import { Moon, Sun } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Theme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  className?: string;
}

export default function ThemeToggle({ theme, onToggle, className }: ThemeToggleProps) {
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
