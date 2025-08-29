import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import CampaignForm, { CampaignFormData } from '../components/CampaignForm';
import type { Campaign } from '../types';
import Alert from '../components/Alert';
import { moderateContent } from '../services/gemini';
import Spinner from '../components/Spinner';
import { usePageMetadata } from '../hooks/usePageMetadata';

/**
 * Page for editing an existing campaign. It fetches the campaign's current data
 * and populates the CampaignForm. It includes authorization checks and now also
 * features content moderation and improved error handling.
 *
 * @returns {React.JSX.Element} The rendered edit campaign page.
 */
export default function EditCampaignPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { addToast } = useToast();
    
    const [initialData, setInitialData] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    // SEO
    const pageTitle = initialData ? `Edit Campaign: ${initialData.candidate_name}` : 'Edit Campaign';
    const pageDescription = initialData ? `Update and manage the campaign details for ${initialData.candidate_name}.` : 'Update your campaign details.';
    usePageMetadata(pageTitle, pageDescription);

    // Effect for fetching campaign data and checking authorization
    useEffect(() => {
        if (authLoading) return; // Wait for auth check to complete
        if (!user) { // Redirect if not logged in
            navigate('/auth');
            return;
        }

        const fetchCampaign = async () => {
            if (!id) return;
            setLoading(true);
            const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).single();

            if (error || !data) {
                console.error("Error fetching campaign for edit", error);
                setSubmissionError("Could not load campaign data.");
                setLoading(false);
            } else if (data.user_id !== user.id) {
                addToast({ message: "You are not authorized to edit this campaign.", type: "danger" });
                navigate('/');
            } else {
                setInitialData(data as Campaign);
                setLoading(false);
            }
        };
        
        fetchCampaign();
    }, [id, user, authLoading, navigate, addToast]);

    /**
     * Handles the submission of updated campaign data to Supabase.
     * @param {CampaignFormData} formData - The updated campaign data from the form.
     */
    const handleSubmit = async (formData: CampaignFormData) => {
        if (!id) return;

        setIsSubmitting(true);
        setSubmissionError(null);

        // Content Moderation Check
        const contentToModerate = [
            formData.candidate_name,
            formData.election_name,
            formData.position_name,
            formData.proposed_policies
        ].join(' ');

        const moderationResult = await moderateContent(contentToModerate);

        if (!moderationResult.isSafe) {
            setSubmissionError(moderationResult.reason || "Content violates our safety policies.");
            setIsSubmitting(false);
            return;
        }
        
        // Update database
        const { error } = await supabase.from('campaigns').update(formData).eq('id', id);

        if (error) {
            setSubmissionError(`Error updating campaign: ${error.message}`);
        } else {
            addToast({ message: "Campaign updated successfully!", type: 'success' });
             // Clear the persisted form data from localStorage
            localStorage.removeItem(`campaign-form-draft-${id}`);
            navigate(`/campaign/${id}`);
        }

        setIsSubmitting(false);
    };
    
    if (authLoading || loading) {
        return <Spinner />;
    }
    
    return (
        <div className="mx-auto my-4" style={{ maxWidth: '800px' }}>
            <h1 className="h3 fw-bold mb-4 text-center">Edit Your Campaign</h1>
            {submissionError && 
              <Alert 
                type="danger" 
                message={submissionError} 
                onClose={() => setSubmissionError(null)} 
              />
            }
            {initialData ? (
                <div className="card bg-body-secondary p-4 p-md-5 shadow-lg mt-3">
                    <CampaignForm 
                        onSubmit={handleSubmit} 
                        initialData={initialData} 
                        isSubmitting={isSubmitting}
                        campaignId={id} 
                    />
                </div>
            ) : !submissionError && (
                 <p className="text-center text-secondary">Could not load campaign data to edit.</p>
            )}
        </div>
    );
}