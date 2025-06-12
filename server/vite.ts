import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname || __dirname || process.cwd(),
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Try multiple possible paths for the built client
  const baseDir = import.meta.dirname || __dirname || process.cwd();
  const possiblePaths = [
    path.resolve(baseDir, "..", "client", "dist"),
    path.resolve(baseDir, "public"),
    path.resolve(baseDir, "dist", "client"),
    path.resolve(process.cwd(), "client", "dist"),
    path.resolve(process.cwd(), "dist", "client"),
    path.resolve(process.cwd(), "public"),
  ];

  let distPath: string | null = null;

  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      distPath = possiblePath;
      console.log(`✅ Found client build at: ${distPath}`);
      break;
    } else {
      console.log(`❌ Not found: ${possiblePath}`);
    }
  }

  if (!distPath) {
    console.error("❌ Could not find client build directory in any of these locations:");
    possiblePaths.forEach(p => console.error(`   - ${p}`));

    // Fallback: serve a simple message
    app.use("*", (_req, res) => {
      res.status(200).send(`
        <html>
          <body>
            <h1>🚀 Server is running!</h1>
            <p>Client build not found, but server is working.</p>
            <p>Build paths checked:</p>
            <ul>
              ${possiblePaths.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </body>
        </html>
      `);
    });
    return;
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath!, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send(`
        <html>
          <body>
            <h1>❌ index.html not found</h1>
            <p>Looking for: ${indexPath}</p>
          </body>
        </html>
      `);
    }
  });
}
