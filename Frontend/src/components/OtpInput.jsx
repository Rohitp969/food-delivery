import React from "react";
import { Field } from "./ui/Field";
import { cx, inputStyles } from "../lib/styles";

const OtpInput = ({ value, onChange, id = "otp", error }) => (
  <Field id={id} label="Verification code" error={error}>
    {(aria) => (
      <input
        {...aria}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="6-digit code"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        required
        className={cx(
          inputStyles(error),
          "tabular h-14 text-center font-display text-[26px] font-semibold tracking-[0.45em]",
          "placeholder:text-base placeholder:font-sans placeholder:font-normal placeholder:tracking-normal",
        )}
      />
    )}
  </Field>
);

export default OtpInput;
