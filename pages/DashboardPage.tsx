import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CampaignCard from '../components/CampaignCard';
import Spinner from '../components/Spinner';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { usePaginatedCampaigns } from '../hooks/usePaginatedCampaigns';

/**
 * The DashboardPage for authenticated users to manage their campaigns.
 * It now uses a reusable hook for pagination to handle a large number of campaigns gracefully.
 * @returns {React.JSX.Element} The rendered dashboard page.
 */
export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    usePageMetadata(
        "My Dashboard",
        "Manage your created campaigns, view analytics, and update your profile on SocietyFixer."
    );

    // Use the custom hook, passing the user and a flag to indicate this is a user-specific query
    const { campaigns, loading, loadingMore, hasMore, error, loadMore } = usePaginatedCampaigns({ 
        user, 
        isDashboard: true 
    });

    // Handle authentication state
    if (authLoading) {
        return <Spinner />;
    }
    if (!user && !authLoading) {
        navigate('/auth');
        return null; // Render nothing while redirecting
    }

    return (
        <div className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 fw-bold text-light">My Campaigns</h1>
                <Link to="/create-campaign" className="btn btn-primary">
                    Create New Campaign
                </Link>
            </div>
            
            {loading ? (
                <Spinner />
            ) : error ? (
                <p className="text-center text-danger mt-5">{error}</p>
            ) : campaigns.length === 0 ? (
                 <div className="text-center p-5 bg-body-secondary rounded-3">
                    <h2>You haven't created any campaigns yet.</h2>
                    <p className="text-secondary">Get started by creating your first campaign page.</p>
                    <Link to="/create-campaign" className="btn btn-primary mt-2">
                        Create a Campaign
                    </Link>
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