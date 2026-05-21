import { useEffect, useRef, useState } from "react";
import { Download, Code2, Palette, Zap } from "lucide-react";

const skills = [
  { name: "HTML", color: "#e34f26" },
  { name: "CSS", color: "#264de4" },
  { name: "JavaScript", color: "#f7df1e" },
  { name: "React", color: "#61dafb" },
  { name: "Bootstrap", color: "#7952b3" },
  { name: "Firebase", color: "#ffca28" },
  { name: "API", color: "#31a8ff" },
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

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-32 relative">
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#00f5a0]/2 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={sectionRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left — image + highlights */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-40px)",
            }}
          >
            <div className="relative">
              {/* Glow frame */}
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-[#00f5a0]/30 to-[#00d9f5]/20 blur-xl" />
              <div className="relative rounded-2xl overflow-hidden border border-[#00f5a0]/20">
                <img
                  src="https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?w=700&auto=format&fit=crop&q=80"
                  alt="Developer at work"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#030712]/80 to-transparent" />
              </div>
            </div>

            {/* Highlight cards */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {highlights.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center p-4 rounded-xl border border-white/5 bg-white/2 hover:border-[#00f5a0]/30 hover:bg-[#00f5a0]/5 transition-all duration-300 group"
                >
                  <Icon
                    size={20}
                    className="text-[#00f5a0] mb-2 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-white text-xs font-semibold">
                    {label}
                  </span>
                  <span className="text-gray-500 text-[10px] mt-0.5">
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — bio + skills */}
          <div
            className="transition-all duration-700 delay-200"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(40px)",
            }}
          >
            <p className="text-[#00f5a0] text-sm font-mono tracking-widest uppercase mb-3">
              // about me
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
              About <span className="gradient-text">Me</span>
            </h2>

            <p className="text-gray-400 leading-relaxed mb-4">
              I graduated IT School and completed the Scrimba Front End
              Developer Career Path. I'm a self-taught learner with a passion
              for pushing the boundaries of the web. Digital art captivates me,
              and I aspire to excel in web development and find the sweet spot
              of technology.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              I specialise in modern web technologies and love working on
              projects that challenge me to learn and grow. When I'm not coding,
              you can find me reading or experimenting with new recipes in the
              kitchen.
            </p>

            {/* Skills */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-4 h-px bg-[#00f5a0]" />
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-300 hover:scale-105"
                    style={{
                      color: skill.color,
                      borderColor: `${skill.color}40`,
                      background: `${skill.color}10`,
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <a
              href="https://drive.google.com/file/d/1KMkyIFdmHdqd2XWRReHLSXrRmG5I42oS/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-linear-to-r from-[#00f5a0] to-[#00d9f5] text-gray-900 font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,245,160,0.4)]"
            >
              <Download size={18} />
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
