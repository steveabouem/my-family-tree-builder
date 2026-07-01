import { FamilyMember, FamilyTree, Relationship } from "../models";
import { APIRequestPayload, GetMemberBloodlineResponse, GetMemberResponse, Kinship, ServiceResponseWithPayload } from "./types";
import logger from "../utils/logger";
import { associationAliases } from "../associations";
import { Op } from "sequelize";

export const getMemberById = async (payload: { id: number, requester: number }): Promise<ServiceResponseWithPayload<GetMemberResponse>> => {
  const response: APIRequestPayload<GetMemberResponse> = {
    code: 500,
    error: true,
    payload: {
      details: null,
      relation_to_user: null
    }
  };

  try {
    const memberRecord = await FamilyMember.findOne({
      where: { id: payload.id },
      include: [
        { model: FamilyTree, as: associationAliases.memberTree, required: false },
      ],
      subQuery: false
    });
    const userFamilyMemberRecords = await FamilyMember.findAll({ where: { user_id: payload.requester } });
    const userFamilyMemberIds = userFamilyMemberRecords?.map((r: FamilyMember | null) => r?.id || 0);
    //! TODO: ACR (make it a function even)
    /*check if current user is allowed to view this member. Conditions for that are:
      - they share a tree together AND the visibility is family_only or public
      - the current user created this member: can edit = true 
      - the current user created the parent tree  AND the visibility is family_only or public: can edit = true
      - the current user is part of the parent tree  AND the visibility is family_only or public: can edit = true
      - the current user did not create this member, or the parent tree but is part of that parent tree: can edit = false
    */
    const canViewMember = [memberRecord?.created_by_id, memberRecord?.user_id].includes(payload.requester);

    if (canViewMember) {
      /*
        return details on the member: 
        - civic info
        - relationship to current user
      */
      const relationshipToCurrentUser = await Relationship.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { target_family_member_id: memberRecord?.id || 0 },
                { source_family_member_id: memberRecord?.id || 0 },
              ]
            },
            {
              [Op.or]: [
                { target_family_member_id: { [Op.in]: userFamilyMemberIds } },
                { source_family_member_id: { [Op.in]: userFamilyMemberIds } },
              ]
            }
          ]
        }
      });

      logger.info('Is member related to current user? ', { relationshipToCurrentUser, userFamilyMemberRecords, memberRecord, canViewMember });
      response.code = 200;
      response.error = false;
      response.payload = {
        details: memberRecord,
        relation_to_user: relationshipToCurrentUser,
      };
    }
  } catch (e: unknown) {
    logger.error('MEmber unavailable:', { error: e, payload });
  }

  return response;
};

export const getBloodline = async (memberId: number): Promise<ServiceResponseWithPayload<GetMemberBloodlineResponse>> => {
  const response: ServiceResponseWithPayload<GetMemberBloodlineResponse> = { code: 500, error: true, payload: { connections: [], members: [] } };

  try {
    // TODO: investigate why include fails , its simpler and less verbose
    // get mmber record
    const member = await FamilyMember.findByPk(memberId);

    if (!member) {
      response.code = 404;
      response.message = 'Invalid data';
      return response;
    }

    // get tree record
    const tree = await FamilyTree.findByPk(member.tree_id);

    if (!tree) {
      response.code = 404;
      response.message = 'Invalid data';
      return response;
    }

    const relations = await
      Relationship.findAll({
        where: {
          tree_id: tree.id
        }
      });

    const nonSpouseRelations = relations.filter(r => r.type !== Kinship.spouse);
    const relationAdjacency = new Map<number, Relationship[]>();

    for (const relation of nonSpouseRelations) {
      const sourceRelations = relationAdjacency.get(relation.source_family_member_id) || [];
      sourceRelations.push(relation);
      relationAdjacency.set(relation.source_family_member_id, sourceRelations);

      const targetRelations = relationAdjacency.get(relation.target_family_member_id) || [];
      targetRelations.push(relation);
      relationAdjacency.set(relation.target_family_member_id, targetRelations);
    }

    const queue: number[] = [member.id];
    const visitedMemberIds = new Set<number>([member.id]);
    const visitedRelationIds = new Set<number>();
    const bloodlineRelations: Relationship[] = [];

    while (queue.length > 0) {
      const currentMemberId = queue.shift()!;
      const connectedRelations = relationAdjacency.get(currentMemberId) || [];

      for (const relation of connectedRelations) {
        if (!visitedRelationIds.has(relation.id)) {
          visitedRelationIds.add(relation.id);
          bloodlineRelations.push(relation);
        }

        const nextMemberId = relation.source_family_member_id === currentMemberId
          ? relation.target_family_member_id
          : relation.source_family_member_id;

        if (!visitedMemberIds.has(nextMemberId)) {
          visitedMemberIds.add(nextMemberId);
          queue.push(nextMemberId);
        }
      }
    }

    const bloodlineMemberIds = Array.from(visitedMemberIds);
    const bloodlineMembers = await FamilyMember.findAll({
      where: { id: { [Op.in]: bloodlineMemberIds } }
    });
    logger.info('bloodline relationships and members', { bloodlineMembers, bloodlineRelations });

    response.payload.connections = bloodlineRelations;
    response.payload.members = bloodlineMembers;
    response.code = 200;

    return response;
  } catch (e: unknown) {
    logger.error('Failed', { e })
    return response;
  }
};

// export const savePosition = (payload: {})