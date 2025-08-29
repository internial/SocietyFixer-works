import React, { useState, useEffect } from 'react';
import { usePageMetadata } from '../hooks/usePageMetadata';

/**
 * A page dedicated to finding a cofounder for the SocietyFixer project.
 * It features a personal message and an application form for interested users.
 * @returns {React.JSX.Element} The rendered cofounder page.
 */
export default function CofounderPage() {
    usePageMetadata(
        "Searching for Technical Cofounders",
        "Join the mission to revolutionize politics. We're looking for two technical cofounders to help build and grow SocietyFixer."
    );
    
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Construct the email address on the client-side to make it harder for bots to scrape.
        const user = 'societyfixer.contact';
        const domain = 'gmail.com';
        setEmail(`${user}@${domain}`);
    }, []);

    return (
        <div className="py-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header className="text-center mb-5">
                <h1 className="display-5 fw-bold text-light">Searching for 2 Technical Cofounders</h1>
                <p className="fs-5">
                    I started SocietyFixer with a simple but powerful mission: to fix the broken political system by focusing on policy, not fundraising. Right now, we are focused on this single feature for the USA, as we are limited by manpower. However, our long-term vision is to build many more features that make the U.S. government and its allies more effective and efficient, and to expand our platform to America's trusted democratic allies. A mission this big can't be accomplished alone. I'm looking for two passionate, driven technical cofounders to join me on this journey.
                </p>
            </header>

            <div className="card bg-body-secondary shadow-lg">
                <div className="card-body p-4 p-md-5">
                    <h2 className="h3 fw-bold text-primary mb-3">We’re Searching For:</h2>
                    
                    <h3 className="h5 fw-semibold mt-4">👨‍🎨 Frontend Developer (1 Position)</h3>
                    <p className="mb-2"><strong>Skills Required:</strong></p>
                    <ul>
                        <li>React.js (Hooks, useContext)</li>
                        <li>TypeScript</li>
                        <li>Bootstrap because it is simple, concise, and maximizes productivity.</li>
                        <li>Ability to design clean, minimalist, and well-organized interfaces</li>
                    </ul>

                    <h3 className="h5 fw-semibold mt-4">🛠 Backend Developer (1 Position)</h3>
                    <p className="mb-2"><strong>Skills Required:</strong></p>
                    <ul>
                        <li>TypeScript</li>
                        <li>Supabase (Backend-as-a-Service for rapid MVP development)</li>
                        <li>AWS skills are preferable but not required. We will transition from Supabase to AWS when there are many users in the future.</li>
                    </ul>

                    <p className="fst-italic mt-3">💡 Web development technology evolves fast—you should always be ready to learn and adapt!</p>

                    <hr className="my-4" />

                    <h2 className="h3 fw-bold text-primary mb-3">Why Join SocietyFixer?</h2>
                     <ul>
                        <li><strong>Equity-based Cofounder Role:</strong> No salary, but ownership % in the company will be given to you.</li>
                        <li><strong>100% Remote work.</strong></li>
                        <li><strong>U.S. Citizenship Required</strong> and you must live in USA.</li>
                        <li><strong>Show us your past work</strong>—we care about skills & long-term commitment!</li>
                    </ul>
                    
                    <hr className="my-4" />

                    <div className="text-center">
                        <h2 className="h3 fw-bold text-primary mb-3">Ready to Join the Mission?</h2>
                        <p className="lead">If you meet the requirements above and are passionate about fixing our political system, I would love to hear from you.</p>
                        <p className="mt-3">Please send your resume to the email address below. Including a link to your portfolio (GitHub, personal website, etc.) is highly encouraged.</p>
                        <div className="mt-4">
                            {email ? (
                                <a href={`mailto:${email}`} className="fs-5 text-primary fw-bold">
                                {email}
                                </a>
                            ) : (
                                <p className="fs-5 text-primary" aria-live="polite" aria-busy="true">
                                Loading contact information...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}