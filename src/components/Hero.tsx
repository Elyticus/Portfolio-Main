import { useEffect, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTypewriter } from "@/hooks/useTypewriter";

const RESUME_URL =
  "https://drive.google.com/file/d/1KMkyIFdmHdqd2XWRReHLSXrRmG5I42oS/view?usp=sharing";

const ROLES = ["Frontend Engineer", "Creative Developer"];

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);
  const role = useTypewriter(ROLES);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-svh flex items-center pt-20 pb-12 lg:pt-16 lg:pb-0 short:pt-20 short:pb-8 scroll-mt-20 overflow-hidden"
    >
      {/* Soft ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="flex flex-col-reverse lg:flex-row short:flex-row items-center gap-8 sm:gap-10 lg:gap-16 short:gap-10">
          {/* ── Left: text ── */}
          <div className="flex-1 min-w-0 text-center lg:text-left short:text-left">
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6 sm:mb-8 short:mb-4">
              <span className="size-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
              Available for work
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl short:text-4xl font-bold tracking-tight mb-3 leading-tight">
              Hi, I'm <span className="text-gradient">Catalin</span>
            </h1>

            <p className="text-xl sm:text-2xl short:text-xl font-medium mb-5 sm:mb-6 short:mb-3">
              <span className="sr-only">{ROLES.join(" and ")}</span>
              <span aria-hidden="true" className="text-gradient-shift">
                {role}
              </span>
              <span
                aria-hidden="true"
                className="inline-block w-0.5 h-[1em] ml-1 align-[-0.15em] bg-primary motion-safe:animate-blink"
              />
            </p>

            <p className="text-muted-foreground text-base sm:text-lg short:text-base max-w-xl mx-auto lg:mx-0 short:mx-0 mb-8 sm:mb-10 short:mb-5 leading-relaxed">
              I build fast, accessible web interfaces with React and modern
              CSS. Recently completed the Scrimba Frontend Career Path and
              looking for my next frontend role.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap short:flex-row short:flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start short:justify-start">
              <a
                href="#projects"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "group h-11 px-6 text-base",
                )}
              >
                View my work
                <ArrowRight
                  size={18}
                  className="motion-safe:group-hover:translate-x-1 transition-transform"
                />
              </a>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-6 text-base",
                )}
              >
                <Download size={18} />
                Download resume
              </a>
            </div>
          </div>

          {/* ── Right: profile photo ── */}
          <div className="shrink-0 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/15 blur-3xl scale-110 pointer-events-none" />
              <img
                src="/profile.webp"
                alt="Portrait of Catalin Pirvulescu"
                width={640}
                height={640}
                fetchPriority="high"
                className="relative size-32 sm:size-48 md:size-56 lg:size-72 xl:size-80 short:size-28 rounded-full object-cover object-top border border-border shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator — fades out once the user starts scrolling */}
        <div
          className="hidden lg:flex short:hidden flex-col items-center gap-2 motion-safe:animate-bounce mt-12 transition-opacity duration-500"
          style={{ opacity: scrolled ? 0 : 1 }}
        >
          <span className="text-muted-foreground text-xs tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-px h-10 bg-linear-to-b from-primary/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
