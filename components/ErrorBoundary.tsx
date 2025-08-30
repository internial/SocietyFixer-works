import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * A component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of a blank screen.
 * It's customized to show a helpful message for missing Supabase credentials.
 */
export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || '';
      const isConfigError = errorMessage.includes("Supabase credentials are not configured");

      if (isConfigError) {
        return (
          <div className="d-flex align-items-center justify-content-center vh-100 p-3">
            <div className="card bg-body-secondary text-center p-4 shadow-lg" style={{ maxWidth: '600px' }}>
              <div className="card-body">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-exclamation-triangle-fill text-danger mb-4" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <h1 className="card-title h3 fw-bold text-danger">Configuration Error</h1>
                <p className="lead mt-3">The application cannot start because it's missing essential credentials.</p>
                <div className="alert alert-danger mt-4 text-start">
                  <p className="fw-bold mb-1">Action Required:</p>
                  <p className="mb-0">Please open the following file in your code editor:</p>
                  <code className="d-block bg-dark p-2 rounded mt-2 mb-2">lib/supabase.ts</code>
                  <p className="mb-0">Inside this file, replace the placeholder <code className="text-danger-emphasis">YOUR_SUPABASE_ANON_KEY</code> with your actual Supabase "anon" key.</p>
                </div>
                 <div className="alert alert-warning mt-3 text-start">
                    <p className="fw-bold mb-1">Gemini API Key:</p>
                    <p className="mb-0">While you're at it, please also check <code className="d-block bg-dark p-2 rounded mt-2 mb-2">services/gemini.ts</code> and ensure you've added your Gemini API key for content moderation to work correctly.</p>
                 </div>
              </div>
            </div>
          </div>
        );
      }

      // Generic fallback UI for other types of errors
      return (
        <div className="text-center p-5">
            <h1 className="h3">Something went wrong.</h1>
            <p className="text-secondary">Please try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
