import React, { useState, useEffect } from 'react';
import { usePageMetadata } from '../hooks/usePageMetadata';
import Spinner from '../components/Spinner';

/**
 * A page that fetches and displays the content of the project's documentation.txt file.
 * This makes the developer documentation publicly accessible via a direct link.
 * @returns {React.JSX.Element} The rendered documentation page.
 */
export default function DocumentationPage() {
    usePageMetadata(
        "Developer Documentation",
        "Technical documentation for the SocietyFixer platform, detailing system architecture, features, data flow, security, and tech stack."
    );

    const [docContent, setDocContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const response = await fetch('/documentation.txt');
                if (!response.ok) {
                    throw new Error(`Failed to load documentation: ${response.statusText}`);
                }
                const text = await response.text();
                setDocContent(text);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchDocs();
    }, []);

    return (
        <div className="py-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header className="text-center mb-5">
                <h1 className="display-5 fw-bold text-light">Developer Documentation</h1>
                <p className="fs-5 text-secondary">
                    This page provides an overview of the SocietyFixer application's architecture, features, and technical implementation.
                </p>
            </header>

            <div className="card bg-body-secondary shadow-lg">
                <div className="card-body p-4 p-md-5">
                    {loading ? (
                        <Spinner />
                    ) : error ? (
                        <div className="alert alert-danger" role="alert">
                            <strong>Error:</strong> {error}
                        </div>
                    ) : (
                        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--bs-body-color)', fontSize: '0.875rem' }}>
                            {docContent}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
}