import { useEffect } from "react";

interface PageSEO {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function usePageSEO({ title, description, image, url }: PageSEO) {
  useEffect(() => {
    const siteName = "Lumière Beauty";
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const defaultDesc = "Luxury beauty salon offering bridal makeup, hair treatments, facials, spa therapies and more. Book your appointment today.";
    const desc = description || defaultDesc;
    const img = image || "/opengraph.jpg";

    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", desc);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:image", img, "property");
    setMeta("og:type", "website", "property");
    if (url) setMeta("og:url", url, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", img);

    return () => {
      document.title = siteName;
    };
  }, [title, description, image, url]);
}
