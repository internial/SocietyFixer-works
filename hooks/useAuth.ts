
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../components/AuthProvider';

/**
 * Custom hook for accessing the authentication context.
 * It provides a convenient way to get the user, session, and other auth-related data.
 * Throws an error if used outside of an AuthProvider.
 *
 * @returns {AuthContextType} The authentication context value.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};