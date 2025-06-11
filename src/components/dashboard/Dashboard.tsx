
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Package, Users, ShoppingCart, DollarSign } from "lucide-react";
import { useAppStore } from "@/hooks/useAppStore";
import { useMemo } from "react";

export const Dashboard = () => {
  const { sales, payments, ledgerEntries } = useAppStore();

  // Calculate real metrics from store data
  const metrics = useMemo(() => {
    const totalRevenue = sales.filter(s => s.status === "Completed").reduce((sum, sale) => sum + sale.total, 0);
    const totalSales = sales.filter(s => s.status === "Completed").length;
    const completedPayments = payments.filter(p => p.status === "Completed");
    const totalIncome = ledgerEntries.filter(e => e.type === "Income").reduce((sum, e) => sum + e.amount, 0);
    
    return {
      totalRevenue,
      totalSales,
      totalIncome,
      completedPayments: completedPayments.length
    };
  }, [sales, payments, ledgerEntries]);

  // Generate sales data by month from real data
  const salesData = useMemo(() => {
    const monthlyData: { [key: string]: { sales: number; revenue: number } } = {};
    
    sales.forEach(sale => {
      const date = new Date(sale.date);
      const monthKey = date.toLocaleDateString('en', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { sales: 0, revenue: 0 };
      }
      
      if (sale.status === "Completed") {
        monthlyData[monthKey].sales += 1;
        monthlyData[monthKey].revenue += sale.total;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      sales: data.sales,
      revenue: data.revenue
    }));
  }, [sales]);

  // Generate payment method distribution from real data
  const paymentData = useMemo(() => {
    const methodCounts: { [key: string]: number } = {};
    const completedPayments = payments.filter(p => p.status === "Completed");
    
    completedPayments.forEach(payment => {
      methodCounts[payment.method] = (methodCounts[payment.method] || 0) + 1;
    });

    const total = completedPayments.length;
    const colors = {
      "Cash": "#10B981",
      "Card": "#3B82F6", 
      "Momo Pay": "#F59E0B"
    };

    return Object.entries(methodCounts).map(([method, count]) => ({
      name: method,
      value: total > 0 ? Math.round((count / total) * 100) : 0,
      color: colors[method as keyof typeof colors] || "#6B7280"
    }));
  }, [payments]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${metrics.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Real-time data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.totalSales}</div>
            <p className="text-xs text-blue-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Live updates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Payments</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.completedPayments}</div>
            <p className="text-xs text-orange-600">
              Successful transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Income</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${metrics.totalIncome.toFixed(2)}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              From ledger
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales & Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {salesData.length > 0 ? (
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#3B82F6" name="Sales" />
                  <Bar dataKey="revenue" fill="#10B981" name="Revenue ($)" />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No sales data available
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {paymentData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No payment data available
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
