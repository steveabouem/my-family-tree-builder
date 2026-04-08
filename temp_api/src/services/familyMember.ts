import { FamilyMember, FamilyTree, Relationship } from "../models";
import { APIRequestPayload, GetMemberResponse, ServiceResponseWithPayload } from "./types";
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