import { useEffect, useRef, useState } from "react";
import { Mail, Phone } from "lucide-react";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "pirvulescu.catalin0409@gmail.com",
    href: "mailto:pirvulescu.catalin0409@gmail.com",
    color: "#00f5a0",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+40 721 906 855",
    href: "tel:+40721906855",
    color: "#00d9f5",
  },
];


export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" className="py-32 relative">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#00d9f5]/2 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center" ref={ref}>
        <div
          className="transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <p className="text-[#00f5a0] text-sm font-mono tracking-widest uppercase mb-3">
            // contact
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-16">
            Have a project in mind or want to collaborate? I'd love to hear from
            you!
          </p>
        </div>

        {/* Contact cards */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          {contacts.map(({ icon: Icon, label, value, href, color }, i) => (
            <a
              key={label}
              href={href}
              className="group flex-1 max-w-sm relative flex flex-col items-center gap-3 p-8 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all duration-500 hover:-translate-y-1"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
                transition: `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s, background 0.3s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 40px ${color}20, 0 0 0 1px ${color}30`;
                e.currentTarget.style.borderColor = `${color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = "";
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: `${color}15`,
                  border: `1px solid ${color}30`,
                }}
              >
                <Icon size={24} style={{ color }} />
              </div>
              <span className="text-gray-400 text-xs uppercase tracking-wider">
                {label}
              </span>
              <span
                className="font-semibold text-sm text-white group-hover:scale-105 transition-transform"
                style={{ wordBreak: "break-all" }}
              >
                {value}
              </span>

              {/* Glow line */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                }}
              />
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
