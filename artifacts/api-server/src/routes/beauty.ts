import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const DATA_FILE = path.resolve(process.cwd(), "data/beauty.json");

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  imageUrl: string;
  featured: boolean;
  createdAt: number;
}

interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  text: string;
  category: string;
  createdAt: number;
}

interface SiteContent {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  aboutText?: string;
  whyChooseUs?: { icon: string; title: string; description: string }[];
  stats?: { value: string; label: string }[];
  testimonials?: { name: string; role: string; text: string; rating: number; avatar?: string }[];
  ctaText?: string;
  websiteName?: string;
  contactNumber?: string;
  whatsappLink?: string;
  instagramLink?: string;
  footerText?: string;
}

interface DB {
  services: Service[];
  gallery: GalleryItem[];
  content: SiteContent;
}

function readDB(): DB {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { services: [], gallery: [], content: {} };
  }
}

function writeDB(db: DB): void {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf-8");
}

function defaultContent(): SiteContent {
  return {
    heroTitle: "Reveal Your True Beauty",
    heroSubtitle: "Luxury Hair, Skin & Bridal Care Experience",
    heroImage: "",
    aboutText:
      "We create confidence through beauty. Expert stylists, premium products, and unforgettable results that transform not just your look — but how you feel about yourself. Step into a world of elegance and let us craft your signature style.",
    whyChooseUs: [
      { icon: "award", title: "Certified Experts", description: "Our artists are trained at top institutions worldwide." },
      { icon: "sparkles", title: "Premium Products", description: "Only the finest international brands for your skin & hair." },
      { icon: "shield", title: "Hygienic Care", description: "Hospital-grade sanitization protocols for every service." },
      { icon: "heart", title: "Personalized Styling", description: "Every look is crafted uniquely for you." },
      { icon: "crown", title: "Bridal Specialists", description: "Make your special day truly unforgettable." },
      { icon: "gem", title: "Affordable Luxury", description: "Premium quality without the premium price tag." },
    ],
    stats: [
      { value: "500+", label: "Happy Clients" },
      { value: "1200+", label: "Services Done" },
      { value: "5", label: "Years Experience" },
      { value: "4.9", label: "Star Rating" },
    ],
    testimonials: [
      { name: "Priya Sharma", role: "Bride", text: "The bridal package was absolutely stunning. Every detail was perfect and I felt like royalty on my wedding day. Truly a luxury experience!", rating: 5 },
      { name: "Ananya Patel", role: "Regular Client", text: "I've been coming here for 2 years and I'm always blown away. The team understands exactly what I want and delivers perfection every time.", rating: 5 },
      { name: "Meera Kapoor", role: "Hair Treatment", text: "My hair has never felt this healthy and beautiful! The treatment they recommended was life-changing. Highly recommend to everyone.", rating: 5 },
    ],
    ctaText: "Book Your Glow Session Today",
    websiteName: "Lumière Beauty",
    contactNumber: "+91 98765 43210",
    whatsappLink: "https://wa.me/919876543210",
    instagramLink: "https://instagram.com",
    footerText: "© 2024 Lumière Beauty. Crafted with love for elegance and confidence.",
  };
}

