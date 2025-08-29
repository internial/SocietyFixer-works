import React, { createContext, useState, ReactNode, useMemo, useCallback } from 'react';
import type { ToastMessage, ToastContextType } from '../types';

/**
 * The context for managing toast notifications throughout the application.
 */
export const ToastContext = createContext<
    { toasts: ToastMessage[]; addToast: (toast: Omit<ToastMessage, 'id'>) => void; removeToast: (id: number) => void; } | undefined
>(undefined);

/**
 * The ToastProvider component wraps the application and provides the toast notification system
 * to all child components through the ToastContext.
 *
 * @param {object} props The component props.
 * @param {React.ReactNode} props.children The child components to be rendered within the provider.
 * @returns {React.JSX.Element} The rendered ToastProvider component.
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
        const id = Date.now();
        setToasts((prevToasts) => [...prevToasts, { id, ...toast }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);
    
    // useMemo helps to prevent unnecessary re-renders of consuming components
    const contextValue = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast]);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
        </ToastContext.Provider>
    );
};
