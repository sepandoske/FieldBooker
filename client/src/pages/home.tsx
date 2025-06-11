import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, Clock, Shield, Phone, MapPin, Mail } from "lucide-react";
import DaySelector from "@/components/day-selector";
import TimeSlotGrid from "@/components/time-slot-grid";
import BookingForm from "@/components/booking-form";
import ConfirmationMessage from "@/components/confirmation-message";
import type { Booking } from "@shared/schema";

export default function Home() {
  const [selectedDay, setSelectedDay] = useState<string>("monday");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const handleBookingConfirmed = (booking: Booking) => {
    setConfirmedBooking(booking);
  };

  const handleNewBooking = () => {
    setConfirmedBooking(null);
    setSelectedTime("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ملاعب الأبطال</h1>
                <p className="text-sm text-gray-600">حجز ملاعب كرة القدم المصغرة</p>
              </div>
            </div>
            <Link href="/admin">
              <Button className="btn-secondary">
                <Shield className="w-4 h-4 ml-2" />
                لوحة الإدارة
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!confirmedBooking ? (
          <>
            {/* Day Selection */}
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="text-primary ml-3" />
                اختر اليوم
              </h2>
              <DaySelector
                selectedDay={selectedDay}
                selectedDate={selectedDate}
                onDaySelect={(day, date) => {
                  setSelectedDay(day);
                  setSelectedDate(date);
                  setSelectedTime(""); // Reset time selection when day changes
                }}
              />
            </Card>

            {/* Time Selection */}
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="text-primary ml-3" />
                اختر الوقت - <span className="text-primary">{selectedDay}</span>
              </h2>
              <TimeSlotGrid
                selectedDay={selectedDay}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
              />
            </Card>

            {/* Booking Form */}
            {selectedTime && (
              <BookingForm
                selectedDay={selectedDay}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onBookingConfirmed={handleBookingConfirmed}
              />
            )}
          </>
        ) : (
          <ConfirmationMessage
            booking={confirmedBooking}
            onNewBooking={handleNewBooking}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">ملاعب الأبطال</h3>
              <p className="text-gray-400 text-sm">
                أفضل ملاعب كرة القدم المصغرة في المدينة. احجز ملعبك الآن واستمتع بتجربة لعب لا تُنسى.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">معلومات الاتصال</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 ml-2" />
                  0500000000
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 ml-2" />
                  info@champions-fields.com
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 ml-2" />
                  شارع الملك فهد، الرياض
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">ساعات العمل</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>السبت - الخميس: 4:00 م - 12:00 ص</div>
                <div>الجمعة: 2:00 م - 12:00 ص</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 ملاعب الأبطال. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
