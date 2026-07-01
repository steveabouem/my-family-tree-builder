import { useQuery } from '@tanstack/react-query';
import { APIEndpointResponse, GetFamilyMemberResponse, GetMemberBloodlineResponse } from 'types';
import { baseUrl } from './index';

const getMemberDetails = async (id: number): Promise<APIEndpointResponse<GetFamilyMemberResponse>> => {
  const response = await fetch(`${baseUrl}/members/${id}`, {
    credentials: 'include',
  });


  return response.json();
};

/**
 * Find all the members related by blood
 * @param id - the target family member id. 
 * @returns 
 **/
const getBybloodlineByMemberID = async(memberId?: string): Promise<GetMemberBloodlineResponse> => {
  const response = await fetch(`${baseUrl}/members/${memberId}/bloodline`, {
    credentials: 'include',
    method: 'GET',
  });

  return response.json();
};

export const useGetMemberDetails = (memberId: number) => {
  return useQuery({
    queryKey: ['familyMember', 'details', memberId],
    queryFn: () => getMemberDetails(memberId),
    enabled: !!memberId,
  });
};

export const useGetMEmberBloodline = (id: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ['bloodline'],
    queryFn: () => getBybloodlineByMemberID(id),
    enabled: enabled && !!id,
    // staleTime: 3600000 // avoid multiple triggers. This doesnt need to be up to date by the second
  });
};

export { getMemberDetails };

