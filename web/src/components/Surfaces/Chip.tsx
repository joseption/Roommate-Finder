import { ReactNode } from "react";

interface Props {
  className?: string;
  children: ReactNode;
}

export default function Chip({ className = "", children }: Props) {
  return (
    <div className={`rounded-full px-3 py-1 ${className}`}>{children}</div>
  );
}
