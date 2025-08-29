import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { usePageMetadata } from '../hooks/usePageMetadata';

const RATE_LIMIT_KEY = 'auth-rate-limit';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * AuthPage handles user login, registration, and password recovery.
 * It uses the 'view' query parameter to switch between different forms and
 * now includes client-side rate limiting to prevent brute-force attacks.
 */
export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const view = searchParams.get('view') || 'login'; // 'login', 'register', or 'forgot'

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [lockoutTime, setLockoutTime] = useState(0);

    const { session } = useAuth();

    // SEO
    const pageTitle = view === 'register' ? 'Create an Account' : view === 'forgot' ? 'Reset Password' : 'Login';
    usePageMetadata(pageTitle);
    
    const checkRateLimit = useCallback(() => {
        const item = localStorage.getItem(`${RATE_LIMIT_KEY}_${view}`);
        if (item) {
            const { lockUntil } = JSON.parse(item);
            const now = Date.now();
            if (lockUntil && lockUntil > now) {
                setLockoutTime(lockUntil);
                return true;
            }
        }
        return false;
    }, [view]);

    const handleFailedAttempt = useCallback(() => {
        const key = `${RATE_LIMIT_KEY}_${view}`;
        const item = localStorage.getItem(key);
        let data = { attempts: 0, lockUntil: 0 };
        if (item) data = JSON.parse(item);

        data.attempts += 1;
        if (data.attempts >= MAX_ATTEMPTS) {
            data.lockUntil = Date.now() + LOCKOUT_DURATION;
            setLockoutTime(data.lockUntil);
        }
        localStorage.setItem(key, JSON.stringify(data));
    }, [view]);

    // Redirect if user is already logged in
    useEffect(() => {
        if (session) navigate('/');
    }, [session, navigate]);
    
    // Manage "Remember Me"
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail && view === 'login') {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, [view]);

    // Clear state on view change and check rate limits
    useEffect(() => {
        setError('');
        setMessage('');
        setPassword('');
        checkRateLimit();
    }, [view, checkRateLimit]);
    
    // Timer to update the lockout countdown
    useEffect(() => {
        if (lockoutTime > Date.now()) {
            const interval = setInterval(() => {
                if (Date.now() >= lockoutTime) {
                    setLockoutTime(0);
                    localStorage.removeItem(`${RATE_LIMIT_KEY}_${view}`);
                    clearInterval(interval);
                } else {
                    // Force re-render to update countdown
                    setLockoutTime(t => t); 
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [lockoutTime, view]);
    
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (checkRateLimit()) return;
        setLoading(true);
        setError('');
        setMessage('');

        if (view === 'login') {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setError(error.message);
                handleFailedAttempt();
            } else {
                if (rememberMe) localStorage.setItem('rememberedEmail', email);
                else localStorage.removeItem('rememberedEmail');
                navigate('/');
            }
        } else if (view === 'register') {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin,
                },
            });
            if (error) {
                setError(error.message);
                handleFailedAttempt();
            } else {
                setMessage('Registration successful! Please check your email to verify your account.');
            }
        }
        setLoading(false);
    };
    
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (checkRateLimit()) return;
        setLoading(true);
        setError('');
        setMessage('');

        const redirectTo = `${window.location.origin}/#/update-password`;

        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) {
            setError(error.message);
            handleFailedAttempt();
        } else {
            setMessage('Password reset link sent!');
        }
        setLoading(false);
    };

    const isLocked = lockoutTime > Date.now();
    const remainingSeconds = Math.ceil((lockoutTime - Date.now()) / 1000);

    const renderFormContent = () => {
        if (view === 'register') {
            return (
                <>
                    <h1 className="card-title text-center h4 mb-4">Create an Account</h1>
                    <form onSubmit={handleAuth} className="d-grid gap-3">
                        <div>
                           <label htmlFor="email-register" className="form-label visually-hidden">Email</label>
                           <input id="email-register" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" required aria-describedby={error ? "auth-error" : undefined} />
                        </div>
                        <div>
                           <label htmlFor="password-register" className="form-label visually-hidden">Password</label>
                           <input id="password-register" type="password" placeholder="Password (min. 6 characters)" value={password} onChange={e => setPassword(e.target.value)} className="form-control" required aria-invalid={!!error} aria-describedby={error ? "auth-error" : undefined} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
                    </form>
                    <p className="text-center text-secondary text-sm mt-3">Already have an account? <Link to="/auth">Login</Link></p>
                </>
            );
        }

        if (view === 'forgot') {
            return (
                <>
                    <h1 className="card-title text-center h4 mb-4">Reset Password</h1>
                    <p className="text-center text-secondary text-sm mb-4">Enter your email and we'll send you a link to reset your password.</p>
                    <form onSubmit={handleForgotPassword} className="d-grid gap-3">
                        <div>
                            <label htmlFor="email-forgot" className="form-label visually-hidden">Email</label>
                            <input id="email-forgot" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" required aria-invalid={!!error} aria-describedby={error ? "auth-error" : undefined} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
                    </form>
                    <p className="text-center text-secondary text-sm mt-3">Remembered your password? <Link to="/auth">Login</Link></p>
                </>
            );
        }

        return ( // Login view
            <>
                <h1 className="card-title text-center h4 mb-4">Login to Your Account</h1>
                <form onSubmit={handleAuth} className="d-grid gap-3">
                    <div>
                        <label htmlFor="email-login" className="form-label visually-hidden">Email</label>
                        <input id="email-login" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" required />
                    </div>
                    <div>
                        <label htmlFor="password-login" className="form-label visually-hidden">Password</label>
                        <input id="password-login" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" required aria-invalid={!!error} aria-describedby={error ? "auth-error" : undefined} />
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="rememberMe" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                            <label className="form-check-label text-sm" htmlFor="rememberMe">Remember me</label>
                        </div>
                        <Link to="/auth?view=forgot" className="text-sm">Forgot password?</Link>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                </form>
                <p className="text-center text-secondary text-sm mt-3">Don't have an account? <Link to="/auth?view=register">Register</Link></p>
            </>
        );
    };

    return (
        <div className="mx-auto mt-5" style={{maxWidth: '400px'}}>
             <div className="card bg-body-secondary p-4 shadow-lg">
                <div className="card-body">
                    {isLocked ? (
                        <div className="text-center">
                            <h4 className="text-warning">Too Many Attempts</h4>
                            <p className="text-secondary">Please try again in {remainingSeconds} seconds.</p>
                        </div>
                    ) : (
                        <>
                            {error && <div id="auth-error" className="alert alert-danger text-sm p-2 mb-3" role="alert">{error}</div>}
                            {message && <div className="alert alert-success text-sm p-2 mb-3" role="status">{message}</div>}
                            {renderFormContent()}
                        </>
                    )}
                </div>
             </div>
        </div>
    );
}