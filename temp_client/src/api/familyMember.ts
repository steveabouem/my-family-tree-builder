import { useQuery } from '@tanstack/react-query';
import { APIEndpointResponse, GetFamilyMemberResponse } from 'types';
import { baseUrl } from './index';

const getMemberDetails = async (id: number): Promise<APIEndpointResponse<GetFamilyMemberResponse>> => {
  const response = await fetch(`${baseUrl}/members/${id}`, {
    credentials: 'include',
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

export { getMemberDetails };

