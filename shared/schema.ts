import { pgTable, text, serial, timestamp, integer, varchar, boolean, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  password: text("password").notNull(), // hashed password
  role: text("role").notNull().default("admin"), // 'admin', 'user'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

// Session storage for security
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("sessions_user_id_idx").on(table.userId),
  index("sessions_expires_at_idx").on(table.expiresAt),
]);

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: varchar("customer_phone", { length: 15 }).notNull(),
  notes: text("notes"),
  day: text("day").notNull(), // e.g., 'monday', 'tuesday', etc.
  time: text("time").notNull(), // e.g., '16:00'
  date: text("date").notNull(), // e.g., '2024-11-25'
  status: text("status").notNull().default("confirmed"), // 'confirmed', 'pending', 'cancelled'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const loginSchema = z.object({
  username: z.string().min(3, "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

// Updated booking schema with Iraqi phone support
export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
}).extend({
  customerName: z.string().min(2, "يرجى إدخال الاسم الكامل"),
  customerPhone: z.string().regex(/^(07[3-9][0-9]{8}|(\+964|964)?7[3-9][0-9]{8})$/, "يرجى إدخال رقم هاتف عراقي صحيح (07xxxxxxxx)"),
  day: z.string().min(1, "يرجى اختيار اليوم"),
  time: z.string().min(1, "يرجى اختيار الوقت"),
  date: z.string().min(1, "تاريخ غير صحيح"),
  notes: z.string().nullable().optional(),
  status: z.string().default("confirmed"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
export type Session = typeof sessions.$inferSelect;
