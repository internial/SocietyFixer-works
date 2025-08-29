import React from 'react';

/**
 * A simple, centered loading spinner component.
 * @returns {React.JSX.Element} The rendered spinner.
 */
export default function Spinner() {
    return (
        <div className="d-flex justify-content-center align-items-center p-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}
