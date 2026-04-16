import { motion } from "framer-motion";
import { Instagram, Phone, MapPin, Heart, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface FooterProps {
  websiteName?: string;
  contactNumber?: string;
  whatsappLink?: string;
  instagramLink?: string;
  footerText?: string;
}

function FooterLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 1px 6px rgba(212,168,67,0.5))" }}
    >
      <defs>
        <radialGradient id="ft-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8c05a" />
          <stop offset="100%" stopColor="#8a6410" />
        </radialGradient>
        <radialGradient id="ft-shine" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffe87a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#d4a843" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ft-petal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff9e6" />
          <stop offset="100%" stopColor="#f0c040" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#ft-bg)" />
      <circle cx="32" cy="32" r="31" fill="url(#ft-shine)" />
      <circle cx="32" cy="32" r="27" fill="#1a0e00" fillOpacity="0.5" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ft-petal)" opacity="0.92" transform="rotate(0,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ft-petal)" opacity="0.85" transform="rotate(45,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ft-petal)" opacity="0.92" transform="rotate(90,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ft-petal)" opacity="0.85" transform="rotate(135,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ft-petal)" opacity="0.92" transform="rotate(180,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ft-petal)" opacity="0.85" transform="rotate(225,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ft-petal)" opacity="0.92" transform="rotate(270,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ft-petal)" opacity="0.85" transform="rotate(315,32,32)" />
      <circle cx="32" cy="32" r="7" fill="url(#ft-bg)" />
      <circle cx="32" cy="32" r="5" fill="#fff9e6" opacity="0.95" />
      <circle cx="32" cy="32" r="2.5" fill="url(#ft-bg)" />
    </svg>
  );
}

export default function Footer({
  websiteName = "Lumière Beauty",
  contactNumber = "+91 98765 43210",
  whatsappLink = "#",
  instagramLink = "#",
  footerText = "© 2024 Lumière Beauty. Crafted with love for elegance and confidence.",
}: FooterProps) {
  return (
    <footer className="bg-[hsl(25,20%,10%)] text-[hsl(40,30%,85%)] relative overflow-hidden">
      {/* Gold top border */}
      <div className="h-px gold-divider" />

      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[hsl(43,74%,49%)] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[hsl(43,74%,49%)] blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <FooterLogo size={40} />
              <div>
                <span className="font-cinzel text-lg font-bold tracking-widest gold-text uppercase leading-tight block">
                  {websiteName}
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[hsl(40,20%,65%)] font-poppins">
              Where luxury meets artistry. Experience beauty redefined in an atmosphere of pure elegance.
            </p>
            <div className="flex gap-4 mt-6">
              <motion.a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass-gold flex items-center justify-center text-[hsl(43,74%,55%)] hover:text-white"
                whileHover={{ scale: 1.1, backgroundColor: "hsl(43,74%,49%)" }}
                data-testid="footer-instagram"
              >
                <Instagram size={18} />
              </motion.a>
              <motion.a
                href={`tel:${contactNumber}`}
                className="w-10 h-10 rounded-full glass-gold flex items-center justify-center text-[hsl(43,74%,55%)] hover:text-white"
                whileHover={{ scale: 1.1, backgroundColor: "hsl(43,74%,49%)" }}
                data-testid="footer-phone"
              >
                <Phone size={18} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-sm font-bold tracking-[0.2em] uppercase text-[hsl(43,74%,55%)] mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: "Gallery", href: "/gallery" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <motion.span
                      className="text-sm text-[hsl(40,20%,65%)] hover:text-[hsl(43,74%,55%)] cursor-pointer transition-colors font-poppins"
                      whileHover={{ x: 4 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-cinzel text-sm font-bold tracking-[0.2em] uppercase text-[hsl(43,74%,55%)] mb-6">
              Our Services
            </h4>
            <ul className="space-y-3">
              {["Hair Styling", "Bridal Makeup", "Skin Care", "Nail Art", "Spa Therapy", "Hair Treatment"].map(
                (service) => (
                  <li key={service}>
                    <Link href="/services">
                      <motion.span
                        className="text-sm text-[hsl(40,20%,65%)] hover:text-[hsl(43,74%,55%)] cursor-pointer transition-colors font-poppins"
                        whileHover={{ x: 4 }}
                      >
                        {service}
                      </motion.span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-cinzel text-sm font-bold tracking-[0.2em] uppercase text-[hsl(43,74%,55%)] mb-6">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-[hsl(43,74%,55%)] mt-0.5 shrink-0" />
                <a
                  href={`tel:${contactNumber}`}
                  className="text-sm text-[hsl(40,20%,65%)] hover:text-[hsl(43,74%,55%)] transition-colors font-poppins"
                >
                  {contactNumber}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[hsl(43,74%,55%)] mt-0.5 shrink-0" />
                <span className="text-sm text-[hsl(40,20%,65%)] font-poppins">
                  123 Luxury Lane, Beauty District
                </span>
              </div>
              <motion.a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-sm font-medium font-poppins hover:bg-[#25D366]/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                data-testid="footer-whatsapp"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[rgba(184,142,40,0.2)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[hsl(40,15%,50%)] font-poppins text-center">
            {footerText}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-[hsl(40,15%,50%)] font-poppins">
            <div className="flex items-center gap-2">
              <span>Made with</span>
              <Heart size={12} className="text-[hsl(43,74%,55%)] fill-current" />
              <span>for beauty</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-[rgba(184,142,40,0.25)]" />
            <motion.a
              href="https://primelinkbranding.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 group"
              whileHover={{ scale: 1.03 }}
            >
              <span className="text-[hsl(40,15%,45%)] group-hover:text-[hsl(43,74%,55%)] transition-colors">
                Designed by
              </span>
              <span className="font-semibold tracking-wide text-[hsl(43,74%,55%)] group-hover:text-[hsl(43,74%,65%)] transition-colors">
                Prime Link Branding
              </span>
              <ExternalLink size={10} className="text-[hsl(43,74%,45%)] group-hover:text-[hsl(43,74%,65%)] transition-colors" />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}
