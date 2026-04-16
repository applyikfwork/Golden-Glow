import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { getGallery, getSiteContent, GalleryItem, SiteContent } from "@/lib/firebaseService";

const galleryCategories = ["All", "Bridal", "Hair", "Makeup", "Nails", "Skin"];

const DEMO_GALLERY: GalleryItem[] = [
  { id: "g1", imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80", title: "Bridal Glow", text: "Complete bridal transformation", category: "Bridal" },
  { id: "g2", imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80", title: "Hair Art", text: "Precision cut & styling", category: "Hair" },
  { id: "g3", imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", title: "Glamour Look", text: "Event-ready full glam", category: "Makeup" },
  { id: "g4", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80", title: "Nail Artistry", text: "Intricate gel nail art", category: "Nails" },
  { id: "g5", imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", title: "Skin Radiance", text: "Deep cleansing facial", category: "Skin" },
  { id: "g6", imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80", title: "Color Transform", text: "Balayage & highlights", category: "Hair" },
  { id: "g7", imageUrl: "https://images.unsplash.com/photo-1583194818764-b8f50e3d9fc0?w=600&q=80", title: "Bridal Henna", text: "Traditional mehndi design", category: "Bridal" },
  { id: "g8", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", title: "Gold Glow Facial", text: "24K gold facial treatment", category: "Skin" },
  { id: "g9", imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80", title: "Spa Serenity", text: "Luxury aromatherapy", category: "Skin" },
  { id: "g10", imageUrl: "https://images.unsplash.com/photo-1599629954294-14df9ebb8549?w=600&q=80", title: "Evening Glam", text: "Bold eye & lip look", category: "Makeup" },
  { id: "g11", imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80", title: "Bridal Party", text: "Group bridal makeup", category: "Bridal" },
  { id: "g12", imageUrl: "https://images.unsplash.com/photo-1614869557284-e96059817744?w=600&q=80", title: "Ombre Nails", text: "Sunset gradient design", category: "Nails" },
];

function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getGallery(), getSiteContent()]).then(([items, cnt]) => {
      setGallery(items.length > 0 ? items : DEMO_GALLERY);
      setContent(cnt);
      setLoading(false);
    });
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  const filtered = gallery.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero banner */}
      <div className="relative h-72 md:h-96 flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1920&q=70)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="font-cinzel text-xs tracking-[0.5em] uppercase text-[hsl(43,74%,65%)]">
            Our Portfolio
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mt-3 mb-4">
            Beauty <span className="gold-text">Gallery</span>
          </h1>
          <p className="font-poppins text-white/70 text-base md:text-lg max-w-xl mx-auto">
            A showcase of transformations, artistry, and elegance.
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {galleryCategories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-poppins text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "text-white gold-shimmer shadow-md"
                  : "bg-white border border-[rgba(184,142,40,0.3)] text-[hsl(25,15%,30%)] hover:border-[hsl(43,74%,49%)]"
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              data-testid={`gallery-filter-${cat}`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Masonry Grid */}
        {loading ? (
          <div className="masonry-grid">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="masonry-item bg-[hsl(40,30%,88%)] rounded-3xl animate-pulse"
                style={{ height: `${200 + Math.random() * 200}px` }}
              />
            ))}
          </div>
        ) : (
          <motion.div className="masonry-grid" layout>
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id || i}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                  className="masonry-item"
                >
                  <motion.div
                    className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm"
                    whileHover={{ y: -4 }}
                    onClick={() => setLightbox(item)}
                    data-testid={`gallery-item-${item.id}`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                          className="w-12 h-12 rounded-full glass flex items-center justify-center text-white"
                        >
                          <ZoomIn size={20} />
                        </motion.div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="font-serif text-lg font-bold text-white">{item.title}</h3>
                        {item.text && (
                          <p className="font-poppins text-sm text-white/80 mt-1">{item.text}</p>
                        )}
                        <span className="mt-2 inline-block px-3 py-0.5 rounded-full bg-[rgba(184,142,40,0.4)] text-[hsl(43,74%,85%)] text-xs font-poppins">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    {/* Gold frame on hover */}
                    <div className="absolute inset-0 border-2 border-[hsl(43,74%,49%)] rounded-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setLightbox(null)}
            data-testid="lightbox-overlay"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative max-w-4xl max-h-[90vh] mx-auto px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gold frame */}
              <div className="absolute -inset-2 border border-[rgba(184,142,40,0.4)] rounded-3xl pointer-events-none" />
              <img
                src={lightbox.imageUrl}
                alt={lightbox.title}
                className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white">{lightbox.title}</h3>
                  {lightbox.text && (
                    <p className="font-poppins text-sm text-white/70 mt-1">{lightbox.text}</p>
                  )}
                  <span className="mt-2 inline-block px-3 py-0.5 rounded-full bg-[rgba(184,142,40,0.3)] text-[hsl(43,74%,75%)] text-xs font-poppins">
                    {lightbox.category}
                  </span>
                </div>
                <button
                  onClick={() => setLightbox(null)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  data-testid="lightbox-close"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer
        websiteName={content?.websiteName}
        contactNumber={content?.contactNumber}
        whatsappLink={content?.whatsappLink}
        instagramLink={content?.instagramLink}
        footerText={content?.footerText}
      />
      <FloatingButtons whatsappLink={content?.whatsappLink} />
    </div>
  );
}
