
interface TransformOptions {
    width: number;
    height: number;
    resize?: 'cover' | 'contain' | 'fill';
}

/**
 * Transforms a public Supabase Storage URL to request a resized and optimized image.
 * This is crucial for performance, ensuring that clients download appropriately-sized images.
 * 
 * @param {string} publicUrl The original public URL of the image from Supabase Storage.
 * @param {TransformOptions} options The transformation options (width, height, resize mode).
 * @returns {string} The new URL with transformation parameters, or the original URL if it's invalid.
 */
export const transformImageUrl = (publicUrl: string, options: TransformOptions): string => {
    if (!publicUrl) return '';
    try {
        const url = new URL(publicUrl);
        // The path for transformation is different from the path for direct object access.
        // We replace `/object/` with `/render/image/`
        if (url.pathname.includes('/object/')) {
            url.pathname = url.pathname.replace('/object/', '/render/image/');
            
            // Append the transformation options as query parameters
            url.searchParams.set('width', String(options.width));
            url.searchParams.set('height', String(options.height));
            if (options.resize) {
                url.searchParams.set('resize', options.resize);
            }
            // You can add more options here, like 'format' or 'quality'
            // url.searchParams.set('quality', '80');
            // url.searchParams.set('format', 'webp');
            
            return url.toString();
        }
        return publicUrl; // Return original if it's not a standard object URL
    } catch (error) {
        console.error("Invalid URL for image transformation:", publicUrl, error);
        return publicUrl; // Return original on error
    }
};
