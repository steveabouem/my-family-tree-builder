import { Op } from "sequelize";
import logger from "../utils/logger";
import FamilyMember from "../models/FamilyMember";
import FamilyTree from "../models/FamilyTree";
import User from "../models/User";
import { ServiceResponseWithPayload } from "./types";

type GetMemberByIdParams = {
  memberId: number;
  userId?: number;
};

//#region getByNodeId
export const getMemberByNodeId = async (
  payload: GetMemberByIdParams
): Promise<ServiceResponseWithPayload<FamilyMember | null>> => {
  let response: ServiceResponseWithPayload<FamilyMember | null> = {
    code: 500,
    error: true,
    payload: null,
  };

  try {
    const { memberId, userId } = payload;

    if (!userId) {
      response.code = 403;
      response.error = true;
      response.message = "Unauthenticated";
      return response;
    }

    const member = await FamilyMember.findOne({where: {node_id: {[Op.like]: memberId}}});

    if (!member) {
      response.code = 500;
      response.error = true;
      response.message = "Family member not found";
      response.payload = null;
      return response;
    }

    // Check that the current user has access to at least one tree
    // that includes this member's node_id in its members list
    const userRecord = await User.findByPk(userId);

    if (!userRecord) {
      response.code = 403;
      response.error = true;
      response.message = "User not found or unauthorized";
      return response;
    }

    const trees = await FamilyTree.findAll({
      where: {
        [Op.or]: {
          emails: {
            [Op.like]: `%${userRecord.email}%`,
          },
          created_by: {
            [Op.eq]: userId,
          },
        },
      },
    });

    const memberNodeId = member.node_id;
    const memberIsInUserTrees = trees.some((tree) => {
      try {
        const nodeIds: string[] = Array.isArray(tree.members)
          ? (tree.members as any)
          : JSON.parse(tree.members || "[]");
        return nodeIds.includes(memberNodeId);
      } catch (e) {
        logger.error("Failed to parse tree members when checking access to member", {
          error: e,
          treeId: tree.id,
        });
        return false;
      }
    });

    if (!memberIsInUserTrees) {
      response.code = 403;
      response.error = true;
      response.message = "You are not authorized to view this family member";
      response.payload = null;
      return response;
    }

    response.code = 200;
    response.error = false;
    response.message = "Family member fetched successfully";
    response.payload = member;
    return response;
  } catch (e: unknown) {
    logger.error("! FamilyMember.getOne !", e);
    response.message = "Internal server error";
    return response;
  }
};
//#endregion