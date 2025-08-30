import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import Navbar from './components/Navbar';
import { ToastProvider } from './components/ToastProvider';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Import page components
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import EditCampaignPage from './pages/EditCampaignPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ContactPage from './pages/ContactPage';
import CofounderPage from './pages/CofounderPage';
import DocumentationPage from './pages/DocumentationPage';
import DashboardPage from './pages/DashboardPage';

/**
 * The main application component. It sets up the router and global providers.
 * @returns {React.JSX.Element} The rendered App component.
 */
export default function App() {
  return (
    <ErrorBoundary>
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
                  <Route path="/create-campaign" element={<CreateCampaignPage />} />
                  <Route path="/campaign/:id" element={<CampaignDetailPage />} />
                  <Route path="/edit-campaign/:id" element={<EditCampaignPage />} />
                  {/* Footer Links */}
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/documentation" element={<DocumentationPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}