import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  PackageCheck,
  XCircle,
  Wallet,
  Calendar,
  Download,
  RefreshCw,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const Sales = () => {
  const [sales, setSales] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    delivered: 0,
    cancelled: 0,
    chartData: [],
    paymentData: [],
    growth: {
      revenue: 0,
      orders: 0,
      delivered: 0,
      cancelled: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("30");
  const [downloading, setDownloading] = useState(false);

  const getDays = (tf) => {
    switch (tf) {
      case "7":
        return 7;
      case "30":
        return 30;
      case "90":
        return 90;
      default:
        return 30;
    }
  };

  const fetchSales = async (days = 30) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:5000/api/admin/sales?days=${days}`
      );
      const json = await response.json();
      if (json.success) {
        setSales({
          totalRevenue: json.totalRevenue || 0,
          totalOrders: json.totalOrders || 0,
          delivered: json.delivered || 0,
          cancelled: json.cancelled || 0,
          chartData: json.chartData || [],
          paymentData: json.paymentData || [],
          growth: {
            revenue: 12.5,
            orders: 8.3,
            delivered: 5.7,
            cancelled: -2.1,
          },
        });
      } else {
        setError("Failed to load sales data");
        toast.error("Unable to load sales data");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(getDays(timeframe));
  }, [timeframe]);

  const handleTimeframeChange = (days) => {
    setTimeframe(days);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ✅ DOWNLOAD FUNCTION – EXPORT AS CSV
  const handleDownload = () => {
    if (downloading) return;
    setDownloading(true);

    try {
      // Prepare CSV rows
      const rows = [];

      // Header: Summary
      rows.push(["Sales Report"]);
      rows.push([`Generated on: ${new Date().toLocaleString()}`]);
      rows.push([]); // empty row

      // Summary stats
      rows.push(["Metric", "Value"]);
      rows.push(["Total Revenue", formatCurrency(sales.totalRevenue)]);
      rows.push(["Total Orders", sales.totalOrders]);
      rows.push(["Delivered", sales.delivered]);
      rows.push(["Cancelled", sales.cancelled]);
      rows.push([]);

      // Payment Methods
      rows.push(["Payment Method", "Count"]);
      sales.paymentData.forEach((item) => {
        rows.push([item.name, item.value]);
      });
      rows.push([]);

      // Revenue Chart Data
      rows.push(["Month", "Revenue (₹)"]);
      sales.chartData.forEach((item) => {
        rows.push([item.month, item.revenue]);
      });

      // Convert rows to CSV string
      const csvContent = rows
        .map((row) =>
          row
            .map((cell) => {
              if (typeof cell === "string" && cell.includes(",")) {
                return `"${cell}"`;
              }
              return cell;
            })
            .join(",")
        )
        .join("\n");

      // Create Blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `sales_report_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Sales report downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, growth, isCurrency }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-500 text-sm font-medium tracking-wide">
            {title}
          </p>
          <h2 className={`text-3xl font-bold ${color} mt-2`}>
            {isCurrency ? formatCurrency(value) : value}
          </h2>
        </div>
        <div
          className={`p-3 rounded-xl ${color
            .replace("text", "bg")
            .replace("600", "50")} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon size={20} className={color} />
        </div>
      </div>
      {growth !== undefined && (
        <div className="flex items-center gap-1.5 mt-3">
          {growth >= 0 ? (
            <TrendingUp size={14} className="text-emerald-500" />
          ) : (
            <TrendingDown size={14} className="text-red-500" />
          )}
          <span
            className={`text-xs font-semibold ${
              growth >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {Math.abs(growth)}%
          </span>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );

  const statData = [
    {
      icon: Wallet,
      title: "Total Revenue",
      value: sales.totalRevenue,
      color: "text-emerald-600",
      growth: sales.growth.revenue,
      isCurrency: true,
    },
    {
      icon: ShoppingBag,
      title: "Total Orders",
      value: sales.totalOrders,
      color: "text-blue-600",
      growth: sales.growth.orders,
      isCurrency: false,
    },
    {
      icon: PackageCheck,
      title: "Delivered",
      value: sales.delivered,
      color: "text-green-500",
      growth: sales.growth.delivered,
      isCurrency: false,
    },
    {
      icon: XCircle,
      title: "Cancelled",
      value: sales.cancelled,
      color: "text-rose-500",
      growth: sales.growth.cancelled,
      isCurrency: false,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="mt-7 text-gray-500">Loading sales data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-700">
          Something went wrong
        </h3>
        <p className="text-gray-500 mt-2">{error}</p>
        <button
          onClick={() => fetchSales(getDays(timeframe))}
          className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-7">
            Sales Analytics
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Calendar size={14} />
            Real-time overview of your business performance
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            {[
              { label: "7 Days", value: "7" },
              { label: "30 Days", value: "30" },
              { label: "90 Days", value: "90" },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleTimeframeChange(value)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  timeframe === value
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ✅ Download Button with handler */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download Sales Report (CSV)"
          >
            {downloading ? (
              <Loader2 size={18} className="text-slate-600 animate-spin" />
            ) : (
              <Download size={18} className="text-slate-600" />
            )}
          </button>

          <button
            onClick={() => fetchSales(getDays(timeframe))}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
          >
            <RefreshCw size={18} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Revenue Overview
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                {timeframe === "7"
                  ? "Weekly"
                  : timeframe === "30"
                  ? "Monthly"
                  : "Quarterly"}{" "}
                revenue trends
              </p>
            </div>
            <span className="text-xs font-medium px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
              +{sales.growth.revenue}%
            </span>
          </div>
          {sales.chartData && sales.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={sales.chartData}>
                <defs>
                  <linearGradient
                    id="colorRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#10b981"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#10b981"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [`₹${value}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-400">
              No revenue data available
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              Payment Methods
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Distribution by type
            </p>
          </div>
          {sales.paymentData && sales.paymentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={sales.paymentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={{ stroke: "#94a3b8", strokeWidth: 1 }}
                >
                  {sales.paymentData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => [`${value}%`, "Percentage"]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-400">
              No payment data available
            </div>
          )}
        </div>
      </div>

      {/* Extra Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
          <p className="text-emerald-100 text-sm font-medium">
            Average Order Value
          </p>
          <p className="text-3xl font-bold mt-2">
            {formatCurrency(
              sales.totalRevenue / (sales.totalOrders || 1)
            )}
          </p>
          <div className="flex items-center gap-1 mt-3">
            <ArrowUpRight size={16} className="text-emerald-200" />
            <span className="text-emerald-100 text-sm">
              +8.2% from last month
            </span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
          <p className="text-blue-100 text-sm font-medium">
            Conversion Rate
          </p>
          <p className="text-3xl font-bold mt-2">24.8%</p>
          <div className="flex items-center gap-1 mt-3">
            <ArrowUpRight size={16} className="text-blue-200" />
            <span className="text-blue-100 text-sm">
              +3.1% from last month
            </span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-200">
          <p className="text-purple-100 text-sm font-medium">
            Customer Satisfaction
          </p>
          <p className="text-3xl font-bold mt-2">4.8 ★</p>
          <div className="flex items-center gap-1 mt-3">
            <ArrowUpRight size={16} className="text-purple-200" />
            <span className="text-purple-100 text-sm">
              +0.3 from last month
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;