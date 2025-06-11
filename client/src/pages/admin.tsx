import React from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import AdminStats from "@/components/admin-stats";
import BookingsTable from "@/components/bookings-table";

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Shield className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">لوحة إدارة الحجوزات</h1>
                <p className="text-sm text-gray-600">إدارة ومراقبة جميع الحجوزات</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline">
                <ArrowRight className="w-4 h-4 ml-2" />
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Statistics */}
        <AdminStats />

        {/* Bookings Table */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">جميع الحجوزات</h2>
          <BookingsTable />
        </Card>
      </main>
    </div>
  );
}
