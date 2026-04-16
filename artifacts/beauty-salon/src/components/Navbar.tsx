import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "navbar-glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-full gold-shimmer flex items-center justify-center">
                <span className="text-white text-lg font-cinzel font-bold">L</span>
              </div>
              <div>
                <span
                  className={`font-cinzel text-xl font-bold tracking-widest transition-colors duration-300 ${
                    scrolled ? "gold-text" : "text-white"
                  }`}
                >
                  LUMIÈRE
                </span>
                <div
                  className={`text-xs tracking-[0.3em] uppercase font-montserrat font-light transition-colors duration-300 ${
                    scrolled
                      ? "text-[hsl(43,74%,49%)]"
                      : "text-white/80"
                  }`}
                >
                  Beauty
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  className={`relative font-montserrat text-sm font-medium tracking-widest uppercase cursor-pointer transition-colors duration-300 ${
                    scrolled
                      ? location === link.href
                        ? "text-[hsl(43,74%,49%)]"
                        : "text-[hsl(25,15%,18%)] hover:text-[hsl(43,74%,49%)]"
                      : "text-white/90 hover:text-white"
                  }`}
                  whileHover={{ y: -1 }}
                >
                  {link.label}
                  {location === link.href && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[hsl(43,74%,49%)]"
                    />
                  )}
                </motion.span>
              </Link>
            ))}
            <motion.a
              href="/services"
              className="px-6 py-2.5 rounded-full font-montserrat text-sm font-semibold tracking-wider uppercase text-white gold-shimmer shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(184,142,40,0.5)" }}
              whileTap={{ scale: 0.98 }}
              data-testid="nav-book-btn"
            >
              Book Now
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 transition-colors ${
              scrolled ? "text-[hsl(25,15%,18%)]" : "text-white"
            }`}
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
            className="md:hidden navbar-glass border-t border-[rgba(184,142,40,0.2)]"
          >
            <div className="px-6 py-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <span
                    className={`block font-montserrat text-sm font-medium tracking-widest uppercase ${
                      location === link.href
                        ? "text-[hsl(43,74%,49%)]"
                        : "text-[hsl(25,15%,18%)]"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <a
                href="/services"
                className="w-full py-3 rounded-full font-montserrat text-sm font-semibold tracking-wider uppercase text-white gold-shimmer shadow-lg text-center"
              >
                Book Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
