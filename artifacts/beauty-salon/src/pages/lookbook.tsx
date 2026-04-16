import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Sparkles, Heart, Share2, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { getSiteContent, SiteContent } from "@/lib/firebaseService";
import { usePageSEO } from "@/hooks/usePageSEO";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

interface LookItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  tags: string[];
  likes: number;
  difficulty: "Easy" | "Medium" | "Advanced";
  occasion: string;
  products: string[];
}

const lookbookData: LookItem[] = [
  {
    id: "1", title: "Radiant Bridal Glow", subtitle: "Traditional meets modern elegance",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=700&q=85",
    category: "Bridal", tags: ["Bridal", "Gold", "Glam", "Heavy"],
    likes: 284, difficulty: "Advanced", occasion: "Wedding Day",
    products: ["M·A·C Airbrush Foundation", "Charlotte Tilbury Contour", "Huda Beauty Eyeshadow", "NARS Lipstick"],
  },
  {
    id: "2", title: "Dewy No-Makeup Makeup", subtitle: "Effortlessly fresh and natural",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=85",
    category: "Everyday", tags: ["Natural", "Dewy", "Minimal", "Fresh"],
    likes: 412, difficulty: "Easy", occasion: "Day Out",
    products: ["Fenty Skin Tint", "Glossier Boy Brow", "ILIA Mascara", "NARS Lip Gloss"],
  },
  {
    id: "3", title: "Glossy Balayage Waves", subtitle: "Sun-kissed color with bouncy curls",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&q=85",
    category: "Hair", tags: ["Balayage", "Waves", "Color", "Glossy"],
    likes: 338, difficulty: "Advanced", occasion: "Special Event",
    products: ["Olaplex No.3", "Redken Blondage", "Dyson Airwrap", "GHD Shine Serum"],
  },
  {
    id: "4", title: "Smoky Eye Seduction", subtitle: "Dark and dramatic evening glam",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&q=85",
    category: "Evening", tags: ["Smoky", "Dramatic", "Evening", "Dark"],
    likes: 197, difficulty: "Medium", occasion: "Date Night",
    products: ["Tom Ford Eye Palette", "M·A·C Studio Fix", "Urban Decay Setting Spray", "MAC Velvet Teddy Lip"],
  },
  {
    id: "5", title: "Glass Skin Radiance", subtitle: "K-beauty inspired luminous finish",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=700&q=85",
    category: "Skin", tags: ["Glass Skin", "Korean", "Luminous", "Hydrating"],
    likes: 521, difficulty: "Easy", occasion: "Everyday",
    products: ["Laneige Water Sleeping Mask", "SK-II Essence", "Tatcha Dewy Skin Cream", "Innisfree Sun SPF50"],
  },
  {
    id: "6", title: "Sunset Ombré Nails", subtitle: "Gradient art with warm summer tones",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=700&q=85",
    category: "Nails", tags: ["Ombré", "Sunset", "Gradient", "Art"],
    likes: 163, difficulty: "Medium", occasion: "Beach Holiday",
    products: ["OPI GelColor", "Sally Hansen Nail Art Pen", "CND Shellac", "Seche Vite Top Coat"],
  },
  {
    id: "7", title: "Boho Braided Updo", subtitle: "Romantic festival-ready style",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=700&q=85",
    category: "Hair", tags: ["Boho", "Braid", "Updo", "Festival"],
    likes: 246, difficulty: "Medium", occasion: "Festival / Mehendi",
    products: ["Bumble & Bumble Prep Spray", "L'Oréal Elnett Hairspray", "Kristin Ess Shine Drops"],
  },
  {
    id: "8", title: "Monochrome Terracotta", subtitle: "Warm earth tones for a cohesive look",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=700&q=85",
    category: "Everyday", tags: ["Terracotta", "Monochrome", "Warm", "Cohesive"],
    likes: 309, difficulty: "Easy", occasion: "Brunch / Casual",
    products: ["Charlotte Tilbury Pillow Talk", "NARS Laguna Bronzer", "MAC Velvet Teddy", "Benefit Brow Bar"],
  },
  {
    id: "9", title: "Spa Serenity Ritual", subtitle: "Signature gold treatment glow",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=700&q=85",
    category: "Skin", tags: ["Spa", "Gold", "Anti-aging", "Luxury"],
    likes: 178, difficulty: "Easy", occasion: "Self-Care Day",
    products: ["Dr. Jart+ Gold Sheet Mask", "La Mer Moisturiser", "Elemis Pro-Collagen Oil", "Sunday Riley Luna Oil"],
  },
];

const LOOKBOOK_CATEGORIES = ["All", "Bridal", "Everyday", "Evening", "Hair", "Skin", "Nails"];
const OCCASIONS = ["All Occasions", "Wedding Day", "Date Night", "Day Out", "Special Event", "Everyday", "Festival / Mehendi"];

