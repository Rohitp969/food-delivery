import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyOrder = () => {
  const [orderData, setOrderData] = useState([]);

  
    const fetchOrders = async () => {
      const email = localStorage.getItem("userEmail");

      const response = await fetch("http://localhost:5000/api/myOrderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: localStorage.getItem('userEmail') }),
      });

      const json = await response.json();

      if (json.orderData) {
        setOrderData(json.orderData.order_data);
      }
    };
    useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div className="row">

          {orderData.length > 0 &&
            orderData.slice(0).reverse().map((order, index) => (
              <div key={index} className="w-100">

                {/* Date */}
                <h4 className="text-success">
                  {order[0].Order_date}
                </h4>
                <hr />

                <div className="row">
                  {order.slice(1).map((item, i) => (
                    <div
                      className="col-12 col-md-6 col-lg-3 mb-3"
                      key={i}
                    >
                      <div
                        className="card"
                        style={{ width: "18rem", maxHeight: "360px" }}
                      >
                        <img
                          src={item.img}
                          className="card-img-top"
                          alt={item.name}
                          style={{ height: "150px", objectFit: "cover" }}
                        />

                        <div className="card-body">
                          <h5 className="card-title">{item.name}</h5>

                          <p>
                            Qty : {item.qty}
                          </p>

                          <p>
                            Size : {item.size}
                          </p>

                          <h6 className="text-success">
                            ₹ {item.price}/-
                          </h6>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}

        </div>
      </div>

      <Footer />
    </>
  );
};

export default MyOrder;