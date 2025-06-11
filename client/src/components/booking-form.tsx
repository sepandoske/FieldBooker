import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserPen, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Booking } from "@shared/schema";

interface BookingFormProps {
  selectedDay: string;
  selectedDate: string;
  selectedTime: string;
  onBookingConfirmed: (booking: Booking) => void;
}

export default function BookingForm({
  selectedDay,
  selectedDate,
  selectedTime,
  onBookingConfirmed,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    notes: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: (booking: Booking) => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings/day'] });
      
      toast({
        title: "تم تأكيد الحجز بنجاح!",
        description: "ستتلقى رسالة تأكيد على رقم الهاتف المسجل.",
      });
      
      onBookingConfirmed(booking);
    },
    onError: (error: any) => {
      toast({
        title: "فشل في إنشاء الحجز",
        description: error.message || "حدث خطأ أثناء معالجة طلبك",
        variant: "destructive",
      });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      newErrors.customerName = "يرجى إدخال الاسم الكامل";
    }

    // Accept Saudi numbers (05xxxxxxxx) or international format (+966xxxxxxxxx)
    const phoneRegex = /^(05[0-9]{8}|(\+966|966)?5[0-9]{8})$/;
    if (!formData.customerPhone || !phoneRegex.test(formData.customerPhone.replace(/\s+/g, ''))) {
      newErrors.customerPhone = "يرجى إدخال رقم هاتف صحيح (05xxxxxxxx أو +966xxxxxxxxx)";
    }

    if (!formData.terms) {
      newErrors.terms = "يرجى الموافقة على شروط وأحكام الاستخدام";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const bookingData = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      notes: formData.notes,
      day: selectedDay,
      time: selectedTime,
      date: selectedDate,
      status: "confirmed",
    };

    createBookingMutation.mutate(bookingData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    return value.replace(/\D/g, '').substring(0, 10);
  };

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
    <Card className="p-6 mb-8" id="booking-form">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <UserPen className="text-primary ml-3" />
        بيانات الحجز
      </h2>

      {/* Booking Summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-primary mb-2">ملخص الحجز</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">اليوم:</span>
            <span className="font-semibold mr-2">{getDayName(selectedDay)} {formatDate(selectedDate)}</span>
          </div>
          <div>
            <span className="text-gray-600">الوقت:</span>
            <span className="font-semibold mr-2">{formatTime(selectedTime)}</span>
          </div>
          <div>
            <span className="text-gray-600">المدة:</span>
            <span className="font-semibold mr-2">ساعة واحدة</span>
          </div>
          <div>
            <span className="text-gray-600">السعر:</span>
            <span className="font-semibold mr-2 text-primary">100 ريال</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="customerName">الاسم الكامل *</Label>
            <Input
              id="customerName"
              type="text"
              placeholder="أدخل اسمك الكامل"
              value={formData.customerName}
              onChange={(e) => handleInputChange("customerName", e.target.value)}
              className={errors.customerName ? "border-red-500" : ""}
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="customerPhone">رقم الهاتف *</Label>
            <Input
              id="customerPhone"
              type="tel"
              placeholder="05xxxxxxxx"
              value={formData.customerPhone}
              onChange={(e) => 
                handleInputChange("customerPhone", formatPhoneNumber(e.target.value))
              }
              className={errors.customerPhone ? "border-red-500" : ""}
            />
            {errors.customerPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="notes">ملاحظات إضافية (اختيارية)</Label>
          <Textarea
            id="notes"
            placeholder="أي ملاحظات أو طلبات خاصة..."
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="terms"
            checked={formData.terms}
            onCheckedChange={(checked) => {
              setFormData((prev) => ({ ...prev, terms: !!checked }));
              if (errors.terms) {
                setErrors((prev) => ({ ...prev, terms: "" }));
              }
            }}
          />
          <Label htmlFor="terms" className="text-sm">
            أوافق على <span className="text-primary hover:underline cursor-pointer">شروط وأحكام</span> الاستخدام
          </Label>
        </div>
        {errors.terms && (
          <p className="text-red-500 text-sm">{errors.terms}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 btn-primary"
            disabled={createBookingMutation.isPending}
          >
            {createBookingMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري التأكيد...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 ml-2" />
                تأكيد الحجز
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="sm:flex-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Card>
  );
}
