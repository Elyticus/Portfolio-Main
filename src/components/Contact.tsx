import { Mail, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "pirvulescu.catalin0409@gmail.com",
    href: "mailto:pirvulescu.catalin0409@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+40 721 906 855",
    href: "tel:+40721906855",
  },
];

const socials = [
  {
    icon: GithubIcon,
    label: "GitHub",
    href: "https://github.com/Elyticus",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/catalin-pirvulescu/",
  },
];

export default function Contact() {
  const [ref, visible] = useInView<HTMLDivElement>(0.2);

  return (
    <section id="contact" className="py-32 relative scroll-mt-20">
      <div className="max-w-4xl mx-auto px-6 text-center" ref={ref}>
        <div
          className="transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Get in touch
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-16">
            I'm currently looking for frontend opportunities. My inbox is
            always open — whether you have a role, a question, or just want to
            say hi.
          </p>

          {/* Contact cards */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            {contacts.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="group flex-1 max-w-sm mx-auto sm:mx-0 w-full flex flex-col items-center gap-3 p-8 rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 motion-safe:hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="size-14 rounded-full flex items-center justify-center mb-1 bg-primary/10 text-primary">
                  <Icon size={24} />
                </span>
                <span className="text-muted-foreground text-xs uppercase tracking-wider">
                  {label}
                </span>
                <span className="font-medium text-sm break-all">{value}</span>
              </a>
            ))}
          </div>

          {/* Socials */}
          <div className="flex justify-center gap-4">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "h-10 px-5")}
              >
                <Icon size={16} />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
