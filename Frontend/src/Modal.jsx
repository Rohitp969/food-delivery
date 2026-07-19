import React from "react";
import ReactDOM from "react-dom";

export default function Modal({ children, onClose }) {
  return ReactDOM.createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
      />

      {/* Modal Wrapper */}
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto">
        {children}
      </div>
    </>,
    document.getElementById("cart-root")
  );
}