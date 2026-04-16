import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Clock, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { getServices, getSiteContent, Service, SiteContent } from "@/lib/apiService";

const categories = ["All", "Hair", "Makeup", "Skin", "Nails", "Bridal", "Spa"];

const DEMO_SERVICES: Service[] = [
  { id: "d1", name: "Luxury Bridal Makeup", description: "Complete bridal transformation — head to toe — using the finest international brands for your most important day.", price: "₹8,999", duration: "4 hours", category: "Bridal", imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80", featured: true },
  { id: "d2", name: "Hair Styling & Blowout", description: "Expert styling with precision cuts, premium blowouts, and finishing for a salon-perfect look.", price: "₹1,499", duration: "1.5 hours", category: "Hair", imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80", featured: true },
  { id: "d3", name: "Luxury Facial", description: "Deep-cleansing signature facial with premium skincare serums, massage, and hydration mask.", price: "₹3,499", duration: "90 min", category: "Skin", imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", featured: true },
  { id: "d4", name: "Gel Nail Art", description: "Creative nail art with long-lasting gel polish in hundreds of colors and intricate designs.", price: "₹799", duration: "1 hour", category: "Nails", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80", featured: false },
  { id: "d5", name: "Keratin Hair Treatment", description: "Professional keratin smoothing treatment for frizz-free, glossy hair that lasts 3-6 months.", price: "₹4,999", duration: "3 hours", category: "Hair", imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80", featured: false },
  { id: "d6", name: "Aromatherapy Spa", description: "Full-body relaxation with hot stone massage, essential oil therapy, and premium body wraps.", price: "₹5,499", duration: "2.5 hours", category: "Spa", imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80", featured: false },
  { id: "d7", name: "Engagement Makeup", description: "Radiant, photo-ready makeup perfect for engagements, parties, and special events.", price: "₹3,999", duration: "2 hours", category: "Makeup", imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", featured: false },
  { id: "d8", name: "Gold Facial", description: "Anti-aging 24K gold leaf facial that brightens, tightens, and rejuvenates your skin.", price: "₹5,999", duration: "1.5 hours", category: "Skin", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", featured: false },
  { id: "d9", name: "Bridal Henna Design", description: "Intricate bridal mehndi with premium dark-staining henna and traditional/modern patterns.", price: "₹2,999", duration: "3 hours", category: "Bridal", imageUrl: "https://images.unsplash.com/photo-1583194818764-b8f50e3d9fc0?w=600&q=80", featured: false },
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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getServices(), getSiteContent()])
      .then(([svcs, cnt]) => {
        setServices(svcs.length > 0 ? svcs : DEMO_SERVICES);
        setContent(cnt);
        setLoading(false);
      })
      .catch(() => {
        setServices(DEMO_SERVICES);
        setLoading(false);
      });
  }, []);

  const filtered = services.filter((s) => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero banner */}
      <div className="relative h-72 md:h-96 flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=70)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="font-cinzel text-xs tracking-[0.5em] uppercase text-[hsl(43,74%,65%)]">
            Our Offerings
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mt-3 mb-4">
            Luxury <span className="gold-text">Services</span>
          </h1>
          <p className="font-poppins text-white/70 text-base md:text-lg max-w-xl mx-auto">
            Every service crafted with precision, passion, and premium products.
          </p>
        </motion.div>
      </div>

      {/* Filters + search */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-10">
          {/* Category filters */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-poppins text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "text-white gold-shimmer shadow-md"
                    : "bg-white border border-[rgba(184,142,40,0.3)] text-[hsl(25,15%,30%)] hover:border-[hsl(43,74%,49%)]"
                }`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                data-testid={`filter-${cat}`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-[rgba(184,142,40,0.3)] bg-white font-poppins text-sm outline-none focus:border-[hsl(43,74%,49%)] focus:shadow-[0_0_0_3px_rgba(184,142,40,0.1)] transition-all"
              data-testid="service-search"
            />
          </div>
        </div>

        {/* Service grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                <div className="h-56 bg-[hsl(40,30%,88%)]" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-[hsl(40,30%,88%)] rounded-full w-2/3" />
                  <div className="h-3 bg-[hsl(40,30%,88%)] rounded-full" />
                  <div className="h-3 bg-[hsl(40,30%,88%)] rounded-full w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="font-serif text-2xl text-muted-foreground mb-2">No services found</div>
            <p className="font-poppins text-sm text-muted-foreground">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((service, i) => (
              <FadeIn key={service.id || i} delay={Math.min(i * 0.08, 0.4)}>
                <motion.div
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover-lift border border-transparent"
                  whileHover={{ borderColor: "rgba(184,142,40,0.4)" }}
                  data-testid={`service-card-${service.id}`}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={service.imageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80"}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full glass text-white text-xs font-poppins font-medium">
                      <Tag size={10} className="inline mr-1" />{service.category}
                    </div>
                    {service.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[hsl(43,74%,49%)] text-white text-xs font-poppins font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold mb-2 group-hover:text-[hsl(43,74%,42%)] transition-colors">
                      {service.name}
                    </h3>
                    <p className="font-poppins text-sm text-muted-foreground mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-cinzel text-xl font-bold gold-text">{service.price}</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock size={14} />
                        <span className="font-poppins text-xs">{service.duration}</span>
                      </div>
                    </div>
                    <motion.button
                      className="w-full py-3 rounded-full font-montserrat text-sm font-semibold tracking-wider uppercase text-white gold-shimmer shadow-md"
                      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(184,142,40,0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      data-testid={`book-service-${service.id}`}
                    >
                      Book Now
                    </motion.button>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>

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