function defaultServices(): Service[] {
  return [
    { id: "s1", name: "Luxury Bridal Makeup", description: "Complete bridal transformation with premium international products and airbrush finish.", price: "₹8,999", duration: "4 hours", category: "Bridal", imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80", featured: true, createdAt: Date.now() - 6000 },
    { id: "s2", name: "Hair Styling & Treatment", description: "Professional styling and deep conditioning treatment for gorgeous, healthy hair.", price: "₹2,499", duration: "2 hours", category: "Hair", imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80", featured: true, createdAt: Date.now() - 5000 },
    { id: "s3", name: "Luxury Facial", description: "Signature facial with premium skincare and advanced techniques for glowing skin.", price: "₹3,499", duration: "90 min", category: "Skin", imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", featured: true, createdAt: Date.now() - 4000 },
    { id: "s4", name: "Nail Art & Extensions", description: "Intricate nail art designs with premium gel and acrylic extensions that last.", price: "₹1,499", duration: "2 hours", category: "Nails", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80", featured: false, createdAt: Date.now() - 3000 },
    { id: "s5", name: "Balayage & Highlights", description: "Sun-kissed balayage and natural highlights by our expert colorists using Loreal & Schwarzkopf.", price: "₹4,999", duration: "3 hours", category: "Hair", imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", featured: false, createdAt: Date.now() - 2000 },
    { id: "s6", name: "Aromatherapy Spa", description: "Full body aromatherapy massage with essential oils for deep relaxation and rejuvenation.", price: "₹2,999", duration: "90 min", category: "Spa", imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80", featured: false, createdAt: Date.now() - 1000 },
  ];
}

function defaultGallery(): GalleryItem[] {
  return [
    { id: "g1", imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80", title: "Bridal Glam", text: "Full bridal transformation", category: "Bridal", createdAt: Date.now() - 6000 },
    { id: "g2", imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80", title: "Hair Magic", text: "Stunning hair makeover", category: "Hair", createdAt: Date.now() - 5000 },
    { id: "g3", imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80", title: "Glowing Skin", text: "Luxury facial results", category: "Skin", createdAt: Date.now() - 4000 },
    { id: "g4", imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80", title: "Color Dreams", text: "Beautiful balayage", category: "Hair", createdAt: Date.now() - 3500 },
    { id: "g5", imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80", title: "Nail Art", text: "Intricate nail designs", category: "Nails", createdAt: Date.now() - 3000 },
    { id: "g6", imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80", title: "Makeup Artistry", text: "Editorial makeup look", category: "Makeup", createdAt: Date.now() - 2500 },
    { id: "g7", imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", title: "Spa Serenity", text: "Relaxation and rejuvenation", category: "Skin", createdAt: Date.now() - 2000 },
    { id: "g8", imageUrl: "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=800&q=80", title: "Bridal Party", text: "Full wedding party styling", category: "Bridal", createdAt: Date.now() - 1500 },
  ];
}

function ensureDefaults(db: DB): DB {
  if (!db.content || Object.keys(db.content).length === 0) {
    db.content = defaultContent();
  }
  if (!db.services || db.services.length === 0) {
    db.services = defaultServices();
  }
  if (!db.gallery || db.gallery.length === 0) {
    db.gallery = defaultGallery();
  }
  return db;
}

// ===== SERVICES =====

router.get("/beauty/services", (_req, res) => {
  const db = ensureDefaults(readDB());
  writeDB(db);
  res.json(db.services.sort((a, b) => b.createdAt - a.createdAt));
});

router.post("/beauty/services", (req, res) => {
  const db = ensureDefaults(readDB());
  const service: Service = {
    ...req.body,
    id: `s${Date.now()}`,
    createdAt: Date.now(),
  };
  db.services.unshift(service);
  writeDB(db);
  res.json(service);
});

router.put("/beauty/services/:id", (req, res) => {
  const db = ensureDefaults(readDB());
  const idx = db.services.findIndex((s) => s.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  db.services[idx] = { ...db.services[idx], ...req.body, id: req.params.id };
  writeDB(db);
  res.json(db.services[idx]);
});

router.delete("/beauty/services/:id", (req, res) => {
  const db = ensureDefaults(readDB());
  db.services = db.services.filter((s) => s.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// ===== GALLERY =====

router.get("/beauty/gallery", (_req, res) => {
  const db = ensureDefaults(readDB());
  writeDB(db);
  res.json(db.gallery.sort((a, b) => b.createdAt - a.createdAt));
});

router.post("/beauty/gallery", (req, res) => {
  const db = ensureDefaults(readDB());
  const item: GalleryItem = {
    ...req.body,
    id: `g${Date.now()}`,
    createdAt: Date.now(),
  };
  db.gallery.unshift(item);
  writeDB(db);
  res.json(item);
});

router.put("/beauty/gallery/:id", (req, res) => {
  const db = ensureDefaults(readDB());
  const idx = db.gallery.findIndex((g) => g.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  db.gallery[idx] = { ...db.gallery[idx], ...req.body, id: req.params.id };
  writeDB(db);
  res.json(db.gallery[idx]);
});

router.delete("/beauty/gallery/:id", (req, res) => {
  const db = ensureDefaults(readDB());
  db.gallery = db.gallery.filter((g) => g.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// ===== CONTENT =====

router.get("/beauty/content", (_req, res) => {
  const db = ensureDefaults(readDB());
  writeDB(db);
  res.json(db.content);
});

router.put("/beauty/content", (req, res) => {
  const db = ensureDefaults(readDB());
  db.content = { ...db.content, ...req.body };
  writeDB(db);
  res.json(db.content);
});

// ===== IMAGE UPLOAD (base64 → stored as data URL) =====

router.post("/beauty/upload", (req, res) => {
  const { base64, mimeType } = req.body as { base64: string; mimeType: string };
  if (!base64 || !mimeType) {
    res.status(400).json({ error: "base64 and mimeType required" });
    return;
  }
  const dataUrl = `data:${mimeType};base64,${base64}`;
  res.json({ url: dataUrl });
});

export default router;
