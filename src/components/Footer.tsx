import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
} from "@/components/icons/SocialIcons";

const socials = [
  {
    icon: GithubIcon,
    href: "https://github.com/Elyticus",
    label: "GitHub",
  },
  {
    icon: LinkedinIcon,
    href: "https://www.linkedin.com/in/catalin-pirvulescu/",
    label: "LinkedIn",
  },
  {
    icon: InstagramIcon,
    href: "https://www.instagram.com/catalinclaudiu_/",
    label: "Instagram",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 text-center md:text-left">
        <span className="text-xl font-bold text-gradient tracking-wider">
          {"<Catalin />"}
        </span>

        <div className="flex gap-1">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="inline-flex items-center justify-center size-11 rounded-lg text-muted-foreground hover:text-primary transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        <p className="text-muted-foreground text-sm">
          © 2026 Catalin Pirvulescu — Designed &amp; coded with{" "}
          <span className="text-primary font-semibold">♥</span>
        </p>
      </div>
    </footer>
  );
}
