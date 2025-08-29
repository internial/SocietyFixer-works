import React, { useState, useEffect } from 'react';
import { usePageMetadata } from '../hooks/usePageMetadata';

/**
 * A static contact page that displays contact information.
 * The email link is constructed with JavaScript to deter simple spam bots.
 * @returns {React.JSX.Element} The rendered Contact page.
 */
export default function ContactPage() {
  usePageMetadata(
    "Contact Us",
    "Get in touch with the SocietyFixer team. We welcome your questions, feedback, and support inquiries."
  );

  const [email, setEmail] = useState('');

  useEffect(() => {
    // Construct the email address on the client-side to make it harder for bots to scrape.
    const user = 'societyfixer.contact';
    const domain = 'gmail.com';
    setEmail(`${user}@${domain}`);
  }, []);

  return (
    <div className="py-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="h2 fw-bold text-light mb-4 text-center">Contact Us</h1>
      <div className="card bg-body-secondary p-4 p-md-5 shadow-sm text-center">
        <p className="lead">
          We'd love to hear from you! Whether you have a question, feedback, or need support, please don't hesitate to reach out.
        </p>
        
        <div className="mt-4">
          <h2 className="h5 fw-semibold">Our Email</h2>
          {email ? (
            <a href={`mailto:${email}`} className="fs-5 text-primary">
              {email}
            </a>
          ) : (
            <p className="fs-5 text-primary" aria-live="polite" aria-busy="true">
              Loading contact information...
            </p>
          )}
          <p className="text-secondary text-sm mt-2">
            To prevent spam, our email address is loaded via JavaScript. Please ensure it is enabled in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}