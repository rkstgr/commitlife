import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "px-4 py-1 rounded-md transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",

          // Variant styles
          variant === "primary" && [
            "bg-black text-white",
            "hover:bg-neutral-800",
            "disabled:hover:bg-neutral-500",
          ],
          variant === "secondary" && [
            "bg-neutral-200 dark:bg-neutral-800",
            "hover:bg-neutral-300 dark:hover:bg-neutral-700",
            "text-neutral-900 dark:text-neutral-100",
          ],
          variant === "outline" && [
            "border border-neutral-200 dark:border-neutral-800",
            "hover:border-neutral-300 dark:hover:border-neutral-700",
            "hover:bg-neutral-50 dark:hover:bg-neutral-900",
            "text-neutral-900 dark:text-neutral-100",
          ],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;

// Usage example:
/*
import Button from "~/components/Button";

export function Example() {
  return (
    <div className="space-x-4">
      <Button>Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Button disabled>Disabled Button</Button>
    </div>
  );
}
*/
