import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600 text-sm">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} | ملعب كرة القدم المصغر
          </p>
          <p className="mt-1">
            تطوير: <span className="font-semibold text-primary">Sepan_b_ahmad</span>
          </p>
        </div>
      </div>
    </footer>
  );
}