import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  onClose?: () => void;
}

export function Toast({ title, description, variant = 'default', onClose }: ToastProps) {
  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex w-full max-w-sm items-center space-x-4 rounded-lg border p-4 shadow-lg transition-all",
        variant === 'destructive'
          ? "bg-destructive text-destructive-foreground"
          : "bg-background text-foreground"
      )}
    >
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-md p-1 hover:bg-black/10"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

