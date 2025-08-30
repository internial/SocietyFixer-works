import React from 'react';
import { usePageMetadata } from '../hooks/usePageMetadata';

// Data for the presidential candidates
const candidates = [
    {
        name: 'Joe Biden',
        party: 'Democrat',
        portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Joe_Biden_presidential_portrait.jpg/440px-Joe_Biden_presidential_portrait.jpg',
        websiteUrl: 'https://joebiden.com/',
    },
    {
        name: 'Donald Trump',
        party: 'Republican',
        portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/440px-Donald_Trump_official_portrait.jpg',
        websiteUrl: 'https://www.donaldjtrump.com/',
    }
];

/**
 * A dedicated page for the 2024 Presidential Race, featuring the main candidates.
 * @returns {React.JSX.Element} The rendered Presidential Race page.
 */
export default function PresidentialRacePage() {
    usePageMetadata(
        "2024 Presidential Race",
        "Explore the platforms of the leading candidates in the 2024 US Presidential Election, Joe Biden and Donald Trump. Find links to their official campaign websites."
    );

    return (
        <div className="py-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header className="text-center mb-5">
                <h1 className="display-5 fw-bold text-light">2024 Presidential Race</h1>
                <p className="fs-5 text-secondary">
                    This page provides a neutral space to find information on the leading candidates for the President of the United States. Explore their official campaign websites to learn more about their policies and vision for the country.
                </p>
            </header>

            <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center">
                {candidates.map((candidate) => (
                    <div className="col" key={candidate.name}>
                        <div className="card h-100 bg-body-secondary border-secondary shadow-sm text-center">
                             <img
                                src={candidate.portraitUrl}
                                className="card-img-top"
                                alt={`Portrait of ${candidate.name}`}
                                style={{ height: '300px', objectFit: 'contain', backgroundColor: 'var(--bs-body-tertiary)' }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title h4 fw-bold text-light">{candidate.name}</h5>
                                <p className="card-text text-primary fw-medium">{candidate.party}</p>
                                <div className="mt-auto">
                                    <a
                                        href={candidate.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                    >
                                        Visit Campaign Website
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             <div className="text-center p-4 mt-5 bg-body-tertiary rounded-3 border border-secondary">
                <h3 className="h5 fw-semibold">Independent & Third-Party Candidates</h3>
                <p className="text-secondary mb-0">
                    While this page highlights the two major party candidates, we encourage voters to research all individuals running for office. Information on other candidates can often be found on state election websites and through non-partisan resources like Ballotpedia.
                </p>
            </div>
        </div>
    );
}