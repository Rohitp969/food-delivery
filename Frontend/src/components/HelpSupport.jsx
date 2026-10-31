import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import StoreLayout from "./store/StoreLayout";
import { FREE_DELIVERY_FROM, DELIVERY_FEE } from "../lib/cart";

const link = "font-semibold text-leaf no-underline hover:text-leaf-dark";

const TOPICS = [
  {
    title: "Ordering",
    items: [
      {
        q: "How do I place an order?",
        a: (
          <>
            Pick a restaurant, press Add on the dishes you want, then open your <Link to="/cart" className={link}>cart</Link> and
            choose Checkout. Enter where we should deliver, pick how to pay, and place the order.
          </>
        ),
      },
      {
        q: "How much is delivery?",
        a: `Delivery is free on orders of ₹${FREE_DELIVERY_FROM} or more. Below that it's ₹${DELIVERY_FEE}. GST of 5% is added to every order, and you'll see the full amount before you pay.`,
      },
      {
        q: "How can I pay?",
        a: "Pay online with a card, UPI or netbanking through Razorpay, or choose cash on delivery and pay when your food arrives.",
      },
    ],
  },
  {
    title: "After you order",
    items: [
      {
        q: "How do I track my order?",
        a: (
          <>
            Open <Link to="/myorder" className={link}>My orders</Link>. Each order shows whether it's placed, accepted by the
            restaurant, on the way or delivered. Press Refresh to see the latest status.
          </>
        ),
      },
      {
        q: "Can I cancel an order?",
        a: "Orders can be cancelled by the restaurant before they're sent out. If you paid online for a cancelled order, the refund goes back to your original payment method.",
      },
    ],
  },
  {
    title: "Your account",
    items: [
      {
        q: "I didn't get my verification code",
        a: "Codes can take a minute and sometimes land in spam. They expire after 10 minutes; on the verification screen you can ask for a new one once a minute.",
      },
      {
        q: "I forgot my password",
        a: (
          <>
            Use <Link to="/forgot-password" className={link}>Reset password</Link>. We'll email you a code, then you can choose a
            new password.
          </>
        ),
      },
      {
        q: "How do I change my phone number or address?",
        a: (
          <>
            Go to <Link to="/profile" className={link}>Your account</Link>. Your saved address and phone are filled in for you at
            checkout.
          </>
        ),
      },
    ],
  },
];

const HelpSupport = () => (
  <StoreLayout>
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-[32px] font-semibold tracking-tight text-ink">Help</h1>
      <p className="mt-1 text-[16px] text-muted">Answers to the questions people ask us most.</p>

      <div className="mt-8 space-y-6">
        {TOPICS.map((topic) => (
          <section key={topic.title} aria-labelledby={`topic-${topic.title}`} className="rounded-xl border border-line bg-white">
            <h2 id={`topic-${topic.title}`} className="border-b border-line px-5 py-3.5 font-display text-[17px] font-semibold text-ink">
              {topic.title}
            </h2>
            <div className="divide-y divide-line">
              {topic.items.map((item) => (
                <details key={item.q} className="group px-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium text-ink [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="pb-4 text-[15px] leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  </StoreLayout>
);

export default HelpSupport;
