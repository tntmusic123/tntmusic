"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/studio", label: "STUDIO" },
  { href: "/artists", label: "ARTISTS" },
  { href: "/staff", label: "STAFF" },
  { href: "/note", label: "NOTE" },
  { href: "/contact", label: "CONTACT" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-navy/95 backdrop-blur-md shadow-lg shadow-black/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" id="logo-link">
          <Image
            src="/images/w_logo.png"
            alt="TNT Music"
            width={140}
            height={40}
            className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8" id="desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link text-sm font-medium tracking-[0.15em] text-white/80 transition-colors hover:text-gold-light"
              id={`nav-${item.label.toLowerCase()}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button - Desktop */}
        <Link
          href="/studio"
          className="hidden lg:inline-flex btn-gold items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold tracking-wider transition-all"
          id="cta-reservation"
        >
          예약하기
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label="메뉴 열기"
          id="mobile-menu-toggle"
        >
          <span
            className={`block h-[2px] w-6 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? "translate-y-[5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-6 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-6 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? "-translate-y-[5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-navy/98 backdrop-blur-xl transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? "max-h-screen border-t border-gold/10" : "max-h-0"
        }`}
        id="mobile-menu"
      >
        <nav className="flex flex-col items-center gap-1 py-6 px-6">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-3 text-sm font-medium tracking-[0.2em] text-white/80 transition-colors hover:text-gold-light hover:bg-white/5 rounded-lg"
              style={{ animationDelay: `${index * 0.05}s` }}
              id={`mobile-nav-${item.label.toLowerCase()}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/studio"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 w-full text-center btn-gold rounded-full py-3 text-sm font-semibold tracking-wider"
            id="mobile-cta-reservation"
          >
            예약하기
          </Link>
        </nav>
      </div>
    </header>
  );
}
