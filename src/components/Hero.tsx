import { ArrowRight, Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RESUME_URL =
  "https://drive.google.com/file/d/1KMkyIFdmHdqd2XWRReHLSXrRmG5I42oS/view?usp=sharing";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 scroll-mt-20 overflow-hidden"
    >
      {/* Soft ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
          {/* ── Left: text ── */}
          <div className="flex-1 text-center md:text-left">
            <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-8">
              <span className="size-1.5 rounded-full bg-primary motion-safe:animate-pulse" />
              Available for work
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3 leading-tight">
              Hi, I'm <span className="text-gradient">Catalin Pirvulescu</span>
            </h1>

            <p className="text-xl sm:text-2xl font-medium text-foreground/80 mb-6">
              Frontend Developer
            </p>

            <p className="text-muted-foreground text-lg max-w-xl mx-auto md:mx-0 mb-10 leading-relaxed">
              I build fast, accessible web interfaces with React, TypeScript
              and modern CSS. Recently completed the Scrimba Frontend Career
              Path and looking for my next frontend role.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
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
                className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full object-cover object-top border border-border shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
