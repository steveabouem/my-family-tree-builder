import { DFormField } from "components/common/definitions";
import { DApiResponse, DFamilyTreeDAO, DFamilyTreeRecord } from "services/api.definitions";
import axios, { AxiosResponse } from "axios";
import { baseUrl } from "..";

export const getAllForUser = async (userId: number) => {
  const results = axios.get(`${baseUrl}/trees/index?member=${userId}`);
  return results;
};

export const getTreeById = async (treeId: string) => {
  const results = axios.get(`${baseUrl}/trees/details?id=${treeId}`);
  // const results = axios.get(`${baseUrl}/trees/layouts?id=${treeId}`);
  return results;
};

export const createFamilyTree = async (values: DFamilyTreeDAO) => { // ! TOFIX: no any
  const results = axios.post(`${baseUrl}/trees/create`, { ...values });
  return results;
};

export const getMembers = async (treeId: number) => { // ! TOFIX: no any
  const results = axios.get(`${baseUrl}/trees/members?id=${treeId}`);
  return results;
};

export const addMembers = async (treeData: DFamilyTreeDAO): Promise<AxiosResponse<DApiResponse<{ payload: DFamilyTreeRecord }>>> => { // ! TOFIX: no any
  const results: any = axios.put(`${baseUrl}/trees/members`, { ...treeData });
  return results;
};

/*
* used to populate step form of family genealogy narrator
*/
export const getGenealogyFormFieldsForStep = async (step: number): Promise<DFormField[]> => {
  // @ts-ignore
  const results: DFormField[] = axios.get(`${baseUrl}/trees/narration-fields?step=${step}`);
  return results;
};