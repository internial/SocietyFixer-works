import { useContext } from 'react';
import { ToastContext } from '../components/ToastProvider';
import type { ToastContextType } from '../types';

/**
 * Custom hook for accessing the toast notification context.
 * It provides a convenient `addToast` function to display notifications.
 * Throws an error if used outside of a ToastProvider.
 *
 * @returns {ToastContextType} The toast context value.
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
