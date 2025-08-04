import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { baseUrl } from "../index";

// API functions using fetch instead of axios
const getCurrentSessionAPI = async (id: number) => {
  const response = await fetch(`${baseUrl}/sessions?id=${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get current session: ${response.statusText}`);
  }
  
  return response.json();
};

const updateSessionAPI = async (user: any) => {
  const response = await fetch(`${baseUrl}/sessions/set-data`, {
    method: 'POST',
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
export const useGetCurrentSession = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['session', 'current', id],
    queryFn: () => getCurrentSessionAPI(id),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateSessionAPI,
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

// Export the API functions for direct use if needed
export {
  getCurrentSessionAPI,
  updateSessionAPI
}; 