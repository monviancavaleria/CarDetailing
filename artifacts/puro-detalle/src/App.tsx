import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
// import TrustStrip from './components/TrustStrip'; // Oculto en esta fase del rediseño premium
import Packages from './components/Packages';
import TarifasSection from './components/TarifasSection';
import InfoHub from './components/InfoHub';
import Footer from './components/Footer';

const queryClient = new QueryClient();

function Home() {
  // Paquete cuya columna se resalta en la sección de tarifas.
  const [infoPkg, setInfoPkg] = React.useState<string | null>(null);

  const handleMoreInfo = (id: string) => {
    setInfoPkg(id);
    const el = document.getElementById('tarifas');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen text-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        {/* <TrustStrip /> — oculto en esta fase del rediseño */}
        <Packages onMoreInfo={handleMoreInfo} activeInfo={infoPkg} />
        <TarifasSection highlighted={infoPkg} />
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
