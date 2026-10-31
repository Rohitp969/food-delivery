import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import Button from "./Button";
import { cx } from "../../lib/styles";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Open modals, newest last: only the top one reacts to Escape and Tab
const openStack = [];

// Dialog (centered) or drawer (slides in from the right). Escape closes it,
// focus stays inside while open and returns to the trigger afterwards.
export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  variant = "dialog",
  size = "md",
  busy = false,
}) => {
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  const busyRef = useRef(busy);
  const titleId = useId();

  useEffect(() => {
    closeRef.current = onClose;
    busyRef.current = busy;
  });

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const token = {};
    openStack.push(token);

    const onKeyDown = (e) => {
      if (openStack[openStack.length - 1] !== token) return;
      if (e.key === "Escape" && !busyRef.current) {
        e.stopPropagation();
        closeRef.current();
      }
      if (e.key === "Tab" && panelRef.current) {
        const items = [...panelRef.current.querySelectorAll(FOCUSABLE)];
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      const target =
        panelRef.current?.querySelector("[data-autofocus]") ||
        panelRef.current?.querySelector(FOCUSABLE) ||
        panelRef.current;
      target?.focus();
    });

    return () => {
      openStack.splice(openStack.indexOf(token), 1);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const isDrawer = variant === "drawer";
  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <div
      className={cx("fixed inset-0 z-50 flex", isDrawer ? "justify-end" : "items-end sm:items-center justify-center sm:p-4")}
    >
      <div
        className="absolute inset-0 bg-ink/50 animate-fade-in"
        onClick={() => !busy && onClose()}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx(
          "relative flex w-full flex-col bg-white shadow-2xl outline-none",
          widths[size],
          isDrawer
            ? "h-full animate-slide-in-right"
            : "max-h-[92vh] rounded-t-2xl sm:rounded-2xl animate-rise-in",
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="font-display text-lg font-semibold text-ink">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="-mr-2 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <footer className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-end">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

// Destructive confirmation that names exactly what will happen
export const ConfirmDialog = ({ open, onClose, onConfirm, title, children, confirmLabel, busy }) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    size="sm"
    busy={busy}
    footer={
      <>
        <Button variant="secondary" onClick={onClose} disabled={busy}>
          Keep it
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={busy} data-autofocus>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <div className="text-[15px] leading-relaxed text-muted">{children}</div>
  </Modal>
);
