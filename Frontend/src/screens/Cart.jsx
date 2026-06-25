import React from "react";
import { useCart, useDispatchCart } from "../components/ContextReducer";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const Cart = () => {
  let data = useCart();
  let dispatch = useDispatchCart();
  if (data.length === 0) {
    return (
      <div className="text-center py-5">
        <h2 className="text-light">🛒 Your Cart is Empty</h2>

        <p className="text-secondary mt-2">
          Add some delicious food to continue
        </p>
      </div>
    );
  }

  const handleCheckOut = async () => {
    let userEmail = localStorage.getItem("userEmail");
    console.log(localStorage.getItem("userEmail"));
    let response = await fetch("http://localhost:5000/api/orderData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_data: data,
        email: userEmail,
        order_date: new Date().toDateString(),
      }),
    });
    console.log("Order Response:", response);

    if (response.status === 200) {
      dispatch({ type: "DROP" });
      toast.success("Order placed successfully 🎉");
    }
  };

  let totalPrice = data.reduce(
    (total, food) => total + food.qty * food.price,
    0,
  );

  return (
    <div>
      {/* <div className="container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md "> */}
      <div className="w-full">
        <table className="table table-hover text-white align-middle">
          <thead className="text-success fs-5 border-bottom">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Option</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>₹ {food.qty * food.price}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      dispatch({ type: "REMOVE", index });
                      toast.success("Item removed from cart 🗑️");
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-between align-items-center mt-4 border-top pt-3">
          <h3 className="text-light mb-0">Total Amount</h3>

          <h2 className="text-success fw-bold mb-0">₹ {totalPrice}</h2>
        </div>
        <div className="mt-4">
          <button
            className="btn btn-success px-4 py-2 fw-bold"
            onClick={handleCheckOut}
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
