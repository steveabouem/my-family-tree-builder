import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DFormField } from "../../components/common/definitions";
import { DApiResponse, DFamilyTreeDAO, DFamilyTreeRecord } from "../api.definitions";
import { baseUrl } from "../index";

// API functions using fetch instead of axios
const getAllForUserAPI = async (userId: number) => {
  const response = await fetch(`${baseUrl}/trees/index?member=${userId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get trees for user: ${response.statusText}`);
  }
  
  return response.json();
};

const getTreeByIdAPI = async (treeId: string) => {
  const response = await fetch(`${baseUrl}/trees/details?id=${treeId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get tree by ID: ${response.statusText}`);
  }
  
  return response.json();
};

const createFamilyTreeAPI = async (values: DFamilyTreeDAO) => {
  const response = await fetch(`${baseUrl}/trees/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create family tree: ${response.statusText}`);
  }
  
  return response.json();
};

const getMembersAPI = async (treeId: number) => {
  const response = await fetch(`${baseUrl}/trees/members?id=${treeId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get members: ${response.statusText}`);
  }
  
  return response.json();
};

const addMembersAPI = async (treeData: DFamilyTreeDAO): Promise<DApiResponse<{ payload: DFamilyTreeRecord }>> => {
  const response = await fetch(`${baseUrl}/trees/members`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(treeData),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to add members: ${response.statusText}`);
  }
  
  return response.json();
};

const getGenealogyFormFieldsForStepAPI = async (step: number): Promise<DFormField[]> => {
  const response = await fetch(`${baseUrl}/trees/narration-fields?step=${step}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get genealogy form fields: ${response.statusText}`);
  }
  
  return response.json();
};

// React Query hooks
export const useGetAllForUser = (userId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['familyTrees', 'user', userId],
    queryFn: () => getAllForUserAPI(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetTreeById = (treeId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['familyTree', 'details', treeId],
    queryFn: () => getTreeByIdAPI(treeId),
    enabled: enabled && !!treeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateFamilyTree = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFamilyTreeAPI,
    onSuccess: (data, variables) => {
      // Invalidate and refetch family trees for the user
      queryClient.invalidateQueries({ queryKey: ['familyTrees', 'user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['familyTrees'] });
    },
    onError: (error) => {
      console.error('Create family tree failed:', error);
    }
  });
};

export const useGetMembers = (treeId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['familyTree', 'members', treeId],
    queryFn: () => getMembersAPI(treeId),
    enabled: enabled && !!treeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAddMembers = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addMembersAPI,
    onSuccess: (data, variables) => {
      // Invalidate and refetch members for the tree
      queryClient.invalidateQueries({ queryKey: ['familyTree', 'members', variables.treeId] });
      queryClient.invalidateQueries({ queryKey: ['familyTree', 'details', variables.treeId] });
    },
    onError: (error) => {
      console.error('Add members failed:', error);
    }
  });
};

export const useGetGenealogyFormFieldsForStep = (step: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['genealogyFormFields', 'step', step],
    queryFn: () => getGenealogyFormFieldsForStepAPI(step),
    enabled: enabled && !!step,
    staleTime: 10 * 60 * 1000, // 10 minutes - form fields don't change often
  });
};

// Export the API functions for direct use if needed
export {
  getAllForUserAPI,
  getTreeByIdAPI,
  createFamilyTreeAPI,
  getMembersAPI,
  addMembersAPI,
  getGenealogyFormFieldsForStepAPI
}; 