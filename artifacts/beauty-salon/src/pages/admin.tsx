import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Scissors, Image, Settings, LogOut,
  Plus, Edit, Trash2, Eye, EyeOff, Upload, Save, X,
  Users, Star, TrendingUp, Lock, Crown,
} from "lucide-react";
import {
  getSiteContent, updateSiteContent, getServices, addService, updateService, deleteService,
  getGallery, addGalleryItem, updateGalleryItem, deleteGalleryItem,
  uploadImage, SiteContent, Service, GalleryItem, getDefaultContent,
} from "@/lib/firebaseService";

const ADMIN_PASSWORD = "12345678";
const SESSION_KEY = "beauty_admin_session";

const categories = ["Hair", "Makeup", "Skin", "Nails", "Bridal", "Spa"];
const galleryCategories = ["Bridal", "Hair", "Makeup", "Nails", "Skin"];

// ===== LOGIN =====
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, "true");
        onLogin();
      } else {
        setError("Wrong Password. Please try again.");
        setLoading(false);
        setPassword("");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, hsl(25,20%,8%) 0%, hsl(25,25%,12%) 100%)" }}>
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute rounded-full opacity-20"
          style={{
            width: `${2 + Math.random() * 3}px`, height: `${2 + Math.random() * 3}px`,
            background: "hsl(43,74%,49%)",
            left: `${Math.random() * 100}%`, bottom: `${Math.random() * 100}%`,
            animation: `floatUp ${6 + Math.random() * 6}s ${Math.random() * 6}s linear infinite`,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-full max-w-md mx-4"
      >
        {/* Gold glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[hsl(43,74%,40%)] to-[hsl(43,74%,65%)] rounded-3xl blur-sm opacity-30" />

        <div className="relative rounded-3xl p-10 border border-[rgba(184,142,40,0.3)]"
          style={{ background: "rgba(30,20,10,0.9)", backdropFilter: "blur(20px)" }}>
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full gold-shimmer flex items-center justify-center mx-auto mb-4 shadow-2xl gold-glow">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="font-cinzel text-2xl font-bold tracking-widest gold-text">Admin Panel</h1>
            <p className="font-poppins text-xs text-[hsl(40,15%,50%)] mt-2 tracking-widest uppercase">
              Lumière Beauty Management
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label className="block font-poppins text-xs text-[hsl(43,50%,60%)] mb-2 tracking-wider uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter admin password"
                  className="admin-input pr-12"
                  data-testid="admin-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(40,15%,50%)] hover:text-[hsl(43,74%,55%)] transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="font-poppins text-sm text-red-400 text-center"
                  data-testid="admin-error"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading || !password}
              className="w-full py-4 rounded-full font-montserrat text-sm font-bold tracking-widest uppercase text-white gold-shimmer shadow-xl disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="admin-login-btn"
            >
              {loading ? "Authenticating..." : "Enter Panel"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ===== DASHBOARD OVERVIEW =====
function DashboardOverview({ services, gallery }: { services: Service[]; gallery: GalleryItem[] }) {
  const stats = [
    { icon: <Scissors size={20} />, label: "Total Services", value: services.length, color: "hsl(43,74%,49%)" },
    { icon: <Image size={20} />, label: "Gallery Items", value: gallery.length, color: "hsl(200,70%,55%)" },
    { icon: <Star size={20} />, label: "Featured", value: services.filter((s) => s.featured).length, color: "hsl(280,60%,60%)" },
    { icon: <TrendingUp size={20} />, label: "Categories", value: new Set(services.map((s) => s.category)).size, color: "hsl(150,60%,45%)" },
  ];

  return (
    <div className="space-y-8">
      <h2 className="font-cinzel text-xl font-bold gold-text">Dashboard Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-6 border border-[rgba(184,142,40,0.15)]"
            style={{ background: "rgba(255,255,255,0.04)" }}
            data-testid={`dashboard-stat-${i}`}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="font-serif text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="font-poppins text-xs text-[hsl(40,15%,55%)]">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl p-6 border border-[rgba(184,142,40,0.15)]"
        style={{ background: "rgba(255,255,255,0.04)" }}>
        <h3 className="font-cinzel text-base font-bold text-[hsl(43,74%,55%)] mb-4">Quick Actions</h3>
        <p className="font-poppins text-sm text-[hsl(40,20%,60%)] leading-relaxed">
          Use the sidebar to manage your salon's content. Changes made here will instantly appear on your public website.
          Add services, upload gallery images, edit homepage content, and update site settings all from this dashboard.
        </p>
      </div>
    </div>
  );
}

// ===== HOME CONTENT EDITOR =====
function HomeEditor({ content, onSave }: { content: SiteContent; onSave: (c: SiteContent) => void }) {
  const [form, setForm] = useState<SiteContent>(content);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);

  const handleSave = async () => {
    setSaving(true);
    let updatedForm = { ...form };
    if (heroFile) {
      const url = await uploadImage(heroFile, "hero");
      updatedForm = { ...updatedForm, heroImage: url };
    }
    await updateSiteContent(updatedForm);
    onSave(updatedForm);
    setForm(updatedForm);
    setHeroFile(null);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateStat = (i: number, field: "value" | "label", val: string) => {
    const stats = [...(form.stats || [])];
    stats[i] = { ...stats[i], [field]: val };
    setForm({ ...form, stats });
  };

  const updateTestimonial = (i: number, field: string, val: string | number) => {
    const testimonials = [...(form.testimonials || [])];
    testimonials[i] = { ...testimonials[i], [field]: val };
    setForm({ ...form, testimonials });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-cinzel text-xl font-bold gold-text">Home Page Control</h2>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full font-poppins text-sm font-semibold text-white gold-shimmer disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          data-testid="save-home-btn"
        >
          <Save size={16} />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </motion.button>
      </div>

      <div className="space-y-6">
        {/* Hero */}
        <Section title="Hero Section">
          <Field label="Hero Title">
            <input value={form.heroTitle || ""} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
              className="admin-input" data-testid="hero-title-input" />
          </Field>
          <Field label="Hero Subtitle">
            <input value={form.heroSubtitle || ""} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              className="admin-input" data-testid="hero-subtitle-input" />
          </Field>
          <Field label="Hero Background Image">
            <div className="space-y-3">
              {(form.heroImage || heroFile) && (
                <img src={heroFile ? URL.createObjectURL(heroFile) : form.heroImage}
                  alt="Hero preview" className="w-full h-40 object-cover rounded-xl opacity-80" />
              )}
              <input type="file" accept="image/*" onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                className="admin-input cursor-pointer" data-testid="hero-image-input" />
              {form.heroImage && (
                <input value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                  placeholder="Or paste image URL" className="admin-input" />
              )}
            </div>
          </Field>
        </Section>

        {/* About */}
        <Section title="About Section">
          <Field label="About Text">
            <textarea value={form.aboutText || ""} onChange={(e) => setForm({ ...form, aboutText: e.target.value })}
              rows={4} className="admin-input resize-none" data-testid="about-text-input" />
          </Field>
        </Section>

        {/* Stats */}
        <Section title="Stats / Counters">
          <div className="grid grid-cols-2 gap-4">
            {(form.stats || []).map((stat, i) => (
              <div key={i} className="space-y-2">
                <input value={stat.value} onChange={(e) => updateStat(i, "value", e.target.value)}
                  placeholder="Value (e.g. 500+)" className="admin-input text-sm"
                  data-testid={`stat-value-${i}`} />
                <input value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)}
                  placeholder="Label" className="admin-input text-sm"
                  data-testid={`stat-label-${i}`} />
              </div>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <Section title="CTA Banner">
          <Field label="CTA Text">
            <input value={form.ctaText || ""} onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
              className="admin-input" data-testid="cta-text-input" />
          </Field>
        </Section>

        {/* Testimonials */}
        <Section title="Testimonials">
          {(form.testimonials || []).map((t, i) => (
            <div key={i} className="border border-[rgba(184,142,40,0.2)] rounded-xl p-4 space-y-3">
              <div className="font-poppins text-xs text-[hsl(43,50%,60%)] mb-2">Testimonial #{i + 1}</div>
              <input value={t.name} onChange={(e) => updateTestimonial(i, "name", e.target.value)}
                placeholder="Client Name" className="admin-input text-sm" />
              <input value={t.role} onChange={(e) => updateTestimonial(i, "role", e.target.value)}
                placeholder="Role / Service" className="admin-input text-sm" />
              <textarea value={t.text} onChange={(e) => updateTestimonial(i, "text", e.target.value)}
                placeholder="Review text" rows={3} className="admin-input text-sm resize-none" />
              <input type="number" min="1" max="5" value={t.rating}
                onChange={(e) => updateTestimonial(i, "rating", parseInt(e.target.value))}
                placeholder="Rating (1-5)" className="admin-input text-sm" />
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}

// ===== SERVICES MANAGER =====
function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Omit<Service, "id" | "createdAt">>({
    name: "", description: "", price: "", duration: "", category: "Hair", imageUrl: "", featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { getServices().then(setServices); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", description: "", price: "", duration: "", category: "Hair", imageUrl: "", featured: false });
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setForm({ name: service.name, description: service.description, price: service.price,
      duration: service.duration, category: service.category, imageUrl: service.imageUrl, featured: service.featured });
    setImageFile(null);
    setShowForm(true);
  };

  const [saveError, setSaveError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, "services");
      }
      const data = { ...form, imageUrl };
      if (editing?.id) {
        await updateService(editing.id, data);
        setServices((prev) => prev.map((s) => s.id === editing.id ? { ...s, ...data } : s));
      } else {
        const id = await addService(data);
        setServices((prev) => [{ id, ...data }, ...prev]);
      }
      setShowForm(false);
    } catch (err) {
      setSaveError("Save failed. If you uploaded an image, try using an image URL instead.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-cinzel text-xl font-bold gold-text">Manage Services</h2>
        <motion.button onClick={openAdd}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full font-poppins text-sm font-semibold text-white gold-shimmer"
          whileHover={{ scale: 1.02 }} data-testid="add-service-btn">
          <Plus size={16} /> Add Service
        </motion.button>
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl rounded-3xl p-8 border border-[rgba(184,142,40,0.3)] overflow-y-auto max-h-[90vh]"
              style={{ background: "hsl(25,20%,12%)" }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-cinzel text-lg font-bold gold-text">
                  {editing ? "Edit Service" : "Add Service"}
                </h3>
                <button onClick={() => setShowForm(false)} className="text-[hsl(40,15%,55%)] hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Service Name *" className="admin-input" data-testid="service-name-input" />
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description *" rows={3} className="admin-input resize-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Price (e.g. ₹1,999)" className="admin-input" />
                  <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="Duration (e.g. 1 hour)" className="admin-input" />
                </div>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="admin-input">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <div>
                  <label className="block font-poppins text-xs text-[hsl(43,50%,60%)] mb-2">Service Image</label>
                  {(imageFile || form.imageUrl) && (
                    <img src={imageFile ? URL.createObjectURL(imageFile) : form.imageUrl}
                      alt="Preview" className="w-full h-32 object-cover rounded-xl mb-2 opacity-80" />
                  )}
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="admin-input cursor-pointer text-sm" />
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="Or paste image URL" className="admin-input mt-2 text-sm" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 accent-[hsl(43,74%,49%)]" />
                  <span className="font-poppins text-sm text-[hsl(40,20%,70%)]">Mark as Featured</span>
                </label>
                {saveError && (
                  <p className="text-red-400 text-xs font-poppins bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{saveError}</p>
                )}
                <motion.button onClick={handleSave} disabled={saving || !form.name}
                  className="w-full py-3 rounded-full font-montserrat text-sm font-bold tracking-wider uppercase text-white gold-shimmer disabled:opacity-50"
                  whileHover={{ scale: 1.02 }} data-testid="save-service-btn">
                  {saving ? "Saving..." : editing ? "Update Service" : "Add Service"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service list */}
      <div className="space-y-4">
        {services.length === 0 ? (
          <div className="text-center py-12 text-[hsl(40,15%,45%)] font-poppins text-sm">
            No services yet. Add your first service above.
          </div>
        ) : (
          services.map((service) => (
            <motion.div key={service.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-4 rounded-2xl p-4 border border-[rgba(184,142,40,0.15)]"
              style={{ background: "rgba(255,255,255,0.04)" }}
              data-testid={`admin-service-${service.id}`}>
              <img src={service.imageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&q=60"}
                alt={service.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-base font-bold text-white truncate">{service.name}</h4>
                  {service.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-[rgba(184,142,40,0.2)] text-[hsl(43,74%,60%)] text-xs font-poppins">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex gap-3 mt-1">
                  <span className="font-poppins text-xs text-[hsl(43,74%,55%)]">{service.price}</span>
                  <span className="font-poppins text-xs text-[hsl(40,15%,50%)]">{service.category}</span>
                  <span className="font-poppins text-xs text-[hsl(40,15%,50%)]">{service.duration}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(service)}
                  className="w-9 h-9 rounded-full bg-[rgba(184,142,40,0.15)] text-[hsl(43,74%,55%)] hover:bg-[hsl(43,74%,49%)] hover:text-white transition-all flex items-center justify-center"
                  data-testid={`edit-service-${service.id}`}>
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(service.id!)}
                  className="w-9 h-9 rounded-full bg-[rgba(220,50,50,0.1)] text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                  data-testid={`delete-service-${service.id}`}>
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// ===== GALLERY MANAGER =====
function GalleryManager() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState<Omit<GalleryItem, "id" | "createdAt">>({
    imageUrl: "", title: "", text: "", category: "Hair",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { getGallery().then(setGallery); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ imageUrl: "", title: "", text: "", category: "Hair" });
    setImageFile(null);
    setShowForm(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditing(item);
    setForm({ imageUrl: item.imageUrl, title: item.title, text: item.text, category: item.category });
    setImageFile(null);
    setShowForm(true);
  };

  const [saveError, setSaveError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) { imageUrl = await uploadImage(imageFile, "gallery"); }
      const data = { ...form, imageUrl };
      if (editing?.id) {
        await updateGalleryItem(editing.id, data);
        setGallery((prev) => prev.map((g) => g.id === editing.id ? { ...g, ...data } : g));
      } else {
        const id = await addGalleryItem(data);
        setGallery((prev) => [{ id, ...data }, ...prev]);
      }
      setShowForm(false);
    } catch (err) {
      setSaveError("Save failed. If you uploaded an image, try using an image URL instead.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery item?")) return;
    await deleteGalleryItem(id);
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-cinzel text-xl font-bold gold-text">Manage Gallery</h2>
        <motion.button onClick={openAdd}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full font-poppins text-sm font-semibold text-white gold-shimmer"
          whileHover={{ scale: 1.02 }} data-testid="add-gallery-btn">
          <Plus size={16} /> Add Item
        </motion.button>
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl p-8 border border-[rgba(184,142,40,0.3)]"
              style={{ background: "hsl(25,20%,12%)" }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-cinzel text-lg font-bold gold-text">
                  {editing ? "Edit Gallery Item" : "Add Gallery Item"}
                </h3>
                <button onClick={() => setShowForm(false)} className="text-[hsl(40,15%,55%)] hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block font-poppins text-xs text-[hsl(43,50%,60%)] mb-2">Image</label>
                  {(imageFile || form.imageUrl) && (
                    <img src={imageFile ? URL.createObjectURL(imageFile) : form.imageUrl}
                      alt="Preview" className="w-full h-32 object-cover rounded-xl mb-2 opacity-80" />
                  )}
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="admin-input cursor-pointer text-sm" data-testid="gallery-image-input" />
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="Or paste image URL" className="admin-input mt-2 text-sm" />
                </div>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Title *" className="admin-input" data-testid="gallery-title-input" />
                <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="Short description" rows={2} className="admin-input resize-none" />
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="admin-input">
                  {galleryCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {saveError && (
                  <p className="text-red-400 text-xs font-poppins bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{saveError}</p>
                )}
                <motion.button onClick={handleSave} disabled={saving || !form.title}
                  className="w-full py-3 rounded-full font-montserrat text-sm font-bold tracking-wider uppercase text-white gold-shimmer disabled:opacity-50"
                  whileHover={{ scale: 1.02 }} data-testid="save-gallery-btn">
                  {saving ? "Saving..." : editing ? "Update" : "Add to Gallery"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((item) => (
          <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="group relative rounded-2xl overflow-hidden"
            data-testid={`admin-gallery-${item.id}`}>
            <img src={item.imageUrl} alt={item.title}
              className="w-full h-36 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button onClick={() => openEdit(item)}
                className="w-8 h-8 rounded-full bg-[hsl(43,74%,49%)] text-white flex items-center justify-center hover:scale-110 transition-transform">
                <Edit size={14} />
              </button>
              <button onClick={() => handleDelete(item.id!)}
                className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
              <p className="font-poppins text-xs text-white truncate">{item.title}</p>
            </div>
          </motion.div>
        ))}
        {gallery.length === 0 && (
          <div className="col-span-full text-center py-12 text-[hsl(40,15%,45%)] font-poppins text-sm">
            No gallery items yet. Add your first image above.
          </div>
        )}
      </div>
    </div>
  );
}

// ===== SETTINGS =====
function SiteSettings({ content, onSave }: { content: SiteContent; onSave: (c: SiteContent) => void }) {
  const [form, setForm] = useState<SiteContent>(content);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateSiteContent(form);
    onSave(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-cinzel text-xl font-bold gold-text">Site Settings</h2>
        <motion.button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full font-poppins text-sm font-semibold text-white gold-shimmer disabled:opacity-50"
          whileHover={{ scale: 1.02 }} data-testid="save-settings-btn">
          <Save size={16} />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </motion.button>
      </div>
      <Section title="Brand">
        <Field label="Website Name">
          <input value={form.websiteName || ""} onChange={(e) => setForm({ ...form, websiteName: e.target.value })}
            className="admin-input" data-testid="site-name-input" />
        </Field>
        <Field label="Footer Text">
          <input value={form.footerText || ""} onChange={(e) => setForm({ ...form, footerText: e.target.value })}
            className="admin-input" />
        </Field>
      </Section>
      <Section title="Contact & Social">
        <Field label="Contact Number">
          <input value={form.contactNumber || ""} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            placeholder="+91 98765 43210" className="admin-input" data-testid="contact-number-input" />
        </Field>
        <Field label="WhatsApp Link">
          <input value={form.whatsappLink || ""} onChange={(e) => setForm({ ...form, whatsappLink: e.target.value })}
            placeholder="https://wa.me/919876543210" className="admin-input" />
        </Field>
        <Field label="Instagram Link">
          <input value={form.instagramLink || ""} onChange={(e) => setForm({ ...form, instagramLink: e.target.value })}
            placeholder="https://instagram.com/yourpage" className="admin-input" />
        </Field>
      </Section>
    </div>
  );
}

// ===== FOOTER EDITOR =====
function FooterEditor({ content, onSave }: { content: SiteContent; onSave: (c: SiteContent) => void }) {
  const [form, setForm] = useState<SiteContent>(content);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateSiteContent(form);
      onSave(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-cinzel text-xl font-bold gold-text">Footer Customisation</h2>
        <motion.button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full font-poppins text-sm font-semibold text-white gold-shimmer disabled:opacity-50"
          whileHover={{ scale: 1.02 }} data-testid="save-footer-btn">
          <Save size={16} />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Footer"}
        </motion.button>
      </div>
      {error && (
        <p className="text-red-400 text-xs font-poppins bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
      )}
      <Section title="Footer Text">
        <Field label="Copyright / Footer Text">
          <input value={form.footerText || ""} onChange={(e) => setForm({ ...form, footerText: e.target.value })}
            placeholder="© 2024 Your Studio. All rights reserved." className="admin-input" />
        </Field>
      </Section>
      <Section title="Contact Information">
        <Field label="Phone Number">
          <input value={form.contactNumber || ""} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            placeholder="+91 98765 43210" className="admin-input" />
        </Field>
        <Field label="Address">
          <input value={(form as any).address || ""} onChange={(e) => setForm({ ...form, ...(form as any), address: e.target.value })}
            placeholder="123 Beauty Lane, Your City" className="admin-input" />
        </Field>
      </Section>
      <Section title="Social Links">
        <Field label="WhatsApp Link">
          <input value={form.whatsappLink || ""} onChange={(e) => setForm({ ...form, whatsappLink: e.target.value })}
            placeholder="https://wa.me/919876543210" className="admin-input" />
        </Field>
        <Field label="Instagram Link">
          <input value={form.instagramLink || ""} onChange={(e) => setForm({ ...form, instagramLink: e.target.value })}
            placeholder="https://instagram.com/yourpage" className="admin-input" />
        </Field>
      </Section>
      <div className="rounded-2xl p-4 border border-[rgba(184,142,40,0.1)] bg-[rgba(184,142,40,0.04)]">
        <p className="font-poppins text-xs text-[hsl(40,15%,45%)]">
          <span className="text-[hsl(43,74%,55%)] font-semibold">Note:</span> The "Design by Prime Link" credit in the footer is fixed and cannot be changed.
        </p>
      </div>
    </div>
  );
}

// ===== HELPERS =====
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 border border-[rgba(184,142,40,0.15)] space-y-4"
      style={{ background: "rgba(255,255,255,0.04)" }}>
      <h3 className="font-cinzel text-sm font-bold text-[hsl(43,74%,55%)] tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block font-poppins text-xs text-[hsl(40,20%,60%)] tracking-wider">{label}</label>
      {children}
    </div>
  );
}

// ===== MAIN ADMIN PANEL =====
const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "home", label: "Home Control", icon: <Crown size={18} /> },
  { id: "services", label: "Manage Services", icon: <Scissors size={18} /> },
  { id: "gallery", label: "Manage Gallery", icon: <Image size={18} /> },
  { id: "footer", label: "Footer", icon: <Settings size={18} /> },
  { id: "settings", label: "Settings", icon: <Users size={18} /> },
];

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [content, setContent] = useState<SiteContent>(getDefaultContent());
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session === "true") setLoggedIn(true);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    getSiteContent().then(setContent);
    getServices().then(setServices);
    getGallery().then(setGallery);
  }, [loggedIn]);

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setLoggedIn(false);
  };

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(25,18%,8%)" }}>
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 flex-shrink-0 z-50 admin-sidebar border-r border-[rgba(184,142,40,0.15)] flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="p-8 border-b border-[rgba(184,142,40,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gold-shimmer flex items-center justify-center">
              <span className="text-white font-cinzel font-bold text-lg">L</span>
            </div>
            <div>
              <div className="font-cinzel text-sm font-bold tracking-widest gold-text">LUMIÈRE</div>
              <div className="font-poppins text-xs text-[hsl(40,15%,45%)]">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-poppins text-sm font-medium transition-all ${
                activeTab === item.id
                  ? "bg-[rgba(184,142,40,0.2)] text-[hsl(43,74%,60%)] border border-[rgba(184,142,40,0.3)]"
                  : "text-[hsl(40,15%,55%)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
              }`}
              data-testid={`sidebar-${item.id}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[rgba(184,142,40,0.15)]">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-poppins text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            data-testid="admin-logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-[rgba(184,142,40,0.15)]">
          <button onClick={() => setSidebarOpen(true)} className="text-[hsl(43,74%,55%)]">
            <LayoutDashboard size={24} />
          </button>
          <span className="font-cinzel text-sm font-bold gold-text">Admin Panel</span>
          <button onClick={handleLogout} className="text-red-400"><LogOut size={20} /></button>
        </div>

        <div className="p-6 lg:p-10 max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}>
              {activeTab === "dashboard" && <DashboardOverview services={services} gallery={gallery} />}
              {activeTab === "home" && <HomeEditor content={content} onSave={setContent} />}
              {activeTab === "services" && <ServicesManager />}
              {activeTab === "gallery" && <GalleryManager />}
              {activeTab === "footer" && <FooterEditor content={content} onSave={setContent} />}
              {activeTab === "settings" && <SiteSettings content={content} onSave={setContent} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
