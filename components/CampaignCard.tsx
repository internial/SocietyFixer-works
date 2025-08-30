
import React from 'react';
import { Link } from 'react-router-dom';
import type { Campaign } from '../types';
import { transformImageUrl } from '../lib/imageHelper';

/**
 * A card component that displays a summary of a political campaign.
 * It shows the candidate's portrait, name, position, and election details.
 * It links to the detailed campaign page.
 *
 * @param {object} props - The component props.
 * @param {Campaign} props.campaign - The campaign data to display.
 * @returns {React.JSX.Element} The rendered campaign card component.
 */
export default function CampaignCard({ campaign }: { campaign: Campaign }) {
    // Request a square image and use 'contain' to fit the entire image without cropping.
    const optimizedImageUrl = campaign.portrait_url 
        ? transformImageUrl(campaign.portrait_url, { width: 400, height: 400, resize: 'contain' })
        : 'https://placehold.co/400x400/343a40/6c757d?text=No+Image';
        
    return (
        <div className="col">
            <Link to={`/campaign/${campaign.id}`} className="card h-100 text-decoration-none bg-body-secondary border-secondary shadow-sm">
                <img 
                    className="card-img-top" 
                    src={optimizedImageUrl} 
                    alt={`${campaign.candidate_name} portrait`} 
                    // Use object-fit: contain to show the entire image without cropping.
                    // Increased height for better portrait display.
                    style={{ height: '220px', objectFit: 'contain', backgroundColor: 'var(--bs-body-tertiary)' }} 
                />
                <div className="card-body">
                    <h5 className="card-title text-light">{campaign.candidate_name}</h5>
                    <p className="card-text text-primary fw-medium">{campaign.position_name}</p>
                    <p className="card-text text-body-secondary">{campaign.election_region} &bull; {campaign.scope}</p>
                </div>
                <div className="card-footer bg-transparent border-top-secondary">
                    <small className="text-body-secondary">Election Deadline: {new Date(campaign.election_deadline).toLocaleDateString()}</small>
                </div>
            </Link>
        </div>
    );
}