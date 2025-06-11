import { bookings, type Booking, type InsertBooking } from "@shared/schema";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

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

export class FirebaseStorage implements IStorage {
  private readonly COLLECTION_NAME = 'bookings';

  async getBooking(id: number): Promise<Booking | undefined> {
    try {
      const doc = await adminDb.collection(this.COLLECTION_NAME).doc(id.toString()).get();
      if (!doc.exists) {
        return undefined;
      }
      const data = doc.data()!;
      return {
        id: parseInt(doc.id),
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Booking;
    } catch (error) {
      console.error('Error getting booking:', error);
      return undefined;
    }
  }

  async getAllBookings(): Promise<Booking[]> {
    try {
      const snapshot = await adminDb.collection(this.COLLECTION_NAME)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: parseInt(doc.id) || Date.now(),
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Booking;
      });
    } catch (error) {
      console.error('Error getting all bookings:', error);
      return [];
    }
  }

  async getBookingsByDay(day: string, date: string): Promise<Booking[]> {
    try {
      const snapshot = await adminDb.collection(this.COLLECTION_NAME)
        .where('day', '==', day)
        .where('date', '==', date)
        .where('status', '==', 'confirmed')
        .get();
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: parseInt(doc.id) || Date.now(),
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Booking;
      });
    } catch (error) {
      console.error('Error getting bookings by day:', error);
      return [];
    }
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    try {
      const docRef = await adminDb.collection(this.COLLECTION_NAME).add({
        ...insertBooking,
        notes: insertBooking.notes || null,
        status: insertBooking.status || "confirmed",
        createdAt: new Date(),
      });

      const booking: Booking = {
        id: parseInt(docRef.id) || Date.now(),
        customerName: insertBooking.customerName,
        customerPhone: insertBooking.customerPhone,
        notes: insertBooking.notes || null,
        day: insertBooking.day,
        time: insertBooking.time,
        date: insertBooking.date,
        status: insertBooking.status || "confirmed",
        createdAt: new Date(),
      };

      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('فشل في إنشاء الحجز');
    }
  }

  async deleteBooking(id: number): Promise<boolean> {
    try {
      await adminDb.collection(this.COLLECTION_NAME).doc(id.toString()).delete();
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
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
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
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        todayBookings: 0,
        weekBookings: 0,
        revenue: 0,
        occupancy: 0,
      };
    }
  }
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
      id,
      customerName: insertBooking.customerName,
      customerPhone: insertBooking.customerPhone,
      notes: insertBooking.notes || null,
      day: insertBooking.day,
      time: insertBooking.time,
      date: insertBooking.date,
      status: insertBooking.status || "confirmed",
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

// Switch between Firebase and Memory storage
// For production, use FirebaseStorage with proper Firebase credentials
// For development/testing, use MemStorage

// Force Firebase usage regardless of environment variable
export const storage = new FirebaseStorage();
