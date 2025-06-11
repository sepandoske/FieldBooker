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

// Initialize Firebase Web SDK for server use
const firebaseConfig = {
  apiKey: "AIzaSyDMTSXaaqY4ays1OAC-efn9mBMGYu7mgI0",
  authDomain: "mini-football-booking.firebaseapp.com",
  projectId: "mini-football-booking",
  storageBucket: "mini-football-booking.firebasestorage.app",
  messagingSenderId: "182950461789",
  appId: "1:182950461789:web:c554cb9023d5f522c6a8b4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export class FirebaseStorage implements IStorage {
  private readonly COLLECTION_NAME = 'bookings';

  async getBooking(id: number): Promise<Booking | undefined> {
    try {
      const allBookings = await this.getAllBookings();
      return allBookings.find(booking => booking.id === id);
    } catch (error) {
      console.error('Error getting booking:', error);
      return undefined;
    }
  }

  async getAllBookings(): Promise<Booking[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      return querySnapshot.docs.map((docSnap, index) => {
        const data = docSnap.data();
        return {
          id: index + 1, // Use sequential ID for simplicity
          customerName: data.customerName || '',
          customerPhone: data.customerPhone || '',
          day: data.day || '',
          date: data.date || '',
          time: data.time || '',
          notes: data.notes || null,
          status: data.status || 'confirmed',
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });
    } catch (error) {
      console.error('Error getting all bookings:', error);
      return [];
    }
  }

  async getBookingsByDay(day: string, date: string): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('day', '==', day),
        where('date', '==', date)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((docSnap, index) => {
        const data = docSnap.data();
        return {
          id: index + 1,
          customerName: data.customerName || '',
          customerPhone: data.customerPhone || '',
          day: data.day || '',
          date: data.date || '',
          time: data.time || '',
          notes: data.notes || null,
          status: data.status || 'confirmed',
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });
    } catch (error) {
      console.error('Error getting bookings by day:', error);
      return [];
    }
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    try {
      const bookingData = {
        ...insertBooking,
        status: 'confirmed' as const,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), bookingData);
      console.log('Booking created successfully with ID:', docRef.id);
      
      const booking: Booking = {
        id: Math.floor(Math.random() * 1000000), // Generate random ID
        ...insertBooking,
        status: 'confirmed',
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
      const querySnapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      const allBookings = await this.getAllBookings();
      const targetBooking = allBookings.find(b => b.id === id);
      
      if (!targetBooking) return false;

      // Find and delete the matching document
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        if (data.customerName === targetBooking.customerName && 
            data.customerPhone === targetBooking.customerPhone &&
            data.date === targetBooking.date &&
            data.time === targetBooking.time) {
          await deleteDoc(doc(db, this.COLLECTION_NAME, docSnapshot.id));
          return true;
        }
      }
      return false;
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
      const revenue = weekBookings * 100; // 100 SAR per booking
      const occupancy = Math.min((todayBookings / 8) * 100, 100); // 8 slots per day max

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
    return Array.from(this.bookings.values());
  }

  async getBookingsByDay(day: string, date: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.day === day && booking.date === date
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const booking: Booking = {
      id: this.currentId++,
      ...insertBooking,
      status: 'confirmed',
      createdAt: new Date(),
    };

    this.bookings.set(booking.id, booking);
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
    const bookings = Array.from(this.bookings.values());
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayBookings = bookings.filter(booking => booking.date === today).length;
    const weekBookings = bookings.filter(booking => new Date(booking.date) >= weekAgo).length;
    const revenue = weekBookings * 100; // 100 SAR per booking
    const occupancy = Math.min((todayBookings / 8) * 100, 100); // 8 slots per day max

    return {
      todayBookings,
      weekBookings,
      revenue,
      occupancy,
    };
  }
}

// Use Firebase storage directly
export const storage = new FirebaseStorage();