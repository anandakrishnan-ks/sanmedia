"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

export function Modal({
  open,
  onClose,
  label,
  id,
  className = "",
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  const close = useCallback(() => {
    const dialog = ref.current;
    if (!dialog || timer.current) return;
    dialog.dataset.closing = "true";
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 220;
    timer.current = setTimeout(() => {
      timer.current = null;
      dialog.close();
      delete dialog.dataset.closing;
      closeRef.current();
    }, duration);
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      delete dialog.dataset.closing;
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      id={id}
      className={`modal ${className}`}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = [
          ...event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ].filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      {children}
      <button
        autoFocus
        className="modal-close"
        type="button"
        aria-label={`Close ${label.toLowerCase()}`}
        onClick={close}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>
    </dialog>
  );
}
