import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all bookings
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "فشل في تحميل الحجوزات" });
    }
  });

  // Get bookings for a specific day
  app.get("/api/bookings/day/:day/:date", async (req, res) => {
    try {
      const { day, date } = req.params;
      const bookings = await storage.getBookingsByDay(day, date);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "فشل في تحميل الحجوزات لهذا اليوم" });
    }
  });

  // Create a new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Check if time slot is already booked
      const existingBookings = await storage.getBookingsByDay(validatedData.day, validatedData.date);
      const isTimeSlotTaken = existingBookings.some(booking => 
        booking.time === validatedData.time && booking.status === "confirmed"
      );
      
      if (isTimeSlotTaken) {
        return res.status(400).json({ message: "هذا الوقت محجوز بالفعل" });
      }
      
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "بيانات غير صحيحة",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "فشل في إنشاء الحجز" });
    }
  });

  // Delete a booking
  app.delete("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBooking(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "الحجز غير موجود" });
      }
      
      res.json({ message: "تم حذف الحجز بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "فشل في حذف الحجز" });
    }
  });

  // Get booking statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getBookingStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "فشل في تحميل الإحصائيات" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
