import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cx, inputStyles } from "../../lib/styles";

// Label + control + hint/error, wired up for screen readers
export const Field = ({ id, label, hint, error, optional, children, className }) => {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-semibold text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
};

export const Input = ({ id, label, hint, error, optional, className, inputClassName, ...props }) => (
  <Field id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
    {(aria) => <input {...aria} {...props} className={cx(inputStyles(error), "h-11", inputClassName)} />}
  </Field>
);

export const Textarea = ({ id, label, hint, error, optional, className, rows = 3, ...props }) => (
  <Field id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
    {(aria) => (
      <textarea {...aria} rows={rows} {...props} className={cx(inputStyles(error), "resize-y py-2.5")} />
    )}
  </Field>
);

export const Select = ({ id, label, hint, error, optional, className, children, ...props }) => (
  <Field id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
    {(aria) => (
      <select {...aria} {...props} className={cx(inputStyles(error), "h-11 pr-8")}>
        {children}
      </select>
    )}
  </Field>
);

export const PasswordInput = ({ id, label, hint, error, className, labelAction, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Field
      id={id}
      label={
        labelAction ? (
          <span className="flex w-full items-baseline justify-between">
            {label}
            {labelAction}
          </span>
        ) : (
          label
        )
      }
      hint={hint}
      error={error}
      className={className}
    >
      {(aria) => (
        <div className="relative">
          <input
            {...aria}
            {...props}
            type={visible ? "text" : "password"}
            className={cx(inputStyles(error), "h-11 pr-11")}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted hover:text-ink"
          >
            {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
        </div>
      )}
    </Field>
  );
};
