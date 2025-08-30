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
 * Creates a plain text snippet from a string, stripping any HTML content.
 * @param {string} text The input string, potentially containing HTML.
 * @param {number} maxLength The maximum length of the snippet.
 * @returns {string} A plain text string.
 */
export const createSnippet = (text: string, maxLength: number = 160): string => {
    if (!text) return '';
    // Replace multiple whitespace chars with a single space and trim
    const plainText = text.replace(/\s+/g, ' ').trim();
    // Return a snippet of the plain text, adding an ellipsis if truncated
    return plainText.length > maxLength ? `${plainText.substring(0, maxLength)}...` : plainText;
}