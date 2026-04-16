import { motion } from "framer-motion";
import { Link } from "wouter";
import { Home, ArrowLeft, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(25,20%,8%) 0%, hsl(30,25%,12%) 100%)" }}>
      <Navbar />

      {/* Floating particles */}
      {[...Array(18)].map((_, i) => (
        <div key={i} className="absolute rounded-full opacity-15 pointer-events-none"
          style={{
            width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
            background: "hsl(43,74%,49%)",
            left: `${(i * 17 + 5) % 100}%`,
            bottom: `${(i * 23 + 10) % 100}%`,
            animation: `floatUp ${6 + (i % 4)}s ${(i * 0.7) % 4}s linear infinite`,
          }} />
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center py-20">
        {/* Glow circle */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative mb-8 sm:mb-10">
          <div className="absolute inset-0 rounded-full blur-2xl opacity-30" style={{ background: "hsl(43,74%,49%)", transform: "scale(1.4)" }} />
          <div className="relative w-28 sm:w-36 h-28 sm:h-36 rounded-full gold-shimmer flex items-center justify-center shadow-2xl">
            <span className="font-cinzel text-5xl sm:text-6xl font-bold text-white" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
              404
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-[hsl(43,74%,55%)]" />
            <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-[hsl(43,74%,55%)]">Page Not Found</span>
            <Sparkles size={14} className="text-[hsl(43,74%,55%)]" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            This Page Has Had<br />
            <span className="gold-text italic">a Makeover</span>
          </h1>
          <p className="font-poppins text-sm sm:text-base text-white/50 max-w-sm sm:max-w-md mx-auto mb-10 leading-relaxed">
            The page you're looking for has been moved, renamed, or doesn't exist. Let's get you back to something beautiful.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <motion.button
                className="flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 rounded-full font-montserrat text-xs font-bold tracking-[0.2em] uppercase text-white gold-shimmer shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(184,142,40,0.5)" }}
                whileTap={{ scale: 0.97 }}>
                <Home size={14} /> Back to Home
              </motion.button>
            </Link>
            <Link href="/services">
              <motion.button
                className="flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 rounded-full font-montserrat text-xs font-bold tracking-[0.2em] uppercase border-2 border-[hsl(43,74%,49%)] text-[hsl(43,74%,55%)] hover:bg-[hsl(43,74%,49%)] hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}>
                <ArrowLeft size={14} /> View Services
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 sm:mt-16">
          <p className="font-poppins text-xs text-white/30 mb-4 tracking-wider uppercase">Quick Links</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { href: "/", label: "Home" },
              { href: "/services", label: "Services" },
              { href: "/gallery", label: "Gallery" },
              { href: "/experience", label: "Client Experience" },
              { href: "/lookbook", label: "Lookbook" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="font-poppins text-xs text-white/50 hover:text-[hsl(43,74%,55%)] transition-colors cursor-pointer border-b border-white/10 hover:border-[hsl(43,74%,49%)] pb-0.5">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
