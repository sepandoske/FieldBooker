import React from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Home from "./pages/home";
import Admin from "./pages/admin";
import Login from "./pages/login";
import NotFound from "./pages/not-found";
import Footer from "./components/footer";
import { useAuth } from "./hooks/useAuth";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return React.createElement(
      "div",
      { className: "min-h-screen flex items-center justify-center" },
      React.createElement(
        "div",
        { className: "text-center" },
        React.createElement("div", { 
          className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" 
        }),
        React.createElement("p", { className: "mt-2 text-gray-600" }, "جاري التحميل...")
      )
    );
  }

  if (!isAuthenticated) {
    return React.createElement(Login);
  }

  return React.createElement(
    "div",
    { className: "min-h-screen flex flex-col" },
    React.createElement(
      "main",
      { className: "flex-1" },
      React.createElement(
        Switch,
        null,
        React.createElement(Route, { path: "/", component: Home }),
        React.createElement(Route, { path: "/admin", component: Admin }),
        React.createElement(Route, { component: NotFound })
      )
    ),
    React.createElement(Footer)
  );
}

function App() {
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(Router)
  );
}

export default App;
