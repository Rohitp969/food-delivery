import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import { CartProvider } from "./context/ContextReducer";
import { WishlistProvider } from "./context/WishlistContext"; 

import Home from "./screens/Home";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import VerifyEmail from "./screens/VerifyEmail";
import ForgotPassword from "./screens/ForgotPassword";
import MyOrder from "./screens/MyOrder";
import Cart from "./screens/Cart";
import Checkout from "./screens/Checkout";
import OrderSuccess from "./components/Cart/OrderSuccess";

import Dashboard from "./admin/Dashboard";
import AddFood from "./admin/AddFood";
import FoodList from "./admin/FoodList";
import Orders from "./admin/Orders";
import Users from "./admin/Users";
import Sales from "./admin/Sales";

import AdminLayout from "./components/AdminLayout";
import AdminProfile from "./admin/AdminProfile";
import AdminSettings from "./admin/AdminSettings";
import HelpSupport from "./components/HelpSupport";
import Profile from "./components/Profile";
import Wishlist from "./components/Wishlist"; 
import FoodDetails from "./screens/FoodDetails";
import UserSettings from "./components/UserSettings";
import AdminHelpSupport from "./admin/AdminHelpSupport";
import RestaurantMenu from "./components/RestaurantMenu";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>  
        <Router>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
            <Route path="/myorder" element={<RequireAuth><MyOrder /></RequireAuth>} />
            <Route path="/food/:id" element={<FoodDetails />} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth><UserSettings /></RequireAuth>} />
            <Route path="/wishlist" element={<Wishlist />} />  {/* ✅ Already there */}
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/help" element={<HelpSupport />} />
            <Route path="/restaurant/:id" element={<RestaurantMenu />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-food" element={<AddFood />} />
              <Route path="food-list" element={<FoodList />} />
              <Route path="orders" element={<Orders />} />
              <Route path="users" element={<Users />} />
              <Route path="sales" element={<Sales />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="help" element={<AdminHelpSupport />} />
            </Route>
          </Routes>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;