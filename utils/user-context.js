import {
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react'
import { supabase } from '../supabase-client';
import { syncAuthCookie } from './auth-cookie';

export const UserContext = createContext(null);

export function UserContextProvider(props) {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      // Keep the server cookie in step with token refreshes and other tabs.
      // INITIAL_SESSION with no session carries nothing to store, so skip it.
      // Not awaited: supabase runs listeners inside its auth lock.
      if (session || event === 'SIGNED_OUT') {
        syncAuthCookie(event, session).catch(() => {})
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const value = {
    session,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export function useSession() {
  const context = useContext(UserContext);
  return context;
};
