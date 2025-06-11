import { db } from './db';
import { bookings } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import type { Booking, InsertBooking } from '@shared/schema';

export interface IStorage {
  getBooking(id: number): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
  getBookingsByDay(day: string, date: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  deleteBooking(id: number): Promise<boolean>;
  getBookingStats(): Promise<{
    todayBookings: number;
    weekBookings: number;
    revenue: number;
    occupancy: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getBooking(id: number): Promise<Booking | undefined> {
    try {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
      return booking;
    } catch (error) {
      console.error('Error getting booking:', error);
      return undefined;
    }
  }

  async getAllBookings(): Promise<Booking[]> {
    try {
      return await db.select().from(bookings);
    } catch (error) {
      console.error('Error getting all bookings:', error);
      return [];
    }
  }

  async getBookingsByDay(day: string, date: string): Promise<Booking[]> {
    try {
      return await db.select()
        .from(bookings)
        .where(and(
          eq(bookings.day, day),
          eq(bookings.date, date)
        ));
    } catch (error) {
      console.error('Error getting bookings by day:', error);
      return [];
    }
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    try {
      const [booking] = await db.insert(bookings)
        .values({
          ...insertBooking,
          notes: insertBooking.notes || null,
        })
        .returning();
      
      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('فشل في إنشاء الحجز');
    }
  }

  async deleteBooking(id: number): Promise<boolean> {
    try {
      const result = await db.delete(bookings).where(eq(bookings.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      return false;
    }
  }

  async getBookingStats(): Promise<{
    todayBookings: number;
    weekBookings: number;
    revenue: number;
    occupancy: number;
  }> {
    try {
      const allBookings = await this.getAllBookings();
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const todayBookings = allBookings.filter(booking => booking.date === today).length;
      const weekBookings = allBookings.filter(booking => new Date(booking.date) >= weekAgo).length;
      const revenue = weekBookings * 7000; // 7000 IQD per booking
      const occupancy = Math.min((todayBookings / 14) * 100, 100); // 14 slots per day max

      return {
        todayBookings,
        weekBookings,
        revenue,
        occupancy,
      };
    } catch (error) {
      console.error('Error getting booking stats:', error);
      return {
        todayBookings: 0,
        weekBookings: 0,
        revenue: 0,
        occupancy: 0,
      };
    }
  }
}

export const storage = new DatabaseStorage();