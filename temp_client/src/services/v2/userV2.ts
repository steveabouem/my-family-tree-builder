import { useQuery } from '@tanstack/react-query';
import { DUserRelatedFamily } from "../api.definitions";
import { baseUrl } from "../index";

// API functions using fetch instead of axios
const getRelatedFamiliesAPI = async (id: string): Promise<DUserRelatedFamily[]> => {
  if (!id) {
    return [];
  }

  const response = await fetch(`${baseUrl}/${id}/families`);
  
  if (!response.ok) {
    throw new Error(`Failed to get related families: ${response.statusText}`);
  }
  
  return response.json();
};

const getExtendedFamiliesAPI = async (id: number): Promise<any> => {
  // get all families of the same level in the tree (families grouped by parents and children' spouses' parents) for a given user
  const response = await fetch(`${baseUrl}/users/${id}/extended`);
  
  if (!response.ok) {
    throw new Error(`Failed to get extended families: ${response.statusText}`);
  }
  
  return response.json();
};

// React Query hooks
export const useGetRelatedFamilies = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['user', 'relatedFamilies', id],
    queryFn: () => getRelatedFamiliesAPI(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetExtendedFamilies = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['user', 'extendedFamilies', id],
    queryFn: () => getExtendedFamiliesAPI(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Export the API functions for direct use if needed
export {
  getRelatedFamiliesAPI,
  getExtendedFamiliesAPI
}; 