import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
// import TrustStrip from './components/TrustStrip'; // Oculto en esta fase del rediseño premium
import Packages, { type ServiceTabId } from './components/Packages';
import TarifasSection from './components/TarifasSection';
import type { CategoryId } from './data/services';
import InfoHub from './components/InfoHub';
import Footer from './components/Footer';
import ReviewsPage from '@/pages/Reviews';

const queryClient = new QueryClient();

function Home() {
  // Paquete cuya columna se resalta en la sección de tarifas.
  const [infoPkg, setInfoPkg] = React.useState<string | null>(null);
  // Pestaña activa (categoría o cotizador): única fuente de verdad.
  const [infoCat, setInfoCat] = React.useState<ServiceTabId>('completo');

  const handleMoreInfo = (id: string, cat: CategoryId) => {
    setInfoPkg(id);
    setInfoCat(cat);
    const el = document.getElementById('tarifas');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const handleTabChange = (tab: ServiceTabId) => {
    setInfoCat(tab);
    setInfoPkg(null);
  };

  return (
    <div className="min-h-screen text-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        {/* <TrustStrip /> — oculto en esta fase del rediseño */}
        <Packages
          activeTab={infoCat}
          onMoreInfo={handleMoreInfo}
          activeInfo={infoPkg}
          onTabChange={handleTabChange}
        />
        {/* Con el cotizador activo se ocultan las tablas de tarifas:
            el propio cotizador ya muestra precios y tiempos. */}
        {infoCat !== 'personalizado' && (
          <TarifasSection highlighted={infoPkg} category={infoCat} />
        )}
        <InfoHub />
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/resenas" component={ReviewsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <QueryClientProvider client={queryClient}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
      </QueryClientProvider>
    </MotionConfig>
  );
}

export default App;
