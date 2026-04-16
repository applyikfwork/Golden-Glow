import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

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
                animationDuration: `${3 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 2}s`,
                animation: `floatUp ${3 + Math.random() * 4}s ${Math.random() * 2}s linear infinite`,
              }}
            />
          ))}

          {/* Logo reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-24 h-24 rounded-full gold-shimmer flex items-center justify-center shadow-2xl gold-glow">
              <span className="text-white text-4xl font-cinzel font-bold">L</span>
            </div>
            <div className="text-center">
              <h1 className="font-cinzel text-4xl font-bold tracking-[0.3em] gold-text">
                LUMIÈRE
              </h1>
              <p className="font-montserrat text-xs tracking-[0.5em] uppercase text-[hsl(43,40%,55%)] mt-2">
                Luxury Beauty
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
