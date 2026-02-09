import { useQuery } from '@tanstack/react-query';
import { baseUrl } from "./index";
import { APIGetProfileResponse } from 'types';

// API functions using fetch instead of axios
const getProfileInfo = async(id?: number): Promise<APIGetProfileResponse | null> => {
    if (!id) {
      return null;
    }
  
    const response = await fetch(`${baseUrl}/users/${id}`, {credentials: 'include'});
    
    if (!response.ok) {
      throw new Error(`Failed to get user : ${response.statusText}`);
    }
    
    return response.json();
};
// const getRelatedFamiliesAPI = async (id: string): Promise<DUserRelatedFamily[]> => {
// };

const getExtendedFamiliesAPI = async (id: number): Promise<any> => {
  // get all families of the same level in the tree (families grouped by parents and children' spouses' parents) for a given user
  const response = await fetch(`${baseUrl}/users/${id}/extended`, {credentials: 'include'});
  
  if (!response.ok) {
    throw new Error(`Failed to get extended families: ${response.statusText}`);
  }
  
  return response.json();
};

// React Query hooks
// export const useGetRelatedFamilies = (id: string, enabled: boolean = true) => {
//   return useQuery({
//     queryKey: ['user', 'relatedFamilies', id],
//     queryFn: () => getRelatedFamiliesAPI(id),
//     enabled: enabled && !!id,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// };

export const useGetExtendedFamilies = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['user', 'extendedFamilies', id],
    queryFn: () => getExtendedFamiliesAPI(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetProfileInfo = (id: number | undefined) => {
  return useQuery({
    queryKey: ['user-profile', id],
    queryFn: () => getProfileInfo(id),
    enabled: !!id
  });
};

export {
  getExtendedFamiliesAPI
}; 