import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { apiRequest } from "@/lib/queryClient";
import type { Booking } from "@shared/schema";

export default function BookingsTable() {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['/api/bookings'],
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/bookings/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      alert("تم حذف الحجز بنجاح");
    },
    onError: (error: any) => {
      alert("فشل في حذف الحجز: " + (error.message || "حدث خطأ أثناء حذف الحجز"));
    },
  });

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
    return date.toLocaleDateString('ar-SA');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="status-confirmed">مؤكد</Badge>;
      case 'pending':
        return <Badge className="status-pending">في الانتظار</Badge>;
      case 'cancelled':
        return <Badge className="status-cancelled">ملغي</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
      deleteBookingMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 space-x-reverse">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لا توجد حجوزات حالياً</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">رقم الحجز</TableHead>
            <TableHead className="text-right">الاسم</TableHead>
            <TableHead className="text-right">الهاتف</TableHead>
            <TableHead className="text-right">اليوم</TableHead>
            <TableHead className="text-right">التاريخ</TableHead>
            <TableHead className="text-right">الوقت</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking: Booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-mono">
                #BK-{booking.id}
              </TableCell>
              <TableCell>{booking.customerName}</TableCell>
              <TableCell>{booking.customerPhone}</TableCell>
              <TableCell>{getDayName(booking.day)}</TableCell>
              <TableCell>{formatDate(booking.date)}</TableCell>
              <TableCell>{formatTime(booking.time)}</TableCell>
              <TableCell>{getStatusBadge(booking.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "تفاصيل الحجز",
                        description: booking.notes || "لا توجد ملاحظات إضافية",
                      });
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(booking.id)}
                    disabled={deleteBookingMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
