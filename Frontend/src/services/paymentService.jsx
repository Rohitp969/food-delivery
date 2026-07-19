import { toast } from "react-toastify";

export const handleRazorpayPayment = async (
  total,
  address,
  handleCheckOut,
  dispatch,
) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/payment/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
        }),
      },
    );

    const data = await response.json();

    if (!data.success) {
      return toast.error("Unable to create order");
    }

    const options = {
      key: "rzp_test_SRm2hdksOgmlLz",

      amount: data.order.amount,

      currency: data.order.currency,

      name: "GoFood",

      description: "Food Order",

      order_id: data.order.id,

      handler: async function (response) {
        const verify = await fetch(
          "http://localhost:5000/api/payment/verify-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          },
        );

        const result = await verify.json();

        if (result.success) {
          await handleCheckOut({
            address,
            paymentMethod: "online",
            totalAmount: total,
            orderId: Date.now(),
          });

          // toast.success("Payment Successful 🎉");
        } else {
          toast.error("Payment Verification Failed");
        }
      },

      prefill: {
        name: address.name,

        email: localStorage.getItem("userEmail"),

        contact: address.phone,
      },

      notes: {
        address: address.address,
      },

      theme: {
        color: "#16a34a",
      },
    };

    const razor = new window.Razorpay(options);

    razor.open();
  } catch (error) {
    console.log(error);

    toast.error("Payment Failed");
  }
};
