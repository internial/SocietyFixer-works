import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import Spinner from '../components/Spinner';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { usePaginatedCampaigns } from '../hooks/usePaginatedCampaigns';

const WELCOME_INTRO_SEEN_KEY = 'hasSeenWelcomeIntro';

/**
 * The home page of the application. It fetches and displays a list of all political campaigns,
 * with added functionality for searching and filtering.
 *
 * @returns {React.JSX.Element} The rendered home page component.
 */
export default function HomePage() {
    const [showIntro, setShowIntro] = useState(false);
    const location = useLocation();
    const [liveRegionMessage, setLiveRegionMessage] = useState('');

    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';
    
    // SEO and A11y
    const pageTitle = query ? `Search results for "${query}"` : 'All Campaigns';
    const pageDescription = "Explore political campaigns across the USA. Find candidates, learn about their policies, and get involved in local, state, and national elections.";
    usePageMetadata(pageTitle, pageDescription);

    // Debounce search input from URL to avoid excessive API calls
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300); // 300ms delay

        return () => clearTimeout(handler);
    }, [query]);

    // Use the custom hook for data fetching and pagination
    const { campaigns, loading, loadingMore, hasMore, error, loadMore } = usePaginatedCampaigns({ query: debouncedQuery });

    // Update live region for screen readers when data changes
    useEffect(() => {
        if (!loading) {
            setLiveRegionMessage(campaigns.length > 0 ? `${campaigns.length} campaigns found.` : 'No campaigns found.');
        }
    }, [campaigns, loading]);

    // Check if the intro has been seen before
    useEffect(() => {
        const hasSeenIntro = localStorage.getItem(WELCOME_INTRO_SEEN_KEY);
        if (!hasSeenIntro) {
            setShowIntro(true);
        }
    }, []);
    
    // Welcome intro dismissal logic
    const handleDismissIntro = () => {
        setShowIntro(false);
        localStorage.setItem(WELCOME_INTRO_SEEN_KEY, 'true');
    };

    return (
        <div className="py-4">
             {/* Visually hidden container for screen reader announcements */}
            <div className="visually-hidden" aria-live="polite" aria-atomic="true">
                {liveRegionMessage}
            </div>

            {showIntro && (
                <div className="card bg-body-secondary text-center border-0 p-4 mb-5 rounded-3 shadow-sm fade show" role="alert">
                    <div className="card-body position-relative">
                        <button type="button" className="btn-close position-absolute top-0 end-0" onClick={handleDismissIntro} aria-label="Close intro message"></button>
                        <h2 className="card-title h3 fw-bold text-primary mb-3">Welcome to SocietyFixer</h2>
                        <div className="card-text mx-auto" style={{maxWidth: '700px'}}>
                            <p className="mb-3">
                                Running for political office is incredibly expensive, often sidelining qualified candidates who can't afford a massive campaign. This shifts the focus from what truly matters—developing solid policies—to endless fundraising.
                            </p>
                            <p className="mb-3">
                                <strong>SocietyFixer is a free and politically neutral platform built to change that.</strong> We empower candidates to create detailed campaign pages, putting their ideas front and center.
                            </p>
                            <p className="mb-0">
                                For voters, this is your hub for discovering candidates based on substance. Use the search bar above to find politicians by name, position, or region, and make informed decisions on the policies that will shape your community.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            <h1 className="h3 fw-bold mb-4 text-light">{pageTitle}</h1>
            
            {loading ? (
                <Spinner />
            ) : error ? (
                <div className="alert alert-danger text-center mt-5" role="alert">
                    <h5 className="alert-heading">An Error Occurred</h5>
                    <p className="mb-0">{error}</p>
                </div>
            ) : campaigns.length === 0 ? (
                <div className="text-center p-5 bg-body-secondary rounded-3" role="region" aria-label="No results">
                    <h4>No campaigns found.</h4>
                    <p className="text-secondary">Try adjusting your search or check back later.</p>
                </div>
            ) : (
                <>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                        {campaigns.map(campaign => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
                        ))}
                    </div>
                    <div className="text-center mt-5">
                        {hasMore && (
                             <button 
                                className="btn btn-primary" 
                                onClick={loadMore} 
                                disabled={loadingMore}
                            >
                                {loadingMore ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </>
                                ) : 'Load More'}
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}