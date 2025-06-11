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

  // Generate time slots from 4 PM to 11 PM
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const bookedTimes = new Set(bookings?.map((b: any) => b.time) || []);

    for (let hour = 16; hour <= 22; hour++) {
      const time = `${hour}:00`;
      const displayHour = hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? 'م' : 'ص';
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
    switch (status) {
      case 'available':
        return 'time-slot-available';
      case 'selected':
        return 'time-slot-selected';
      case 'booked':
        return 'time-slot-booked';
      default:
        return '';
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
          <Button
            key={slot.time}
            variant="outline"
            className={`p-4 h-auto ${getSlotClasses(slot.status)}`}
            onClick={() => handleTimeClick(slot.time, slot.status)}
            disabled={slot.status === 'booked'}
          >
            <div className="text-center">
              <div className="text-lg font-semibold">{slot.display}</div>
              <div className="text-sm">{getSlotText(slot.status)}</div>
              <div className="text-xs mt-1">
                {getSlotIcon(slot.status)}
              </div>
            </div>
          </Button>
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
