import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility functions for Arabic RTL support
export function formatArabicDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatArabicTime(time: string): string {
  const hour = parseInt(time.split(':')[0]);
  const displayHour = hour > 12 ? hour - 12 : hour;
  const period = hour >= 12 ? 'م' : 'ص';
  return `${displayHour}:00 ${period}`;
}

export function getDayNameArabic(day: string): string {
  const dayNames: Record<string, string> = {
    sunday: 'الأحد',
    monday: 'الاثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
    saturday: 'السبت'
  };
  return dayNames[day] || day;
}

export function validateSaudiPhoneNumber(phone: string): boolean {
  const phoneRegex = /^05[0-9]{8}$/;
  return phoneRegex.test(phone);
}

export function formatSaudiPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Limit to 10 digits
  return digitsOnly.substring(0, 10);
}

export function generateBookingId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `BK-${timestamp}-${random}`;
}

export function isValidBookingTime(time: string): boolean {
  const hour = parseInt(time.split(':')[0]);
  // Booking hours are from 4 PM (16) to 11 PM (23)
  return hour >= 16 && hour <= 22;
}

export function getNextSevenDays(): Array<{
  key: string;
  name: string;
  date: string;
  fullDate: string;
}> {
  const days = [];
  const dayNames = [
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
  ];
  const arabicDayNames = [
    'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
  ];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayIndex = date.getDay();
    
    days.push({
      key: dayNames[dayIndex],
      name: arabicDayNames[dayIndex],
      date: formatArabicDate(date),
      fullDate: date.toISOString().split('T')[0],
    });
  }

  return days;
}
