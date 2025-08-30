import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Campaign } from '../types';
// FIX: Import User type from @supabase/supabase-js to use in props.
import type { User } from '@supabase/supabase-js';

const CAMPAIGNS_PER_PAGE = 6;

// FIX: Added user and isDashboard properties to support filtering campaigns by the logged-in user on the dashboard.
interface UsePaginatedCampaignsProps {
    query?: string;
    user?: User | null;
    isDashboard?: boolean;
}

/**
 * A custom hook for fetching and paginating campaigns from Supabase.
 * It encapsulates loading states, pagination logic, and filtering by search query or user.
 * @param {UsePaginatedCampaignsProps} props - Hook configuration.
 * @returns {object} The state and methods for managing paginated campaigns.
 */
export const usePaginatedCampaigns = ({ query, user, isDashboard }: UsePaginatedCampaignsProps) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fetchCampaigns = useCallback(async (isReset: boolean) => {
        // FIX: If this is for a dashboard view and the user is not yet available,
        // stop loading and return an empty result to prevent errors.
        if (isDashboard && !user) {
            setLoading(false);
            setCampaigns([]);
            setHasMore(false);
            return;
        }

        const currentPage = isReset ? 0 : page;
        if (!isReset && (loadingMore || !hasMore)) return;

        if (isReset) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(null);

        const from = currentPage * CAMPAIGNS_PER_PAGE;
        const to = from + CAMPAIGNS_PER_PAGE - 1;

        let queryBuilder = supabase.from('campaigns').select('*');

        // FIX: Added logic to filter campaigns by the current user's ID when on the dashboard.
        if (isDashboard && user) {
            queryBuilder = queryBuilder.eq('user_id', user.id);
        }

        // Filter by public search query, if provided.
        if (query) {
            queryBuilder = queryBuilder.or(`candidate_name.ilike.%${query}%,position_name.ilike.%${query}%,election_region.ilike.%${query}%`);
        }

        // Then apply ordering and pagination.
        queryBuilder = queryBuilder.order('created_at', { ascending: false }).range(from, to);

        const { data, error: dbError } = await queryBuilder;

        if (dbError) {
            console.error('Error fetching paginated campaigns:', dbError);
            if (dbError.message.includes('Failed to fetch')) {
                setError("Network Error: Could not connect to the database. This is often a CORS (Cross-Origin Resource Sharing) issue. Please ensure this website's URL is added to your Supabase project's 'Allowed Origins' list in the API settings.");
            } else {
                setError(`Failed to load campaigns. An unexpected error occurred: ${dbError.message}`);
            }
        } else if (data) {
            setCampaigns(prev => isReset ? data : [...prev, ...data]);
            setHasMore(data.length === CAMPAIGNS_PER_PAGE);
            setPage(currentPage + 1);
        }

        setLoading(false);
        setLoadingMore(false);
    }, [page, hasMore, loadingMore, query, user, isDashboard]); // FIX: Added user and isDashboard to the dependency array.

    // Effect to trigger a reset fetch when dependencies change
    useEffect(() => {
        // This effect correctly captures changes in query,
        // triggering a full refresh of the campaign list.
        fetchCampaigns(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, user, isDashboard]); // FIX: Added user and isDashboard to the dependency array.

    return { campaigns, loading, loadingMore, hasMore, error, loadMore: () => fetchCampaigns(false) };
};