import { useQuery } from '@tanstack/react-query';
import { supabase, Service } from '@/lib/supabaseClient';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Service[];
    },
  });
}

