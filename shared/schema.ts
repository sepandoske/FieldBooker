import { pgTable, text, serial, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
}).extend({
  customerName: z.string().min(2, "يرجى إدخال الاسم الكامل"),
  customerPhone: z.string().regex(/^05[0-9]{8}$/, "يرجى إدخال رقم هاتف صحيح (05xxxxxxxx)"),
  day: z.string().min(1, "يرجى اختيار اليوم"),
  time: z.string().min(1, "يرجى اختيار الوقت"),
  date: z.string().min(1, "تاريخ غير صحيح"),
  notes: z.string().nullable().optional(),
  status: z.string().default("confirmed"),
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
