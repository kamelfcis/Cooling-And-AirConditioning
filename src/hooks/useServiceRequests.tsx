import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, ServiceRequest, ServiceStatus } from '@/lib/supabaseClient';
import { useAuth } from './useAuth';

export function useServiceRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['serviceRequests', user?.id, user?.role],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('service_requests')
        .select(`
          *,
          service:services(*),
          customer:users!service_requests_customer_id_fkey(*),
          engineer:engineers(
            *,
            user:users!engineers_user_id_fkey(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (user.role === 'customer') {
        query = query.eq('customer_id', user.id);
      } else if (user.role === 'engineer') {
        const { data: engineer } = await supabase
          .from('engineers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (engineer) {
          query = query.eq('engineer_id', engineer.id);
        } else {
          return [];
        }
      }
      // Admin can see all

      const { data, error } = await query;

      if (error) throw error;
      return data as ServiceRequest[];
    },
    enabled: !!user,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, finalPrice, notes }: {
      id: string;
      status?: ServiceStatus;
      finalPrice?: number;
      notes?: string;
    }) => {
      const updates: any = {};
      if (status) updates.status = status;
      if (finalPrice !== undefined) updates.final_price = finalPrice;
      if (notes !== undefined) updates.notes = notes;

      const { data, error } = await supabase
        .from('service_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
  });

  const assignEngineerMutation = useMutation({
    mutationFn: async ({ requestId, engineerId }: { requestId: string; engineerId: string }) => {
      const { data, error } = await supabase
        .from('service_requests')
        .update({ engineer_id: engineerId })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceRequests'] });
    },
  });

  return {
    requests: data || [],
    isLoading,
    error,
    updateStatus: updateStatusMutation.mutate,
    assignEngineer: assignEngineerMutation.mutate,
    assignEngineerAsync: assignEngineerMutation.mutateAsync,
  };
}

