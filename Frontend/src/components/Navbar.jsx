// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom';
// import Badge from 'react-bootstrap/Badge'
// import Modal from '../Modal';
// import Cart from '../screens/Cart';
// import { useCart } from './ContextReducer';
// import { toast } from "react-toastify";
// import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

// const Navbar = () => {

// const [showProfile, setShowProfile] = useState(false);
// const [cartView, setCartView] = useState(false)
// let data = useCart();
// const navigate = useNavigate();
// const handleLogout = () =>{
//   localStorage.removeItem("authToken");
//   localStorage.removeItem("userEmail");
//   toast.success("User Logout Successful 🎉");
//   navigate("/login")
// }

//   return (
//     <div>
//       <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm" style={{position: "sticky"}}>
//   <div className="container-fluid">
//     <Link className="navbar-brand fw-bold fs-2 text-white" to="/">🍔 GoFood </Link>
//     <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
//      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//       <span className="navbar-toggler-icon"></span>
//     </button>
//     <div className="collapse navbar-collapse" id="navbarNav">
//       <ul className="navbar-nav me-auto mb-2">
//         <li className="nav-item">
//           <Link className="nav-link active fs-5" aria-current="page" to="/">Home</Link>
//         </li>
//         {(localStorage.getItem("authToken")) ?
//         <li className="nav-item">
//           <Link className="nav-link active fs-5" aria-current="page" to="/myorder">My Order</Link>
//         </li>
//        : "" }
//       </ul>
//       {(!localStorage.getItem("authToken")) ?
//       <div className='d-flex'>
//           <Link className="btn bg-white text-success mx-1" to="/login">Login</Link>
//           <Link className="btn bg-white text-success mx-1" to="/signup">SignUp</Link>
//       </div>
//       : 
// <div className="d-flex align-items-center gap-3 position-relative">

//   {/* Cart */}

//   <button
//     className="btn btn-light position-relative"
//     onClick={() => setCartView(true)}
//   >
//     <FaShoppingCart size={18} />

//     {data.length > 0 && (
//       <Badge
//         bg="danger"
//         pill
//         className="position-absolute top-0 start-100 translate-middle"
//       >
//         {data.length}
//       </Badge>
//     )}
//   </button>

//   {cartView && (
//     <Modal onClose={() => setCartView(false)}>
//       <Cart />
//     </Modal>
//   )}

//   {/* Profile */}

//   <div className="position-relative">

//     <button
//       className="btn btn-light d-flex align-items-center gap-2"
//       onClick={() => setShowProfile(!showProfile)}
//     >
//       <FaUserCircle size={24} />
//       Profile
//     </button>

//     {showProfile && (
//       <div
//         className="card shadow border-0 position-absolute end-0 mt-2"
//         style={{
//           width: "250px",
//           zIndex: 9999
//         }}
//       >
//         <div className="card-body">

//           <h6 className="fw-bold">
//             {localStorage.getItem("userEmail")}
//           </h6>

//           <hr />

//           <Link
//             to="/myorder"
//             className="dropdown-item py-2"
//           >
//             📦 My Orders
//           </Link>

//           <button
//             className="btn btn-danger w-100 mt-3"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>

//         </div>
//       </div>
//     )}

//   </div>

// </div>

//        }
//      </div>
//    </div>
//  </nav>
// </div>
//   )
// }

// export default Navbar;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Modal from "../Modal";
import Cart from "../screens/Cart";
import { useCart } from "./ContextReducer";
import { toast } from "react-toastify";
import {
  FaShoppingCart,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [cartView, setCartView] = useState(false);

  const data = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");

    toast.success("Logout Successful 👋");

    navigate("/login");
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark shadow"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1050,
          background: "#0f172a",
          padding: "12px 20px",
        }}
      >
        <div className="container-fluid">
          {/* Logo */}

          <Link
            className="navbar-brand fw-bold d-flex align-items-center gap-2"
            to="/"
          >
            <span style={{ fontSize: "2rem" }}>🍔</span>

            <span
              style={{
                fontSize: "1.8rem",
                color: "#facc15",
              }}
            >
              GoFood
            </span>
          </Link>

          {/* Mobile Toggle */}

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <FaBars />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Left Links */}

            <ul className="navbar-nav me-auto align-items-lg-center">
              <li className="nav-item">
                <Link
                  className="nav-link text-white fw-semibold mx-2"
                  to="/"
                >
                  Home
                </Link>
              </li>

              {localStorage.getItem("authToken") && (
                <li className="nav-item">
                  <Link
                    className="nav-link text-white fw-semibold mx-2"
                    to="/myorder"
                  >
                    My Orders
                  </Link>
                </li>
              )}
            </ul>

            {/* Right Side */}

            {!localStorage.getItem("authToken") ? (
              <div className="d-flex mt-3 mt-lg-0">
                <Link
                  className="btn btn-outline-light mx-1"
                  to="/login"
                >
                  Login
                </Link>

                <Link
                  className="btn btn-warning mx-1"
                  to="/signup"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-3 ms-auto mt-3 mt-lg-0">
                {/* Cart */}

                <button
                  className="btn position-relative"
                  onClick={() => setCartView(true)}
                  style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    padding: "10px 15px",
                  }}
                >
                  <FaShoppingCart
                    size={20}
                    color="#16a34a"
                  />

                  {data.length > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute top-0 start-100 translate-middle"
                    >
                      {data.length}
                    </Badge>
                  )}
                </button>

                {cartView && (
                  <Modal onClose={() => setCartView(false)}>
                    <Cart />
                  </Modal>
                )}

                {/* Profile */}

                <div className="position-relative">
                  <button
                    className="btn d-flex align-items-center gap-2 text-white"
                    style={{
                      background: "#1e293b",
                      borderRadius: "12px",
                      padding: "8px 14px",
                    }}
                    onClick={() =>
                      setShowProfile(!showProfile)
                    }
                  >
                    <FaUserCircle size={28} />
                    <span>Profile</span>
                  </button>

                  {showProfile && (
                    <div
                      className="card border-0 shadow position-absolute end-0 mt-2"
                      style={{
                        width: "280px",
                        borderRadius: "15px",
                        zIndex: 9999,
                      }}
                    >
                      <div className="card-body">
                        <div className="text-center mb-3">
                          <FaUserCircle
                            size={60}
                            color="#64748b"
                          />

                          <h6 className="mt-2">
                            {localStorage.getItem(
                              "userEmail"
                            )}
                          </h6>
                        </div>

                        <hr />

                        <Link
                          to="/myorder"
                          className="dropdown-item py-2"
                          onClick={() =>
                            setShowProfile(false)
                          }
                        >
                          📦 My Orders
                        </Link>

                        <Link
                          to="/"
                          className="dropdown-item py-2"
                          onClick={() =>
                            setShowProfile(false)
                          }
                        >
                          🏠 Home
                        </Link>

                        <hr />

                        <button
                          className="btn btn-danger w-100"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