function LookCard({ item, onSelect }: { item: LookItem; onSelect: (item: LookItem) => void }) {
  const [liked, setLiked] = useState(false);

  const difficultyColor = { Easy: "hsl(120,45%,42%)", Medium: "hsl(43,74%,49%)", Advanced: "hsl(340,60%,55%)" }[item.difficulty];

  return (
    <motion.div
      className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm cursor-pointer relative"
      whileHover={{ y: -6, boxShadow: "0 25px 70px rgba(184,142,40,0.14)" }}
      onClick={() => onSelect(item)}>
      <div className="relative overflow-hidden aspect-[3/4]">
        <img src={item.image} alt={item.title} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 50%)" }} />

        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all"
          style={{ background: liked ? "hsl(340,60%,55%)" : "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <Heart size={14} fill={liked ? "white" : "none"} className="text-white" />
        </button>

        {/* Category */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full backdrop-blur-md"
          style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <span className="font-poppins text-xs text-white">{item.category}</span>
        </div>

        {/* Difficulty */}
        <div className="absolute bottom-12 left-3 px-2 py-0.5 rounded-full" style={{ background: `${difficultyColor}CC` }}>
          <span className="font-poppins text-[10px] text-white font-medium">{item.difficulty}</span>
        </div>

        {/* Occasion */}
        <div className="absolute bottom-3 left-3 right-12">
          <div className="font-poppins text-xs text-white/70">{item.occasion}</div>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1">
          <Heart size={11} fill="hsl(340,60%,55%)" className="text-[hsl(340,60%,55%)]" />
          <span className="font-poppins text-xs text-white">{item.likes + (liked ? 1 : 0)}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-serif text-lg sm:text-xl font-bold mb-1 leading-snug group-hover:text-[hsl(43,74%,38%)] transition-colors duration-300">{item.title}</h3>
        <p className="font-poppins text-xs text-muted-foreground mb-3">{item.subtitle}</p>
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 rounded-full bg-[hsl(42,30%,96%)] font-poppins text-[10px] text-[hsl(43,74%,38%)] border border-[rgba(184,142,40,0.2)]">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function LookModal({ item, onClose, whatsappLink }: { item: LookItem; onClose: () => void; whatsappLink?: string }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleKey); };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        <div className="relative h-64 sm:h-80 flex-shrink-0">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
            <span className="text-lg leading-none">×</span>
          </button>
          <div className="absolute bottom-4 left-5">
            <span className="font-poppins text-xs text-white/70 mb-1 block">{item.occasion}</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">{item.title}</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          <p className="font-poppins text-sm text-muted-foreground leading-relaxed">{item.subtitle}</p>

          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-[hsl(42,30%,96%)] font-poppins text-xs text-[hsl(43,74%,38%)] border border-[rgba(184,142,40,0.25)]">
                #{tag}
              </span>
            ))}
          </div>

          <div className="bg-[hsl(42,30%,97%)] rounded-2xl p-4">
            <div className="font-poppins text-xs font-semibold tracking-wider uppercase text-[hsl(43,74%,42%)] mb-3">Products Used</div>
            <div className="space-y-2">
              {item.products.map((p, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full gold-shimmer flex-shrink-0" style={{ background: "hsl(43,74%,49%)" }} />
                  <span className="font-poppins text-sm">{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <motion.button className="w-full py-3.5 rounded-full font-montserrat text-xs font-bold tracking-[0.2em] uppercase text-white gold-shimmer shadow-lg"
                  whileHover={{ scale: 1.02 }}>
                  Book This Look
                </motion.button>
              </a>
            )}
            <button onClick={onClose}
              className="flex-1 sm:flex-none py-3.5 px-6 rounded-full font-montserrat text-xs font-bold tracking-[0.2em] uppercase border-2 border-[hsl(43,74%,49%)] text-[hsl(43,74%,42%)] hover:bg-[hsl(43,74%,49%)] hover:text-white transition-all duration-300">
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeroCarousel() {
  const featured = lookbookData.filter((_, i) => [0, 2, 4].includes(i));
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % featured.length), 4000);
    return () => clearInterval(t);
  }, [featured.length]);

  return (
    <div className="relative h-[380px] sm:h-[480px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={featured[idx].image}
          alt={featured[idx].title}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.1) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 pt-28 h-full flex items-end">
        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-3 font-cinzel text-[10px] tracking-[0.5em] uppercase text-[hsl(43,74%,65%)] mb-4">
            <span className="w-6 sm:w-8 h-px bg-[hsl(43,74%,60%)]" />
            Style Inspirations
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-3">
            Look<span className="gold-text italic">book</span>
          </h1>
          <p className="font-poppins text-white/70 text-sm sm:text-base max-w-xs sm:max-w-sm leading-relaxed">
            Curated looks, trending styles, and the products behind each transformation.
          </p>
        </motion.div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 right-5 flex gap-1.5">
        {featured.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`rounded-full transition-all duration-300 ${i === idx ? "w-5 h-2 bg-[hsl(43,74%,49%)]" : "w-2 h-2 bg-white/40"}`} />
        ))}
      </div>
    </div>
  );
}

