"use client";

import { Spinner } from "./Spinner";

export type ModalVariant =
  | "error"
  | "success"
  | "loading"
  | "confirm-delete"
  | "confirm-leave"
  | "confirm-withdraw"
  | "parse-fail";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  variant?: ModalVariant;
  actions?: React.ReactNode;
  closeOnBackdrop?: boolean;
}

function ModalIcon({ variant }: { variant: ModalVariant }) {
  if (variant === "success") {
    return (
      <div className="flex size-12 items-center justify-center rounded-full bg-dd-green text-xl text-white">
        ✓
      </div>
    );
  }
  if (variant === "loading") {
    return <Spinner className="size-12" />;
  }
  return (
    <div className="flex size-12 items-center justify-center rounded-full bg-dd-error text-xl font-bold text-white">
      !
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
  variant = "error",
  actions,
  closeOnBackdrop = false,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div
        className="relative z-10 w-[475px] overflow-hidden rounded-lg bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-dd-black px-4 py-3 text-center text-sm font-medium text-white">
          {title}
        </div>
        <div className="flex flex-col items-center gap-4 px-6 py-6 text-center">
          <ModalIcon variant={variant} />
          <div className="text-sm text-dd-black">{children}</div>
        </div>
        {actions && (
          <div className="flex justify-center gap-3 border-t border-dd-gray-400 px-6 py-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export function ModalButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "danger" | "outline";
}) {
  const styles = {
    primary: "bg-dd-black text-white",
    danger: "bg-dd-error text-white",
    outline: "border border-dd-gray-400 bg-white text-dd-black",
  };
  return (
    <button
      onClick={onClick}
      className={`rounded-[8px] px-5 py-2 text-sm font-medium ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
