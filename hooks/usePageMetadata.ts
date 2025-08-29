import { useEffect } from 'react';

const defaultTitle = 'SocietyFixer';
const defaultDescription = 'A platform for political candidates to create campaign pages, share policies, and connect with voters. Empowering democracy by focusing on ideas, not fundraising.';

/**
 * A custom hook to dynamically manage the page's title and meta description for SEO.
 *
 * @param {string} [title] - The title to set for the page.
 * @param {string} [description] - The meta description for the page.
 */
export const usePageMetadata = (title?: string, description?: string) => {
  useEffect(() => {
    // Set the document title
    const finalTitle = title ? `${title} | SocietyFixer` : defaultTitle;
    if (document.title !== finalTitle) {
      document.title = finalTitle;
    }

    // Find or create the meta description tag
    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }

    // Set the meta description content
    const finalDescription = description || defaultDescription;
    if (metaDescription.content !== finalDescription) {
        metaDescription.content = finalDescription;
    }
    
    // Cleanup function to reset to defaults when the component unmounts
    return () => {
        if (document.title !== defaultTitle) {
            document.title = defaultTitle;
        }
         if (metaDescription && metaDescription.content !== defaultDescription) {
            metaDescription.content = defaultDescription;
        }
    };
  }, [title, description]); // Rerun effect if title or description changes
};
