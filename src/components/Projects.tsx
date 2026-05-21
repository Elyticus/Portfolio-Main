import { useRef, useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { Badge } from "@/components/ui/badge";

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  live: string;
  accent: string;
}

const projects: Project[] = [
  {
    title: "Coffee Cup — Website",
    description:
      "A full-featured online store with payment integration (frontend) and inventory management.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    tags: ["HTML", "CSS", "JavaScript", "Firebase"],
    github: "https://github.com/Elyticus/Coffee-Shop",
    live: "https://creamy-cup.netlify.app/",
    accent: "#00f5a0",
  },
  {
    title: "Password Generator — App",
    description:
      "Generate strong and unique passwords for any account to keep you safe online.",
    image:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&auto=format&fit=crop&q=80",
    tags: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/Elyticus/Password-Generator-Scrimba",
    live: "https://password-generator-scrimba-m3.netlify.app/",
    accent: "#00d9f5",
  },
  {
    title: "Quote Generator — App",
    description:
      "Available in Dark/Light mode, generates random quotes via a public API.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    tags: ["React", "CSS", "API"],
    github: "https://github.com/Elyticus/Quote-Generator-App",
    live: "https://advice-generator-app-fendm.netlify.app/",
    accent: "#a78bfa",
  },
  {
    title: "Kitz Chef — AI Cooking App",
    description:
      "AI application using ChatGPT API to generate inspired recipes from your ingredients.",
    image:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&auto=format&fit=crop&q=80",
    tags: ["React", "CSS", "OpenAI API"],
    github: "https://github.com/Elyticus/AI-Chef",
    live: "https://kitzchef.netlify.app/",
    accent: "#f59e0b",
  },
  {
    title: "Custom Okta Sign-in Widget",
    description:
      "Transformed the default Okta Sign-In Widget into a creative, polished interface.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    tags: ["HTML", "CSS", "JavaScript", "React"],
    github: "https://github.com/Elyticus/okta-signin-widget",
    live: "https://catalin-pirvulescu-okta-signin-widget.netlify.app/",
    accent: "#ec4899",
  },
  {
    title: "Coming Soon",
    description:
      "Something exciting is in the works. Stay tuned for the next project!",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80",
    tags: ["???"],
    github: "#",
    live: "#",
    accent: "#6366f1",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/5 bg-white/2 backdrop-blur-sm hover:border-opacity-40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
        boxShadow: `0 0 0 1px ${project.accent}00`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 40px ${project.accent}25, 0 0 0 1px ${project.accent}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 1px ${project.accent}00`;
      }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#030712] via-[#030712]/40 to-transparent" />
        {/* Glowing border top */}
        <div
          className="absolute top-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00f5a0] transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs border-white/10 text-gray-400 bg-white/5 hover:bg-white/10"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.github !== "#" && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-medium border border-white/10 rounded-lg px-3 py-1.5 hover:border-white/30 hover:bg-white/5"
            >
              <GithubIcon size={14} /> Code
            </a>
          )}
          {project.live !== "#" && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-1.5 transition-all duration-200 hover:scale-105"
              style={{
                color: project.accent,
                border: `1px solid ${project.accent}40`,
                background: `${project.accent}10`,
              }}
            >
              <ExternalLink size={14} /> Live Preview
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const headingRef = useRef<HTMLDivElement>(null);
  const [headingVisible, setHeadingVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeadingVisible(true);
      },
      { threshold: 0.3 },
    );
    if (headingRef.current) observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={headingRef}
          className="text-center mb-16 transition-all duration-700"
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <p className="text-[#00f5a0] text-sm font-mono tracking-widest uppercase mb-3">
            // portfolio
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            My <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A selection of recent works that showcase my passion for building
            polished, interactive experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
