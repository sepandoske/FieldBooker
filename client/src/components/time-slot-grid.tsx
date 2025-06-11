import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check, X, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TimeSlotGridProps {
  selectedDay: string;
  selectedDate: string;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

interface TimeSlot {
  time: string;
  display: string;
  status: 'available' | 'selected' | 'booked';
}

export default function TimeSlotGrid({ 
  selectedDay, 
  selectedDate, 
  selectedTime, 
  onTimeSelect 
}: TimeSlotGridProps) {
  // Fetch bookings for the selected day
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['/api/bookings/day', selectedDay, selectedDate],
  });

  // Generate time slots from 3 PM to 2 AM
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const bookedTimes = new Set((bookings as any[])?.map((b: any) => b.time) || []);

    // 3 PM to 11 PM (15:00 to 23:00)
    for (let hour = 15; hour <= 23; hour++) {
      const time = `${hour}:00`;
      const displayHour = hour > 12 ? hour - 12 : hour;
      const period = 'م';
      const display = `${displayHour}:00 ${period}`;

      slots.push({
        time,
        display,
        status: bookedTimes.has(time) ? 'booked' : 
                selectedTime === time ? 'selected' : 'available'
      });
    }

    // 12 AM to 2 AM (00:00 to 02:00)
    for (let hour = 0; hour <= 2; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const displayHour = hour === 0 ? 12 : hour;
      const period = 'ص';
      const display = `${displayHour}:00 ${period}`;

      let status: 'available' | 'selected' | 'booked' = 'available';
      
      if (bookedTimes.has(time)) {
        status = 'booked';
      } else if (selectedTime === time) {
        status = 'selected';
      }

      slots.push({ time, display, status });
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimeClick = (time: string, status: string) => {
    if (status === 'booked') return;
    
    if (selectedTime === time) {
      onTimeSelect(""); // Deselect if already selected
    } else {
      onTimeSelect(time);
      // Scroll to booking form
      setTimeout(() => {
        const bookingForm = document.querySelector('#booking-form');
        if (bookingForm) {
          bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const getSlotIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Check className="w-4 h-4" />;
      case 'selected':
        return <Star className="w-4 h-4" />;
      case 'booked':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getSlotText = (status: string) => {
    switch (status) {
      case 'available':
        return 'متاح';
      case 'selected':
        return 'محدد';
      case 'booked':
        return 'محجوز';
      default:
        return '';
    }
  };

  const getSlotClasses = (status: string) => {
    const baseClasses = "w-full p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[100px]";
    
    switch (status) {
      case 'available':
        return `${baseClasses} border-green-300 bg-green-50 hover:bg-green-100 text-green-800 cursor-pointer dark:border-green-600 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-800/30`;
      case 'selected':
        return `${baseClasses} border-blue-500 bg-blue-100 text-blue-800 cursor-pointer dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300`;
      case 'booked':
        return `${baseClasses} border-red-500 bg-red-100 text-red-800 cursor-not-allowed opacity-75 dark:border-red-400 dark:bg-red-900/30 dark:text-red-300`;
      default:
        return baseClasses;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">جاري تحميل الأوقات المتاحة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {timeSlots.map((slot) => (
          <div
            key={slot.time}
            className={getSlotClasses(slot.status)}
            onClick={() => handleTimeClick(slot.time, slot.status)}
          >
            <div className="text-center">
              <div className="text-lg font-semibold">{slot.display}</div>
              <div className="text-sm font-medium">{getSlotText(slot.status)}</div>
              <div className="mt-2">
                {getSlotIcon(slot.status)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-200 rounded ml-2"></div>
          <span>متاح</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary rounded ml-2"></div>
          <span>محدد</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-200 rounded ml-2"></div>
          <span>محجوز</span>
        </div>
      </div>
    </div>
  );
}
