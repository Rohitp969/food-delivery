import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Banknote, CreditCard, Lock } from "lucide-react";
import StoreLayout from "../components/store/StoreLayout";
import PriceSummary from "../components/store/PriceSummary";
import Button from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Field";
import FormAlert from "../components/FormAlert";
import { useCart, useDispatchCart } from "../context/ContextReducer";
import { api } from "../lib/api";
import { cartTotals } from "../lib/cart";
import { formatCurrency } from "../lib/format";
import { getSession } from "../lib/session";
import { cx } from "../lib/styles";
import { useFetch } from "../lib/useFetch";
import { handleRazorpayPayment } from "../services/paymentService";

const PAYMENT_OPTIONS = [
  { id: "online", label: "Pay online", hint: "Card, UPI or netbanking through Razorpay", icon: CreditCard },
  { id: "cod", label: "Cash on delivery", hint: "Pay the delivery partner when your food arrives", icon: Banknote },
];

const RULES = {
  name: (v) => (v.trim() ? "" : "Enter the name for this delivery"),
  phone: (v) => (/^[0-9]{10}$/.test(v.trim()) ? "" : "Enter a 10-digit mobile number"),
  address: (v) => (v.trim() ? "" : "Enter your house number, street and area"),
  city: (v) => (v.trim() ? "" : "Enter your city"),
  state: (v) => (v.trim() ? "" : "Enter your state"),
  pincode: (v) => (/^[0-9]{6}$/.test(v.trim()) ? "" : "Enter a 6-digit pincode"),
};

const newOrderId = () => Date.now();

// Profile phone may be stored as "+91 98765 43210"; the form wants the last 10 digits
const tenDigits = (phone = "") => phone.replace(/\D/g, "").slice(-10);

