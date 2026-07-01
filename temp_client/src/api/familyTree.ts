import { useQuery, useMutation } from '@tanstack/react-query';
import {
  APICreateFamilyResponse, APIEndpointResponse, FamilyTree,
  FormField, MembersPositions, FamilyMember, FamilyTreeRecord,
  DeleteMembersRequestPayload,
  FamilyTreeDAOV2,
  CreateTreeResponseV2,
  ViewTreeResponseV2
} from "types";
import { baseUrl } from "./index";

//#region API Functions
const getAllTreesForUser = async (): Promise<APIEndpointResponse<FamilyTreeRecord[]>> => {
  const response = await fetch(`${baseUrl}/trees/index`, { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`Failed to get trees for user: ${response.statusText}`);
  }

  return response.json();
};
// #endregion
const getTreeById = async (treeId: string): Promise<CreateTreeResponseV2> => {
  const response = await fetch(`${baseUrl}/trees/details?id=${treeId}`, { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`Failed to get tree by ID: ${response.statusText}`);
  }

  return response.json();
};

const createFamilyTree = async (values: FamilyTreeDAOV2): Promise<CreateTreeResponseV2> => {
  const response = await fetch(`${baseUrl}/trees/new`, {
    method: 'POST',
    credentials: 'include',
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

const deleteTree = async (id: number): Promise<void> => {
  const response = await fetch(`${baseUrl}/trees/delete/${id}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to delete family tree: ${response.statusText}`);
  }

  return response.json();
};

const getMembers = async (treeId: number) => {
  const response = await fetch(`${baseUrl}/trees/members?id=${treeId}`, { credentials: 'include' });

  if (!response.ok) {
    throw new Error(`Failed to get members: ${response.statusText}`);
  }

  return response.json();
};

const addMembers = async (treeData: FamilyTree): Promise<APIEndpointResponse<{ payload: FamilyTree }>> => {
  const response = await fetch(`${baseUrl}/trees/members`, {
    method: 'PUT',
    credentials: 'include',
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
    credentials: 'include',
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
    credentials: 'include',
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

const deleteAllTree = async (): Promise<APIEndpointResponse<{ payload: null }>> => {
  const response = await fetch(`${baseUrl}/trees/bulk-delete`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to flush the trees: ${response.statusText}`);
  }

  return response.json();
};
//#endregion

//#region React Query Hooks
export const useGetAllForUser = () => {
  return useQuery({
    queryKey: ['familyTrees'],
    queryFn: () => getAllTreesForUser(),
  });
};

export const useGetTreeById = (treeId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['familyTree', 'details', treeId],
    queryFn: () => getTreeById(treeId),
    enabled
  });
};

export const useCreateFamilyTree = () => {

  return useMutation({
    mutationFn: createFamilyTree,
  });
};

export const useGetMembers = (treeId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['familyTree', 'members', treeId],
    queryFn: () => getMembers(treeId),
  });
};

export const useAddMembers = () => {

  return useMutation({
    mutationFn: addMembers,
  });
};

export const useChangeMemberPositions = () => {

  return useMutation({
    mutationFn: updateMemberPositions,
  });
};

export const useDeleteMembers = () => {

  return useMutation({
    mutationFn: deleteMember
  });
};

export const useDeleteTree = (id: number) => {
  return useMutation({
    mutationFn: () => deleteTree(id)
  });
};

export const useDeleteAllTree = () => {
  return useMutation({
    mutationFn: deleteAllTree
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
  deleteAllTree
};
//#endregion 