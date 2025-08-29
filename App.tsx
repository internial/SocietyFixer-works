import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import Navbar from './components/Navbar';
import { ToastProvider } from './components/ToastProvider';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import { supabase } from './lib/supabase';

// Import page components
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import EditCampaignPage from './pages/EditCampaignPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import DashboardPage from './pages/DashboardPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ContactPage from './pages/ContactPage';
import CofounderPage from './pages/CofounderPage';

const KEEP_ALIVE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * The main application component. It sets up the router and global providers.
 * @returns {React.JSX.Element} The rendered App component.
 */
export default function App() {
  // Supabase free tier pauses projects after 1 week of inactivity.
  // This function sends a trivial query every 24 hours to prevent that.
  useEffect(() => {
    const keepAlive = async () => {
      try {
        // A very lightweight query. `head: true` ensures we only get the count, not the data itself.
        const { error } = await supabase
          .from('campaigns')
          .select('id', { count: 'exact', head: true })
          .limit(1);

        if (error) {
          console.warn('Supabase keep-alive ping failed:', error.message);
        } else {
          console.log('Supabase keep-alive ping successful at', new Date().toLocaleTimeString());
        }
      } catch (e) {
        console.warn('An unexpected error occurred during Supabase keep-alive ping:', e);
      }
    };

    // Run it once on startup to register activity immediately.
    keepAlive();

    // Then, set up the interval to run periodically.
    const intervalId = setInterval(keepAlive, KEEP_ALIVE_INTERVAL);

    // Clean up the interval when the component unmounts (important for clean code).
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main className="container flex-grow-1" style={{ paddingTop: '70px', paddingBottom: '2rem' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/find-cofounder" element={<CofounderPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/update-password" element={<UpdatePasswordPage />} />
                <Route path="/create-campaign" element={<CreateCampaignPage />} />
                <Route path="/campaign/:id" element={<CampaignDetailPage />} />
                <Route path="/edit-campaign/:id" element={<EditCampaignPage />} />
                {/* Footer Links */}
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
}