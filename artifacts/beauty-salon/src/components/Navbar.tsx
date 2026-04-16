import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  {
    label: "Experience",
    children: [
      { href: "/experience", label: "Client Experience" },
      { href: "/lookbook", label: "Lookbook" },
    ],
  },
];

function BrandLogo({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 2px 8px rgba(212,168,67,0.55))" }}
    >
      <defs>
        <radialGradient id="nb-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8c05a" />
          <stop offset="100%" stopColor="#8a6410" />
        </radialGradient>
        <radialGradient id="nb-shine" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffe87a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#d4a843" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nb-petal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff9e6" />
          <stop offset="100%" stopColor="#f0c040" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#nb-bg)" />
      <circle cx="32" cy="32" r="31" fill="url(#nb-shine)" />
      <circle cx="32" cy="32" r="27" fill="#1a0e00" fillOpacity="0.5" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#nb-petal)" opacity="0.92" transform="rotate(0,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#nb-petal)" opacity="0.85" transform="rotate(45,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#nb-petal)" opacity="0.92" transform="rotate(90,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#nb-petal)" opacity="0.85" transform="rotate(135,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#nb-petal)" opacity="0.92" transform="rotate(180,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#nb-petal)" opacity="0.85" transform="rotate(225,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#nb-petal)" opacity="0.92" transform="rotate(270,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#nb-petal)" opacity="0.85" transform="rotate(315,32,32)" />
      <circle cx="32" cy="32" r="7" fill="url(#nb-bg)" />
      <circle cx="32" cy="32" r="5" fill="#fff9e6" opacity="0.95" />
      <circle cx="32" cy="32" r="2.5" fill="url(#nb-bg)" />
      <circle cx="32" cy="7" r="1.5" fill="#ffe87a" opacity="0.8" />
      <circle cx="57" cy="32" r="1.5" fill="#ffe87a" opacity="0.8" />
      <circle cx="32" cy="57" r="1.5" fill="#ffe87a" opacity="0.8" />
      <circle cx="7" cy="32" r="1.5" fill="#ffe87a" opacity="0.8" />
    </svg>
  );
}

function splitBrandName(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return { main: words[0], sub: "" };
  const mid = Math.ceil(words.length / 2);
  return {
    main: words.slice(0, mid).join(" "),
    sub: words.slice(mid).join(" "),
  };
}

interface NavLink {
  href?: string;
  label: string;
  children?: { href: string; label: string }[];
}

function DropdownMenu({ link, scrolled, location, onClose }: {
  link: NavLink; scrolled: boolean; location: string; onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isActive = link.children?.some((c) => c.href === location);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <motion.button
        className={`relative flex items-center gap-1 font-montserrat text-sm font-medium tracking-widest uppercase cursor-pointer transition-colors duration-300 ${
          scrolled
            ? isActive ? "text-[hsl(43,74%,49%)]" : "text-[hsl(25,15%,18%)] hover:text-[hsl(43,74%,49%)]"
            : "text-white/90 hover:text-white"
        }`}
        whileHover={{ y: -1 }}>
        {link.label}
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        {isActive && (
          <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[hsl(43,74%,49%)]" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-2xl overflow-hidden shadow-xl border border-[rgba(184,142,40,0.2)]"
            style={{ background: "rgba(255,252,245,0.98)", backdropFilter: "blur(20px)" }}>
            {link.children?.map((child) => (
              <Link key={child.href} href={child.href} onClick={() => { setOpen(false); onClose(); }}>
                <div className={`px-5 py-3.5 font-montserrat text-xs tracking-wider uppercase cursor-pointer transition-colors duration-200 ${
                  location === child.href
                    ? "text-[hsl(43,74%,42%)] bg-[rgba(184,142,40,0.08)]"
                    : "text-[hsl(25,15%,25%)] hover:bg-[rgba(184,142,40,0.06)] hover:text-[hsl(43,74%,42%)]"
                }`}>
                  {child.label}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [location] = useLocation();
  const { content } = useSiteContent();

  const websiteName = content.websiteName || "Lumière Beauty";
  const { main, sub } = splitBrandName(websiteName);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "navbar-glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div className="flex items-center gap-2 sm:gap-3 cursor-pointer" whileHover={{ scale: 1.02 }}>
              <BrandLogo size={36} />
              <div className="leading-tight">
                <div className={`font-cinzel text-base sm:text-lg font-bold tracking-widest uppercase transition-colors duration-300 ${
                  scrolled ? "gold-text" : "text-white"
                }`} style={{ lineHeight: 1.1 }}>
                  {main}
                </div>
                {sub ? (
                  <div className={`text-xs tracking-[0.25em] uppercase font-montserrat font-light transition-colors duration-300 ${
                    scrolled ? "text-[hsl(43,74%,49%)]" : "text-white/80"
                  }`}>
                    {sub}
                  </div>
                ) : (
                  <div className={`text-[10px] tracking-[0.35em] uppercase font-montserrat font-light transition-colors duration-300 ${
                    scrolled ? "text-[hsl(43,74%,49%)]" : "text-white/70"
                  }`}>
                    Est. Beauty Studio
                  </div>
                )}
              </div>
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) =>
              link.children ? (
                <DropdownMenu key={link.label} link={link} scrolled={scrolled} location={location} onClose={() => setMobileOpen(false)} />
              ) : (
                <Link key={link.href} href={link.href!}>
                  <motion.span
                    className={`relative font-montserrat text-sm font-medium tracking-widest uppercase cursor-pointer transition-colors duration-300 ${
                      scrolled
                        ? location === link.href ? "text-[hsl(43,74%,49%)]" : "text-[hsl(25,15%,18%)] hover:text-[hsl(43,74%,49%)]"
                        : "text-white/90 hover:text-white"
                    }`}
                    whileHover={{ y: -1 }}>
                    {link.label}
                    {location === link.href && (
                      <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[hsl(43,74%,49%)]" />
                    )}
                  </motion.span>
                </Link>
              )
            )}
            <motion.a
              href="/services"
              className="px-5 lg:px-6 py-2.5 rounded-full font-montserrat text-sm font-semibold tracking-wider uppercase text-white gold-shimmer shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(184,142,40,0.5)" }}
              whileTap={{ scale: 0.98 }}
              data-testid="nav-book-btn"
            >
              Book Now
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 transition-colors ${scrolled ? "text-[hsl(25,15%,18%)]" : "text-white"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="mobile-menu-btn"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden navbar-glass border-t border-[rgba(184,142,40,0.2)] overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                      className="w-full flex items-center justify-between py-3 font-montserrat text-sm font-medium tracking-widest uppercase text-[hsl(25,15%,18%)]">
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${mobileExpanded === link.label ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {mobileExpanded === link.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 pb-1 space-y-1">
                          {link.children.map((child) => (
                            <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)}>
                              <div className={`py-2.5 font-montserrat text-xs tracking-widest uppercase ${
                                location === child.href ? "text-[hsl(43,74%,49%)]" : "text-[hsl(25,15%,35%)]"
                              }`}>
                                {child.label}
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link key={link.href} href={link.href!} onClick={() => setMobileOpen(false)}>
                    <span className={`block py-3 font-montserrat text-sm font-medium tracking-widest uppercase ${
                      location === link.href ? "text-[hsl(43,74%,49%)]" : "text-[hsl(25,15%,18%)]"
                    }`}>
                      {link.label}
                    </span>
                  </Link>
                )
              )}
              <a href="/services" className="w-full py-3 mt-2 rounded-full font-montserrat text-sm font-semibold tracking-wider uppercase text-white gold-shimmer shadow-lg text-center">
                Book Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
