import React from "react";
import ReactDom from "react-dom";

const MODAL_STYLES = {
  position: "fixed",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  backgroundColor: "#1f1f1f",
  borderRadius: "16px",

  zIndex: 1000,

  width: "90%",
  maxWidth: "1000px",

  maxHeight: "80vh",
  overflowY: "auto",

  padding: "20px",

  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  zIndex: 999,
};

export default function Modal({ children, onClose }) {
  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} onClick={onClose} />

      <div style={MODAL_STYLES}>
        <div className="d-flex justify-content-end mb-3">
          <button
            className="btn btn-danger fw-bold"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </>,
    document.getElementById("cart-root")
  );
}
