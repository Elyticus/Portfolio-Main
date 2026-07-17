import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

// Real screenshots produced by `npm run capture` (scripts/capture-screenshots.mjs).
// Until a slug has been captured, the card falls back to its stock image.
const screenshots = import.meta.glob<string>("../assets/projects/*.webp", {
  eager: true,
  import: "default",
});

interface Project {
  slug: string;
  title: string;
  description: string;
  fallbackImage: string;
  tags: string[];
  github: string;
  live: string;
}

const projects: Project[] = [
  {
    slug: "coffee-cup",
    title: "Coffee Cup — Website",
    description:
      "A full-featured online store with payment integration (frontend) and inventory management.",
    fallbackImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
    tags: ["HTML", "CSS", "JavaScript", "Firebase"],
    github: "https://github.com/Elyticus/Coffee-Shop",
    live: "https://creamy-cup.netlify.app/",
  },
  {
    slug: "password-generator",
    title: "Password Generator — App",
    description:
      "Generate strong and unique passwords for any account to keep you safe online.",
    fallbackImage:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&auto=format&fit=crop&q=80",
    tags: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/Elyticus/Password-Generator-Scrimba",
    live: "https://password-generator-scrimba-m3.netlify.app/",
  },
  {
    slug: "quote-generator",
    title: "Quote Generator — App",
    description:
      "Available in Dark/Light mode, generates random quotes via a public API.",
    fallbackImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    tags: ["React", "CSS", "API"],
    github: "https://github.com/Elyticus/Quote-Generator-App",
    live: "https://advice-generator-app-fendm.netlify.app/",
  },
  {
    slug: "kitz-chef",
    title: "Kitz Chef — AI Cooking App",
    description:
      "AI application using ChatGPT API to generate inspired recipes from your ingredients.",
    fallbackImage:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&auto=format&fit=crop&q=80",
    tags: ["React", "CSS", "OpenAI API"],
    github: "https://github.com/Elyticus/AI-Chef",
    live: "https://kitzchef.netlify.app/",
  },
  {
    slug: "okta-widget",
    title: "Custom Okta Sign-in Widget",
    description:
      "Transformed the default Okta Sign-In Widget into a creative, polished interface.",
    fallbackImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    tags: ["HTML", "CSS", "JavaScript", "React"],
    github: "https://github.com/Elyticus/okta-signin-widget",
    live: "https://catalin-pirvulescu-okta-signin-widget.netlify.app/",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [ref, visible] = useInView<HTMLElement>();
  const image =
    screenshots[`../assets/projects/${project.slug}.webp`] ??
    project.fallbackImage;

  return (
    <article
      ref={ref}
      className="group flex flex-col rounded-xl overflow-hidden border border-border bg-card transition-[border-color,box-shadow,transform,opacity] duration-500 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 motion-safe:hover:-translate-y-1"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: visible ? `${Math.min(index, 3) * 100}ms` : "0ms",
      }}
    >
      <div className="relative aspect-video overflow-hidden border-b border-border">
        <img
          src={image}
          alt={`Screenshot of ${project.title}`}
          width={960}
          height={540}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-3">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <GithubIcon size={14} /> Code
          </a>
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            <ExternalLink size={14} /> Live demo
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const [headingRef, headingVisible] = useInView<HTMLDivElement>(0.3);

  return (
    <section id="projects" className="py-32 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={headingRef}
          className="text-center mb-16 transition-all duration-700"
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">
            Projects
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Things I've built
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A selection of recent work — every card links to the live site and
            the source code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
