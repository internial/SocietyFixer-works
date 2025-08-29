import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/useToast';
import Spinner from '../components/Spinner';
import { usePageMetadata } from '../hooks/usePageMetadata';

/**
 * Page for users to update their password after requesting a password reset.
 * This page should only be accessed via a valid link from a password recovery email.
 * @returns {React.JSX.Element} The rendered update password page.
 */
export default function UpdatePasswordPage() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasSession, setHasSession] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);

    usePageMetadata("Update Your Password");

    useEffect(() => {
        // Supabase client automatically parses the URL fragment for an access token.
        // We listen for the PASSWORD_RECOVERY event to confirm the user is valid.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setHasSession(true);
            }
             // This also covers the case where the session is already established when the component mounts
            if(session) {
                setHasSession(true);
            }
            setIsVerifying(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        setError('');

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(`Error updating password: ${error.message}`);
            setLoading(false);
        } else {
            addToast({ message: "Password updated successfully!", type: 'success' });
            await supabase.auth.signOut(); // Ensure user logs in with new password
            setTimeout(() => navigate('/auth'), 2000); // Redirect after toast is seen
        }
    };
    
    if (isVerifying) {
        return <Spinner />;
    }

    if (!hasSession) {
        return (
            <div className="mx-auto mt-5 text-center" style={{maxWidth: '450px'}}>
                <div className="alert alert-danger">
                    <h1 className="h5">Invalid or Expired Link</h1>
                    <p>This password reset link is either invalid or has expired. Please request a new one.</p>
                    <button onClick={() => navigate('/auth?view=forgot')} className="btn btn-primary mt-2">Request New Link</button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto mt-5" style={{maxWidth: '400px'}}>
            <div className="card bg-body-secondary p-4 shadow-lg">
                <div className="card-body">
                    <h1 className="card-title text-center h4 mb-4">Create a New Password</h1>
                    <form onSubmit={handleUpdatePassword} className="d-grid gap-3">
                        <div>
                             <label htmlFor="new-password" className="form-label visually-hidden">New Password</label>
                             <input
                                id="new-password"
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div>
                             <label htmlFor="confirm-password" className="form-label visually-hidden">Confirm New Password</label>
                             <input
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="form-control"
                                required
                                aria-invalid={!!error}
                                aria-describedby={error ? "password-error" : undefined}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                        {error && <p id="password-error" className="text-danger text-sm text-center mt-2" role="alert">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}