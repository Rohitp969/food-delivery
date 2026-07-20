import React, { useEffect, useRef, useState } from "react";
import {
  ShoppingCart,
  UtensilsCrossed,
  Users,
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import Chart from "chart.js/auto";

const COLORS = {
  bg: "#F3F5F4",
  surface: "#FFFFFF",
  ink: "#14181A",
  ink2: "#6B7472",
  line: "#E4E8E6",
  accent: "#0F9D8C",
  accentSoft: "#E3F3F0",
  gold: "#C9971E",
  terracotta: "#DC5F3C",
};

const API_URL = import.meta.env.VITE_API_URL;

const PALETTE = ["#0F9D8C", "#C9971E", "#5B7FDE", "#DC5F3C"];

const RevenueBarChart = ({ data }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: "Revenue",
            data: data.map((d) => d.revenue),
            backgroundColor: COLORS.accent,
            borderRadius: 8,
            maxBarThickness: 36,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: COLORS.ink,
            titleFont: { family: "Inter", weight: "600" },
            bodyFont: { family: "Inter" },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => `₹${ctx.parsed.y.toLocaleString("en-IN")}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: "Inter", size: 12 }, color: COLORS.ink2 },
          },
          y: {
            grid: { color: COLORS.line },
            border: { display: false },
            ticks: {
              font: { family: "Inter", size: 12 },
              color: COLORS.ink2,
              callback: (v) => `₹${v}`,
            },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [data]);

  return <canvas ref={canvasRef} />;
};

const PaymentDoughnutChart = ({ data }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: data.map((d) => d.name),
        datasets: [
          {
            data: data.map((d) => d.value),
            backgroundColor: PALETTE,
            borderColor: COLORS.surface,
            borderWidth: 3,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: { family: "Inter", size: 12 },
              color: COLORS.ink2,
              padding: 16,
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            backgroundColor: COLORS.ink,
            titleFont: { family: "Inter", weight: "600" },
            bodyFont: { family: "Inter" },
            padding: 10,
            cornerRadius: 8,
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [data]);

  return <canvas ref={canvasRef} />;
};

const Dashboard = () => {
  // ---------- State ----------
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalFoods: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [days, setDays] = useState(30);
  const [sales, setSales] = useState({
    chartData: [],
    paymentData: [],
    delivered: 0,
    cancelled: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [latestUsers, setLatestUsers] = useState([]);
  const [topFoods, setTopFoods] = useState([]);
  const [loading, setLoading] = useState(true);


  // ---------- API Calls ----------
  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/dashboard`);
      const json = await res.json();
      if (json.success) {
        setStats({
          totalOrders: json.totalOrders || 0,
          totalFoods: json.totalFoods || 0,
          totalUsers: json.totalUsers || 0,
          totalRevenue: json.totalRevenue || 0,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/admin/sales?days=${days}`
      );
      const json = await res.json();
      if (json.success) {
        setSales({
          chartData: json.chartData || [],
          paymentData: json.paymentData || [],
          delivered: json.delivered || 0,
          cancelled: json.cancelled || 0,
        });
        setStats((prev) => ({
          ...prev,
          totalOrders: json.totalOrders || prev.totalOrders,
          totalRevenue: json.totalRevenue || prev.totalRevenue,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/recent-orders`);
      const json = await res.json();
      if (json.success) {
        const orders = json.recentOrders || [];
        orders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
        setRecentOrders(orders);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`);
      const json = await res.json();
      if (json.success) {
        setLatestUsers(json.users || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTopFoods = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/top-foods`);
      const json = await res.json();
      if (json.success) {
        setTopFoods(json.topFoods || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Load data ----------
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchDashboard(),
        fetchSales(),
        fetchRecentOrders(),
        fetchUsers(),
        fetchTopFoods(),
      ]);
      setLoading(false);
    };
    loadAll();
  }, [days]);

  // ---------- UI Helpers ----------
  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString("en-IN"),
      icon: <ShoppingCart size={20} />,
    },
    {
      title: "Total Foods",
      value: stats.totalFoods.toLocaleString("en-IN"),
      icon: <UtensilsCrossed size={20} />,
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString("en-IN"),
      icon: <Users size={20} />,
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: <IndianRupee size={20} />,
      highlight: true,
    },
  ];

  const RANGE_OPTIONS = [
    { label: "7D", value: 7 },
    { label: "30D", value: 30 },
    { label: "90D", value: 90 },
    { label: "1Y", value: 365 },
  ];

  const StatusPill = ({ status }) => {
    const map = {
      Delivered: { bg: "bg-green-100", color: "text-green-700" },
      "Out For Delivery": { bg: "bg-yellow-100", color: "text-yellow-700" },
      Accepted: { bg: "bg-blue-100", color: "text-blue-700" },
      Preparing: { bg: "bg-purple-100", color: "text-purple-700" },
      Cancelled: { bg: "bg-red-100", color: "text-red-700" },
    };
    const style = map[status] || { bg: "bg-gray-100", color: "text-gray-600" };
    return (
      <span
        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${style.bg} ${style.color}`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F5F4]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#0F9D8C] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-[#6B7472]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F3F5F4] font-sans text-[#14181A] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#0F9D8C]">
              Admin Overview
            </p>
            <h1 className="font-serif font-semibold text-2xl sm:text-3xl md:text-4xl tracking-tight mt-1">
              Good to see you, Admin
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 bg-white border border-[#E4E8E6] rounded-full px-4 py-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#0F9D8C] shadow-md shadow-[#0F9D8C]/30"></span>
            <span className="text-sm font-medium text-[#6B7472]">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`rounded-2xl p-5 shadow-sm transition hover:shadow-md ${
                card.highlight
                  ? "bg-[#14181A] text-white"
                  : "bg-white border border-[#E4E8E6]"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-2 rounded-xl ${
                    card.highlight
                      ? "bg-white/10 text-white"
                      : "bg-[#E3F3F0] text-[#0F9D8C]"
                  }`}
                >
                  {card.icon}
                </div>
                <ArrowUpRight
                  size={16}
                  className={card.highlight ? "text-white/50" : "text-[#6B7472]"}
                />
              </div>
              <p className="text-sm font-medium text-[#6B7472]">
                {card.title}
              </p>
              <h2 className="font-serif font-semibold text-2xl md:text-3xl mt-1">
                {card.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Status Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white border border-[#E4E8E6] rounded-2xl p-4 md:p-5 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-[#6B7472]">Delivered Orders</p>
              <h3 className="font-serif font-semibold text-2xl md:text-3xl text-[#0F9D8C]">
                {sales.delivered}
              </h3>
            </div>
            <TrendingUp size={22} className="text-[#0F9D8C]" />
          </div>
          <div className="bg-white border border-[#E4E8E6] rounded-2xl p-4 md:p-5 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-[#6B7472]">Cancelled Orders</p>
              <h3 className="font-serif font-semibold text-2xl md:text-3xl text-[#DC5F3C]">
                {sales.cancelled}
              </h3>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2 bg-white border border-[#E4E8E6] rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <h3 className="font-serif font-semibold text-lg">Revenue</h3>
              <div className="flex bg-[#F3F5F4] rounded-full p-0.5">
                {RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDays(opt.value)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
                      days === opt.value
                        ? "bg-[#14181A] text-white"
                        : "text-[#6B7472] hover:bg-[#E4E8E6]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64 md:h-72">
              <RevenueBarChart data={sales.chartData} />
            </div>
          </div>

          <div className="bg-white border border-[#E4E8E6] rounded-2xl p-4 md:p-6 shadow-sm">
            <h3 className="font-serif font-semibold text-lg mb-4">Payment Methods</h3>
            <div className="h-64 md:h-72">
              <PaymentDoughnutChart data={sales.paymentData} />
            </div>
          </div>
        </div>

        {/* Recent Orders – Mobile/Tablet: Card with Status Below Amount */}
        <div className="bg-white border border-[#E4E8E6] rounded-2xl p-4 md:p-6 shadow-sm mb-4">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
            <h3 className="font-serif font-semibold text-lg">Recent Orders</h3>
            <button className="text-sm font-semibold text-[#0F9D8C] hover:underline">
              View all →
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-[#6B7472]">No orders yet</div>
          ) : (
            <>
              {/* ✅ Card View – Shows on Mobile & Tablet (all screens below lg/1024px) */}
              <div className="block lg:hidden space-y-3">
                {recentOrders.slice(0, 5).map((order, idx) => (
                  <div
                    key={order._id || idx}
                    className="border border-[#E4E8E6] rounded-xl p-4 bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-[#14181A] truncate max-w-[180px] text-sm">
                        {order.email || "N/A"}
                      </div>
                      <div className="text-xs text-[#6B7472]">
                        {order.order_date
                          ? new Date(order.order_date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </div>
                    </div>
                    {/* ✅ Amount and Status – Stacked Vertically, Status Just Below Amount */}
                    <div className="mt-2">
                      <div className="font-semibold text-[#14181A] text-base">
                        ₹{order.totalAmount || 0}
                      </div>
                      <div className="mt-1">
                        <StatusPill status={order.orderStatus} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ✅ Table View – Only on large screens (lg and above) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#E4E8E6]">
                      <th className="text-left py-2 px-3 font-semibold text-[#6B7472] uppercase text-xs whitespace-nowrap">
                        Customer
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-[#6B7472] uppercase text-xs whitespace-nowrap">
                        Date
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-[#6B7472] uppercase text-xs whitespace-nowrap">
                        Amount
                      </th>
                      <th className="text-left py-2 px-3 font-semibold text-[#6B7472] uppercase text-xs whitespace-nowrap">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.slice(0, 5).map((order, idx) => (
                      <tr
                        key={order._id || idx}
                        className="border-b border-[#E4E8E6] last:border-0 hover:bg-gray-50 transition"
                      >
                        <td className="py-2.5 px-3 max-w-[120px] truncate">
                          {order.email || "N/A"}
                        </td>
                        <td className="py-2.5 px-3 text-[#6B7472] whitespace-nowrap">
                          {order.order_date
                            ? new Date(order.order_date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td className="py-2.5 px-3 font-semibold whitespace-nowrap">
                          ₹{order.totalAmount || 0}
                        </td>
                        <td className="py-2.5 px-3 font-semibold whitespace-nowrap">
                          <StatusPill status={order.orderStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Latest Users */}
          <div className="bg-white border border-[#E4E8E6] rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif font-semibold text-lg">Latest Users</h3>
              <span className="text-sm text-[#6B7472]">
                {latestUsers.length} total
              </span>
            </div>

            {latestUsers.length === 0 ? (
              <div className="text-center py-8 text-[#6B7472]">No users yet</div>
            ) : (
              <div className="space-y-2">
                {latestUsers.slice(0, 5).map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#E3F3F0] text-[#0F9D8C] flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {user.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-[#6B7472] truncate">
                        {user.email}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-[#E3F3F0] text-[#0F9D8C]"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Selling Foods */}
          <div className="bg-white border border-[#E4E8E6] rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif font-semibold text-lg">Top Selling Foods</h3>
              <span className="text-sm text-[#6B7472]">Top 5</span>
            </div>

            {topFoods.length === 0 ? (
              <div className="text-center py-8 text-[#6B7472]">No data yet</div>
            ) : (
              <div className="space-y-4">
                {topFoods.map((food, index) => {
                  const maxSold = topFoods[0]?.totalSold || 1;
                  const pct = Math.max(6, (food.totalSold / maxSold) * 100);
                  const rankColor =
                    index === 0
                      ? "#C9971E"
                      : index === 1
                      ? "#9AA3A0"
                      : index === 2
                      ? "#DC5F3C"
                      : "#0F9D8C";

                  return (
                    <div key={food._id || index}>
                      <div className="flex justify-between items-baseline mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-serif font-bold text-sm"
                            style={{ color: rankColor }}
                          >
                            {index + 1}
                          </span>
                          <span className="font-semibold text-sm">
                            {food.name}
                          </span>
                        </div>
                        <span className="text-xs text-[#6B7472]">
                          {food.totalSold} sold
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: rankColor,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;