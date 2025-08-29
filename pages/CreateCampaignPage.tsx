import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import CampaignForm, { CampaignFormData } from '../components/CampaignForm';
import Alert from '../components/Alert';
import { moderateContent } from '../services/gemini';
import Spinner from '../components/Spinner';
import { usePageMetadata } from '../hooks/usePageMetadata';

/**
 * Page for creating a new campaign. It renders the CampaignForm for data input.
 * It ensures that only authenticated users can access this page and now includes
 * content moderation and improved error handling.
 *
 * @returns {React.JSX.Element} The rendered create campaign page.
 */
export default function CreateCampaignPage() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    usePageMetadata(
      "Create a New Campaign",
      "Launch your political campaign for free on SocietyFixer. Create a professional page to share your policies and connect with voters."
    );

    // Redirect to auth page if user is not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/auth');
        }
    }, [user, authLoading, navigate]);

    /**
     * Handles submission of the new campaign data to Supabase.
     * @param {CampaignFormData} formData - The campaign data from the form.
     */
    const handleSubmit = async (formData: CampaignFormData) => {
        if (!user) {
            setSubmissionError("You must be logged in to create a campaign.");
            return;
        }

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

        // Insert into database
        const { error } = await supabase.from('campaigns').insert({ ...formData, user_id: user.id });

        if (error) {
            setSubmissionError(`Error creating campaign: ${error.message}`);
        } else {
            addToast({ message: "Campaign created successfully!", type: 'success' });
            // Clear the persisted form data from localStorage
            localStorage.removeItem('campaign-form-draft-new');
            navigate('/');
        }
        
        setIsSubmitting(false);
    };
    
    // Render a loading state while authentication status is being checked
    if (authLoading) {
        return <Spinner />;
    }
    
    // Do not render the form if the user is not authenticated (and about to be redirected)
    if (!user) {
        return null;
    }

    return (
        <div className="mx-auto my-4" style={{ maxWidth: '800px' }}>
            <h1 className="h3 fw-bold mb-4 text-center">Create a New Campaign</h1>
            {submissionError && 
              <Alert 
                type="danger" 
                message={submissionError} 
                onClose={() => setSubmissionError(null)} 
              />
            }
            <div className="card bg-body-secondary p-4 p-md-5 shadow-lg mt-3">
                <CampaignForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
}