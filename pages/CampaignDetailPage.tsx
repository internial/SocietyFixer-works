import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Campaign } from '../types';
import Alert from '../components/Alert';
import Tooltip from '../components/Tooltip';
import { transformImageUrl } from '../lib/imageHelper';
import { useToast } from '../hooks/useToast';
import ConfirmModal from '../components/ConfirmModal';
import Spinner from '../components/Spinner';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { getStorageInfo, createSnippet } from '../lib/storageHelper';

/**
 * Displays the detailed view of a single campaign.
 * It fetches the campaign data based on the ID from the URL.
 * Also provides options to edit or delete the campaign for the owner,
 * with improved error handling for deletion.
 *
 * @returns {React.JSX.Element} The rendered campaign detail page.
 */
export default function CampaignDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToast } = useToast();

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // SEO: Set dynamic page title and description
    const pageTitle = campaign ? `${campaign.candidate_name} for ${campaign.position_name}` : 'Campaign Details';
    const pageDescription = campaign ? createSnippet(campaign.proposed_policies) : 'View campaign details, policies, and contact information for political candidates.';
    usePageMetadata(pageTitle, pageDescription);
    
    useEffect(() => {
        /**
         * Fetches a single campaign's data from Supabase.
         */
        const fetchCampaign = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);

            const { data, error: dbError } = await supabase
                .from('campaigns')
                .select(`*`)
                .eq('id', id)
                .maybeSingle(); // Use .maybeSingle() to gracefully handle 0 rows
            
            if (dbError) {
                console.error(`Error fetching campaign with id '${id}':`, dbError.message, dbError);
                if (dbError.message.includes('Failed to fetch')) {
                    setError("Network Error: Could not connect to the database. This is often a CORS (Cross-Origin Resource Sharing) issue. Please ensure this website's URL is added to your Supabase project's 'Allowed Origins' list in the API settings.");
                } else {
                    setError(`Failed to load campaign. An unexpected error occurred: ${dbError.message}`);
                }
            } else {
                // .maybeSingle() returns null for data if no row is found.
                // This is the expected behavior for a non-existent campaign.
                setCampaign(data as Campaign | null);
            }
            
            setLoading(false);
        };
        fetchCampaign();
    }, [id]);

    /**
     * Handles the confirmed deletion of a campaign, including associated storage files.
     */
    const handleConfirmDelete = async () => {
        if (!campaign) return;

        setDeleting(true);
        setDeleteError(null);

        try {
            // Step 1: Clean up associated files from storage to prevent orphans.
            const { portrait_url, resume_url } = campaign;
            const filesToDelete = [portrait_url, resume_url]
                .filter(Boolean)
                .map(url => getStorageInfo(url!))
                .filter(Boolean) as { bucket: string, path: string }[];
            
            if (filesToDelete.length > 0) {
                for (const { bucket, path } of filesToDelete) {
                    const { error: storageError } = await supabase.storage.from(bucket).remove([path]);
                    if (storageError) {
                            console.warn(`[File Cleanup] Failed to delete ${path} from bucket ${bucket}: ${storageError.message}`);
                    } else {
                        console.log(`[File Cleanup] Successfully deleted ${path} from bucket ${bucket}`);
                    }
                }
            }
            
            // Step 2: Delete the campaign record from the database.
            const { error: dbError } = await supabase.from('campaigns').delete().eq('id', campaign.id);

            if (dbError) {
                throw new Error(`Deletion failed: ${dbError.message}. Please check RLS policies.`);
            }
            
            addToast({ message: "Campaign deleted successfully.", type: 'success' });
            setShowConfirmModal(false);
            navigate('/');

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during deletion.';
            console.error('An error occurred during campaign deletion:', error);
            setDeleteError(errorMessage);
        } finally {
            setDeleting(false);
            if (!deleteError) { // Only close modal on success, otherwise keep it open to show error
                setShowConfirmModal(false);
            }
        }
    };


    if (loading) return <Spinner />;
    
    if (error) {
        const isCorsError = error.includes('CORS');
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <div className="card bg-body-secondary p-4 p-md-5 shadow-lg text-center" style={{ maxWidth: '600px' }}>
                    <div className="card-body">
                         <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-wifi-off text-danger mb-4" viewBox="0 0 16 16">
                            <path d="M10.706 3.294A12.545 12.545 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c2.507 0 4.863.695 6.706 1.855a.5.5 0 0 0 .62-.728A12.541 12.541 0 0 0 10.706 3.294z"/>
                            <path d="M.918 8.025A11.45 11.45 0 0 1 8 7c.258 0 .51.008.753.025l-1.07.922a.5.5 0 0 0 .176.846l2.311-1.238a.5.5 0 0 0 .176-.846L8.943 6.04a.5.5 0 0 0-.596.026l-.05.044a.5.5 0 0 0-.176.846L8.082 7.01a.5.5 0 0 0 .22.84L.918 8.026zM.734 5.841l.707-.707 12.728 12.728-.707.707L.734 5.841z"/>
                            <path d="M6.924 10.115a6.474 6.474 0 0 0-1.423.656 8.448 8.448 0 0 0-2.313 1.579.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A7.447 7.447 0 0 1 8 10c.84 0 1.649.167 2.407.473l-1.355.918a.5.5 0 0 0 .176.846l2.311-1.238a.5.5 0 0 0 .176-.846L8.943 9.04a.5.5 0 0 0-.596.026l-.05.044a.5.5 0 0 0-.176.846l-.333.285a.5.5 0 0 0 .22.84l-1.55-1.045a.5.5 0 0 0-.176-.846z"/>
                        </svg>
                        <h1 className="card-title h4 fw-bold text-danger mb-3">
                            {isCorsError ? 'Connection Error' : 'An Error Occurred'}
                        </h1>
                        <p className="text-secondary">{error}</p>
                        {isCorsError && (
                            <div className="alert alert-warning mt-4 text-start">
                                <p className="fw-bold mb-1">How to fix this:</p>
                                <ol className="mb-0 ps-3">
                                    <li className="mb-1">Go to your project dashboard on <strong>supabase.com</strong>.</li>
                                    <li className="mb-1">Navigate to <strong>Settings</strong> &gt; <strong>API</strong>.</li>
                                    <li className="mb-1">Under <strong>CORS settings</strong>, add your application's full URL to the list of allowed origins.</li>
                                    <li>Save your changes and refresh this page.</li>
                                </ol>
                            </div>
                        )}
                        <a href="/" className="btn btn-primary mt-3">
                            Go to Homepage
                        </a>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!campaign) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <div className="card bg-body-secondary p-4 p-md-5 shadow-lg text-center" style={{ maxWidth: '600px' }}>
                    <div className="card-body">
                         <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-question-circle-fill text-warning mb-4" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927"/>
                        </svg>
                        <h1 className="card-title h4 fw-bold mb-3">Campaign Not Found</h1>
                        <p className="text-secondary">
                            Sorry, we couldn't find the campaign you're looking for. It might have been moved, deleted, or you may have followed a broken link.
                        </p>
                        <Link to="/" className="btn btn-primary mt-3">
                            Explore All Campaigns
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isOwner = user?.id === campaign.user_id;
    const regionTooltipText = 'The geographic area where an election is held. Only registered voters within this region are eligible to vote.';
    const optimizedImageUrl = campaign.portrait_url 
        ? transformImageUrl(campaign.portrait_url, { width: 384, height: 384, resize: 'contain' })
        : 'https://placehold.co/192x192/343a40/6c757d?text=No+Image';

    return (
        <article className="card bg-body-secondary p-4 p-md-5 shadow-lg my-4">
            <header className="text-center">
                <img src={optimizedImageUrl} alt={`${campaign.candidate_name} portrait`} className="img-fluid rounded-circle mx-auto mb-4 border border-primary border-4 bg-body-tertiary" style={{width: '192px', height: '192px', objectFit: 'contain'}}/>
                <h1 className="h4 fw-bold text-light">{campaign.candidate_name}</h1>
                <p className="text-primary">{campaign.position_name}</p>
                <p className="text-sm text-secondary">{campaign.political_party}</p>
                
                {isOwner && (
                  <div className="mt-4">
                      {deleteError && 
                        <Alert 
                          type="danger" 
                          message={deleteError} 
                          onClose={() => setDeleteError(null)} 
                        />
                      }
                      <div className="d-flex justify-content-center gap-2 mt-2">
                          <Link to={`/edit-campaign/${campaign.id}`} className="btn btn-primary btn-sm">Edit</Link>
                          <button onClick={() => setShowConfirmModal(true)} className="btn btn-danger btn-sm" disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete'}
                          </button>
                      </div>
                  </div>
                )}
            </header>

            <div className="mt-5">
                <h2 className="h5 fw-semibold border-bottom border-secondary pb-2 mb-4">Election Details</h2>
                <div className="row g-3">
                    <div className="col-sm-6"><strong className="text-secondary">Election:</strong> {campaign.election_name}</div>
                    <div className="col-sm-6"><strong className="text-secondary">Deadline:</strong> {new Date(campaign.election_deadline).toLocaleDateString()}</div>
                    <div className="col-sm-6"><strong className="text-secondary">Scope:</strong> {campaign.scope}</div>
                    <div className="col-sm-6">
                        <Tooltip text={regionTooltipText}>
                            <span>
                                <strong className="text-secondary" style={{cursor: 'help', textDecoration: 'underline dotted'}}>Region (?):</strong> {campaign.election_region}
                            </span>
                        </Tooltip>
                    </div>
                </div>

                <h2 className="h5 fw-semibold border-bottom border-secondary pb-2 my-4 mt-5">Personal & Contact Information</h2>
                 <div className="row g-3">
                    <div className="col-sm-6"><strong className="text-secondary">Gender:</strong> {campaign.gender}</div>
                    <div className="col-sm-6"><strong className="text-secondary">Date of Birth:</strong> {new Date(campaign.date_of_birth).toLocaleDateString()}</div>
                    <div className="col-sm-6"><strong className="text-secondary">Religion:</strong> {campaign.religion}</div>
                    {campaign.resume_url && <div className="col-sm-6"><a href={campaign.resume_url} target="_blank" rel="noopener noreferrer">View Resume</a></div>}
                    {campaign.contact_email && <div className="col-sm-6"><strong className="text-secondary">Email:</strong> {campaign.contact_email}</div>}
                    {campaign.social_media_url && <div className="col-sm-6"><a href={campaign.social_media_url} target="_blank" rel="noopener noreferrer">Social Media</a></div>}
                </div>
                
                <h2 className="h5 fw-semibold border-bottom border-secondary pb-2 my-4 mt-5">Proposed Policies</h2>
                <div 
                    className="policy-content ql-editor"
                    dangerouslySetInnerHTML={{ __html: campaign.proposed_policies }}
                >
                </div>
            </div>

            <ConfirmModal
                show={showConfirmModal}
                onClose={() => !deleting && setShowConfirmModal(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                body={<p>Are you sure you want to delete this campaign? This action is permanent and cannot be undone.</p>}
                confirmText={deleting ? 'Deleting...' : 'Delete'}
                isConfirming={deleting}
                confirmVariant="danger"
            />
        </article>
    );
};