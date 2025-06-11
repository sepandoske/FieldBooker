import { Heart, Code, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Security Badge */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Shield className="w-4 h-4 text-green-600" />
            <span>محمي بأحدث تقنيات الأمان والحماية</span>
          </div>
          
          {/* Developer Credit */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">تم تطوير هذا التطبيق بواسطة</span>
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
              <Code className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary">Sepan_b_ahmad</span>
              <Heart className="w-4 h-4 text-red-500" />
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-xs text-gray-500 dark:text-gray-500">
            جميع الحقوق محفوظة © {new Date().getFullYear()} - نظام إدارة حجوزات الملعب
          </div>
        </div>
      </div>
    </footer>
  );
}