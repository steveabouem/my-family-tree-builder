import { FamilyMember } from "services/api.definitions";

export const formatTreeMemberDAOList = (v: FamilyMember[]) => {
  const formattedNodes = v?.reduce((nodeList: any, member: FamilyMember) => {
    let childrenIds: any = null;
    let siblingsIds: any = null;
    let spousesIds: any = null;

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

    return ({
      ...nodeList,
      [member.node_id]: {
        data: {
          ...member,
          type: 'blackbox',
          position: JSON.parse(member?.position || '{"x": 0, "y": 0}'),
          id: member.node_id,
          children: childrenIds,
          siblings: siblingsIds,
          spouses: spousesIds,
        },
        ...member,
          type: 'blackbox',
          position: JSON.parse(member?.position || '{"x": 0, "y": 0}'),
          id: member.node_id,
          children: childrenIds,
          siblings: siblingsIds,
          spouses: spousesIds,
      }
    })
  }, {});

  return formattedNodes;
}