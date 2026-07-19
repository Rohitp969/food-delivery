import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/ContextReducer";
import { WishlistProvider } from "./context/WishlistContext"; 

import Home from "./screens/Home";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
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
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/myorder" element={<MyOrder />} />
            <Route path="/food/:id" element={<FoodDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/wishlist" element={<Wishlist />} />  {/* ✅ Already there */}
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/help" element={<HelpSupport />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
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