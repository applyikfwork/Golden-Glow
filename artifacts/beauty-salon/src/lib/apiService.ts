// ===== TYPES =====

export interface Service {
  id?: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  imageUrl: string;
  featured: boolean;
  createdAt?: number;
}

export interface GalleryItem {
  id?: string;
  imageUrl: string;
  title: string;
  text: string;
  category: string;
  createdAt?: number;
}

export interface SiteContent {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  aboutText?: string;
  whyChooseUs?: WhyChooseItem[];
  stats?: StatItem[];
  testimonials?: Testimonial[];
  ctaText?: string;
  websiteName?: string;
  contactNumber?: string;
  whatsappLink?: string;
  instagramLink?: string;
  footerText?: string;
}

export interface WhyChooseItem {
  icon: string;
  title: string;
  description: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar?: string;
}

const BASE = "/api/beauty";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
}

// ===== SERVICES =====

export async function getServices(): Promise<Service[]> {
  return get<Service[]>("/services");
}

export async function getFeaturedServices(): Promise<Service[]> {
  const all = await getServices();
  return all.filter((s) => s.featured);
}

export async function addService(service: Omit<Service, "id" | "createdAt">): Promise<string> {
  const created = await post<Service>("/services", service);
  return created.id ?? "";
}

export async function updateService(id: string, service: Partial<Service>): Promise<void> {
  await put(`/services/${id}`, service);
}

export async function deleteService(id: string): Promise<void> {
  await del(`/services/${id}`);
}

// ===== GALLERY =====

export async function getGallery(): Promise<GalleryItem[]> {
  return get<GalleryItem[]>("/gallery");
}

export async function addGalleryItem(item: Omit<GalleryItem, "id" | "createdAt">): Promise<string> {
  const created = await post<GalleryItem>("/gallery", item);
  return created.id ?? "";
}

export async function updateGalleryItem(id: string, item: Partial<GalleryItem>): Promise<void> {
  await put(`/gallery/${id}`, item);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await del(`/gallery/${id}`);
}

// ===== SITE CONTENT =====

export async function getSiteContent(): Promise<SiteContent> {
  return get<SiteContent>("/content");
}

export async function updateSiteContent(content: Partial<SiteContent>): Promise<void> {
  await put("/content", content);
}

// ===== IMAGE UPLOAD =====

export async function uploadImage(file: File, _folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        const mimeType = file.type;
        const res = await post<{ url: string }>("/upload", { base64, mimeType });
        resolve(res.url);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// ===== DEFAULTS =====

export function getDefaultContent(): SiteContent {
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
