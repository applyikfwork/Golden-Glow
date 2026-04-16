import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { getGallery, getSiteContent, GalleryItem, SiteContent } from "@/lib/firebaseService";

const galleryCategories = ["All", "Bridal", "Hair", "Makeup", "Nails", "Skin"];

const DEMO_GALLERY: GalleryItem[] = [
  { id: "g1", imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=85", title: "Bridal Glow", text: "Complete bridal transformation", category: "Bridal" },
  { id: "g2", imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=85", title: "Hair Art", text: "Precision cut & styling", category: "Hair" },
  { id: "g3", imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=85", title: "Glamour Look", text: "Event-ready full glam", category: "Makeup" },
  { id: "g4", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=85", title: "Nail Artistry", text: "Intricate gel nail art", category: "Nails" },
  { id: "g5", imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85", title: "Skin Radiance", text: "Deep cleansing facial", category: "Skin" },
  { id: "g6", imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=85", title: "Color Transform", text: "Balayage & highlights", category: "Hair" },
  { id: "g7", imageUrl: "https://images.unsplash.com/photo-1583194818764-b8f50e3d9fc0?w=800&q=85", title: "Bridal Henna", text: "Traditional mehndi design", category: "Bridal" },
  { id: "g8", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=85", title: "Gold Glow Facial", text: "24K gold facial treatment", category: "Skin" },
  { id: "g9", imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=85", title: "Spa Serenity", text: "Luxury aromatherapy", category: "Skin" },
  { id: "g10", imageUrl: "https://images.unsplash.com/photo-1599629954294-14df9ebb8549?w=800&q=85", title: "Evening Glam", text: "Bold eye & lip look", category: "Makeup" },
  { id: "g11", imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=85", title: "Bridal Party", text: "Group bridal makeup", category: "Bridal" },
  { id: "g12", imageUrl: "https://images.unsplash.com/photo-1614869557284-e96059817744?w=800&q=85", title: "Ombre Nails", text: "Sunset gradient design", category: "Nails" },
];

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

const categoryColors: Record<string, string> = {
  Bridal: "#c2736a", Hair: "#4a9db5", Skin: "#6aa87a",
  Nails: "#9b72c0", Makeup: "#c47a50",
};

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    Promise.all([getGallery(), getSiteContent()])
      .then(([items, cnt]) => { setGallery(items.length > 0 ? items : DEMO_GALLERY); setContent(cnt); setLoading(false); })
      .catch(() => { setGallery(DEMO_GALLERY); setLoading(false); });
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIdx]);

  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIdx]);

  const filtered = gallery.filter((item) => activeCategory === "All" || item.category === activeCategory);

  const openLightbox = (item: GalleryItem) => {
    const idx = filtered.findIndex((f) => f.id === item.id);
    if (idx !== -1) setLightboxIdx(idx);
  };

  const nextLightbox = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % filtered.length);
  };

  const prevLightbox = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + filtered.length) % filtered.length);
  };

  const categoryCounts = galleryCategories.reduce((acc, cat) => {
    acc[cat] = cat === "All" ? gallery.length : gallery.filter((g) => g.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const lightboxItem = lightboxIdx !== null ? filtered[lightboxIdx] : null;

  // Distribute items into 3 columns for masonry
  const cols: GalleryItem[][] = [[], [], []];
  filtered.forEach((item, i) => cols[i % 3].push(item));

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO BANNER ═══ */}
      <div ref={heroRef} className="relative h-[480px] md:h-[560px] flex items-end overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&q=80)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-16 pt-32 w-full">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <span className="inline-flex items-center gap-3 font-cinzel text-[10px] tracking-[0.5em] uppercase text-[hsl(43,74%,65%)] mb-5">
              <span className="w-8 h-px bg-[hsl(43,74%,60%)]" />
              Our Portfolio
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
              Beauty <span className="gold-text italic">Gallery</span>
            </h1>
            <p className="font-poppins text-white/70 text-base md:text-lg max-w-lg leading-relaxed">
              A curated showcase of transformations, artistry, and timeless elegance.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ═══ CATEGORY FILTERS ═══ */}
      <div className="sticky top-16 z-30 border-b border-[rgba(184,142,40,0.12)]"
        style={{ background: "rgba(253,251,247,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {galleryCategories.map((cat) => (
              <motion.button key={cat} onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2 rounded-full font-poppins text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat ? "text-white shadow-md" : "bg-white border border-[rgba(184,142,40,0.2)] text-[hsl(25,15%,40%)] hover:border-[hsl(43,74%,49%)]"
                }`}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                {activeCategory === cat && (
                  <motion.div layoutId="gallery-pill" className="absolute inset-0 rounded-full gold-shimmer" style={{ zIndex: -1 }} />
                )}
                <span className="relative">
                  {cat}
                  {categoryCounts[cat] > 0 && (
                    <span className={`ml-1.5 text-xs font-normal ${activeCategory === cat ? "text-white/70" : "text-muted-foreground"}`}>
                      {categoryCounts[cat]}
                    </span>
                  )}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ MASONRY GRID ═══ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, ci) => (
              <div key={ci} className="flex flex-col gap-4">
                {[240, 320, 280].map((h, ri) => (
                  <div key={ri} className="w-full rounded-3xl bg-[hsl(40,30%,90%)] animate-pulse" style={{ height: h }} />
                ))}
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <div className="w-20 h-20 rounded-full bg-[hsl(43,74%,94%)] flex items-center justify-center mx-auto mb-6">
              <ZoomIn size={28} className="text-[hsl(43,74%,49%)]" />
            </div>
            <div className="font-serif text-2xl font-bold mb-2">No items in this category</div>
            <p className="font-poppins text-sm text-muted-foreground">Try selecting a different category above</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cols.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-4">
                {col.map((item, ri) => {
                  const heights = [300, 380, 260, 340, 290, 360];
                  const h = heights[(ci * 3 + ri) % heights.length];
                  return (
                    <motion.div key={item.id || ri}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.45, delay: Math.min(ri * 0.07, 0.3) }}
                      className="group relative rounded-3xl overflow-hidden cursor-pointer"
                      style={{ height: h }}
                      whileHover={{ y: -4 }}
                      onClick={() => openLightbox(item)}>
                      <img src={item.imageUrl} alt={item.title} loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" />

                      {/* Default gradient - always slightly visible */}
                      <div className="absolute inset-0 transition-opacity duration-500"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 55%)", opacity: 0.6 }} />

                      {/* Full hover overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0) 100%)" }} />

                      {/* Gold border on hover */}
                      <div className="absolute inset-0 rounded-3xl border-2 border-[hsl(43,74%,49%)] opacity-0 group-hover:opacity-50 transition-opacity duration-400 pointer-events-none" />

                      {/* Category chip - top left */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full backdrop-blur-sm text-xs font-poppins font-semibold text-white"
                        style={{ background: `${categoryColors[item.category] || "rgba(184,142,40,0.6)"}cc`, border: "1px solid rgba(255,255,255,0.25)" }}>
                        {item.category}
                      </div>

                      {/* Zoom icon center */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-full backdrop-blur-md border border-white/30 flex items-center justify-center text-white"
                          style={{ background: "rgba(184,142,40,0.35)" }}>
                          <ZoomIn size={22} />
                        </div>
                      </div>

                      {/* Bottom info - slides up on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                        <h3 className="font-serif text-lg font-bold text-white leading-snug">{item.title}</h3>
                        {item.text && (
                          <p className="font-poppins text-xs text-white/75 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            {item.text}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Item count */}
        {!loading && filtered.length > 0 && (
          <div className="text-center mt-12">
            <p className="font-poppins text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> work{filtered.length !== 1 ? "s" : ""} displayed
              {activeCategory !== "All" && <> · <span className="text-[hsl(43,74%,42%)] font-semibold">{activeCategory}</span></>}
            </p>
          </div>
        )}
      </div>

      {/* ═══ CTA SECTION ═══ */}
      <div className="py-24 px-6 relative overflow-hidden" style={{ background: "hsl(25,20%,9%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full opacity-10 blur-3xl"
            style={{ background: "hsl(43,74%,49%)" }} />
        </div>
        <FadeIn className="relative max-w-2xl mx-auto text-center">
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for Your <span className="gold-text italic">Transformation?</span>
          </h3>
          <p className="font-poppins text-sm text-white/55 mb-10 leading-relaxed">
            Every look in this gallery started with a single appointment. Book yours today.
          </p>
          <Link href="/services">
            <motion.button className="flex items-center gap-3 px-12 py-4 rounded-full font-montserrat text-sm font-bold tracking-[0.2em] uppercase text-white gold-shimmer shadow-2xl mx-auto"
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(184,142,40,0.45)" }}>
              Book a Service <ArrowRight size={16} />
            </motion.button>
          </Link>
        </FadeIn>
      </div>

      {/* ═══ LIGHTBOX ═══ */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
            onClick={() => setLightboxIdx(null)}>

            {/* Prev button */}
            <motion.button onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ChevronLeft size={22} />
            </motion.button>

            {/* Image container */}
            <motion.div initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative max-w-4xl w-full mx-16"
              onClick={(e) => e.stopPropagation()}>
              {/* Gold frame */}
              <div className="absolute -inset-3 rounded-3xl pointer-events-none"
                style={{ border: "1px solid rgba(184,142,40,0.3)" }} />

              <AnimatePresence mode="wait">
                <motion.img key={lightboxItem.id} src={lightboxItem.imageUrl} alt={lightboxItem.title}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl" />
              </AnimatePresence>

              {/* Caption */}
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">{lightboxItem.title}</h3>
                  {lightboxItem.text && <p className="font-poppins text-sm text-white/60 mt-1">{lightboxItem.text}</p>}
                  <span className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-poppins font-semibold text-white"
                    style={{ background: `${categoryColors[lightboxItem.category] || "rgba(184,142,40,0.6)"}cc` }}>
                    {lightboxItem.category}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-poppins text-xs text-white/40 mb-1">
                    {(lightboxIdx ?? 0) + 1} / {filtered.length}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Next button */}
            <motion.button onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ChevronRight size={22} />
            </motion.button>

            {/* Close button */}
            <button onClick={() => setLightboxIdx(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer websiteName={content?.websiteName} contactNumber={content?.contactNumber}
        whatsappLink={content?.whatsappLink} instagramLink={content?.instagramLink} footerText={content?.footerText} />
      <FloatingButtons whatsappLink={content?.whatsappLink} />
    </div>
  );
}
