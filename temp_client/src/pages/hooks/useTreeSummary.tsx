import { CreateTreeResponseV2, FamilyMemberDTOV2, Gender, TreeSummary } from "types";
import { getAge } from "utils/parsingAndFormatting/dateAndTime";

export const useTreeSummary = (payload: CreateTreeResponseV2['payload'] | undefined): TreeSummary => {
  const members = payload?.members || [];
  const ages: number[] = [];
  let totalFemales = 0;
  let totalMales = 0;
  let totalOther = 0;
  const treeSummary: TreeSummary = {
    totalMembers: members.length,
    youngest: undefined,
    oldest: undefined,
    pendingInvites: 0,
    collaboratorsCount: 0,
    membersWithUserProfile: [],
    membersWithoutUserProfile: [],
    averageChildrenPerFamily: 0,
    numberOfMarriagesOrCouples: 0,
    men: 0,
    women: 0,
    other: 0,
    averageAge: 0
  };
  const membersByAgeAsc = members.sort((a: any, b: any) => {
    const ageA = getAge(a.dob);
    const ageB = getAge(b.dob);
    ages.push(ageA);
    
    return ageA - ageB;
  });
  treeSummary.youngest = membersByAgeAsc[0];
  treeSummary.oldest = membersByAgeAsc[membersByAgeAsc.length - 1];
  members.forEach((member: FamilyMemberDTOV2) => {
    if (member.user_id) {
      treeSummary.membersWithUserProfile.push(member);
    } else {
      treeSummary.membersWithoutUserProfile.push(member);
    }

    if (member.gender === Gender.Female) {
      totalFemales++;
    } else if (member.gender === Gender.Male) {
      totalMales++;
    } else {
      totalOther++;
    }
  });

  treeSummary.men = totalMales;
  treeSummary.women = totalFemales;
  treeSummary.other = totalOther;
  treeSummary.averageAge = ages.reduce((total: number, current: number) => {
    return total + current
  }, 0) / ages.length;

  return treeSummary;
};