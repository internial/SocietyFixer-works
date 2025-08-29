import React from 'react';
import { usePageMetadata } from '../hooks/usePageMetadata';

/**
 * The About Us page, explaining the mission and vision of SocietyFixer.
 * It details the problem of high campaign costs and positions the platform
 * as a neutral, accessible, and policy-focused solution.
 * @returns {React.JSX.Element} The rendered About Us page.
 */
export default function AboutPage() {
  usePageMetadata(
    "About Us",
    "Learn about SocietyFixer's mission to dismantle financial barriers in politics by providing a free, neutral platform for candidates to focus on policy, not fundraising."
  );

  return (
    <div className="py-4" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header className="text-center mb-5">
          <h1 className="display-5 fw-bold text-light">Fixing Society, One Policy at a Time</h1>
          <p className="fs-5 text-secondary">Our mission is to dismantle the financial barriers in politics, providing a free and neutral platform where the strength of a candidate's ideas—not the size of their bank account—determines their ability to connect with voters.</p>
        </header>

        {/* The Problem Card */}
        <div className="card bg-body-secondary shadow-lg mb-5">
            <div className="card-body p-4 p-md-5">
                <h2 className="h3 fw-bold text-primary mb-3">The Problem: Money Over Mission</h2>
                <p className="lead text-body-secondary">
                    American elections have devolved into a money race, creating an insurmountable barrier for qualified individuals and shifting focus from substantive policy to endless fundraising. The system is broken, favoring the wealthy and well-connected over the will of the people.
                </p>
                
                <h3 className="h4 fw-semibold text-center mt-5 mb-4">By the Numbers</h3>
                <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
                    <div className="col">
                        <div className="card h-100 text-center p-3 bg-primary-subtle border-primary shadow-sm">
                            <h3 className="display-5 fw-bold text-primary-emphasis mb-0">$14.4B</h3>
                            <p className="mb-0 fw-medium text-body-secondary">Total Campaign Spending in Federal Elections (2020)</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card h-100 text-center p-3 bg-success-subtle border-success shadow-sm">
                           <h3 className="display-5 fw-bold text-success-emphasis mb-0">$5.7B</h3>
                            <p className="mb-0 fw-medium text-body-secondary">Campaign Cost of Presidential Race (2020)</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card h-100 text-center p-3 bg-info-subtle border-info shadow-sm">
                           <h3 className="display-5 fw-bold text-info-emphasis mb-0">$26.3M</h3>
                            <p className="mb-0 fw-medium text-body-secondary">Avg. Cost to Win a Senate Seat (2022)</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card h-100 text-center p-3 bg-warning-subtle border-warning shadow-sm">
                           <h3 className="display-5 fw-bold text-warning-emphasis mb-0">$2.8M</h3>
                            <p className="mb-0 fw-medium text-body-secondary">Avg. Cost to Win a House Seat (2022)</p>
                        </div>
                    </div>
                     <div className="col">
                        <div className="card h-100 text-center p-3 bg-danger-subtle border-danger shadow-sm">
                           <h3 className="display-5 fw-bold text-danger-emphasis mb-0">$1B+</h3>
                            <p className="mb-0 fw-medium text-body-secondary">"Dark Money" Spent in Midterms (2022)</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card h-100 text-center p-3 bg-body-tertiary border-secondary shadow-sm">
                           <h3 className="display-5 fw-bold text-light mb-0">~50%</h3>
                            <p className="mb-0 fw-medium text-body-secondary">Time Congress Members Spend Fundraising</p>
                            <small className="text-secondary mt-1 d-block">Diverting focus from governance.</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Our Solution Card */}
        <div className="card bg-body-secondary shadow-lg mb-5">
            <div className="card-body p-4 p-md-5">
                <h2 className="h3 fw-bold text-primary mb-4">Our Solution: A Level Playing Field</h2>
                <p className="mb-4">
                    <strong>SocietyFixer</strong> challenges this status quo. We are a politically neutral platform designed to shift the focus back to where it belongs: on detailed, thoughtful policies. We believe a candidate's success should be determined by the strength of their ideas, not the size of their bank account.
                </p>
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="card bg-body-tertiary border-secondary h-100 p-4 shadow-sm">
                            <div className="d-flex align-items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-unlock-fill text-primary flex-shrink-0 me-3 mt-1" viewBox="0 0 16 16"><path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 S0 0 1-1 0V3a2 2 0 0 0-2-2"/></svg>
                                <div>
                                    <h5 className="fw-bold text-light mb-2">Accessible & Affordable</h5>
                                    <p className="text-body-secondary mb-0">Creating a campaign is free, lowering financial barriers and allowing candidates to focus on community outreach, not web development.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card bg-body-tertiary border-secondary h-100 p-4 shadow-sm">
                            <div className="d-flex align-items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-file-text-fill text-primary flex-shrink-0 me-3 mt-1" viewBox="0 0 16 16"><path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M5 4h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1m-.5 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5M5 9h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1m-1 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H4.5a.5.5 0 0 1-.5-.5"/></svg>
                                <div>
                                    <h5 className="fw-bold text-light mb-2">Policy-First</h5>
                                    <p className="text-body-secondary mb-0">Our structure highlights detailed proposals, empowering voters to make informed decisions based on substance, not rhetoric.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                         <div className="card bg-body-tertiary border-secondary h-100 p-4 shadow-sm">
                            <div className="d-flex align-items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-scales text-primary flex-shrink-0 me-3 mt-1" viewBox="0 0 16 16"><path d="M16 3a1 1 0 0 1-1 1H1a1 1 0 0 1 0-2h14a1 1 0 0 1 1 1M1 5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2zM4 9a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zm3 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zm3 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/></svg>
                                <div>
                                    <h5 className="fw-bold text-light mb-2">Politically Neutral</h5>
                                    <p className="text-body-secondary mb-0">We don't endorse any candidate or party. Our goal is to provide a fair and open forum for political discourse for everyone.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card bg-body-tertiary border-secondary h-100 p-4 shadow-sm">
                            <div className="d-flex align-items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-shield-fill-check text-primary flex-shrink-0 me-3 mt-1" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.54.918.635.13.07.248.103.33.103.083 0 .2-.034.33-.103.174-.095.532-.362.918-.635a11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.262c-.658-.215-1.777-.57-2.887-.87C9.843.266 8.69 0 8 0m2.146 6.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708.708"/></svg>
                                <div>
                                    <h5 className="fw-bold text-light mb-2">Safe and Secure</h5>
                                    <p className="text-body-secondary mb-0">We use AI moderation and robust security measures to foster a respectful environment and protect our users.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Join the Movement Card */}
         <div className="card bg-body-secondary shadow-lg">
            <div className="card-body p-4 p-md-5">
                <div className="text-center">
                    <h2 className="h3 fw-bold text-primary">Join the Movement</h2>
                    <p className="lead mt-3">A healthy democracy requires informed and engaged citizens. By making it easier for candidates to share their vision and for voters to understand it, we hope to foster a more productive and meaningful political process.</p>
                    <p>
                        Currently, our platform is focused on this single, crucial feature and is available only in the USA. We are limited by manpower, but our vision is much larger. In the future, we will expand to include America's trusted democratic allies and introduce many more features designed to make governments more effective and efficient.
                    </p>
                    <p>Whether you're a candidate ready to launch your campaign or a voter seeking clarity, SocietyFixer is your platform. Together, we can build a political landscape where ideas, not dollars, determine our future.</p>
                </div>
            </div>
        </div>
    </div>
  );
}