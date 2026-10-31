import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { PageHeader, Panel } from "../components/ui/Display";

const link = "font-semibold text-leaf no-underline hover:text-leaf-dark";

const TOPICS = [
  {
    title: "Orders",
    items: [
      {
        q: "A new order came in. What do I do?",
        a: (
          <>
            New orders are highlighted in yellow on <Link to="/admin/orders?status=Preparing" className={link}>Orders</Link>.
            Press <strong>Accept</strong>, then <strong>Send out</strong> when it leaves the kitchen, then{" "}
            <strong>Mark delivered</strong>. Cash orders are marked as paid when you mark them delivered. The new-orders
            count in the top bar refreshes every minute.
          </>
        ),
      },
      {
        q: "How do I cancel an order?",
        a: (
          <>
            Open the order with the eye icon and choose <strong>Cancel order</strong>. Cancelled orders don't count towards
            revenue. If the customer paid online, refund them from your Razorpay dashboard; GoFood doesn't refund
            automatically.
          </>
        ),
      },
      {
        q: "How do I give a customer an invoice?",
        a: "Open the order and choose Download invoice. You get a PDF with the items, address, payment method and total.",
      },
    ],
  },
  {
    title: "Menu",
    items: [
      {
        q: "How do I add or change a dish?",
        a: (
          <>
            Go to <Link to="/admin/add-food" className={link}>Add a dish</Link>, upload a photo (up to 5 MB) or paste an
            image link, then pick its category and restaurant. To change a price or photo later, use the pencil icon on{" "}
            <Link to="/admin/food-list" className={link}>Menu</Link>.
          </>
        ),
      },
      {
        q: "Does removing a dish affect past orders?",
        a: "No. Customers stop seeing it straight away, but orders that included it keep their items and totals.",
      },
    ],
  },
  {
    title: "Customers and admins",
    items: [
      {
        q: "How do I make someone an admin?",
        a: (
          <>
            On <Link to="/admin/users" className={link}>Customers</Link>, press the pencil icon and set Role to Admin. You
            can't change your own role or delete your own account, and GoFood always keeps at least one admin.
          </>
        ),
      },
      {
        q: "Why can't I change a customer's email?",
        a: "Orders are linked to the email address, so changing it would detach the customer from their order history.",
      },
      {
        q: "A customer says they never got their verification code.",
        a: "Codes are emailed through Brevo and expire after 10 minutes. Ask them to check spam, then use Resend (allowed once a minute). Brevo's free plan sends up to 300 emails a day across sign-ups, password resets and confirmations.",
      },
    ],
  },
  {
    title: "Reports and your account",
    items: [
      {
        q: "How are revenue and the % changes calculated?",
        a: (
          <>
            Revenue adds up every order in the period except cancelled ones. The percentage compares it with the period of
            the same length just before. <Link to="/admin/sales" className={link}>Sales</Link> can export everything as CSV.
          </>
        ),
      },
      {
        q: "How do I change my password?",
        a: (
          <>
            Go to <Link to="/admin/settings" className={link}>Account settings</Link>. If you've forgotten it, log out and
            use "Forgot password?" on the login page; we'll email you a code.
          </>
        ),
      },
    ],
  },
];

const AdminHelpSupport = () => (
  <>
    <PageHeader title="Help" description="Quick answers for running GoFood day to day." />

    <div className="max-w-3xl space-y-6">
      {TOPICS.map((topic) => (
        <Panel key={topic.title} title={topic.title} bodyClassName="divide-y divide-line">
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
        </Panel>
      ))}
    </div>
  </>
);

export default AdminHelpSupport;
