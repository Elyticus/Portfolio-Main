import { useEffect, useState } from "react";
import { ArrowRight, Download } from "lucide-react";

const TYPED_STRINGS = ["Creative Developer", "Frontend Engineer"];

export default function Hero() {
  const [typed, setTyped] = useState("");
  const [stringIdx, setStringIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const current = TYPED_STRINGS[stringIdx];
    const delay = deleting ? 50 : charIdx === current.length ? 1800 : 80;

    const t = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setTyped(current.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        } else {
          setDeleting(true);
        }
      } else {
        if (charIdx > 0) {
          setTyped(current.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        } else {
          setDeleting(false);
          setStringIdx((i) => (i + 1) % TYPED_STRINGS.length);
        }
      }
    }, delay);

    return () => clearTimeout(t);
  }, [charIdx, deleting, stringIdx]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f5a0]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d9f5]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
          {/* ── Left: text ── */}
          <div className="flex-1 text-center md:text-left">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00f5a0]/30 bg-[#00f5a0]/5 text-[#00f5a0] text-xs font-medium mb-8 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0]" />
              Available for work
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
              Hi, I'm <span className="gradient-text">Catalin</span>
            </h1>

            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-300 mb-8 h-10 flex items-center justify-center md:justify-start gap-2">
              <span className="gradient-text">{typed}</span>
              <span className="w-0.5 h-8 bg-[#00f5a0] animate-blink inline-block" />
            </h2>

            <p className="text-gray-400 text-lg max-w-xl mx-auto md:mx-0 mb-12 leading-relaxed">
              I build beautiful, functional digital experiences that push the
              boundaries of modern web technology. Let's create something
              extraordinary together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => scrollTo("projects")}
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-linear-to-r from-[#00f5a0] to-[#00d9f5] text-gray-900 font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,245,160,0.4)]"
              >
                View My Work
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <a
                href="https://drive.google.com/file/d/1KMkyIFdmHdqd2XWRReHLSXrRmG5I42oS/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-[#00f5a0]/30 text-gray-300 font-medium hover:bg-[#00f5a0]/10 hover:border-[#00f5a0]/60 hover:text-white transition-all duration-300"
              >
                <Download size={18} />
                Resume
              </a>
            </div>

          </div>

          {/* ── Right: profile photo ── */}
          <div className="shrink-0 flex justify-center">
            <div className="relative animate-float">
              {/* Outer glow blob */}
              <div className="absolute inset-0 rounded-full bg-[#00f5a0]/20 blur-3xl scale-125 pointer-events-none" />
              {/* Spinning dashed ring */}
              <div
                className="absolute -inset-3 rounded-full border border-dashed border-[#00f5a0]/20"
                style={{ animation: "spin 20s linear infinite" }}
              />
              {/* Photo */}
              <img
                src="/profile.jpg"
                alt="Catalin Pirvulescu"
                className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full object-cover object-top border-2 border-[#00f5a0]/40 shadow-[0_0_50px_rgba(0,245,160,0.25)]"
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator — fades out once the user starts scrolling */}
        <div
          className="hidden md:flex flex-col items-center gap-2 animate-bounce mt-12 transition-all duration-500"
          style={{ opacity: scrolled ? 0 : 1, pointerEvents: scrolled ? "none" : "auto" }}
        >
          <span className="text-gray-600 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-linear-to-b from-[#00f5a0]/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
