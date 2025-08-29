
import React, { useContext } from 'react';
import { ToastContext } from './ToastProvider';
import Toast from './Toast';

/**
 * A container that renders all active toast notifications.
 * It positions them in a fixed location on the screen.
 * @returns {React.JSX.Element} The rendered container with toasts.
 */
export default function ToastContainer() {
    const context = useContext(ToastContext);

    if (!context) return null; // Should not happen if wrapped in provider

    const { toasts, removeToast } = context;

    return (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onClose={removeToast} />
            ))}
        </div>
    );
}
