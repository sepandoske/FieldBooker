import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import type { Booking } from "@shared/schema";

interface ConfirmationMessageProps {
  booking: Booking;
  onNewBooking: () => void;
}

export default function ConfirmationMessage({ booking, onNewBooking }: ConfirmationMessageProps) {
  const getDayName = (day: string) => {
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
  };

  const formatTime = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    const displayHour = hour > 12 ? hour - 12 : hour;
    const period = hour >= 12 ? 'م' : 'ص';
    const nextHour = hour + 1;
    const nextDisplayHour = nextHour > 12 ? nextHour - 12 : nextHour;
    const nextPeriod = nextHour >= 12 ? 'م' : 'ص';
    return `${displayHour}:00 ${period} - ${nextDisplayHour}:00 ${nextPeriod}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-SA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="p-8 text-center">
      <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="text-white text-3xl w-12 h-12" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">تم تأكيد الحجز بنجاح!</h2>
      
      <p className="text-gray-600 mb-6">
        تم حجز الملعب بنجاح. ستتلقى رسالة تأكيد على رقم الهاتف المسجل.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="text-sm space-y-2">
          <div>
            <span className="font-semibold">رقم الحجز:</span>
            <span className="text-primary mr-2">#BK-{booking.id}</span>
          </div>
          <div>
            <span className="font-semibold">الاسم:</span>
            <span className="mr-2">{booking.customerName}</span>
          </div>
          <div>
            <span className="font-semibold">اليوم:</span>
            <span className="mr-2">{getDayName(booking.day)} {formatDate(booking.date)}</span>
          </div>
          <div>
            <span className="font-semibold">الوقت:</span>
            <span className="mr-2">{formatTime(booking.time)}</span>
          </div>
        </div>
      </div>
      
      <Button onClick={onNewBooking} className="btn-primary">
        حجز جديد
      </Button>
    </Card>
  );
}
