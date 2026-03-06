import { useQuery } from '@tanstack/react-query';
import { APIEndpointResponse, APIGetMemberDataResponse } from 'types';
import { baseUrl } from './index';

const getMemberDetails = async (nodeId: string): Promise<APIEndpointResponse<APIGetMemberDataResponse>> => {
  const response = await fetch(`${baseUrl}/members/${nodeId}`, {
    credentials: 'include',
  });


  return response.json();
};

export const useGetMemberDetails = (memberId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['familyMember', 'details', memberId],
    queryFn: () => getMemberDetails(memberId),
    enabled: !!memberId && enabled,
  });
};

export { getMemberDetails };

