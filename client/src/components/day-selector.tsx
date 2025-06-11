import { Button } from "@/components/ui/button";

interface Day {
  key: string;
  name: string;
  date: string;
}

interface DaySelectorProps {
  selectedDay: string;
  selectedDate: string;
  onDaySelect: (day: string, date: string) => void;
}

export default function DaySelector({ selectedDay, selectedDate, onDaySelect }: DaySelectorProps) {
  // Generate next 7 days starting from today
  const generateDays = (): Day[] => {
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
      const formattedDate = date.toLocaleDateString('ar-SA', {
        day: 'numeric',
        month: 'long'
      });

      days.push({
        key: dayNames[dayIndex],
        name: arabicDayNames[dayIndex],
        date: formattedDate,
      });
    }

    return days;
  };

  const days = generateDays();

  const getDateString = (dayOffset: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {days.map((day, index) => (
        <Button
          key={day.key}
          variant={selectedDay === day.key ? "default" : "outline"}
          className={`p-4 h-auto transition-all duration-200 ${
            selectedDay === day.key
              ? "bg-primary text-white border-primary"
              : "bg-gray-50 hover:bg-primary hover:text-white border-gray-200 hover:border-primary"
          }`}
          onClick={() => onDaySelect(day.key, getDateString(index))}
        >
          <div className="text-center">
            <div className="text-lg font-semibold mb-1">{day.name}</div>
            <div className="text-sm opacity-75">{day.date}</div>
          </div>
        </Button>
      ))}
    </div>
  );
}
