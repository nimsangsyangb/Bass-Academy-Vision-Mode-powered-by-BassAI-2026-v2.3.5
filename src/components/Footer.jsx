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
    <footer className="mt-6 sm:mt-10 md:mt-12 mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0 animate-fadeInUp" style={{ animationDelay: "0.5s" }}>
      <div className="glass-strong rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 text-center max-w-lg mx-auto">
        {/* Made with Love - Mobile Optimized */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
          <span className="text-[var(--color-cream)] font-medium text-xs sm:text-sm md:text-base">Hecho con</span>
          <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-red-500 fill-red-500 animate-pulse" />
          <span className="text-[var(--color-cream)] font-medium text-xs sm:text-sm md:text-base">por</span>
        </div>

        {/* Author Name - Mobile Optimized */}
        <h3 className="font-[var(--font-display)] text-xl sm:text-2xl md:text-3xl font-bold text-gradient-gold mb-2 sm:mb-2.5 md:mb-3 leading-tight">
          Julian Javier Soto
        </h3>

        {/* Bass Icon Decorative - Mobile Optimized */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-5 md:mb-6">
          <div className="h-px w-8 sm:w-10 md:w-12 bg-gradient-to-r from-transparent to-[var(--color-gold)]" />
          <Music2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-[var(--color-gold)]" />
          <div className="h-px w-8 sm:w-10 md:w-12 bg-gradient-to-l from-transparent to-[var(--color-gold)]" />
        </div>

        {/* Message - Mobile Optimized */}
        <p className="text-[var(--color-primary-light)] text-xs sm:text-sm md:text-base mb-4 sm:mb-5 md:mb-6 max-w-md mx-auto leading-relaxed px-2">
          Pensada para el <span className="text-[var(--color-gold)] font-semibold">2026</span> en adelante, 
          para todos los bajistas del mundo. <br className="hidden sm:inline" />
          <span className="italic">Con cariño y pasión por la música.</span>
        </p>

        {/* Social Links - Mobile Optimized */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-5 md:mb-6">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                w-11 h-11 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl glass flex items-center justify-center
                text-[var(--color-primary-light)] transition-all duration-300
                hover:scale-110 hover:shadow-lg border border-[var(--color-primary-medium)]
                active:scale-95
                ${social.color}
              `}
              title={social.name}
            >
              <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          ))}
        </div>

        {/* Copyright - Mobile Optimized */}
        <div className="pt-3 sm:pt-4 border-t border-[var(--color-primary-medium)]/30">
          <p className="text-[10px] sm:text-xs text-[var(--color-primary-medium)] leading-relaxed">
            © 2026 Bass Academy · Interactive Bass Training
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;