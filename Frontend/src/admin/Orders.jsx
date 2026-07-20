import React, { useEffect, useState } from "react";
import { 
  FaSearch, 
  FaEye, 
  FaFilePdf, 
  FaFilter,
  FaDownload,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaBoxOpen,
  FaTimesCircle,
  FaTimes
} from "react-icons/fa";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;



  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/orders`);
      const json = await response.json();
      if (json.success) {
        setOrders(json.orders);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (err) {
      console.log(err);
      toast.error("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (orderId, index, status) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/${index}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const json = await response.json();
      if (json.success) {
        toast.success(`Order status updated to ${status}`);
        fetchOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error");
    }
  };

  // ✅ Download Invoice as PDF
  const downloadInvoice = (order) => {
    if (!order) return;

    const doc = new jsPDF();

    // Header
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("INVOICE", 14, 25);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    let yPos = 55;

    // Customer Details
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text("CUSTOMER DETAILS", 14, yPos);
    yPos += 8;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Email: ${order.email || order.userEmail || "N/A"}`, 14, yPos);
    yPos += 6;
    doc.text(`Date: ${order.order_date || new Date().toLocaleString()}`, 14, yPos);
    yPos += 6;
    doc.text(`Payment: ${order.paymentMethod || "N/A"}`, 14, yPos);
    yPos += 6;
    doc.text(`Status: ${order.orderStatus || "N/A"}`, 14, yPos);
    yPos += 15;

    // Address
    doc.setFontSize(14);
    doc.setTextColor(34, 197, 94);
    doc.text("DELIVERY ADDRESS", 14, yPos);
    yPos += 8;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    const addr = order.address || {};
    doc.text(addr.name || "", 14, yPos);
    yPos += 6;
    doc.text(addr.phone || "", 14, yPos);
    yPos += 6;
    doc.text(addr.address || "", 14, yPos);
    yPos += 6;
    doc.text(`${addr.city || ""} ${addr.state || ""} ${addr.pincode || ""}`, 14, yPos);
    yPos += 15;

    // Items Table
    autoTable(doc, {
      startY: yPos,
      head: [["Item", "Qty", "Size", "Price"]],
      body: (order.items || []).map((item) => [
        item.name || "Item",
        item.qty || 1,
        item.size || "Regular",
        `₹${item.price || 0}`,
      ]),
      headStyles: {
        fillColor: [34, 197, 94],
        fontSize: 11,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 248, 235],
      },
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text(`TOTAL AMOUNT: ₹${order.totalAmount || 0}`, 14, finalY);

    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for your order!", 14, 280);

    doc.save(`Invoice-${order.email || "order"}-${Date.now()}.pdf`);
    toast.success("Invoice downloaded");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Preparing": { color: "bg-blue-100 text-blue-700", icon: FaClock },
      "Accepted": { color: "bg-purple-100 text-purple-700", icon: FaCheckCircle },
      "Out For Delivery": { color: "bg-orange-100 text-orange-700", icon: FaTruck },
      "Delivered": { color: "bg-green-100 text-green-700", icon: FaBoxOpen },
      "Cancelled": { color: "bg-red-100 text-red-700", icon: FaTimesCircle },
    };
    const config = statusConfig[status] || statusConfig["Preparing"];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  // Flat orders for display
  const flatOrders = orders.flatMap(order => 
    order.order_data.map((item, index) => ({
      ...order,
      itemIndex: index,
      orderData: item,
      uniqueKey: `${order._id}-${index}`
    }))
  );

  const filteredOrders = flatOrders.filter(order => 
    order.email.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "All" || order.orderData.orderStatus === statusFilter)
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-1.5 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-7">
              Orders Management
            </h1>
          </div>
          <p className="text-gray-500 mt-2 ml-4">Track and manage all customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-500 bg-white/80 backdrop-blur-sm transition-all"
            />
          </div>
          <div className="relative w-44">
            <FaFilter className="absolute left-4 top-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-500 bg-white appearance-none cursor-pointer transition-all"
            >
              <option value="All">All Status</option>
              <option value="Preparing">Preparing</option>
              <option value="Accepted">Accepted</option>
              <option value="Out For Delivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200/60">
          <span className="text-sm text-gray-500">Total Orders:</span>
          <span className="ml-2 font-bold text-slate-800">{filteredOrders.length}</span>
        </div>
        {search && (
          <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-200">
            <span className="text-sm text-indigo-600">
              Showing {filteredOrders.length} result{filteredOrders.length !== 1 && 's'}
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <FaSpinner className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No orders found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Items</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentOrders.map((order) => (
                    <tr key={order.uniqueKey} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-800 max-w-[150px] truncate">
                        {order.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(order.orderData.order_date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {order.orderData.items?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-green-600">
                        ₹{order.orderData.totalAmount || 0}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          order.orderData.paymentMethod === 'online' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.orderData.paymentMethod || 'COD'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <select
                            value={order.orderData.orderStatus}
                            onChange={(e) =>
                              changeStatus(order._id, order.itemIndex, e.target.value)
                            }
                            className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-green-500 bg-white transition-all"
                          >
                            <option value="Preparing">Preparing</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Out For Delivery">Out For Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* View Button */}
                          <button
                            onClick={() => {
                              setSelectedOrder({
                                email: order.email,
                                ...order.orderData,
                              });
                              setShowModal(true);
                            }}
                            className="group bg-blue-50 hover:bg-blue-500 text-blue-500 hover:text-white p-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                            title="View Details"
                          >
                            <FaEye size={14} />
                          </button>
                          {/* Download Button */}
                          <button
                            onClick={() => downloadInvoice({
                              email: order.email,
                              ...order.orderData,
                            })}
                            className="group bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white p-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                            title="Download Invoice"
                          >
                            <FaDownload size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ========== MODAL ========== */}
      <AnimatePresence>
        {showModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10 rounded-t-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Order Details</h2>
                  <p className="text-sm text-slate-500 mt-1">Complete order information</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-2xl"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    👤 Customer Information
                  </h3>
                  <p className="text-sm"><span className="text-slate-500">Email:</span> {selectedOrder.email}</p>
                  <p className="text-sm"><span className="text-slate-500">Date:</span> {selectedOrder.order_date}</p>
                  <p className="text-sm"><span className="text-slate-500">Payment:</span> {selectedOrder.paymentMethod}</p>
                  <p className="text-sm"><span className="text-slate-500">Status:</span> {getStatusBadge(selectedOrder.orderStatus)}</p>
                </div>

                {/* Address */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    📍 Delivery Address
                  </h3>
                  <p className="text-sm">{selectedOrder.address?.name}</p>
                  <p className="text-sm">{selectedOrder.address?.phone}</p>
                  <p className="text-sm">{selectedOrder.address?.address}</p>
                  <p className="text-sm">
                    {selectedOrder.address?.city}, {selectedOrder.address?.state}
                    {selectedOrder.address?.pincode && ` - ${selectedOrder.address.pincode}`}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    🛒 Ordered Items
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((food, index) => (
                      <div key={index} className="flex items-center gap-4 border border-slate-100 rounded-xl p-3 hover:shadow-sm transition-shadow">
                        <img
                          src={food.img}
                          alt={food.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800">{food.name}</h4>
                          <div className="flex gap-3 text-sm text-slate-500">
                            <span>Qty: {food.qty}</span>
                            <span>Size: {food.size}</span>
                          </div>
                        </div>
                        <p className="font-bold text-green-600">₹{food.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Total Amount</span>
                    <span className="font-bold text-xl text-green-600">₹{selectedOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Payment Method</span>
                    <span className="font-medium">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Order Status</span>
                    {getStatusBadge(selectedOrder.orderStatus)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => downloadInvoice(selectedOrder)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <FaFilePdf className="w-4 h-4" />
                    Download Invoice PDF
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;