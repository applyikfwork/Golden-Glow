import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSiteContent, SiteContent, getDefaultContent } from "@/lib/apiService";

interface SiteContentContextValue {
  content: SiteContent;
  loading: boolean;
  refresh: () => void;
}

const SiteContentContext = createContext<SiteContentContextValue>({
  content: getDefaultContent(),
  loading: true,
  refresh: () => {},
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(getDefaultContent());
  const [loading, setLoading] = useState(true);

  const fetchContent = () => {
    setLoading(true);
    getSiteContent()
      .then(setContent)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    const name = content.websiteName || "Lumière Beauty";
    document.title = name;
  }, [content.websiteName]);

  return (
    <SiteContentContext.Provider value={{ content, loading, refresh: fetchContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
