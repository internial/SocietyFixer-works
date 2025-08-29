import React from 'react';
import { usePageMetadata } from '../hooks/usePageMetadata';

/**
 * A comprehensive, static page outlining the Terms of Service.
 * @returns {React.JSX.Element} The rendered Terms of Service page.
 */
export default function TermsOfServicePage() {
  usePageMetadata(
    "Terms of Service",
    "Read the Terms of Service for using SocietyFixer. Understand your rights and responsibilities when using our platform."
  );

  return (
    <div className="py-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="h2 fw-bold text-light mb-4 text-center">Terms of Service</h1>
      <div className="card bg-body-secondary p-4 p-md-5 shadow-sm">
        <p className="lead">Welcome to SocietyFixer. By accessing or using our services, you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy.</p>
        
        <h2 className="h5 fw-semibold mt-4">1. Acceptance of Terms</h2>
        <p>This is a binding agreement. If you do not agree to these Terms, you may not use the service. We may modify these Terms at any time, and such modifications will be effective immediately upon posting.</p>
        
        <h2 className="h5 fw-semibold mt-4">2. User Accounts and Conduct</h2>
        <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must not use the service for any illegal or unauthorized purpose. You agree to comply with all laws, rules, and regulations applicable to your use of the service.</p>

        <h2 className="h5 fw-semibold mt-4">3. Prohibited Conduct</h2>
        <p>You agree not to engage in any of the following prohibited activities:</p>
        <ul>
          <li>Posting content that is unlawful, harmful, defamatory, or obscene.</li>
          <li>Engaging in hate speech, harassment, or incitement of violence.</li>
          <li>Impersonating any person or entity or falsely stating or otherwise misrepresenting your affiliation with a person or entity.</li>
          <li>Distributing spam, chain letters, or pyramid schemes.</li>
          <li>Uploading viruses or other malicious code.</li>
        </ul>
        <p>We reserve the right to remove content and terminate accounts that violate these rules.</p>

        <h2 className="h5 fw-semibold mt-4">4. Content You Provide</h2>
        <p>You retain all rights to the content you post to SocietyFixer. However, by posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection with the service. You are solely responsible for the content you post, including its legality, reliability, and appropriateness.</p>

        <h2 className="h5 fw-semibold mt-4">5. Our Intellectual Property</h2>
        <p>The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of SocietyFixer and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>

        <h2 className="h5 fw-semibold mt-4">6. Termination</h2>
        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>

        <h2 className="h5 fw-semibold mt-4">7. Disclaimers and Limitation of Liability</h2>
        <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that the service will be uninterrupted, secure, or error-free. In no event shall SocietyFixer be liable for any indirect, incidental, special, consequential or punitive damages arising out of or in connection with your use of the service.</p>

        <p className="mt-4 text-secondary text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>
  );
}