const DeliveryForm = ({ initial, onPlaced }) => {
  const cart = useCart();
  const dispatch = useDispatchCart();
  const totals = cartTotals(cart);
  const [address, setAddress] = useState(initial);
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState("online");
  const [placing, setPlacing] = useState(false);
  const [formError, setFormError] = useState("");

  const field = (name) => ({
    id: `delivery-${name}`,
    name,
    value: address[name],
    error: errors[name],
    onChange: (e) => {
      setAddress({ ...address, [name]: e.target.value });
      if (errors[name]) setErrors({ ...errors, [name]: "" });
    },
    onBlur: (e) => e.target.value && setErrors({ ...errors, [name]: RULES[name](e.target.value) }),
  });

  // Saves the order once payment (or the cash choice) is settled
  const submitOrder = async ({ paymentMethod, totalAmount, orderId }) => {
    try {
      await api("/api/orderData", {
        method: "POST",
        body: {
          email: getSession().email,
          order_data: cart,
          order_date: new Date().toISOString(),
          address,
          paymentMethod,
          totalAmount,
        },
      });
      dispatch({ type: "DROP" });
      onPlaced({ orderId, totalAmount, paymentMethod, address, items: cart });
      return true;
    } catch (err) {
      setFormError(`We couldn't place your order. ${err.message}`);
      return false;
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    const found = Object.fromEntries(Object.entries(RULES).map(([k, rule]) => [k, rule(address[k])]));
    setErrors(found);
    const firstInvalid = Object.keys(found).find((k) => found[k]);
    if (firstInvalid) {
      document.getElementById(`delivery-${firstInvalid}`)?.focus();
      return;
    }

    setPlacing(true);
    setFormError("");
    if (payment === "cod") {
      await submitOrder({ paymentMethod: "cod", totalAmount: totals.total, orderId: newOrderId() });
    } else {
      // Razorpay opens its own window and calls submitOrder after the payment is verified
      await handleRazorpayPayment(totals.total, address, submitOrder, dispatch);
    }
    setPlacing(false);
  };

  return (
    <form onSubmit={placeOrder} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <div className="space-y-6">
        <section aria-labelledby="deliver-title" className="rounded-xl border border-line bg-white p-5">
          <h2 id="deliver-title" className="font-display text-[17px] font-semibold text-ink">
            Delivery details
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Input label="Name" autoComplete="name" {...field("name")} />
            <Input label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} {...field("phone")} />
            <Textarea
              label="Address"
              rows={2}
              autoComplete="street-address"
              hint="House or flat number, street and area"
              className="sm:col-span-2"
              {...field("address")}
            />
            <Input label="City" autoComplete="address-level2" {...field("city")} />
            <Input label="State" autoComplete="address-level1" {...field("state")} />
            <Input label="Pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} {...field("pincode")} />
          </div>
        </section>

        <fieldset className="rounded-xl border border-line bg-white p-5">
          <legend className="sr-only">Payment method</legend>
          <h2 className="font-display text-[17px] font-semibold text-ink" aria-hidden="true">
            Payment
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PAYMENT_OPTIONS.map(({ id, label, hint, icon: Icon }) => (
              <label
                key={id}
                className={cx(
                  "flex cursor-pointer gap-3 rounded-lg p-4 ring-1 ring-inset transition-colors",
                  payment === id ? "bg-leaf-soft ring-2 ring-leaf" : "ring-line hover:bg-canvas",
                )}
              >
                <input
                  type="radio"
                  name="payment"
                  value={id}
                  checked={payment === id}
                  onChange={() => setPayment(id)}
                  className="mt-1 h-4 w-4 accent-[var(--color-leaf)]"
                />
                <span>
                  <span className="flex items-center gap-2 font-semibold text-ink">
                    <Icon className="h-4 w-4" aria-hidden="true" /> {label}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24">
        <section aria-labelledby="items-title" className="rounded-xl border border-line bg-white p-5">
          <div className="flex items-baseline justify-between">
            <h2 id="items-title" className="font-display text-[17px] font-semibold text-ink">
              Your order
            </h2>
            <Link to="/cart" className="text-sm font-semibold text-leaf no-underline">
              Edit
            </Link>
          </div>
          <ul className="mt-3 space-y-2 text-[15px]">
            {cart.map((item) => (
              <li key={`${item.id}-${item.size}`} className="flex justify-between gap-3">
                <span className="min-w-0 truncate text-ink">
                  <span className="tabular text-muted">{item.qty} ×</span> {item.name}
                </span>
                <span className="tabular shrink-0 text-ink">{formatCurrency(item.qty * item.price)}</span>
              </li>
            ))}
          </ul>
        </section>

        <PriceSummary totals={totals}>
          <FormAlert className="mb-3">{formError}</FormAlert>
          <Button type="submit" size="lg" loading={placing} className="w-full">
            {payment === "cod" ? "Place order" : "Pay"}, {formatCurrency(totals.total)}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            {payment === "cod" ? "No payment needed now" : "Payments are processed securely by Razorpay"}
          </p>
        </PriceSummary>
      </div>
    </form>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const cart = useCart();
  const [placed, setPlaced] = useState(false);
  const { data, loading } = useFetch(() => api("/api/account/me").catch(() => ({})), []);

  if (!cart.length && !placed) return <Navigate to="/cart" replace />;

  const user = data?.user || {};
  const initial = {
    name: user.name || getSession().name || "",
    phone: tenDigits(user.phone),
    address: user.location || "",
    city: "",
    state: "",
    pincode: "",
  };

  return (
    <StoreLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-display text-[28px] font-semibold tracking-tight text-ink">Checkout</h1>
        {loading && !data ? (
          <div className="h-96 animate-pulse rounded-xl bg-slate-200/70" role="status" aria-label="Loading checkout" />
        ) : (
          <DeliveryForm
            initial={initial}
            onPlaced={(order) => {
              setPlaced(true);
              navigate("/order-success", { state: order, replace: true });
            }}
          />
        )}
      </div>
    </StoreLayout>
  );
};

export default Checkout;