export default function LookbookPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeOccasion, setActiveOccasion] = useState("All Occasions");
  const [selectedLook, setSelectedLook] = useState<LookItem | null>(null);

  usePageSEO({
    title: "Lookbook | Style Inspirations & Virtual Try-On",
    description: "Browse curated beauty looks for every occasion — bridal, everyday, evening, hair, skin and nails. Find your perfect style and book the look.",
  });

  useEffect(() => {
    getSiteContent().then(setContent).catch(() => {});
  }, []);

  const filtered = lookbookData.filter((item) => {
    const matchCat = activeCategory === "All" || item.category === activeCategory;
    const matchOcc = activeOccasion === "All Occasions" || item.occasion === activeOccasion;
    return matchCat && matchOcc;
  });

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroCarousel />

      {/* ═══ CATEGORY FILTER ═══ */}
      <div className="sticky top-[80px] z-40 border-b border-[rgba(184,142,40,0.15)] bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-1">
            {LOOKBOOK_CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-poppins text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat ? "text-white gold-shimmer shadow-md" : "border border-[rgba(184,142,40,0.25)] text-[hsl(25,15%,35%)] hover:border-[hsl(43,74%,49%)]"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ LOOKBOOK GRID ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <FadeIn>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                {activeCategory === "All" ? "All Looks" : `${activeCategory} Looks`}
              </h2>
              <p className="font-poppins text-sm text-muted-foreground mt-1">{filtered.length} curated styles</p>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[hsl(43,74%,49%)]" />
              <span className="font-poppins text-xs text-muted-foreground hidden sm:inline">Click any look to discover the details</span>
            </div>
          </FadeIn>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="font-serif text-2xl font-bold mb-2">No looks found</div>
            <p className="font-poppins text-sm text-muted-foreground">Try a different category</p>
          </div>
        ) : (
          <motion.div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" layout>
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div key={item.id} layout
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}>
                  <LookCard item={item} onSelect={setSelectedLook} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ═══ OCCASION INSPIRATION ═══ */}
      <FadeIn>
        <div className="py-12 sm:py-16 px-4 sm:px-6" style={{ background: "linear-gradient(135deg, hsl(25,20%,10%) 0%, hsl(30,25%,14%) 100%)" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <span className="inline-flex items-center gap-3 font-cinzel text-[10px] tracking-[0.5em] uppercase text-[hsl(43,74%,65%)] mb-4">
                <span className="w-6 h-px bg-[hsl(43,74%,60%)]" />
                Find Your Look
                <span className="w-6 h-px bg-[hsl(43,74%,60%)]" />
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">Shop by Occasion</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {["Wedding Day", "Date Night", "Day Out", "Special Event", "Everyday", "Festival / Mehendi", "Beach Holiday", "Self-Care Day"].map((occ) => (
                <motion.button key={occ}
                  onClick={() => { setActiveOccasion(occ === activeOccasion ? "All Occasions" : occ); window.scrollTo({ top: 300, behavior: "smooth" }); }}
                  className={`px-4 py-3 rounded-xl font-poppins text-sm font-medium transition-all duration-300 ${
                    activeOccasion === occ ? "text-white gold-shimmer" : "border border-[rgba(184,142,40,0.25)] text-white/60 hover:border-[hsl(43,74%,49%)] hover:text-white"
                  }`}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  {occ}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ═══ CTA ═══ */}
      <div className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: "linear-gradient(135deg, hsl(42,30%,97%) 0%, hsl(40,45%,94%) 100%)" }}>
        <FadeIn className="max-w-2xl mx-auto text-center">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Love a look? Let's recreate it for you.
          </h3>
          <p className="font-poppins text-sm text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
            Share the look you love with our artists and we'll make it happen — personalised to your features.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            {content?.whatsappLink && (
              <a href={content.whatsappLink} target="_blank" rel="noopener noreferrer">
                <motion.button className="w-full sm:w-auto px-8 sm:px-10 py-3.5 rounded-full font-montserrat text-xs font-bold tracking-[0.2em] uppercase text-white gold-shimmer shadow-lg"
                  whileHover={{ scale: 1.04 }}>
                  Share a Look
                </motion.button>
              </a>
            )}
            <a href="/services">
              <motion.button className="w-full sm:w-auto px-8 sm:px-10 py-3.5 rounded-full font-montserrat text-xs font-bold tracking-[0.2em] uppercase border-2 border-[hsl(43,74%,49%)] text-[hsl(43,74%,42%)] hover:bg-[hsl(43,74%,49%)] hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.04 }}>
                View Services
              </motion.button>
            </a>
          </div>
        </FadeIn>
      </div>

      <Footer websiteName={content?.websiteName} contactNumber={content?.contactNumber}
        whatsappLink={content?.whatsappLink} instagramLink={content?.instagramLink} footerText={content?.footerText}
        address={content?.address} />
      <FloatingButtons whatsappLink={content?.whatsappLink} />

      <AnimatePresence>
        {selectedLook && (
          <LookModal item={selectedLook} onClose={() => setSelectedLook(null)} whatsappLink={content?.whatsappLink} />
        )}
      </AnimatePresence>
    </div>
  );
}
