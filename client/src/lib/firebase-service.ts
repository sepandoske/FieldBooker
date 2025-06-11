import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  type DocumentData 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Booking, InsertBooking } from '@shared/schema';

const BOOKINGS_COLLECTION = 'bookings';

// Convert Firestore document to Booking type
function docToBooking(doc: DocumentData): Booking {
  const data = doc.data();
  return {
    id: parseInt(doc.id) || 0,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    notes: data.notes || null,
    day: data.day,
    time: data.time,
    date: data.date,
    status: data.status,
    createdAt: data.createdAt?.toDate() || new Date(),
  };
}

export class FirebaseBookingService {
  async createBooking(booking: InsertBooking): Promise<Booking> {
    try {
      const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
        ...booking,
        createdAt: Timestamp.now(),
      });
      
      return {
        id: parseInt(docRef.id) || Date.now(),
        ...booking,
        notes: booking.notes || null,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('فشل في إنشاء الحجز');
    }
  }

  async getAllBookings(): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, BOOKINGS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docToBooking);
    } catch (error) {
      console.error('Error getting bookings:', error);
      throw new Error('فشل في تحميل الحجوزات');
    }
  }

  async getBookingsByDay(day: string, date: string): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, BOOKINGS_COLLECTION),
        where('day', '==', day),
        where('date', '==', date),
        where('status', '==', 'confirmed')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docToBooking);
    } catch (error) {
      console.error('Error getting bookings by day:', error);
      throw new Error('فشل في تحميل الحجوزات لهذا اليوم');
    }
  }

  async deleteBooking(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, BOOKINGS_COLLECTION, id));
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw new Error('فشل في حذف الحجز');
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
      const weekBookings = allBookings.filter(b => 
        new Date(b.createdAt) >= weekAgo
      ).length;
      
      // Calculate revenue (assuming 100 SAR per booking)
      const revenue = weekBookings * 100;
      
      // Calculate occupancy (7 days * 8 hours = 56 total slots)
      const occupancy = Math.min(Math.round((weekBookings / 56) * 100), 100);
      
      return {
        todayBookings,
        weekBookings,
        revenue,
        occupancy,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw new Error('فشل في تحميل الإحصائيات');
    }
  }
}

export const firebaseBookingService = new FirebaseBookingService();