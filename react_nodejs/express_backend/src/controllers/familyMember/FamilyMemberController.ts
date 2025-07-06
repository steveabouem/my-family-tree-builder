import BaseController from "../Base.controller";
import { APIFamilyMemberDAO } from "./familyMember.definitions";
import logger from "../../utils/logger";
import { FamilyMemberService } from "../../services";

class FamilyMemberController extends BaseController<any> {
  constructor() {
    super('family_trees');
  }

  public async createAll(members: { [stepName: string]: APIFamilyMemberDAO }, userId: number): Promise<{ [id: string]: APIFamilyMemberDAO } | null> {
    const service = new FamilyMemberService();

    try {
      const res = await service.createRecords(members, userId);
      return res;
    } catch (e: unknown) {
      logger.error('Unable to bulk create members ', e);
    }

    return null;
  }
}

export default FamilyMemberController;
