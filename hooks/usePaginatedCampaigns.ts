import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Campaign } from '../types';
import type { User } from '@supabase/supabase-js';

const CAMPAIGNS_PER_PAGE = 6;

interface UsePaginatedCampaignsProps {
    query?: string;
    user?: User | null;
    isDashboard?: boolean; // Flag to know if we should wait for a user object
}

/**
 * A custom hook for fetching and paginating campaigns from Supabase.
 * It encapsulates loading states, pagination logic, and filtering by search query or user.
 * @param {UsePaginatedCampaignsProps} props - Hook configuration.
 * @returns {object} The state and methods for managing paginated campaigns.
 */
export const usePaginatedCampaigns = ({ query, user, isDashboard = false }: UsePaginatedCampaignsProps) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const fetchCampaigns = useCallback(async (isReset: boolean) => {
        // For the dashboard, don't fetch until the user object is available.
        if (isDashboard && !user) {
            setLoading(false);
            setCampaigns([]);
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

        let queryBuilder = supabase.from('campaigns').select('*').range(from, to);

        if (query) {
            queryBuilder = queryBuilder.or(`candidate_name.ilike.%${query}%,position_name.ilike.%${query}%,election_region.ilike.%${query}%`);
        }
        if (user) {
            queryBuilder = queryBuilder.eq('user_id', user.id);
        }

        // Consistent ordering
        queryBuilder = queryBuilder.order('created_at', { ascending: false });

        const { data, error: dbError } = await queryBuilder;

        if (dbError) {
            setError('Failed to load campaigns.');
        } else if (data) {
            setCampaigns(prev => isReset ? data : [...prev, ...data]);
            setHasMore(data.length === CAMPAIGNS_PER_PAGE);
            setPage(currentPage + 1);
        }

        setLoading(false);
        setLoadingMore(false);
    }, [page, hasMore, loadingMore, query, user, isDashboard]);

    // Effect to trigger a reset fetch when dependencies change
    useEffect(() => {
        // This effect correctly captures changes in query or user identity,
        // triggering a full refresh of the campaign list.
        fetchCampaigns(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, user, isDashboard]);

    return { campaigns, loading, loadingMore, hasMore, error, loadMore: () => fetchCampaigns(false) };
};