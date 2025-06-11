import { Booking } from "@shared/schema";

export class WhatsAppService {
  private phoneNumber: string;
  private apiKey: string;

  constructor() {
    this.phoneNumber = process.env.CALLMEBOT_PHONE_NUMBER || "9647508275402";
    this.apiKey = process.env.CALLMEBOT_API_KEY || "1002501";
  }

  async sendBookingNotification(booking: Booking): Promise<boolean> {
    try {
      const message = this.formatBookingMessage(booking);
      const encodedMessage = encodeURIComponent(message);
      
      const url = `https://api.callmebot.com/whatsapp.php?phone=${this.phoneNumber}&text=${encodedMessage}&apikey=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        console.log('WhatsApp notification sent successfully');
        return true;
      } else {
        console.error('Failed to send WhatsApp notification:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
      return false;
    }
  }

  private formatBookingMessage(booking: Booking): string {
    const dayNameArabic = this.getDayNameArabic(booking.day);
    const timeFormatted = this.formatTimeArabic(booking.time);
    
    return `🏟️ حجز جديد في الملعب!

👤 العميل: ${booking.customerName}
📱 الهاتف: ${booking.customerPhone}
📅 اليوم: ${dayNameArabic}
🗓️ التاريخ: ${booking.date}
⏰ الوقت: ${timeFormatted}
${booking.notes ? `📝 ملاحظات: ${booking.notes}` : ''}

✅ حالة الحجز: مؤكد
💰 المبلغ: 100 ريال`;
  }

  private getDayNameArabic(day: string): string {
    const dayNames: { [key: string]: string } = {
      'saturday': 'السبت',
      'sunday': 'الأحد',
      'monday': 'الاثنين',
      'tuesday': 'الثلاثاء',
      'wednesday': 'الأربعاء',
      'thursday': 'الخميس',
      'friday': 'الجمعة'
    };
    return dayNames[day] || day;
  }

  private formatTimeArabic(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'مساءً' : 'صباحاً';
    const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${hour12}:${minutes} ${period}`;
  }
}

export const whatsappService = new WhatsAppService();