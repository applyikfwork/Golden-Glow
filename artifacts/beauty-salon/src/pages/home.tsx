import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import {
  Award, Sparkles, Shield, Heart, Crown, Gem,
  Star, ArrowRight, ChevronLeft, ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { getSiteContent, getFeaturedServices, SiteContent, Service } from "@/lib/firebaseService";

const iconMap: Record<string, React.ReactNode> = {
  award: <Award size={28} />,
  sparkles: <Sparkles size={28} />,
  shield: <Shield size={28} />,
  heart: <Heart size={28} />,
  crown: <Crown size={28} />,
  gem: <Gem size={28} />,
};

// Animated counter
function Counter({ value, duration = 2000 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.]/g, "");
    if (isNaN(num)) { setDisplay(value); return; }

    const start = 0;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (num - start) * eased * 10) / 10;
      setDisplay(
        current % 1 === 0
          ? current.toFixed(0) + suffix
          : current.toFixed(1) + suffix
      );
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

// Scroll fade-in wrapper
function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Floating particles component
function Particles({ count = 20 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            background: "hsl(43,74%,49%)",
            opacity: 0.2 + Math.random() * 0.4,
            left: `${Math.random() * 100}%`,
            bottom: `-${Math.random() * 20}px`,
            animationDuration: `${6 + Math.random() * 8}s`,
            animationDelay: `${Math.random() * 6}s`,
            animation: `floatUp ${6 + Math.random() * 8}s ${Math.random() * 6}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

const heroImages = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=80",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&q=80",
];

export default function HomePage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [heroImg, setHeroImg] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    getSiteContent().then(setContent);
    getFeaturedServices().then((svcs) => {
      if (svcs.length === 0) {
        setFeaturedServices([
          { id: "1", name: "Luxury Bridal Makeup", description: "Complete bridal transformation with premium products.", price: "₹8,999", duration: "4 hours", category: "Bridal", imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80", featured: true },
          { id: "2", name: "Hair Styling & Treatment", description: "Professional styling and deep conditioning treatment.", price: "₹2,499", duration: "2 hours", category: "Hair", imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80", featured: true },
          { id: "3", name: "Luxury Facial", description: "Signature facial with premium skincare products.", price: "₹3,499", duration: "90 min", category: "Skin", imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", featured: true },
        ]);
      } else {
        setFeaturedServices(svcs.slice(0, 3));
      }
    });
  }, []);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImg((i) => (i + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!content?.testimonials?.length) return;
    const interval = setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % (content.testimonials?.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [content?.testimonials]);

  const heroTitle = content?.heroTitle || "Reveal Your True Beauty";
  const heroSubtitle = content?.heroSubtitle || "Luxury Hair, Skin & Bridal Care Experience";
  const currentHeroImage = content?.heroImage || heroImages[heroImg];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* === HERO === */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background image with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY }}
        >
          {heroImages.map((img, i) => (
            <motion.div
              key={img}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${content?.heroImage || img})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: heroImg === i && !content?.heroImage ? 1 : (content?.heroImage && i === 0 ? 1 : 0) }}
              transition={{ duration: 1.5 }}
            />
          ))}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </motion.div>

        <Particles count={25} />

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-6"
          >
            <span className="font-cinzel text-xs tracking-[0.5em] uppercase text-[hsl(43,74%,65%)] px-6 py-2 border border-[rgba(184,142,40,0.4)] rounded-full backdrop-blur-sm">
              Premium Beauty Experience
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6"
          >
            {heroTitle.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.15 }}
                className="inline-block mr-3"
              >
                {i === 1 ? <span className="gold-text">{word}</span> : word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="font-poppins text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto"
          >
            {heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link href="/services">
              <motion.button
                className="px-10 py-4 rounded-full font-montserrat text-sm font-semibold tracking-wider uppercase text-white gold-shimmer shadow-2xl"
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(184,142,40,0.6)" }}
                whileTap={{ scale: 0.98 }}
                data-testid="hero-explore-btn"
              >
                Explore Services
              </motion.button>
            </Link>
            <Link href="/gallery">
              <motion.button
                className="px-10 py-4 rounded-full font-montserrat text-sm font-semibold tracking-wider uppercase text-white border border-white/40 backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.98 }}
                data-testid="hero-gallery-btn"
              >
                View Gallery
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* === ABOUT === */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, hsl(43,74%,90%) 0%, transparent 70%)" }}
        />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                  alt="Salon"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Floating stat card */}
              <motion.div
                className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl border border-[rgba(184,142,40,0.2)]"
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gold-shimmer flex items-center justify-center">
                    <Crown className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-cinzel text-xl font-bold gold-text">5+</div>
                    <div className="font-poppins text-xs text-muted-foreground">Years of Excellence</div>
                  </div>
                </div>
              </motion.div>
              {/* Gold frame accent */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[hsl(43,74%,49%)] rounded-tl-2xl" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[hsl(43,74%,49%)] rounded-br-2xl opacity-50" />
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <div>
                <span className="font-cinzel text-xs tracking-[0.4em] uppercase text-[hsl(43,74%,49%)]">
                  About Us
                </span>
                <div className="w-12 h-px bg-[hsl(43,74%,49%)] mt-2" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
                Where Beauty Meets{" "}
                <span className="gold-text">Artistry</span>
              </h2>
              <p className="font-poppins text-base text-muted-foreground leading-relaxed">
                {content?.aboutText ||
                  "We create confidence through beauty. Expert stylists, premium products, and unforgettable results that transform not just your look — but how you feel about yourself."}
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                {["Premium Products", "Expert Artists", "Personalized Care"].map((tag) => (
                  <div key={tag} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[hsl(43,74%,49%)]" />
                    <span className="font-poppins text-sm font-medium">{tag}</span>
                  </div>
                ))}
              </div>
              <Link href="/services">
                <motion.button
                  className="mt-4 flex items-center gap-3 px-8 py-3.5 rounded-full font-montserrat text-sm font-semibold tracking-wider uppercase text-white gold-shimmer shadow-lg"
                  whileHover={{ gap: "16px", scale: 1.02 }}
                  data-testid="about-services-btn"
                >
                  Our Services <ArrowRight size={16} />
                </motion.button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* === WHY CHOOSE US === */}
      <section className="py-24 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(42,30%,95%) 0%, hsl(40,40%,97%) 100%)" }}>
        <Particles count={15} />
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="font-cinzel text-xs tracking-[0.4em] uppercase text-[hsl(43,74%,49%)]">
              Why Choose Us
            </span>
            <div className="w-12 h-px bg-[hsl(43,74%,49%)] mx-auto mt-2 mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              The <span className="gold-text">Lumière</span> Difference
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(content?.whyChooseUs || []).map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.div
                  className="group relative bg-white rounded-3xl p-8 shadow-sm hover-lift cursor-default border border-transparent"
                  whileHover={{ borderColor: "hsl(43,74%,49%)" }}
                  data-testid={`why-card-${i}`}
                >
                  <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-[hsl(43,74%,49%)] transition-all duration-300 group-hover:bg-[hsl(43,74%,49%)] group-hover:text-white"
                    style={{ background: "hsl(43,74%,95%)" }}>
                    {iconMap[item.icon] || <Sparkles size={28} />}
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-3">{item.title}</h3>
                  <p className="font-poppins text-sm text-muted-foreground leading-relaxed">{item.description}</p>

                  {/* Gold bottom accent */}
                  <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[hsl(43,74%,49%)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* === STATS === */}
      <section className="py-20 px-6 relative overflow-hidden bg-[hsl(25,20%,10%)]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[hsl(43,74%,49%)] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[hsl(43,74%,49%)] blur-3xl" />
        </div>
        <Particles count={20} />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {(content?.stats || []).map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1} className="text-center">
                <div className="font-serif text-5xl md:text-6xl font-bold mb-3 gold-text">
                  <Counter value={stat.value} />
                </div>
                <div className="font-poppins text-sm text-white/60 tracking-widest uppercase">{stat.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* === FEATURED SERVICES === */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="font-cinzel text-xs tracking-[0.4em] uppercase text-[hsl(43,74%,49%)]">
              Our Signature Services
            </span>
            <div className="w-12 h-px bg-[hsl(43,74%,49%)] mx-auto mt-2 mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              Featured <span className="gold-text">Services</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service, i) => (
              <FadeIn key={service.id || i} delay={i * 0.15}>
                <motion.div
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover-lift border border-transparent"
                  whileHover={{ borderColor: "hsl(43,74%,80%)" }}
                  data-testid={`featured-service-${i}`}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass text-white text-xs font-poppins font-medium">
                      {service.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold mb-2">{service.name}</h3>
                    <p className="font-poppins text-sm text-muted-foreground mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-cinzel text-xl font-bold gold-text">{service.price}</span>
                      <span className="font-poppins text-xs text-muted-foreground">{service.duration}</span>
                    </div>
                    <Link href="/services">
                      <motion.button
                        className="w-full py-3 rounded-full font-montserrat text-sm font-semibold tracking-wider uppercase text-white gold-shimmer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        data-testid={`service-book-btn-${i}`}
                      >
                        Book Now
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center mt-12">
            <Link href="/services">
              <motion.button
                className="px-10 py-4 rounded-full font-montserrat text-sm font-semibold tracking-wider uppercase border-2 border-[hsl(43,74%,49%)] text-[hsl(43,74%,49%)] hover:text-white hover:bg-[hsl(43,74%,49%)] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                data-testid="view-all-services-btn"
              >
                View All Services
              </motion.button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="py-24 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(42,30%,95%) 0%, hsl(40,50%,97%) 100%)" }}>
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, hsl(43,74%,85%) 0%, transparent 70%)" }} />

        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="font-cinzel text-xs tracking-[0.4em] uppercase text-[hsl(43,74%,49%)]">
              Client Stories
            </span>
            <div className="w-12 h-px bg-[hsl(43,74%,49%)] mx-auto mt-2 mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
              What Our <span className="gold-text">Clients Say</span>
            </h2>
          </FadeIn>

          {content?.testimonials && content.testimonials.length > 0 && (
            <div className="relative">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-10 shadow-xl border border-[rgba(184,142,40,0.15)]"
                data-testid="testimonial-card"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(content.testimonials[testimonialIdx]?.rating || 5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-[hsl(43,74%,49%)] text-[hsl(43,74%,49%)]" />
                  ))}
                </div>
                <blockquote className="font-serif text-xl md:text-2xl italic text-foreground leading-relaxed mb-8">
                  "{content.testimonials[testimonialIdx]?.text}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gold-shimmer flex items-center justify-center text-white font-bold font-serif text-lg">
                    {content.testimonials[testimonialIdx]?.name[0]}
                  </div>
                  <div>
                    <div className="font-serif text-base font-bold">{content.testimonials[testimonialIdx]?.name}</div>
                    <div className="font-poppins text-xs text-[hsl(43,74%,49%)]">{content.testimonials[testimonialIdx]?.role}</div>
                  </div>
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setTestimonialIdx((i) => (i - 1 + (content.testimonials?.length || 1)) % (content.testimonials?.length || 1))}
                  className="w-10 h-10 rounded-full border border-[rgba(184,142,40,0.4)] flex items-center justify-center text-[hsl(43,74%,49%)] hover:bg-[hsl(43,74%,49%)] hover:text-white transition-all"
                  data-testid="testimonial-prev"
                >
                  <ChevronLeft size={18} />
                </button>
                {content.testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIdx(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === testimonialIdx ? "bg-[hsl(43,74%,49%)] w-6" : "bg-[hsl(43,74%,80%)]"}`}
                    data-testid={`testimonial-dot-${i}`}
                  />
                ))}
                <button
                  onClick={() => setTestimonialIdx((i) => (i + 1) % (content.testimonials?.length || 1))}
                  className="w-10 h-10 rounded-full border border-[rgba(184,142,40,0.4)] flex items-center justify-center text-[hsl(43,74%,49%)] hover:bg-[hsl(43,74%,49%)] hover:text-white transition-all"
                  data-testid="testimonial-next"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* === CTA BANNER === */}
      <section className="py-24 px-6 relative overflow-hidden bg-[hsl(25,20%,10%)]">
        <Particles count={30} />
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=60)", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="absolute inset-0 bg-[hsl(25,20%,10%)]/80" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <FadeIn>
            <div className="font-cinzel text-xs tracking-[0.5em] uppercase text-[hsl(43,74%,55%)] mb-6">
              Limited Slots Available
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
              {content?.ctaText || "Book Your Glow Session Today"}
            </h2>
            <p className="font-poppins text-white/70 text-lg mb-10">
              Step into luxury. Walk out radiant. Book your exclusive beauty session now.
            </p>
            <motion.a
              href={content?.whatsappLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-12 py-5 rounded-full font-montserrat text-base font-bold tracking-widest uppercase text-white gold-shimmer shadow-2xl gold-glow"
              whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(184,142,40,0.7)" }}
              whileTap={{ scale: 0.98 }}
              data-testid="cta-book-btn"
            >
              Book Now →
            </motion.a>
          </FadeIn>
        </div>
      </section>

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
