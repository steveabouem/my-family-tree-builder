import { APICreateFamilyResponse, FamilyMemberDTO, FamilyTree, FamilyTreeFormData, FormField, MappedFamilyMember } from "types";

export function formatIncomingValues(data: APICreateFamilyResponse) {

}
/*
 * At every step, the field names will be prefixed by the type of kin (father, mother, children etc..)
 * We need to remove that prefix to match the DAO expected by the API
 * We will use the first part of the field name to determine the type of kinship to build an array for
 * the API will handle creating a family member from each of these steps
 */

export function formatOutgoingValues(v: FamilyTreeFormData, stepsInStore: { [name: string]: FormField[] }, userId: number, treeId?: number): FamilyTree {
  let anchorAdded: boolean = false;
  console.log('Original values sent', v);
  
  const mappedMembers = Object.keys(stepsInStore).reduce((acc: any, curr: string) => {
    const formatted: FamilyMemberDTO = cleanUpValuesPrefixes(curr, v);
    // @ts-ignore
    const hasName = !!formatted?.first_name?.length;
    
    // Skip empty/ghost members that don't have valid data
    if (!hasName) {
      return acc;
    }

    // Handle anchor (first member)
    if (!anchorAdded) {
      anchorAdded = true;
      return { anchor: formatted };
    }

    const prefix = curr.split('-')[0];
    //TODO: could easily  run these in one if statement rather than 4
    if (prefix === 'son' || prefix === 'daughter') {
      const existingChildren = Array.isArray(acc?.anchor?.children) ? acc.anchor.spouses : [];

      acc = {
        ...acc,
        // add current child to anchor's children
        anchor: {
          ...acc?.anchor || {},
          children: [...existingChildren || [], formatted.node_id]
        },
      };
    } else if (prefix === 'brother' || prefix === 'sister') {
      const existingSiblings = Array.isArray(acc?.anchor?.siblings) ? acc.anchor.spouses : [];

      acc = {
        ...acc,
        anchor: {
          ...acc?.anchor || {},
          siblings: [...existingSiblings || [], formatted.node_id]
        }
      };
    } else if (prefix === 'mother' || prefix === 'father') {
      const existingParents = Array.isArray(acc?.anchor?.parents) ? acc.anchor.spouses : [];

      acc = {
        ...acc,
        anchor: {
          ...acc?.anchor || {},
          parents: [...existingParents || [], formatted.node_id]
        }
      };
    } else if (prefix === 'husband' || prefix === 'wife') {
      const existingSpouses = Array.isArray(acc?.anchor?.spouses) ? acc.anchor.spouses : [];

      acc = {
        ...acc,
        anchor: {
          ...acc?.anchor || {},
          spouses: [...existingSpouses, formatted.node_id]
        }
      };
    }
    acc = { ...acc, [prefix]: formatted };

    return acc;
  }, {});
  // @ts-ignore
  return { data: { anchor: v.anchor_node_id, members: Object.values(mappedMembers), userId: userId, treeName: v?.treeName || '', treeId: treeId || 1 } };
}
export function cleanUpValuesPrefixes(indicator: string, valuesObject: FamilyTreeFormData): FamilyMemberDTO {
  const formatted: FamilyMemberDTO = {
    dob: valuesObject?.[`${indicator}_dob`] || '',
    dod: valuesObject?.[`${indicator}_dod`] || '',
    node_id: valuesObject?.[`${indicator}_node_id`] || '',
    email: valuesObject?.[`${indicator}_email`] || '',
    // @ts-ignore
    first_name: valuesObject?.[`${indicator}_firstName`] || '',
    gender: valuesObject?.[`${indicator}_gender`] || '',
    last_name: valuesObject?.[`${indicator}_lastName`] || '',
    marital_status: valuesObject?.[`${indicator}_marital_status`] || '',
    occupation: valuesObject?.[`${indicator}_occupation`] || '',
    // @ts-ignore
    parents: valuesObject?.[`${indicator}_parents`] || '',
    // @ts-ignore
    siblings: valuesObject?.[`${indicator}_siblings`] || '',
    // @ts-ignore
    children: valuesObject?.[`${indicator}_children`] || '',
    age: valuesObject?.[`${indicator}_age`] || '',
    description: valuesObject?.[`${indicator}_description`] || '',
    profile_url: valuesObject?.[`${indicator}_profile_url`] || '',
    userId: valuesObject?.[`${indicator}_userId`] || '',
  };

  return formatted;
};

export const formatTreeMembers = (v: MappedFamilyMember[]) => {
  const formattedNodes = v?.reduce((nodeList: any, member: any) => {
    let childrenIds: any = null;
    let siblingsIds: any = null;
    let spousesIds: any = null;
    let parentsIds: any = null;

    if (member?.children) {
      if (Array.isArray(JSON.parse(member.children))) {
        childrenIds = JSON.parse(member.children).map((item: any) => item.node_id);
      }
    }
    if (member?.siblings) {
      if (Array.isArray(JSON.parse(member.siblings))) {
        siblingsIds = JSON.parse(member.siblings).map((item: any) => item.node_id);
      }
    }
    if (member?.spouses) {
      if (Array.isArray(JSON.parse(member.spouses))) {
        spousesIds = JSON.parse(member.spouses).map((item: any) => item.node_id);
      }
    }
    if (member?.parents) {
      if (Array.isArray(JSON.parse(member.parents))) {
        parentsIds = JSON.parse(member.parents).map((item: any) => item.node_id);
      }
    }

    return ({
      ...nodeList,
      [member.node_id]: {
        data: {
          ...member,
          type: 'blackbox',
          position: member?.position,
          id: member.node_id,
          children: childrenIds,
          siblings: siblingsIds,
          spouses: spousesIds,
        },
        ...member,
        type: 'blackbox',
        position: member?.position,
        id: member.node_id,
        children: childrenIds,
        siblings: siblingsIds,
        spouses: spousesIds,
      }
    })
  }, {});

  return formattedNodes;
}