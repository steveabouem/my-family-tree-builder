import axios from "axios";
import { baseUrl } from "..";

export const getCurrent = async (id: number) => {
  const result = await axios.get(`${baseUrl}/sessions?id=${id}`);

  return result;
}

export const update = async (user: any) => {
  const result = await axios.post(`${baseUrl}/sessions/set-data`, { data: user });

  return result;
}

