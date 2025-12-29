import React from "react";
import { Heart, Instagram, Linkedin, Github, Music2 } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/palee_0x71/?hl=es-la",
      icon: Instagram,
      color: "hover:text-pink-400",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/full-stack-julian-soto/",
      icon: Linkedin,
      color: "hover:text-blue-400",
    },
    {
      name: "GitHub",
      url: "https://github.com/juliandeveloper05",
      icon: Github,
      color: "hover:text-white",
    },
  ];

  return (
    <footer className="mt-12 mb-8 animate-fadeInUp" style={{ animationDelay: "0.5s" }}>
      <div className="glass-strong rounded-3xl p-8 text-center max-w-2xl mx-auto">
        {/* Made with Love */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-[var(--color-cream)] font-medium">Hecho con</span>
          <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
          <span className="text-[var(--color-cream)] font-medium">por</span>
        </div>

        {/* Author Name */}
        <h3 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-gradient-gold mb-3">
          Julian Javier Soto
        </h3>

        {/* Bass Icon Decorative */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
          <Music2 className="w-6 h-6 text-[var(--color-gold)]" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
        </div>

        {/* Message */}
        <p className="text-[var(--color-primary-light)] text-sm md:text-base mb-6 max-w-md mx-auto leading-relaxed">
          Pensada para el <span className="text-[var(--color-gold)] font-semibold">2026</span> en adelante, 
          para todos los bajistas del mundo. <br />
          <span className="italic">Con cariño y pasión por la música.</span>
        </p>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                w-12 h-12 rounded-xl glass flex items-center justify-center
                text-[var(--color-primary-light)] transition-all duration-300
                hover:scale-110 hover:shadow-lg border border-[var(--color-primary-medium)]
                ${social.color}
              `}
              title={social.name}
            >
              <social.icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-[var(--color-primary-medium)]/30">
          <p className="text-xs text-[var(--color-primary-medium)]">
            © 2026 Bass Academy · Modern Web 4.0 Interactive Training
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
