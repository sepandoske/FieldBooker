# دليل إعداد Firebase - خطوة بخطوة

## الخطوة الأولى: إنشاء مشروع Firebase

1. **انتقل إلى Firebase Console**
   - اذهب إلى: https://console.firebase.google.com
   - سجل الدخول بحساب Google الخاص بك

2. **إنشاء مشروع جديد**
   - اضغط على "Add project" أو "إضافة مشروع"
   - أدخل اسم المشروع مثل: `mini-football-booking`
   - اختر إعدادات Google Analytics (يمكنك تعطيلها للمشاريع البسيطة)
   - اضغط "Create project"

## الخطوة الثانية: إعداد Firestore Database

1. **إنشاء قاعدة البيانات**
   - من القائمة الجانبية، اختر "Firestore Database"
   - اضغط "Create database"
   - اختر "Start in test mode" للتطوير
   - اختر موقع الخادم (اختر الأقرب لموقعك)

2. **إنشاء Collection**
   - اضغط "Start collection"
   - أدخل اسم المجموعة: `bookings`
   - أضف وثيقة تجريبية:
     ```
     customerName: "اختبار"
     customerPhone: "0501234567"
     day: "monday"
     time: "16:00"
     date: "2024-01-01"
     status: "confirmed"
     notes: null
     createdAt: [timestamp]
     ```

## الخطوة الثالثة: إعداد Web App

1. **إضافة تطبيق ويب**
   - من إعدادات المشروع (رمز الترس)
   - اضغط على أيقونة الويب `</>`
   - أدخل اسم التطبيق: `Mini Football Booking`
   - اختر "Also set up Firebase Hosting" (اختياري)
   - اضغط "Register app"

2. **نسخ إعدادات Firebase**
   - ستظهر لك إعدادات JavaScript مثل:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "mini-football-booking.firebaseapp.com",
     projectId: "mini-football-booking",
     storageBucket: "mini-football-booking.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdefghijklmnop"
   };
   ```

## الخطوة الرابعة: إعداد متغيرات البيئة

1. **إنشاء ملف .env**
   ```bash
   # في مجلد المشروع، أنشئ ملف .env
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=mini-football-booking.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=mini-football-booking
   VITE_FIREBASE_STORAGE_BUCKET=mini-football-booking.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdefghijklmnop
   
   # للخادم
   FIREBASE_PROJECT_ID=mini-football-booking
   USE_FIREBASE=true
   ```

## الخطوة الخامسة: تفعيل Firebase في الموقع

1. **تحديث إعدادات الخادم**
   - غير `USE_FIREBASE=true` في ملف .env
   - أعد تشغيل الخادم

2. **اختبار الاتصال**
   - افتح موقعك وحاول إنشاء حجز جديد
   - تحقق من Firestore Console لرؤية البيانات

## الخطوة السادسة: إعداد قواعد الأمان (مهمة!)

1. **تحديث قواعد Firestore**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /bookings/{document} {
         allow read, write: if true; // للتطوير فقط
         // للإنتاج، ضع قواعد أمان أكثر صرامة
       }
     }
   }
   ```

## الخطوة السابعة: النشر (اختياري)

1. **تثبيت Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **تسجيل الدخول وتهيئة المشروع**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **النشر**
   ```bash
   npm run build
   firebase deploy
   ```

## ملاحظات مهمة:

### للأمان:
- لا تضع مفاتيح Firebase في كود المصدر العام
- استخدم متغيرات البيئة دائماً
- حدّث قواعد Firestore للإنتاج

### للتطوير:
- يمكنك استخدام Firebase Emulator للتطوير المحلي
- `firebase emulators:start`

### استكشاف الأخطاء:
- تأكد من صحة مفاتيح Firebase
- تحقق من إعدادات الشبكة وCORS
- راجع وحدة التحكم في المتصفح للأخطاء

## الحالة الحالية للموقع:
الموقع مُعد للعمل مع Firebase، ولكنه يستخدم حالياً التخزين المؤقت.
لتفعيل Firebase، أضف المفاتيح في ملف .env وغير USE_FIREBASE=true