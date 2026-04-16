import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useSiteContent } from "@/context/SiteContentContext";

function LoadingLogo({ size = 96 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 4px 24px rgba(212,168,67,0.7))" }}
    >
      <defs>
        <radialGradient id="ls-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8c05a" />
          <stop offset="100%" stopColor="#8a6410" />
        </radialGradient>
        <radialGradient id="ls-shine" cx="35%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffe87a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d4a843" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ls-petal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff9e6" />
          <stop offset="100%" stopColor="#f0c040" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#ls-bg)" />
      <circle cx="32" cy="32" r="31" fill="url(#ls-shine)" />
      <circle cx="32" cy="32" r="27" fill="#1a0e00" fillOpacity="0.5" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ls-petal)" opacity="0.92" transform="rotate(0,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ls-petal)" opacity="0.85" transform="rotate(45,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ls-petal)" opacity="0.92" transform="rotate(90,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ls-petal)" opacity="0.85" transform="rotate(135,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ls-petal)" opacity="0.92" transform="rotate(180,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ls-petal)" opacity="0.85" transform="rotate(225,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ls-petal)" opacity="0.92" transform="rotate(270,32,32)" />
      <ellipse cx="32" cy="20" rx="4" ry="8" fill="url(#ls-petal)" opacity="0.85" transform="rotate(315,32,32)" />
      <circle cx="32" cy="32" r="7" fill="url(#ls-bg)" />
      <circle cx="32" cy="32" r="5" fill="#fff9e6" opacity="0.95" />
      <circle cx="32" cy="32" r="2.5" fill="url(#ls-bg)" />
      <circle cx="32" cy="7" r="1.5" fill="#ffe87a" opacity="0.8" />
      <circle cx="57" cy="32" r="1.5" fill="#ffe87a" opacity="0.8" />
      <circle cx="32" cy="57" r="1.5" fill="#ffe87a" opacity="0.8" />
      <circle cx="7" cy="32" r="1.5" fill="#ffe87a" opacity="0.8" />
    </svg>
  );
}

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const { content } = useSiteContent();

  const websiteName = content.websiteName || "Lumière Beauty";
  const words = websiteName.trim().split(/\s+/);
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ").toUpperCase();
  const line2 = words.slice(mid).join(" ");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setVisible(false), 400);
          return 100;
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(42,30%,97%) 0%, hsl(40,40%,93%) 50%, hsl(42,30%,97%) 100%)",
          }}
        >
          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full opacity-40"
              style={{
                background: "hsl(43,74%,49%)",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatUp ${3 + Math.random() * 4}s ${Math.random() * 2}s linear infinite`,
              }}
            />
          ))}

          {/* Logo reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
            className="flex flex-col items-center gap-5"
          >
            <LoadingLogo size={96} />
            <div className="text-center">
              <h1 className="font-cinzel text-3xl font-bold tracking-[0.3em] gold-text">
                {line1}
              </h1>
              {line2 && (
                <p className="font-cinzel text-xl font-semibold tracking-[0.25em] gold-text mt-1 opacity-80">
                  {line2.toUpperCase()}
                </p>
              )}
              <p className="font-montserrat text-xs tracking-[0.5em] uppercase text-[hsl(43,40%,55%)] mt-2">
                Luxury Beauty Studio
              </p>
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="mt-12 w-48">
            <div className="h-px bg-[hsl(40,30%,85%)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, hsl(43,74%,49%), hsl(43,90%,62%), hsl(43,74%,49%))",
                  width: `${progress}%`,
                  transition: "width 0.05s linear",
                }}
              />
            </div>
            <p className="text-center mt-3 font-poppins text-xs text-[hsl(43,50%,55%)] tracking-widest">
              {progress < 100 ? "Preparing your experience..." : "Welcome"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
