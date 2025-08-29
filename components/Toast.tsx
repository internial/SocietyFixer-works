import React, { useEffect, useState, useRef } from 'react';
import type { ToastMessage } from '../types';

interface ToastProps {
    toast: ToastMessage;
    onClose: (id: number) => void;
}

/**
 * A component that renders a single toast notification.
 * It handles its own show/hide animations and auto-dismissal timer.
 * @param {ToastProps} props The component props.
 * @returns {React.JSX.Element} The rendered toast notification.
 */
export default function Toast({ toast, onClose }: ToastProps) {
    const { id, message, type, duration = 5000 } = toast;
    const [show, setShow] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Effect to trigger the fade-in animation
    useEffect(() => {
        // Using a short timeout to allow the element to be in the DOM before adding the 'show' class
        const showTimeout = setTimeout(() => setShow(true), 50);
        return () => clearTimeout(showTimeout);
    }, []);
    
    // Effect to handle auto-dismissal
    useEffect(() => {
        timerRef.current = setTimeout(() => {
            setShow(false);
            // Wait for the fade-out transition to finish before removing from the DOM
            setTimeout(() => onClose(id), 400); 
        }, duration);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [id, duration, onClose]);

    const handleClose = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setShow(false);
        setTimeout(() => onClose(id), 400);
    };

    const iconMap = {
        success: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
        ),
        danger: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
        ),
        info: (
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
            </svg>
        ),
        warning: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                 <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
        )
    };

    return (
        <div 
            className={`toast align-items-center text-bg-${type} border-0 shadow-lg ${show ? 'show' : ''}`} 
            role="alert" 
            aria-live="assertive" 
            aria-atomic="true"
        >
            <div className="d-flex">
                <div className="toast-body d-flex align-items-center gap-2">
                    {iconMap[type]}
                    {message}
                </div>
                <button 
                    type="button" 
                    className="btn-close btn-close-white me-2 m-auto" 
                    onClick={handleClose} 
                    aria-label="Close"
                ></button>
            </div>
        </div>
    );
}