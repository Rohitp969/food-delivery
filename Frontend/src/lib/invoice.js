import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDateTime, orderRef } from "./format";
import { PAYMENT_LABELS, STATUS_META } from "./orders";

const NAVY = [15, 26, 46];
const LEAF = [21, 128, 61];
const MUTED = [94, 107, 122];

// jsPDF's built-in fonts have no ₹ glyph, so amounts use "Rs."
const rs = (n) => `Rs. ${Number(n || 0).toLocaleString("en-IN")}`;

export const downloadInvoice = (order) => {
  const doc = new jsPDF();
  const addr = order.address || {};

  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 210, 32, "F");
  doc.setTextColor(250, 204, 21);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("GoFood", 14, 20);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice ${orderRef(order.id)}`, 196, 15, { align: "right" });
  doc.text(formatDateTime(order.date), 196, 22, { align: "right" });

  doc.setTextColor(...MUTED);
  doc.setFontSize(9);
  doc.text("BILLED TO", 14, 46);
  doc.text("PAYMENT", 120, 46);

  doc.setTextColor(...NAVY);
  doc.setFontSize(11);
  const billed = [addr.name, order.email, addr.phone, addr.address, [addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")].filter(Boolean);
  billed.forEach((line, i) => doc.text(String(line), 14, 53 + i * 6));
  doc.text(PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod, 120, 53);
  doc.text(`${order.paymentStatus}  |  ${STATUS_META[order.orderStatus]?.label || order.orderStatus}`, 120, 59);

  autoTable(doc, {
    startY: 60 + billed.length * 6 + 6,
    head: [["Item", "Size", "Qty", "Amount"]],
    body: (order.items || []).map((item) => [item.name, item.size || "Regular", item.qty, rs(item.price)]),
    foot: [["", "", "Total", rs(order.totalAmount)]],
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 3, textColor: NAVY },
    headStyles: { textColor: MUTED, fontStyle: "bold", lineWidth: { bottom: 0.3 }, lineColor: [226, 230, 235] },
    footStyles: { fontStyle: "bold", textColor: LEAF, fontSize: 12 },
    columnStyles: { 2: { halign: "right" }, 3: { halign: "right" } },
  });

  doc.setTextColor(...MUTED);
  doc.setFontSize(9);
  doc.text("Thank you for ordering with GoFood.", 14, 285);

  doc.save(`GoFood-invoice-${orderRef(order.id).slice(1)}.pdf`);
};
