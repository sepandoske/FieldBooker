import { bookings, type Booking, type InsertBooking } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private bookings: Map<number, Booking>;
  private currentId: number;

  constructor() {
    this.bookings = new Map();
    this.currentId = 1;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBookingsByDay(day: string, date: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.day === day && booking.date === date
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentId++;
    const booking: Booking = {
      ...insertBooking,
      id,
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async deleteBooking(id: number): Promise<boolean> {
    return this.bookings.delete(id);
  }

  async getBookingStats(): Promise<{
    todayBookings: number;
    weekBookings: number;
    revenue: number;
    occupancy: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const allBookings = Array.from(this.bookings.values());
    const todayBookings = allBookings.filter(b => b.date === today).length;
    const weekBookings = allBookings.filter(b => new Date(b.createdAt) >= weekAgo).length;
    
    // Calculate revenue (assuming 100 SAR per booking)
    const revenue = weekBookings * 100;
    
    // Calculate occupancy (7 days * 8 hours = 56 total slots)
    const occupancy = Math.round((weekBookings / 56) * 100);
    
    return {
      todayBookings,
      weekBookings,
      revenue,
      occupancy: Math.min(occupancy, 100),
    };
  }
}

export const storage = new MemStorage();
