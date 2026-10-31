import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import CartBar from "./CartBar";
import { cx } from "../../lib/styles";

// Customer pages: navbar, page body on the canvas colour, footer
const StoreLayout = ({ children, cartBar = false, className }) => (
  <>
    <Navbar />
    <main className={cx("min-h-[calc(100vh-4rem)] bg-canvas", cartBar && "pb-24", className)}>{children}</main>
    {cartBar && <CartBar />}
    <Footer />
  </>
);

export default StoreLayout;
