import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
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

interface BeforeAfter {
  id: string;
  label: string;
  category: string;
  before: string;
  after: string;
  description: string;
  artist: string;
  rating: number;
  reviews: number;
}

const beforeAfterData: BeforeAfter[] = [
  {
    id: "1",
    label: "Bridal Transformation",
    category: "Bridal",
    before: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    after: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
    description: "Complete bridal makeover including airbrush foundation, contouring, and a dramatic eye look for her special day.",
    artist: "Priya Mehra",
    rating: 5,
    reviews: 48,
  },
  {
    id: "2",
    label: "Keratin Smoothing",
    category: "Hair",
    before: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80",
    after: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
    description: "Professional keratin treatment that eliminated frizz and added mirror-like shine — results lasting 5 months.",
    artist: "Anjali Singh",
    rating: 5,
    reviews: 61,
  },
  {
    id: "3",
    label: "Gold Facial Glow",
    category: "Skin",
    before: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80",
    after: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    description: "24K gold facial treatment that visibly reduced fine lines, brightened the complexion, and restored youthful radiance.",
    artist: "Dr. Kavya Rao",
    rating: 5,
    reviews: 33,
  },
  {
    id: "4",
    label: "Nail Art Creation",
    category: "Nails",
    before: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    after: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=85",
    description: "Intricate floral nail art with gel polish, transforming bare nails into a stunning wearable artwork.",
    artist: "Simran Kaur",
    rating: 4.9,
    reviews: 27,
  },
  {
    id: "5",
    label: "Engagement Glam",
    category: "Makeup",
    before: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    after: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    description: "HD makeup with airbrush foundation, sculpted brows, and bold lip — perfect for the engagement photoshoot.",
    artist: "Nisha Verma",
    rating: 5,
    reviews: 42,
  },
  {
    id: "6",
    label: "Deep Relaxation Spa",
    category: "Spa",
    before: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
    after: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80",
    description: "Full body aromatherapy with hot stone massage and gold body wrap — visibly rejuvenated skin and deep relaxation.",
    artist: "Meera Iyer",
    rating: 5,
    reviews: 19,
  },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Bride", text: "The before & after difference was unreal! I couldn't recognise myself — in the most beautiful way.", rating: 5, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80" },
  { name: "Ananya Patel", role: "Hair Client", text: "My hair was so frizzy before. After the keratin treatment it's like silk every single day. Life-changing!", rating: 5, avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=100&q=80" },
  { name: "Meera Kapoor", role: "Skin Care", text: "The gold facial completely transformed my skin. People keep asking what I did differently — just this salon!", rating: 5, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" },
  { name: "Ritu Nair", role: "Makeup Client", text: "I came in for engagement makeup and left feeling like a movie star. The artist understood my vision perfectly.", rating: 5, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80" },
];

function BeforeAfterSlider({ item }: { item: BeforeAfter }) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => { if (isDragging) getPos(e.clientX); }, [isDragging, getPos]);
  const onTouchMove = useCallback((e: TouchEvent) => { if (isDragging) getPos(e.touches[0].clientX); }, [isDragging, getPos]);
  const stopDrag = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [onMouseMove, onTouchMove, stopDrag]);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-[rgba(184,142,40,0.1)]">
      {/* Slider */}
      <div
        ref={containerRef}
        className="relative h-56 sm:h-72 overflow-hidden select-none cursor-col-resize"
        onMouseDown={(e) => { setIsDragging(true); getPos(e.clientX); }}
        onTouchStart={(e) => { setIsDragging(true); getPos(e.touches[0].clientX); }}
      >
        {/* After (full) */}
        <img src={item.after} alt="After" className="absolute inset-0 w-full h-full object-cover" draggable={false} />

        {/* Before (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
          <img src={item.before} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${10000 / position}%`, maxWidth: "none" }} draggable={false} />
        </div>

        {/* Divider line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 pointer-events-none" style={{ left: `${position}%` }}>
          {/* Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center gap-0.5 pointer-events-auto cursor-col-resize"
            style={{ border: "2px solid rgba(184,142,40,0.6)" }}>
            <ChevronLeft size={14} className="text-[hsl(43,74%,42%)]" />
            <ChevronRight size={14} className="text-[hsl(43,74%,42%)]" />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm pointer-events-none">
          <span className="font-poppins text-xs text-white font-medium">Before</span>
        </div>
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full gold-shimmer pointer-events-none">
          <span className="font-poppins text-xs text-white font-semibold">After</span>
        </div>

        {/* Category badge */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full backdrop-blur-md pointer-events-none"
          style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <span className="font-poppins text-xs text-white">{item.category}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-serif text-lg sm:text-xl font-bold">{item.label}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star size={13} fill="hsl(43,74%,49%)" className="text-[hsl(43,74%,49%)]" />
            <span className="font-poppins text-xs font-semibold">{item.rating}</span>
            <span className="font-poppins text-xs text-muted-foreground">({item.reviews})</span>
          </div>
        </div>
        <p className="font-poppins text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">{item.description}</p>
        <div className="flex items-center gap-2 pt-3 border-t border-[rgba(184,142,40,0.1)]">
          <div className="w-6 h-6 rounded-full gold-shimmer flex items-center justify-center">
            <span className="font-cinzel text-white text-[8px] font-bold">{item.artist[0]}</span>
          </div>
          <span className="font-poppins text-xs text-muted-foreground">by <span className="font-semibold text-foreground">{item.artist}</span></span>
        </div>
      </div>
    </div>
  );
}

