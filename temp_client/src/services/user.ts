import axios from "axios";
import { baseUrl } from ".";

export const getExtendedFamilies = async (id: number): Promise<any> => {
  // get all families of the same level in the tree (families grouped by parents and children' spouses' parents) for a given user
  const results = axios.get(`${baseUrl}/users/${id}/extended`);
  return results;
}