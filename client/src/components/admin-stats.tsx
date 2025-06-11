import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Calendar, TrendingUp, DollarSign, Percent } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center">
              <Skeleton className="w-10 h-10 rounded-lg ml-3" />
              <div className="flex-1">
                <Skeleton className="h-6 w-16 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "حجوزات اليوم",
      value: stats?.todayBookings || 0,
      icon: Calendar,
      bgColor: "bg-primary/5",
      borderColor: "border-primary/20",
      iconColor: "bg-primary",
      textColor: "text-primary",
    },
    {
      title: "حجوزات الأسبوع",
      value: stats?.weekBookings || 0,
      icon: TrendingUp,
      bgColor: "bg-secondary/5",
      borderColor: "border-secondary/20",
      iconColor: "bg-secondary",
      textColor: "text-secondary",
    },
    {
      title: "إيرادات الأسبوع",
      value: stats?.revenue || 0,
      icon: DollarSign,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "bg-green-600",
      textColor: "text-green-600",
    },
    {
      title: "معدل الإشغال",
      value: `${stats?.occupancy || 0}%`,
      icon: Percent,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "bg-yellow-500",
      textColor: "text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className={`p-4 ${stat.bgColor} border ${stat.borderColor}`}
        >
          <div className="flex items-center">
            <div className={`w-10 h-10 ${stat.iconColor} rounded-lg flex items-center justify-center ml-3`}>
              <stat.icon className="text-white w-5 h-5" />
            </div>
            <div>
              <div className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
