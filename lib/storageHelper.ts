/**
 * Parses a Supabase Storage URL to extract the bucket name and file path.
 * This is a pure helper function used for file cleanup operations.
 * @param {string} url The public URL of the file in Supabase Storage.
 * @returns {{ bucket: string; path: string } | null} An object with bucket and path, or null if parsing fails.
 */
export const getStorageInfo = (url: string): { bucket: string; path: string } | null => {
    try {
        const urlObject = new URL(url);
        const pathParts = urlObject.pathname.split('/');
        // The path is typically /storage/v1/object/public/bucket_name/file_path
        const publicIndex = pathParts.indexOf('public');
        if (publicIndex !== -1 && pathParts.length > publicIndex + 2) {
            const bucket = pathParts[publicIndex + 1];
            const path = pathParts.slice(publicIndex + 2).join('/');
            return { bucket, path };
        }
        return null;
    } catch (e) {
        console.warn("Could not parse storage URL for cleanup:", url, e);
        return null;
    }
};

/**
 * Creates a plain text snippet from HTML content.
 * @param {string} html The HTML string.
 * @param {number} maxLength The maximum length of the snippet.
 * @returns {string} A plain text string.
 */
export const createSnippet = (html: string, maxLength: number = 160): string => {
    if (!html) return '';
    // This function must run in a browser environment to use DOMParser
    if (typeof window === 'undefined' || typeof window.DOMParser === 'undefined') {
        // Fallback for non-browser environments, just strip tags crudely
        return html.replace(/<[^>]+>/g, '').trim().slice(0, maxLength);
    }
    // Strip HTML tags and decode entities
    const text = new window.DOMParser().parseFromString(html, 'text/html').body.textContent || '';
    // Trim and cut to length
    return text.trim().slice(0, maxLength);
}