function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);
  const count = TESTIMONIALS.length;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div className="flex" animate={{ x: `-${idx * 100}%` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="min-w-full px-4 sm:px-16">
              <div className="max-w-2xl mx-auto text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={16} fill="hsl(43,74%,49%)" className="text-[hsl(43,74%,49%)]" />)}
                </div>
                <blockquote className="font-serif text-lg sm:text-2xl font-medium text-white leading-relaxed mb-6">
                  "{t.text}"
                </blockquote>
                <div className="flex items-center justify-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-[hsl(43,74%,49%)]" />
                  <div className="text-left">
                    <div className="font-poppins text-sm font-semibold text-white">{t.name}</div>
                    <div className="font-poppins text-xs text-white/60">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center items-center gap-3 mt-8">
        <button onClick={() => setIdx((idx - 1 + count) % count)}
          className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-[hsl(43,74%,49%)] hover:text-[hsl(43,74%,49%)] transition-colors">
          <ChevronLeft size={16} />
        </button>
        {TESTIMONIALS.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`rounded-full transition-all duration-300 ${i === idx ? "w-6 h-2 bg-[hsl(43,74%,49%)]" : "w-2 h-2 bg-white/30"}`} />
        ))}
        <button onClick={() => setIdx((idx + 1) % count)}
          className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-[hsl(43,74%,49%)] hover:text-[hsl(43,74%,49%)] transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function ClientExperiencePage() {
  const [content, setContent] = useState<SiteContent | null>(null);

  usePageSEO({
    title: "Client Experience | Before & After Gallery",
    description: "See real transformations from our clients. Browse our before and after gallery showcasing bridal, hair, skin, makeup and nail transformations.",
  });

  useEffect(() => {
    getSiteContent().then(setContent).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <div className="relative h-[380px] sm:h-[440px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&q=80)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.15) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 pt-28 w-full">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <span className="inline-flex items-center gap-3 font-cinzel text-[10px] tracking-[0.5em] uppercase text-[hsl(43,74%,65%)] mb-4">
              <span className="w-6 sm:w-8 h-px bg-[hsl(43,74%,60%)]" />
              Real Results
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-3">
              Client <span className="gold-text italic">Experience</span>
            </h1>
            <p className="font-poppins text-white/70 text-sm sm:text-base max-w-xs sm:max-w-md leading-relaxed">
              Drag the slider to reveal stunning before & after transformations from our real clients.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ═══ STATS STRIP ═══ */}
      <div className="border-b border-[rgba(184,142,40,0.15)]" style={{ background: "linear-gradient(135deg, hsl(25,20%,10%) 0%, hsl(30,25%,14%) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { value: "500+", label: "Transformations" },
              { value: "4.9★", label: "Average Rating" },
              { value: "98%", label: "Satisfied Clients" },
              { value: "6", label: "Expert Artists" },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-cinzel text-2xl sm:text-3xl font-bold gold-text">{s.value}</div>
                <div className="font-poppins text-xs text-white/50 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ BEFORE & AFTER GRID ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <FadeIn className="text-center mb-10 sm:mb-16">
          <span className="inline-flex items-center gap-3 font-cinzel text-[10px] tracking-[0.5em] uppercase text-[hsl(43,74%,49%)] mb-4">
            <span className="w-6 h-px bg-[hsl(43,74%,49%)]" />
            Slide to Reveal
            <span className="w-6 h-px bg-[hsl(43,74%,49%)]" />
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Before & <span className="gold-text italic">After</span>
          </h2>
          <p className="font-poppins text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Drag the divider left or right to see the full transformation. Every result you see is from a real client at our salon.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {beforeAfterData.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.08}>
              <BeforeAfterSlider item={item} />
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ═══ TESTIMONIALS ═══ */}
      <div className="py-16 sm:py-24 px-4 sm:px-6" style={{ background: "linear-gradient(135deg, hsl(25,20%,10%) 0%, hsl(30,25%,14%) 100%)" }}>
        <FadeIn className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-3 font-cinzel text-[10px] tracking-[0.5em] uppercase text-[hsl(43,74%,65%)] mb-4">
              <span className="w-6 h-px bg-[hsl(43,74%,60%)]" />
              What Clients Say
              <span className="w-6 h-px bg-[hsl(43,74%,60%)]" />
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Real <span className="gold-text italic">Reviews</span>
            </h2>
          </div>
          <TestimonialsCarousel />
        </FadeIn>
      </div>

      {/* ═══ CTA ═══ */}
      <div className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: "linear-gradient(135deg, hsl(42,30%,97%) 0%, hsl(40,45%,94%) 100%)" }}>
        <FadeIn className="max-w-2xl mx-auto text-center">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Ready for your transformation?
          </h3>
          <p className="font-poppins text-sm text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
            Join hundreds of happy clients who trusted us with their most important moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            {content?.whatsappLink && (
              <a href={content.whatsappLink} target="_blank" rel="noopener noreferrer">
                <motion.button className="w-full sm:w-auto px-8 sm:px-10 py-3.5 rounded-full font-montserrat text-xs font-bold tracking-[0.2em] uppercase text-white gold-shimmer shadow-lg"
                  whileHover={{ scale: 1.04 }}>
                  Book My Transformation
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
    </div>
  );
}
