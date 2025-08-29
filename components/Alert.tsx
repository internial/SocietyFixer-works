import React from 'react';

interface AlertProps {
    type: 'success' | 'danger' | 'info' | 'warning';
    message: string;
    onClose?: () => void;
}

/**
 * A reusable, dismissible Bootstrap alert component.
 * @param {AlertProps} props - The component props.
 * @returns {React.JSX.Element | null} The rendered alert, or null if there is no message.
 */
export default function Alert({ type, message, onClose }: AlertProps) {
    if (!message) return null;

    return (
        <div className={`alert alert-${type} ${onClose ? 'alert-dismissible' : ''} fade show`} role="alert">
            {message}
            {onClose && (
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close alert"></button>
            )}
        </div>
    );
}