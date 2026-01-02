import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { APICreateFamilyResponse, APIEndpointResponse, FamilyTree, FormField, MembersPositions, FamilyMember, FamilyTreeRecord, DeleteMembersRequestPayload, APIDeleteTreeResponse } from "types";
import { baseUrl } from "../index";

//#region API Functions
const getAllTreesForUser = async (userId?: number): Promise<APIEndpointResponse<FamilyTreeRecord[]>> => {
  if (!userId) {
    throw new Error('Invalid parameter');
  }

  const response = await fetch(`${baseUrl}/trees/index?user=${userId}`);

  if (!response.ok) {
    throw new Error(`Failed to get trees for user: ${response.statusText}`);
  }

  return response.json();
};
// #endregion
const getTreeById = async (treeId: string) => {
  const response = await fetch(`${baseUrl}/trees/details?id=${treeId}`);

  if (!response.ok) {
    throw new Error(`Failed to get tree by ID: ${response.statusText}`);
  }

  return response.json();
};

const createFamilyTree = async (values: FamilyTree): Promise<APICreateFamilyResponse> => {
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

const deleteTree = async (data: {id: number, userId: number}): Promise<void> => {
  const response =  await fetch(`${baseUrl}/trees/delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({userId: data.userId, id: data.id})
  });

  if (!response.ok) {
    throw new Error(`Failed to delete family tree: ${response.statusText}`);
  }

  return response.json();
};

const getMembers = async (treeId: number) => {
  const response = await fetch(`${baseUrl}/trees/members?id=${treeId}`);

  if (!response.ok) {
    throw new Error(`Failed to get members: ${response.statusText}`);
  }

  return response.json();
};

const addMembers = async (treeData: FamilyTree): Promise<APIEndpointResponse<{ payload: FamilyTree }>> => {
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

const updateMemberPositions = async (positions: MembersPositions): Promise<APIEndpointResponse<{ payload: FamilyMember[] }>> => {
  const response = await fetch(`${baseUrl}/trees/members/positions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(positions),
  });

  if (!response.ok) {
    throw new Error(`Failed to add members: ${response.statusText}`);
  }

  return response.json();
};

const deleteMember = async (info: DeleteMembersRequestPayload): Promise<APIEndpointResponse<{ payload: FamilyTree }>> => {
  const response = await fetch(`${baseUrl}/trees/members/remove`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ node_id: info.nodeId, treeId: info.treeId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete member: ${response.statusText}`);
  }

  return response.json();
};

const getGenealogyFormFieldsForStep = async (step: number): Promise<FormField[]> => {
  const response = await fetch(`${baseUrl}/trees/narration-fields?step=${step}`);

  if (!response.ok) {
    throw new Error(`Failed to get genealogy form fields: ${response.statusText}`);
  }

  return response.json();
};
//#endregion

//#region React Query Hooks
export const useGetAllForUser = (userId?: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['familyTrees', 'user', userId],
    queryFn: () => getAllTreesForUser(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetTreeById = (treeId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['familyTree', 'details', treeId],
    queryFn: () => getTreeById(treeId),
    enabled: enabled && !!treeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateFamilyTree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFamilyTree,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['familyTrees', 'user', variables?.id || 0] });
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
    queryFn: () => getMembers(treeId),
    enabled: enabled && !!treeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAddMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMembers,
    onSuccess: (data, variables) => {
      // Invalidate and refetch members for the tree
      queryClient.invalidateQueries({ queryKey: ['familyTree', 'members', variables?.id || 0] });
      queryClient.invalidateQueries({ queryKey: ['familyTree', 'details', variables?.id || 0] });
    },
    onError: (error) => {
      console.error('Add members failed:', error);
    }
  });
};

export const useChangeMemberPositions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMemberPositions,
    onSuccess: (data, variables) => {
      // Invalidate and refetch members for the tree
      queryClient.invalidateQueries({ queryKey: ['familyTree', 'members', 'positions'] });
      queryClient.invalidateQueries({ queryKey: ['familyTree'] });
    },
    onError: (error) => {
      console.error('Add members failed:', error);
    }
  });
};

export const useDeleteMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMember,
    onSuccess: (data, variables) => {
      console.log({data});
      
 // Invalidate and refetch members for the tree
      queryClient.invalidateQueries({ queryKey: ['familyTree', 'members', 'remove'] });
    },
    throwOnError: true,
    onError: (error) => {
      console.error('Add members failed:', error);
    }
  });
};

export const useDeleteTree = () => {
 const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTree,
    onSuccess: (data, variables) => {
      console.log({data});
      
 // Invalidate and refetch members for the tree
      queryClient.invalidateQueries({ queryKey: ['familyTree', 'delete', 'remove'] });
    },
    throwOnError: true,
    onError: (error) => {
      console.error('Add members failed:', error);
    }
  });
};

export const useGetGenealogyFormFieldsForStep = (step: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['genealogyFormFields', 'step', step],
    queryFn: () => getGenealogyFormFieldsForStep(step),
    enabled: enabled && !!step,
    staleTime: 10 * 60 * 1000, // 10 minutes - form fields don't change often
  });
};
//#endregion

//#region Exports
// Export the API functions for direct use if needed
export {
  getAllTreesForUser as getAllForUser,
  getTreeById,
  createFamilyTree,
  getMembers,
  addMembers,
  getGenealogyFormFieldsForStep
};
//#endregion 