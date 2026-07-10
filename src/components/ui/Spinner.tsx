interface SpinnerProps {
  className?: string;
}

export function Spinner({ className = "h-8 w-8" }: SpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-[#32A287] border-t-transparent ${className}`}
    />
  );
}
