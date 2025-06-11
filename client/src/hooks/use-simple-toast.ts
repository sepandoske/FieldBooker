// نظام toast بسيط جداً بدون أي مكتبات خارجية
export function useToast() {
  const toast = ({ title, description, variant = "default" }: {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => {
    // إنشاء عنصر toast
    const toastEl = document.createElement('div');
    toastEl.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border max-w-sm transition-all duration-300 ${
      variant === "destructive" 
        ? "bg-red-50 border-red-200 text-red-800" 
        : "bg-white border-gray-200 text-gray-800"
    }`;
    
    // إضافة المحتوى
    toastEl.innerHTML = `
      <div class="font-semibold">${title}</div>
      ${description ? `<div class="text-sm mt-1">${description}</div>` : ''}
    `;
    
    // إضافة إلى الصفحة
    document.body.appendChild(toastEl);
    
    // إزالة بعد 5 ثوانٍ
    setTimeout(() => {
      toastEl.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toastEl)) {
          document.body.removeChild(toastEl);
        }
      }, 300);
    }, 5000);
  };

  return { toast };
}