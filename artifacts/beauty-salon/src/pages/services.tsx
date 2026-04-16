import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { Search, Clock, ArrowRight, Sparkles, X, Phone, MessageCircle, Star } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { getServices, getSiteContent, Service, SiteContent } from "@/lib/firebaseService";
import { usePageSEO } from "@/hooks/usePageSEO";

const categories = ["All", "Hair", "Makeup", "Skin", "Nails", "Bridal", "Spa"];

const DEMO_SERVICES: Service[] = [
  { id: "d1", name: "Luxury Bridal Makeup", description: "Complete bridal transformation — head to toe — using the finest international brands for your most important day. Our bridal artists create long-lasting, photo-ready looks tailored to your skin tone and wedding theme.", price: "₹8,999", duration: "4 hours", category: "Bridal", imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=85", featured: true },
  { id: "d2", name: "Hair Styling & Blowout", description: "Expert styling with precision cuts, premium blowouts, and finishing for a salon-perfect look that lasts all day. We use professional heat-protection products and premium styling tools.", price: "₹1,499", duration: "1.5 hours", category: "Hair", imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=85", featured: true },
  { id: "d3", name: "Luxury Facial", description: "Deep-cleansing signature facial with premium skincare serums, massage, and hydration mask. Our expert estheticians analyze your skin to provide the most effective treatment for your unique needs.", price: "₹3,499", duration: "90 min", category: "Skin", imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=85", featured: true },
  { id: "d4", name: "Gel Nail Art", description: "Creative nail art with long-lasting gel polish in hundreds of colors and intricate designs. Our nail technicians are trained in the latest trends including ombre, stamping, and 3D nail art.", price: "₹799", duration: "1 hour", category: "Nails", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=85", featured: false },
  { id: "d5", name: "Keratin Hair Treatment", description: "Professional keratin smoothing treatment for frizz-free, glossy hair that lasts 3–6 months. This treatment eliminates up to 95% of frizz while adding incredible shine and softness.", price: "₹4,999", duration: "3 hours", category: "Hair", imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=85", featured: false },
  { id: "d6", name: "Aromatherapy Spa", description: "Full-body relaxation with hot stone massage, essential oil therapy, and premium body wraps. Drift away in our serene spa environment designed to restore balance and harmony to your body and mind.", price: "₹5,499", duration: "2.5 hours", category: "Spa", imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=85", featured: false },
  { id: "d7", name: "Engagement Makeup", description: "Radiant, photo-ready makeup perfect for engagements, parties, and special events. We create a look that photographs beautifully and stays flawless through the entire celebration.", price: "₹3,999", duration: "2 hours", category: "Makeup", imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=85", featured: false },
  { id: "d8", name: "Gold Facial", description: "Anti-aging 24K gold leaf facial that brightens, tightens, and rejuvenates your skin. Gold particles stimulate cellular renewal while powerful serums target fine lines and uneven texture.", price: "₹5,999", duration: "1.5 hours", category: "Skin", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=85", featured: false },
  { id: "d9", name: "Bridal Henna Design", description: "Intricate bridal mehndi with premium dark-staining henna and traditional or modern patterns. Our mehndi artists work with you to create a unique design that complements your wedding attire.", price: "₹2,999", duration: "3 hours", category: "Bridal", imageUrl: "https://images.unsplash.com/photo-1583194818764-b8f50e3d9fc0?w=800&q=85", featured: false },
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
  Bridal: "hsl(340,60%,55%)", Hair: "hsl(200,60%,45%)", Skin: "hsl(120,35%,45%)",
  Nails: "hsl(280,50%,55%)", Makeup: "hsl(15,65%,52%)", Spa: "hsl(170,45%,40%)",
};

const serviceHighlights: Record<string, string[]> = {
  Bridal: ["Trial session included", "On-location available", "Touch-up kit gifted"],
  Hair: ["Consultation included", "Premium products only", "Styling tips shared"],
  Skin: ["Skin analysis first", "Hypoallergenic products", "Home care guide"],
  Nails: ["Gel or acrylic options", "Nail repair included", "Hand massage bonus"],
  Makeup: ["HD makeup technique", "Air-brush available", "Long-wear formulas"],
  Spa: ["Private suite", "Refreshments included", "Robe & slippers provided"],
};

function ServiceModal({ service, onClose, whatsappLink, contactNumber }: {
  service: Service; onClose: () => void; whatsappLink?: string; contactNumber?: string;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleKey); };
  }, [onClose]);

  const highlights = serviceHighlights[service.category] || ["Expert service", "Premium products", "Personalised care"];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.95 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
        >
          {/* Image header */}
          <div className="relative h-56 sm:h-72 flex-shrink-0">
            <img src={service.imageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80"}
              alt={service.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)" }} />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md"
              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: categoryColors[service.category] || "hsl(43,74%,49%)" }} />
              <span className="font-poppins text-xs text-white font-medium">{service.category}</span>
            </div>
            {service.featured && (
              <div className="absolute top-4 right-12 px-3 py-1.5 rounded-full gold-shimmer flex items-center gap-1.5">
                <Sparkles size={10} className="text-white" />
                <span className="font-poppins text-xs text-white font-semibold">Featured</span>
              </div>
            )}

            {/* Close */}
            <button onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors">
              <X size={16} />
            </button>

            {/* Price */}
            <div className="absolute bottom-4 left-5">
              <div className="font-cinzel text-3xl font-bold text-white" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
                {service.price}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-2">{service.name}</h2>
            
            <div className="flex items-center gap-2 mb-4">
              <Clock size={14} className="text-muted-foreground" />
              <span className="font-poppins text-sm text-muted-foreground">{service.duration}</span>
              <div className="flex items-center gap-0.5 ml-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="hsl(43,74%,49%)" className="text-[hsl(43,74%,49%)]" />)}
              </div>
              <span className="font-poppins text-xs text-muted-foreground">5.0</span>
            </div>

            <p className="font-poppins text-sm text-muted-foreground leading-relaxed mb-6">{service.description}</p>

            {/* Highlights */}
            <div className="bg-[hsl(42,30%,97%)] rounded-2xl p-4 mb-6">
              <div className="font-poppins text-xs font-semibold tracking-wider uppercase text-[hsl(43,74%,42%)] mb-3">What's included</div>
              <div className="space-y-2">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full gold-shimmer flex items-center justify-center flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <span className="font-poppins text-sm text-foreground">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {whatsappLink && (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <motion.button
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-full font-montserrat text-xs font-bold tracking-[0.2em] uppercase text-white gold-shimmer shadow-lg"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <MessageCircle size={15} /> Book on WhatsApp
                  </motion.button>
                </a>
              )}
              {contactNumber && (
                <a href={`tel:${contactNumber}`} className="flex-1 sm:flex-none">
                  <motion.button
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full font-montserrat text-xs font-bold tracking-[0.2em] uppercase border-2 border-[hsl(43,74%,49%)] text-[hsl(43,74%,42%)] hover:bg-[hsl(43,74%,49%)] hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Phone size={15} /> Call to Book
                  </motion.button>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  usePageSEO({
    title: "Our Services | Luxury Beauty Treatments",
    description: "Explore our full menu of luxury beauty services including bridal makeup, hair treatments, facials, spa therapies and more. Book your appointment today.",
  });

  useEffect(() => {
    Promise.all([getServices(), getSiteContent()])
      .then(([svcs, cnt]) => { setServices(svcs.length > 0 ? svcs : DEMO_SERVICES); setContent(cnt); setLoading(false); })
      .catch(() => { setServices(DEMO_SERVICES); setLoading(false); });
  }, []);

  const filtered = services.filter((s) => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = cat === "All" ? services.length : services.filter((s) => s.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const featuredService = services.find((s) => s.featured) || services[0];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO BANNER ═══ */}
      <div ref={heroRef} className="relative h-[420px] sm:h-[480px] md:h-[560px] flex items-end justify-start overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 pt-28 w-full">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <span className="inline-flex items-center gap-3 font-cinzel text-[10px] tracking-[0.5em] uppercase text-[hsl(43,74%,65%)] mb-4 sm:mb-5">
              <span className="w-6 sm:w-8 h-px bg-[hsl(43,74%,60%)]" />
              Our Offerings
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-3 sm:mb-4">
              Luxury <span className="gold-text italic">Services</span>
            </h1>
            <p className="font-poppins text-white/70 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-lg leading-relaxed">
              Every service crafted with precision, passion, and premium products.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ═══ FEATURED SERVICE SPOTLIGHT ═══ */}
      {featuredService && !loading && (
        <FadeIn>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-6 sm:mb-8 relative z-10">
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[rgba(184,142,40,0.2)]"
              style={{ background: "linear-gradient(135deg, hsl(25,20%,10%) 0%, hsl(30,25%,14%) 100%)" }}>
              <div className="grid sm:grid-cols-5 gap-0 items-center">
                <div className="sm:col-span-2 h-44 sm:h-56 md:h-full overflow-hidden">
                  <img src={featuredService.imageUrl} alt={featuredService.name}
                    className="w-full h-full object-cover opacity-70" />
                </div>
                <div className="sm:col-span-3 p-6 sm:p-8 md:p-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(184,142,40,0.2)] border border-[rgba(184,142,40,0.3)] mb-3 sm:mb-4">
                    <Sparkles size={12} className="text-[hsl(43,74%,55%)]" />
                    <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[hsl(43,74%,60%)]">Featured Service</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">{featuredService.name}</h3>
                  <p className="font-poppins text-xs sm:text-sm text-white/60 leading-relaxed mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-none">{featuredService.description}</p>
                  <div className="flex items-center gap-6 sm:gap-8 mb-4 sm:mb-6">
                    <div>
                      <div className="font-poppins text-xs text-white/40 uppercase tracking-wider mb-1">Price</div>
                      <div className="font-cinzel text-xl sm:text-2xl font-bold gold-text">{featuredService.price}</div>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div>
                      <div className="font-poppins text-xs text-white/40 uppercase tracking-wider mb-1">Duration</div>
                      <div className="flex items-center gap-1.5 text-white/80">
                        <Clock size={14} />
                        <span className="font-poppins text-sm">{featuredService.duration}</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setSelectedService(featuredService)}
                    className="flex items-center gap-3 px-6 sm:px-8 py-3 rounded-full font-montserrat text-xs font-bold tracking-[0.2em] uppercase text-white gold-shimmer"
                    whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(184,142,40,0.4)" }}>
                    View Details <ArrowRight size={14} />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {/* ═══ FILTERS + SEARCH ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col gap-5 sm:gap-6 mb-8 sm:mb-12">
          {/* Category pills */}
          <div className="relative flex flex-wrap gap-2 justify-center sm:justify-start">
            {categories.map((cat) => (
              <motion.button key={cat} onClick={() => setActiveCategory(cat)}
                className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-poppins text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat ? "text-white shadow-lg" : "bg-white border border-[rgba(184,142,40,0.25)] text-[hsl(25,15%,35%)] hover:border-[hsl(43,74%,49%)] hover:text-[hsl(43,74%,42%)]"
                }`}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                {activeCategory === cat && (
                  <motion.div layoutId="pill" className="absolute inset-0 rounded-full gold-shimmer" style={{ zIndex: -1 }} />
                )}
                {cat}
                {categoryCounts[cat] > 0 && (
                  <span className={`ml-1.5 text-xs font-normal ${activeCategory === cat ? "text-white/70" : "text-muted-foreground"}`}>
                    ({categoryCounts[cat]})
                  </span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-sm md:w-80 self-center sm:self-auto">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="search" placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 py-3 sm:py-3.5 rounded-full border border-[rgba(184,142,40,0.25)] bg-white font-poppins text-sm outline-none focus:border-[hsl(43,74%,49%)] focus:ring-2 focus:ring-[rgba(184,142,40,0.1)] transition-all placeholder:text-muted-foreground/60" />
          </div>
        </div>

        {/* ═══ SERVICE GRID ═══ */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden animate-pulse shadow-sm">
                <div className="h-56 sm:h-72 bg-[hsl(40,30%,90%)]" />
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="h-5 bg-[hsl(40,30%,90%)] rounded-full w-2/3" />
                  <div className="h-3 bg-[hsl(40,30%,90%)] rounded-full" />
                  <div className="h-3 bg-[hsl(40,30%,90%)] rounded-full w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 sm:py-32">
            <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[hsl(43,74%,94%)] flex items-center justify-center mx-auto mb-5 sm:mb-6">
              <Search size={24} className="text-[hsl(43,74%,49%)]" />
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold mb-2">No services found</div>
            <p className="font-poppins text-sm text-muted-foreground">Try a different search or category</p>
          </motion.div>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8" layout>
            <AnimatePresence>
              {filtered.map((service, i) => (
                <motion.div key={service.id || i} layout
                  initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.35) }}>
                  <motion.div
                    className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm relative cursor-pointer"
                    whileHover={{ y: -6, boxShadow: "0 25px 70px rgba(184,142,40,0.14)" }}
                    onClick={() => setSelectedService(service)}>
                    {/* Portrait image */}
                    <div className="relative h-56 sm:h-72 overflow-hidden">
                      <img src={service.imageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80"}
                        alt={service.name} loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

                      <div className="absolute inset-0 transition-opacity duration-500"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 55%)" }} />

                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-md"
                        style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.2)" }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: categoryColors[service.category] || "hsl(43,74%,49%)" }} />
                        <span className="font-poppins text-xs text-white font-medium">{service.category}</span>
                      </div>

                      {service.featured && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full gold-shimmer flex items-center gap-1.5">
                          <Sparkles size={10} className="text-white" />
                          <span className="font-poppins text-xs text-white font-semibold">Featured</span>
                        </div>
                      )}

                      <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-5">
                        <div className="font-cinzel text-xl sm:text-2xl font-bold text-white" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
                          {service.price}
                        </div>
                      </div>

                      {/* Tap to view on mobile, hover on desktop */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-400 ease-out hidden sm:block">
                        <button className="w-full py-2.5 sm:py-3 rounded-full font-montserrat text-xs font-bold tracking-[0.2em] uppercase text-white gold-shimmer shadow-xl">
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 sm:p-6">
                      <h3 className="font-serif text-lg sm:text-xl font-bold mb-1.5 sm:mb-2 group-hover:text-[hsl(43,74%,38%)] transition-colors duration-300 leading-snug">
                        {service.name}
                      </h3>
                      <p className="font-poppins text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3 sm:mb-5">{service.description}</p>
                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-[rgba(184,142,40,0.1)]">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock size={13} />
                          <span className="font-poppins text-xs">{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-1 font-poppins text-xs font-semibold text-[hsl(43,74%,42%)]">
                          View Details <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Result count */}
        {!loading && filtered.length > 0 && (
          <div className="text-center mt-8 sm:mt-12">
            <p className="font-poppins text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> service{filtered.length !== 1 ? "s" : ""}
              {activeCategory !== "All" && <> in <span className="font-semibold text-[hsl(43,74%,42%)]">{activeCategory}</span></>}
            </p>
          </div>
        )}
      </div>

      {/* ═══ BOTTOM CTA ═══ */}
      <div className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: "linear-gradient(135deg, hsl(42,30%,97%) 0%, hsl(40,45%,94%) 100%)" }}>
        <FadeIn className="max-w-2xl mx-auto text-center">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Not sure which service to choose?
          </h3>
          <p className="font-poppins text-sm text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
            Our beauty experts are happy to recommend the perfect service for you. Get in touch and we'll guide you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            {content?.whatsappLink && (
              <a href={content.whatsappLink} target="_blank" rel="noopener noreferrer">
                <motion.button className="w-full sm:w-auto px-8 sm:px-10 py-3.5 rounded-full font-montserrat text-xs font-bold tracking-[0.2em] uppercase text-white gold-shimmer shadow-lg"
                  whileHover={{ scale: 1.04 }}>
                  Chat on WhatsApp
                </motion.button>
              </a>
            )}
            <Link href="/">
              <motion.button className="w-full sm:w-auto px-8 sm:px-10 py-3.5 rounded-full font-montserrat text-xs font-bold tracking-[0.2em] uppercase border-2 border-[hsl(43,74%,49%)] text-[hsl(43,74%,42%)] hover:bg-[hsl(43,74%,49%)] hover:text-white transition-all duration-400"
                whileHover={{ scale: 1.04 }}>
                Back to Home
              </motion.button>
            </Link>
          </div>
        </FadeIn>
      </div>

      <Footer websiteName={content?.websiteName} contactNumber={content?.contactNumber}
        whatsappLink={content?.whatsappLink} instagramLink={content?.instagramLink} footerText={content?.footerText} />
      <FloatingButtons whatsappLink={content?.whatsappLink} />

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            whatsappLink={content?.whatsappLink}
            contactNumber={content?.contactNumber}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
