import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import Packages from './components/Packages';
import Extras from './components/Extras';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

const queryClient = new QueryClient();

function Home() {
  return (
    <div className="bg-background min-h-screen text-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Packages />
        <Extras />
        <Testimonials />
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
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
