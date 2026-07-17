import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import type { Theme } from "@/hooks/useTheme";

const links = [
  { href: "#home", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export default function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = document.querySelectorAll("section[id]");
      let current = "home";
      sections.forEach((s) => {
        if (window.scrollY >= (s as HTMLElement).offsetTop - 120) {
          current = s.getAttribute("id") ?? "home";
        }
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 72, behavior: "smooth" });
    }
    setOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#030712]/80 backdrop-blur-xl border-b border-[#00f5a0]/10 shadow-lg shadow-[#00f5a0]/5"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-bold gradient-text tracking-wider">
          {"<Catalin />"}
        </span>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <button
                onClick={() => scrollTo(href)}
                className={`relative text-sm font-medium transition-colors duration-200 group ${
                  active === href.slice(1)
                    ? "text-[#00f5a0]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-linear-to-r from-[#00f5a0] to-[#00d9f5] transition-all duration-300 ${active === href.slice(1) ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        } bg-[#030712]/95 backdrop-blur-xl border-b border-[#00f5a0]/10`}
      >
        <ul className="px-6 py-4 flex flex-col gap-4">
          {links.map(({ href, label }) => (
            <li key={href}>
              <button
                onClick={() => scrollTo(href)}
                className="text-gray-300 hover:text-[#00f5a0] transition-colors text-sm font-medium"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
