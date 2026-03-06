import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { baseUrl } from "./index";

// TODO: obsolete. Auth middleware in api handles this
// Fetching functions
const getCurrentSession = async (sid: string | null) => {
  const response = await fetch(`${baseUrl}/sessions?id=${sid}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get current session: ${response.statusText}`);
  }
  
  return response.json();
};

const updateSession = async (user: any) => {
  const response = await fetch(`${baseUrl}/sessions/set-data`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: user }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update session: ${response.statusText}`);
  }
  
  return response.json();
};

// React Query hooks
export const useGetCurrentSession = (id: string, enabled: boolean)  => {

  return useQuery({
    queryKey: ['sessions', id],
    queryFn: () => getCurrentSession(id),
    enabled
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateSession,
    onSuccess: (data, variables) => {
      // Invalidate and refetch session data
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Update session failed:', error);
    }
  });
};

export {
  getCurrentSession,
  updateSession,
}; 