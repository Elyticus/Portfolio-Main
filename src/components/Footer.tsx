import {
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
} from "@/components/icons/SocialIcons";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <span className="text-xl font-bold gradient-text tracking-wider">
          {"<Catalin />"}
        </span>

        <div className="flex gap-4">
          {[
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
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="text-gray-500 hover:text-[#00f5a0] transition-colors duration-300"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        <p className="text-gray-600 text-sm">
          © 2026 Catalin Pirvulescu — Designed &amp; coded with{" "}
          <span className="gradient-text font-semibold">♥</span>
        </p>
      </div>
    </footer>
  );
}
