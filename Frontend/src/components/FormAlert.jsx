import React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cx } from "../lib/styles";

const TONES = {
  error: { icon: AlertCircle, className: "bg-danger-soft text-danger ring-red-200" },
  info: { icon: Info, className: "bg-sky-50 text-sky-900 ring-sky-200" },
  success: { icon: CheckCircle2, className: "bg-leaf-soft text-leaf-dark ring-green-200" },
};

// Inline message shown above a form's submit button
const FormAlert = ({ tone = "error", children, className }) => {
  if (!children) return null;
  const { icon: Icon, className: toneClass } = TONES[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cx("flex gap-2.5 rounded-lg px-3.5 py-3 text-sm ring-1 ring-inset", toneClass, className)}
    >
      <Icon className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
};

export default FormAlert;
