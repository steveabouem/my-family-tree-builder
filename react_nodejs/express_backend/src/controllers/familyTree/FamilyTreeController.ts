import BaseController from "../Base.controller";
import { Request, Response } from "express";
import { DEndpointResponse } from "../controllers.definitions";
import FamilyTree from "../../models/FamilyTree";
import { Op } from "sequelize";
import FamilyMemberController from "../familyMember/FamilyMemberController";
import logger from "../../utils/logger";
import User from "../../models/User";

class FamilyTreeController extends BaseController<any> {
  constructor() {
    super('trees');
  }

  public async getAll(req: Request, res: Response) {
    const response: DEndpointResponse = { error: true, status: 400, payload: undefined, session: '' };
    const userId = req.query.member;

    try {
      const treeList = await FamilyTree.findAll({ where: { members: { [Op.like]: `%${userId}%` } } });
      response.status = 200;
      response.error = false;
      response.payload= [...treeList];
      res.status(200);
    } catch (e: unknown) {
      response.status = 400;
      response.message = `Caught ERR ${e}`;
      res.status(400);
    }

    res.json(response);
  }

  public async create(req: Request, res: Response) {
    const response: DEndpointResponse = { error: true, status: 400, payload: undefined, session: '' };

    try {
      const {
        father,
        user_id,
        is_public,
        mother,
        siblings,
        tree_name,
      } = req.body;

      const currentUser = await User.findByPk(user_id);
      if (currentUser) {
        const familyMemberController = new FamilyMemberController();
        const membersIds = await familyMemberController.createFamilyUnit({ siblings, father, mother });
        const newTree = await FamilyTree.create({ active: 1, name: tree_name, members: '[]', public: is_public, authorized_ips: '[]', created_at: new Date(), created_by: user_id });

        membersIds.push(user_id);
        newTree.members = JSON.stringify(membersIds);
        newTree.save();
  
        response.payload= newTree;
        response.status = 200;
        response.error = false;
        response.message = 'Family Tree Created Succesfully';
        res.status(200);
      } else {
        response.status = 400;
        response.message = 'Creating User not found';
        res.status(400);
      }
    } catch (e: unknown) {
      logger.error('! FamilyTree.create !', e);
      response.status = 400;
        response.message = 'FAIL';
        res.status(400);
    }

    res.json(response);
  }

  public async delete(req: Request, res: Response) {
    const response: DEndpointResponse = { error: true, status: 400, payload: undefined, session: '' };
    const treeId = req.body.id;
    try {
      const currentTree = await FamilyTree.findByPk(treeId);
      if (currentTree) {

        await currentTree.destroy();
        response.status = 200;
        response.error = false;
        response.message = 'Family Tree Deleted Succesfully';
        res.status(200);
      } else {
        response.status = 400;
        response.error = true;
        response.message = 'Family Tree Does not Exist';
        res.status(400);
      }

    } catch (e: unknown) {
      response.status = 400;
      response.message = `Caught ERR ${e}`;
      res.status(400);
    }

    res.json(response);
  }

  public async addMembers(req: Request, res: Response) { // ! TODO: use family member model here?
    const response: DEndpointResponse = { error: true, status: 400, payload: undefined, session: '' };
    const newMember = req.body.member;
    const treeId = req.body.id;
    let treeMembers: number[] = [];

    try {
      const currentTree = await FamilyTree.findByPk(treeId);
      if (currentTree) {
        if (currentTree.members) {
          treeMembers = [...JSON.parse(currentTree.members), newMember];
          console.log({ treeMembers });
        } else {
          treeMembers = [newMember];
        }

        await currentTree.update({ members: JSON.stringify(treeMembers) });
        response.status = 200;
        response.error = false;
        response.message = 'Family Member Added Succesfully';
        res.status(200);
      } else {
        response.status = 400;
        response.error = true;
        response.message = 'Family Tree Does not Exist';
        res.status(400);
      }

    } catch (e: unknown) {
      response.status = 400;
      response.message = `Caught ERR ${e}`;
      res.status(400);
    }

    res.json(response);
  }
}

export default FamilyTreeController;