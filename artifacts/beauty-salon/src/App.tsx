import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoadingScreen from "@/components/LoadingScreen";
import HomePage from "@/pages/home";
import ServicesPage from "@/pages/services";
import GalleryPage from "@/pages/gallery";
import AdminPanel from "@/pages/admin";
import NotFound from "@/pages/not-found";
import { SiteContentProvider } from "@/context/SiteContentContext";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/adminbeauty" component={AdminPanel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SiteContentProvider>
          <LoadingScreen />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </SiteContentProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
