import React from 'react';
import { usePageMetadata } from '../hooks/usePageMetadata';

/**
 * A comprehensive, static page outlining the Privacy Policy.
 * @returns {React.JSX.Element} The rendered Privacy Policy page.
 */
export default function PrivacyPolicyPage() {
  usePageMetadata(
    "Privacy Policy",
    "Learn how SocietyFixer collects, uses, and protects your personal information when you use our services to create and view political campaigns."
  );

  return (
    <div className="py-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="h2 fw-bold text-light mb-4 text-center">Privacy Policy</h1>
      <div className="card bg-body-secondary p-4 p-md-5 shadow-sm">
        <p className="lead">Your privacy is important to us. This Privacy Policy explains how SocietyFixer ("we," "us," or "our") collects, uses, and discloses information about you when you use our website and services (the "Service").</p>
        
        <h2 className="h5 fw-semibold mt-4">1. Information We Collect</h2>
        <h3 className="h6 fw-semibold mt-3 text-secondary">A. Information You Provide to Us</h3>
        <p>We collect information you provide directly to us. This includes:</p>
        <ul>
          <li><strong>Account Information:</strong> When you register for an account, we collect your email address and password.</li>
          <li><strong>Campaign Information:</strong> When you create or manage a campaign page, we collect the information you provide, such as the candidate's name, political position, policies, region, and any files you upload (e.g., portraits, resumes). This information is intended to be public.</li>
        </ul>
        
        <h3 className="h6 fw-semibold mt-3 text-secondary">B. Information We Collect Automatically</h3>
        <p>When you access or use our Service, we automatically collect certain information, including:</p>
        <ul>
            <li><strong>Log and Usage Data:</strong> We may log information about your use of the Service, including the type of browser you use, access times, pages viewed, your IP address, and the page you visited before navigating to our Service.</li>
            <li><strong>Cookies and Similar Technologies:</strong> We use cookies to help improve our Service and your experience. You may refuse to accept cookies by activating the appropriate setting on your browser.</li>
        </ul>

        <h2 className="h5 fw-semibold mt-4">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
            <li>Provide, maintain, and improve our Service.</li>
            <li>Process transactions and send you related information.</li>
            <li>Respond to your comments, questions, and requests and provide customer service.</li>
            <li>Communicate with you about products, services, offers, and events offered by SocietyFixer and others.</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our Service.</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities and protect the rights and property of SocietyFixer and others.</li>
        </ul>

        <h2 className="h5 fw-semibold mt-4">3. How We Share Your Information</h2>
        <p>We may share information about you as follows or as otherwise described in this Privacy Policy:</p>
        <ul>
            <li><strong>Publicly on the Platform:</strong> All information submitted as part of a campaign page will be publicly accessible.</li>
            <li><strong>With Service Providers:</strong> We may share your information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf (e.g., Supabase for database and storage hosting).</li>
            <li><strong>In Response to Legal Process:</strong> We may disclose your information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process.</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>

        <h2 className="h5 fw-semibold mt-4">4. Data Security</h2>
        <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no electronic storage or transmission of information over the internet is completely secure, so we cannot guarantee absolute security.</p>
        
        <h2 className="h5 fw-semibold mt-4">5. Your Rights and Choices</h2>
        <p>You can review, update, or delete your campaign information at any time by logging into your account dashboard. You may also delete your account, but please note that we may retain certain information as required by law or for legitimate business purposes.</p>

        <h2 className="h5 fw-semibold mt-4">6. Children's Privacy</h2>
        <p>Our Service is not directed to individuals under 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.</p>
        
        <h2 className="h5 fw-semibold mt-4">7. Changes to This Policy</h2>
        <p>We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the bottom of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our homepage or sending you a notification).</p>
        
        <p className="mt-4 text-secondary text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>
  );
}