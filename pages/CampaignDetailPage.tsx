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

// Makes DOMPurify available from the global scope (loaded via CDN in index.html)
declare const DOMPurify: any;

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
                .single();
            
            if (dbError) {
                // Differentiate between a "not found" error and other, unexpected errors.
                // Supabase's .single() returns error code 'PGRST116' when no rows are found.
                if (dbError.code === 'PGRST116') {
                    setCampaign(null); // This is the "not found" case, not an actual error.
                } else {
                    // This is a genuine network or database error.
                    console.error(`Error fetching campaign with id '${id}':`, dbError.message, dbError);
                    setError(`Failed to load campaign. An unexpected error occurred.`);
                }
            } else if (data) {
                setCampaign(data as Campaign);
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
        return (
            <div className="alert alert-danger text-center mt-5">
                <h5 className="alert-heading">An Error Occurred</h5>
                <p>{error}</p>
            </div>
        );
    }
    
    if (!campaign) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <div className="card bg-body-secondary p-4 p-md-5 shadow-lg text-center" style={{ maxWidth: '600px' }}>
                    <div className="card-body">
                         <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-file-earmark-x-fill text-warning mb-4" viewBox="0 0 16 16">
                            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.854 7.146a.5.5 0 1 1 .708.708L7.94 8.5l-.375.375a.5.5 0 0 1-.708.708L7.56 9.207l-.375.375a.5.5 0 1 1-.708-.708L7.172 8.5l.375-.375a.5.5 0 0 1 .708-.708L8.276 7.857l.375-.375a.5.5 0 1 1 .708.708L8.646 8.5l.375.375a.5.5 0 1 1-.708.708L8.276 9.207l.375.375a.5.5 0 0 1-.708.708L7.56 8.879l-.375.375a.5.5 0 1 1-.708-.708L7.172 8.5z"/>
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

    // Sanitize user-generated content before rendering to prevent XSS attacks
    const sanitizedPolicies = DOMPurify.sanitize(campaign.proposed_policies);

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
                <div className="policy-content" dangerouslySetInnerHTML={{ __html: sanitizedPolicies }} />
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