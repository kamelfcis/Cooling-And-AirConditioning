import { useState, useEffect } from 'react';
import { supabase, User } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUser(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUser(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUser = async (userId: string) => {
    try {
      // Use maybeSingle instead of single to avoid errors when no rows exist
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user:', error);
        setUser(null);
        setLoading(false);
        return;
      }

      // If user doesn't exist in public.users, create a default one
      if (!data) {
        // Get auth user metadata
        const { data: authUser } = await supabase.auth.getUser();
        
        if (authUser?.user) {
          // Create default user record
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              id: userId,
              name: authUser.user.email?.split('@')[0] || 'User',
              role: 'customer',
            })
            .select()
            .maybeSingle();

          if (insertError) {
            console.error('Error creating user:', insertError);
            console.error('This might be due to RLS policies. Please ensure users can insert their own profile.');
            setUser(null);
          } else if (newUser) {
            setUser(newUser);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error in fetchUser:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, session, loading };
}

