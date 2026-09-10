import { Download, Code2, Palette, Zap, ArrowDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

const RESUME_URL =
  "https://drive.google.com/file/d/1KMkyIFdmHdqd2XWRReHLSXrRmG5I42oS/view?usp=sharing";

const skills = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Bootstrap",
  "Firebase",
  "REST APIs",
];

const highlights = [
  {
    icon: Code2,
    label: "Clean Code",
    desc: "Writing maintainable, readable code",
  },
  {
    icon: Palette,
    label: "UI/UX Design",
    desc: "Eye for aesthetics and user flow",
  },
  {
    icon: Zap,
    label: "Performance",
    desc: "Optimised for speed and efficiency",
  },
];

const timeline = [
  {
    period: "Now",
    title: "Open to frontend opportunities",
    desc: "Actively looking for a frontend role where I can keep growing and ship polished user interfaces.",
  },
  {
    period: "Completed",
    title: "Scrimba — Frontend Developer Career Path",
    desc: "Project-based training covering modern JavaScript, React and responsive design.",
  },
  {
    period: "Graduate",
    title: "IT School",
    desc: "Foundation in web development fundamentals: HTML, CSS and JavaScript.",
  },
];

export default function About() {
  const [headerRef, headerVisible] = useInView<HTMLDivElement>(0.2);
  const [gridRef, gridVisible] = useInView<HTMLDivElement>(0.15);

  return (
    <section id="about" className="py-32 relative scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header + bio */}
        <div
          ref={headerRef}
          className="transition-all duration-700"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">
              About
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              A bit <span className="text-gradient-shift">about me</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 mb-12">
            <p className="text-muted-foreground leading-relaxed">
              I graduated IT School and completed the Scrimba Front End
              Developer Career Path. I'm a self-taught learner with a passion
              for building for the web — digital art captivates me, and I love
              finding the sweet spot between design and technology.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              I specialise in modern web technologies and enjoy projects that
              challenge me to learn and grow. When I'm not coding, you can find
              me reading or experimenting with new recipes in the kitchen.
            </p>
          </div>

          {/* Highlights */}
          <div className="grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-16">
            {highlights.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center p-4 rounded-xl border border-border bg-card"
              >
                <Icon size={20} className="text-primary mb-2" />
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-muted-foreground text-xs mt-0.5">
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Experience + skills */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 transition-all duration-700"
          style={{
            opacity: gridVisible ? 1 : 0,
            transform: gridVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div>
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-primary" />
              Education &amp; Experience
            </h3>
            <ol className="relative border-l border-border pl-6 space-y-8">
              {timeline.map(({ period, title, desc }) => (
                <li key={title} className="relative">
                  <span className="absolute -left-[30.5px] top-1.5 size-2.5 rounded-full bg-primary" />
                  <p className="text-xs font-medium uppercase tracking-wider text-primary mb-1">
                    {period}
                  </p>
                  <h4 className="font-semibold">{title}</h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {desc}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-primary" />
              Technical Skills
            </h3>
            <ul className="flex flex-wrap gap-2 mb-10">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="inline-flex items-center rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium"
                >
                  {skill}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-11 px-6 text-base",
                )}
              >
                <Download size={18} />
                Download resume
              </a>
              <a
                href="#contact"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-6 text-base",
                )}
              >
                <ArrowDown size={18} />
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
