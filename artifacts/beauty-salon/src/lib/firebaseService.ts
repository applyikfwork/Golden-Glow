import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";

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
  createdAt?: unknown;
}

export interface GalleryItem {
  id?: string;
  imageUrl: string;
  title: string;
  text: string;
  category: string;
  createdAt?: unknown;
}

export interface PageSEOSettings {
  title?: string;
  description?: string;
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
  seoHome?: PageSEOSettings;
  seoServices?: PageSEOSettings;
  seoGallery?: PageSEOSettings;
  seoExperience?: PageSEOSettings;
  seoLookbook?: PageSEOSettings;
  seoMetaKeywords?: string;
  seoOgImage?: string;
  seoBusinessName?: string;
  seoBusinessPhone?: string;
  seoBusinessCity?: string;
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

// ===== SERVICES =====

export async function getServices(): Promise<Service[]> {
  const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
}

export async function getFeaturedServices(): Promise<Service[]> {
  const q = query(
    collection(db, "services"),
    where("featured", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
}

export async function addService(
  service: Omit<Service, "id" | "createdAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, "services"), {
    ...service,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateService(
  id: string,
  service: Partial<Service>
): Promise<void> {
  await updateDoc(doc(db, "services", id), service);
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, "services", id));
}

// ===== GALLERY =====

export async function getGallery(): Promise<GalleryItem[]> {
  const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem));
}

export async function addGalleryItem(
  item: Omit<GalleryItem, "id" | "createdAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, "gallery"), {
    ...item,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateGalleryItem(
  id: string,
  item: Partial<GalleryItem>
): Promise<void> {
  await updateDoc(doc(db, "gallery", id), item);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await deleteDoc(doc(db, "gallery", id));
}

// ===== SITE CONTENT =====

const CONTENT_DOC = "siteContent";

export async function getSiteContent(): Promise<SiteContent> {
  const docRef = doc(db, "siteContent", CONTENT_DOC);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as SiteContent;
  }
  return getDefaultContent();
}

export async function updateSiteContent(
  content: Partial<SiteContent>
): Promise<void> {
  const docRef = doc(db, "siteContent", CONTENT_DOC);
  await setDoc(docRef, content, { merge: true });
}

// ===== IMAGE UPLOAD =====

export async function uploadImage(
  file: File,
  folder: "services" | "gallery" | "hero"
): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // ignore if already deleted
  }
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
      {
        icon: "award",
        title: "Certified Experts",
        description: "Our artists are trained at top institutions worldwide.",
      },
      {
        icon: "sparkles",
        title: "Premium Products",
        description: "Only the finest international brands for your skin & hair.",
      },
      {
        icon: "shield",
        title: "Hygienic Care",
        description: "Hospital-grade sanitization protocols for every service.",
      },
      {
        icon: "heart",
        title: "Personalized Styling",
        description: "Every look is crafted uniquely for you.",
      },
      {
        icon: "crown",
        title: "Bridal Specialists",
        description: "Make your special day truly unforgettable.",
      },
      {
        icon: "gem",
        title: "Affordable Luxury",
        description: "Premium quality without the premium price tag.",
      },
    ],
    stats: [
      { value: "500+", label: "Happy Clients" },
      { value: "1200+", label: "Services Done" },
      { value: "5", label: "Years Experience" },
      { value: "4.9", label: "Star Rating" },
    ],
    testimonials: [
      {
        name: "Priya Sharma",
        role: "Bride",
        text: "The bridal package was absolutely stunning. Every detail was perfect and I felt like royalty on my wedding day. Truly a luxury experience!",
        rating: 5,
      },
      {
        name: "Ananya Patel",
        role: "Regular Client",
        text: "I've been coming here for 2 years and I'm always blown away. The team understands exactly what I want and delivers perfection every time.",
        rating: 5,
      },
      {
        name: "Meera Kapoor",
        role: "Hair Treatment",
        text: "My hair has never felt this healthy and beautiful! The treatment they recommended was life-changing. Highly recommend to everyone.",
        rating: 5,
      },
    ],
    ctaText: "Book Your Glow Session Today",
    websiteName: "Lumière Beauty",
    contactNumber: "+91 98765 43210",
    whatsappLink: "https://wa.me/919876543210",
    instagramLink: "https://instagram.com",
    footerText:
      "© 2024 Lumière Beauty. Crafted with love for elegance and confidence.",
  };
}
