import axios, { AxiosResponse } from "axios";
import { baseUrl } from ".";
import { APIRequestPayload, FamilyTree, FormField } from "types";

export const getAllForUser = async (userId: number) => {
  const results = axios.get(`${baseUrl}/trees/index?member=${userId}`);
  return results;
};

export const getTreeById = async (treeId: string) => {
  const results = axios.get(`${baseUrl}/trees/details?id=${treeId}`);
  return results;
};

export const createFamilyTree = async (values: FamilyTree) => {
  const results = axios.post(`${baseUrl}/trees/create`, { ...values });
  return results;
};

export const getMembers = async (treeId: number) => {
  const results = axios.get(`${baseUrl}/trees/members?id=${treeId}`);
  return results;
};

export const addMembers = async (treeData: FamilyTree): Promise<AxiosResponse<APIRequestPayload<{ payload: FamilyTree }>>> => {
  const results: any = axios.put(`${baseUrl}/trees/members`, { ...treeData });
  return results;
};

/*
* used to populate step form of family genealogy narrator
*/
export const getGenealogyFormFieldsForStep = async (step: number): Promise<FormField[]> => {
  // @ts-ignore
  const results: FormField[] = axios.get(`${baseUrl}/trees/narration-fields?step=${step}`);
  return results;
};