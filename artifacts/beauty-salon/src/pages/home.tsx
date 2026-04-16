import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Award, Sparkles, Shield, Heart, Crown, Gem,
  Star, ArrowRight, ChevronLeft, ChevronRight, Quote,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { getSiteContent, getFeaturedServices, getDefaultContent, SiteContent, Service } from "@/lib/firebaseService";

const iconMap: Record<string, React.ReactNode> = {
  award: <Award size={26} />,
  sparkles: <Sparkles size={26} />,
  shield: <Shield size={26} />,
  heart: <Heart size={26} />,
  crown: <Crown size={26} />,
  gem: <Gem size={26} />,
};

function Counter({ value, duration = 2000 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.]/g, "");
    if (isNaN(num)) { setDisplay(value); return; }
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round((num * eased) * 10) / 10;
      setDisplay(current % 1 === 0 ? current.toFixed(0) + suffix : current.toFixed(1) + suffix);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function Particles({ count = 20 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            width: `${2 + (i % 3) * 2}px`, height: `${2 + (i % 3) * 2}px`,
            background: "hsl(43,74%,49%)", opacity: 0.15 + (i % 5) * 0.07,
            left: `${(i * 7.3) % 100}%`, bottom: `-${(i * 13) % 20}px`,
            animation: `floatUp ${6 + (i % 4) * 2}s ${(i % 6)}s linear infinite`,
          }} />
      ))}
    </div>
  );
}

const marqueeItems = ["Bridal", "Hair Styling", "Luxury Facials", "Nail Art", "Makeup", "Spa & Wellness", "Keratin Treatment", "Gold Facial", "Mehndi Design", "Balayage"];

const heroImages = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=80",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&q=80",
];

const demoFeatured: Service[] = [
  { id: "1", name: "Luxury Bridal Makeup", description: "Complete bridal transformation with premium international products and airbrush finish.", price: "₹8,999", duration: "4 hours", category: "Bridal", imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80", featured: true },
  { id: "2", name: "Hair Styling & Treatment", description: "Professional styling and deep conditioning treatment for gorgeous healthy hair.", price: "₹2,499", duration: "2 hours", category: "Hair", imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80", featured: true },
  { id: "3", name: "Luxury Facial", description: "Signature facial with premium skincare and advanced techniques for glowing skin.", price: "₹3,499", duration: "90 min", category: "Skin", imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80", featured: true },
];

export default function HomePage() {
  const [content, setContent] = useState<SiteContent>(getDefaultContent());
  const [featuredServices, setFeaturedServices] = useState<Service[]>(demoFeatured);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [heroImg, setHeroImg] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    getSiteContent().then(setContent).catch(() => setContent(getDefaultContent()));
    getFeaturedServices().then((s) => setFeaturedServices(s.length > 0 ? s.slice(0, 3) : demoFeatured)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroImg((i) => (i + 1) % heroImages.length), 5500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!content?.testimonials?.length) return;
    const t = setInterval(() => setTestimonialIdx((i) => (i + 1) % (content.testimonials?.length || 1)), 5000);
    return () => clearInterval(t);
  }, [content?.testimonials]);

  const testimonials = content?.testimonials || [];
  const prev = () => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setTestimonialIdx((i) => (i + 1) % testimonials.length);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          {heroImages.map((img, i) => (
            <motion.div key={img} className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${content?.heroImage || img})` }}
              initial={{ opacity: 0 }} animate={{ opacity: (content?.heroImage ? i === 0 : heroImg === i) ? 1 : 0 }}
              transition={{ duration: 1.8 }} />
          ))}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.75) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 60%)" }} />
        </motion.div>

        <Particles count={30} />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="mb-8">
            <span className="inline-flex items-center gap-3 font-cinzel text-[10px] md:text-xs tracking-[0.6em] uppercase text-[hsl(43,74%,70%)] px-8 py-3 border border-[rgba(184,142,40,0.35)] rounded-full backdrop-blur-sm">
              <span className="w-8 h-px bg-[hsl(43,74%,60%)]" />
              Premium Beauty Experience
              <span className="w-8 h-px bg-[hsl(43,74%,60%)]" />
            </span>
          </motion.div>

          <motion.h1 className="font-serif text-5xl md:text-7xl lg:text-[90px] font-bold text-white leading-[1.05] mb-8 tracking-tight">
            {(content?.heroTitle || "Reveal Your True Beauty").split(" ").map((word, i, arr) => (
              <motion.span key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`inline-block mr-3 md:mr-4 ${i === Math.floor(arr.length / 2) ? "gold-text italic" : ""}`}>
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }}
            className="font-poppins text-lg md:text-xl text-white/75 mb-12 max-w-2xl mx-auto leading-relaxed">
            {content?.heroSubtitle || "Luxury Hair, Skin & Bridal Care Experience"}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/services">
              <motion.button className="group px-12 py-4 rounded-full font-montserrat text-sm font-bold tracking-[0.2em] uppercase text-white gold-shimmer shadow-2xl flex items-center gap-3"
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(184,142,40,0.5)" }} whileTap={{ scale: 0.97 }}>
                Book Now
                <motion.span className="group-hover:translate-x-1 transition-transform duration-300"><ArrowRight size={16} /></motion.span>
              </motion.button>
            </Link>
            <Link href="/gallery">
              <motion.button className="px-12 py-4 rounded-full font-montserrat text-sm font-bold tracking-[0.2em] uppercase text-white border border-white/35 backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.6)" }} whileTap={{ scale: 0.97 }}>
                View Our Work
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero image dots */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setHeroImg(i)}
              className={`rounded-full transition-all duration-500 ${heroImg === i ? "w-8 h-2 bg-[hsl(43,74%,55%)]" : "w-2 h-2 bg-white/40"}`} />
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-0.5 h-2 bg-white/70 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ═══ MARQUEE RIBBON ═══ */}
      <div className="py-4 overflow-hidden border-y border-[rgba(184,142,40,0.2)]"
        style={{ background: "linear-gradient(90deg, hsl(42,30%,96%) 0%, hsl(43,40%,94%) 50%, hsl(42,30%,96%) 100%)" }}>
        <motion.div className="flex whitespace-nowrap gap-0"
          animate={{ x: [0, -50 * marqueeItems.length] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}>
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 mx-8">
              <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[hsl(25,20%,35%)]">{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(43,74%,49%)] flex-shrink-0" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* ═══ ABOUT ═══ */}
      <section className="py-28 px-6 relative overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(43,74%,88%) 0%, transparent 70%)", transform: "translate(30%, -20%)" }} />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <FadeIn>
            <div className="relative">
              {/* Gold corner frames */}
              <div className="absolute -top-5 -left-5 w-20 h-20 border-t-2 border-l-2 border-[hsl(43,74%,49%)] rounded-tl-3xl z-10" />
              <div className="absolute -bottom-5 -right-5 w-20 h-20 border-b-2 border-r-2 border-[hsl(43,74%,49%)] rounded-br-3xl z-10 opacity-60" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
                <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=85" alt="Salon"
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 60%)" }} />
              </div>
              {/* Floating badge */}
              <motion.div className="absolute -bottom-8 -right-8 bg-white rounded-2xl px-6 py-4 shadow-2xl border border-[rgba(184,142,40,0.2)]"
                whileHover={{ scale: 1.04 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gold-shimmer flex items-center justify-center flex-shrink-0">
                    <Crown className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-cinzel text-2xl font-bold gold-text leading-none">5+</div>
                    <div className="font-poppins text-xs text-muted-foreground mt-0.5">Years of Excellence</div>
                  </div>
                </div>
              </motion.div>
              {/* Secondary badge */}
              <motion.div className="absolute -top-8 -right-4 bg-[hsl(43,74%,49%)] rounded-2xl px-5 py-3 shadow-xl"
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-white text-white" />)}
                  <span className="font-poppins text-xs text-white font-semibold ml-1">4.9 Rating</span>
                </div>
              </motion.div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="space-y-7">
              <div>
                <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-[hsl(43,74%,49%)]">About Us</span>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-px w-10 bg-[hsl(43,74%,49%)]" />
                  <div className="h-px w-4 bg-[hsl(43,74%,70%)]" />
                </div>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
                Where Beauty Meets <span className="gold-text italic">Artistry</span>
              </h2>
              <p className="font-poppins text-base text-muted-foreground leading-[1.9]">
                {content?.aboutText || "We create confidence through beauty. Expert stylists, premium products, and unforgettable results that transform not just your look — but how you feel about yourself. Step into a world of elegance."}
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2">
                {[["Premium", "Products"], ["Expert", "Artists"], ["Personalized", "Care"]].map(([l1, l2], i) => (
                  <div key={i} className="text-center p-4 rounded-2xl border border-[rgba(184,142,40,0.2)] hover:border-[hsl(43,74%,49%)] transition-colors duration-300">
                    <div className="font-cinzel text-[hsl(43,74%,49%)] text-xs font-bold">{l1}</div>
                    <div className="font-poppins text-xs text-muted-foreground mt-0.5">{l2}</div>
                  </div>
                ))}
              </div>
              <Link href="/services">
                <motion.button className="mt-2 flex items-center gap-3 px-9 py-4 rounded-full font-montserrat text-sm font-bold tracking-[0.2em] uppercase text-white gold-shimmer shadow-lg"
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(184,142,40,0.35)" }} whileTap={{ scale: 0.97 }}>
                  Explore Services <ArrowRight size={15} />
                </motion.button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: "hsl(25,20%,8%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[hsl(43,74%,49%)] opacity-8 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-[hsl(43,74%,49%)] opacity-6 blur-3xl" />
          {/* Decorative lines */}
          <div className="absolute inset-y-0 left-1/4 w-px bg-gradient-to-b from-transparent via-[rgba(184,142,40,0.15)] to-transparent hidden md:block" />
          <div className="absolute inset-y-0 left-2/4 w-px bg-gradient-to-b from-transparent via-[rgba(184,142,40,0.15)] to-transparent hidden md:block" />
          <div className="absolute inset-y-0 left-3/4 w-px bg-gradient-to-b from-transparent via-[rgba(184,142,40,0.15)] to-transparent hidden md:block" />
        </div>
        <Particles count={25} />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-4">
            {(content?.stats || []).map((stat, i) => (
              <FadeIn key={i} delay={i * 0.12} className="text-center group">
                <div className="relative inline-block">
                  <div className="font-cinzel text-5xl md:text-6xl lg:text-7xl font-bold gold-text mb-3">
                    <Counter value={stat.value} />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[hsl(43,74%,49%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="font-poppins text-xs text-white/50 tracking-[0.3em] uppercase mt-2">{stat.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="py-28 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, hsl(42,30%,97%) 0%, hsl(40,45%,94%) 100%)" }}>
        <Particles count={15} />
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-20">
            <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-[hsl(43,74%,49%)]">Why Choose Us</span>
            <div className="flex items-center justify-center gap-3 mt-2 mb-7">
              <div className="h-px w-10 bg-[hsl(43,74%,49%)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(43,74%,49%)]" />
              <div className="h-px w-10 bg-[hsl(43,74%,49%)]" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              The <span className="gold-text italic">{content?.websiteName?.split(" ")[0] || "Lumière"}</span> Difference
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {(content?.whyChooseUs || []).map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <motion.div className="group relative bg-white rounded-3xl p-8 shadow-sm cursor-default overflow-hidden"
                  whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(184,142,40,0.12)" }}>
                  {/* Hover gold shimmer background */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                    style={{ background: "linear-gradient(135deg, rgba(184,142,40,0.03) 0%, rgba(184,142,40,0.06) 100%)" }} />
                  {/* Top accent line */}
                  <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-[hsl(43,74%,49%)] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <div className="relative w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-all duration-400 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg, hsl(43,74%,95%) 0%, hsl(43,50%,92%) 100%)" }}>
                    <div className="text-[hsl(43,74%,42%)] group-hover:text-[hsl(43,74%,35%)] transition-colors duration-300">
                      {iconMap[item.icon] || <Sparkles size={26} />}
                    </div>
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 gold-shimmer" />
                    <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      <div className="text-white">{iconMap[item.icon] || <Sparkles size={26} />}</div>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-[hsl(43,74%,35%)] transition-colors duration-300">{item.title}</h3>
                  <p className="font-poppins text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED SERVICES ═══ */}
      <section className="py-28 px-6 bg-background relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(43,74%,88%) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-20">
            <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-[hsl(43,74%,49%)]">Signature Offerings</span>
            <div className="flex items-center justify-center gap-3 mt-2 mb-7">
              <div className="h-px w-10 bg-[hsl(43,74%,49%)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(43,74%,49%)]" />
              <div className="h-px w-10 bg-[hsl(43,74%,49%)]" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              Featured <span className="gold-text italic">Services</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service, i) => (
              <FadeIn key={service.id || i} delay={i * 0.14}>
                <motion.div className="group bg-white rounded-3xl overflow-hidden shadow-sm relative"
                  whileHover={{ y: -8, boxShadow: "0 30px 80px rgba(184,142,40,0.15)" }}>
                  {/* Portrait image - tall */}
                  <div className="relative h-72 overflow-hidden">
                    <img src={service.imageUrl} alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 transition-opacity duration-500"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%)" }} />
                    {/* Category chip */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full backdrop-blur-md bg-black/30 border border-white/20 text-white text-xs font-poppins">
                      {service.category}
                    </div>
                    {/* Price overlay on image */}
                    <div className="absolute bottom-4 left-4">
                      <div className="font-cinzel text-2xl font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                        {service.price}
                      </div>
                    </div>
                    {/* Slide-up Book button on hover */}
                    <motion.div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
                      <Link href="/services">
                        <button className="w-full py-3 rounded-full font-montserrat text-xs font-bold tracking-[0.2em] uppercase text-white gold-shimmer shadow-xl">
                          Book This Service
                        </button>
                      </Link>
                    </motion.div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-[hsl(43,74%,40%)] transition-colors duration-300">{service.name}</h3>
                    <p className="font-poppins text-sm text-muted-foreground leading-relaxed line-clamp-2">{service.description}</p>
                    <div className="mt-4 pt-4 border-t border-[rgba(184,142,40,0.12)] flex items-center justify-between">
                      <span className="font-poppins text-xs text-muted-foreground">Duration</span>
                      <span className="font-cinzel text-sm font-bold text-[hsl(43,74%,42%)]">{service.duration}</span>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center mt-14">
            <Link href="/services">
              <motion.button className="px-12 py-4 rounded-full font-montserrat text-sm font-bold tracking-[0.2em] uppercase border-2 border-[hsl(43,74%,49%)] text-[hsl(43,74%,42%)] hover:text-white hover:bg-[hsl(43,74%,49%)] transition-all duration-400"
                whileHover={{ scale: 1.03 }}>
                View All Services
              </motion.button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ═══ TESTIMONIALS (DARK) ═══ */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: "hsl(25,20%,8%)" }}>
        <Particles count={20} />
        {/* Large decorative quotes */}
        <div className="absolute top-12 left-8 text-[hsl(43,74%,49%)] opacity-10 pointer-events-none">
          <Quote size={120} />
        </div>
        <div className="absolute bottom-12 right-8 text-[hsl(43,74%,49%)] opacity-10 rotate-180 pointer-events-none">
          <Quote size={120} />
        </div>

        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-20">
            <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-[hsl(43,74%,55%)]">Client Stories</span>
            <div className="flex items-center justify-center gap-3 mt-2 mb-7">
              <div className="h-px w-10 bg-[hsl(43,74%,49%)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(43,74%,49%)]" />
              <div className="h-px w-10 bg-[hsl(43,74%,49%)]" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">
              What Our <span className="gold-text italic">Clients Say</span>
            </h2>
          </FadeIn>

          {testimonials.length > 0 && (
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div key={testimonialIdx}
                  initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative rounded-3xl p-10 md:p-14 border border-[rgba(184,142,40,0.15)]"
                  style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)" }}>
                  {/* Gold quote mark */}
                  <div className="mb-8">
                    <Quote size={36} className="text-[hsl(43,74%,49%)]" />
                  </div>
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonials[testimonialIdx]?.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-[hsl(43,74%,49%)] text-[hsl(43,74%,49%)]" />
                    ))}
                  </div>
                  <blockquote className="font-serif text-2xl md:text-3xl italic text-white/90 leading-[1.65] mb-10">
                    "{testimonials[testimonialIdx]?.text}"
                  </blockquote>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full gold-shimmer flex items-center justify-center text-white font-bold font-cinzel text-xl flex-shrink-0">
                      {testimonials[testimonialIdx]?.name?.[0]}
                    </div>
                    <div>
                      <div className="font-cinzel text-base font-bold text-white">{testimonials[testimonialIdx]?.name}</div>
                      <div className="font-poppins text-sm text-[hsl(43,74%,55%)] mt-0.5">{testimonials[testimonialIdx]?.role}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-6 mt-10">
                <motion.button onClick={prev} className="w-12 h-12 rounded-full border border-[rgba(184,142,40,0.3)] flex items-center justify-center text-[hsl(43,74%,49%)] hover:bg-[rgba(184,142,40,0.1)] transition-colors duration-300"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <ChevronLeft size={20} />
                </motion.button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button key={i} onClick={() => setTestimonialIdx(i)}
                      className={`rounded-full transition-all duration-400 ${i === testimonialIdx ? "w-8 h-2 bg-[hsl(43,74%,49%)]" : "w-2 h-2 bg-white/25"}`} />
                  ))}
                </div>
                <motion.button onClick={next} className="w-12 h-12 rounded-full border border-[rgba(184,142,40,0.3)] flex items-center justify-center text-[hsl(43,74%,49%)] hover:bg-[rgba(184,142,40,0.1)] transition-colors duration-300"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ CTA STRIP ═══ */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, hsl(43,60%,92%) 0%, hsl(42,80%,88%) 30%, hsl(43,50%,92%) 60%, hsl(40,70%,90%) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-30"
            style={{ background: "radial-gradient(ellipse, hsl(43,74%,65%) 0%, transparent 70%)" }} />
        </div>
        <Particles count={15} />
        <div className="relative max-w-4xl mx-auto text-center">
          <FadeIn>
            <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase text-[hsl(43,74%,42%)]">Ready for a Transformation?</span>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-[hsl(25,20%,12%)] mt-4 mb-6 leading-tight">
              {content?.ctaText || "Book Your Glow Session Today"}
            </h2>
            <p className="font-poppins text-base text-[hsl(25,15%,35%)] mb-10 max-w-xl mx-auto leading-relaxed">
              Experience luxury beauty services tailored just for you. Call us or book online — we can't wait to meet you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/services">
                <motion.button className="px-12 py-4 rounded-full font-montserrat text-sm font-bold tracking-[0.2em] uppercase text-white gold-shimmer shadow-2xl"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(184,142,40,0.5)" }} whileTap={{ scale: 0.97 }}>
                  Book Now
                </motion.button>
              </Link>
              {content?.contactNumber && (
                <a href={`tel:${content.contactNumber}`}>
                  <motion.button className="px-12 py-4 rounded-full font-montserrat text-sm font-bold tracking-[0.2em] uppercase border-2 border-[hsl(43,74%,42%)] text-[hsl(43,74%,35%)] hover:bg-[hsl(43,74%,42%)] hover:text-white transition-all duration-400"
                    whileHover={{ scale: 1.05 }}>
                    {content.contactNumber}
                  </motion.button>
                </a>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer websiteName={content?.websiteName} contactNumber={content?.contactNumber}
        whatsappLink={content?.whatsappLink} instagramLink={content?.instagramLink} footerText={content?.footerText}
        address={content?.address} />
      <FloatingButtons whatsappLink={content?.whatsappLink} />
    </div>
  );
}
