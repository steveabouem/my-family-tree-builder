import BaseController from "../Base.controller";
import { Request, Response } from "express";
import { DEndpointResponse } from "../controllers.definitions";
import FamilyMember from "../../models/FamilyMember";
import { Op } from "sequelize";
import FamilyTree from "../../models/FamilyTree";

class FamilyMemberController extends BaseController<any> {
  constructor() {
    super('family_trees');
  }
  // ! THERE ARE A LOOOT OF ANYS in Headers. FIX. EASY TYPING
  public async create(req: Request, res: Response) {
    const response: DEndpointResponse = { error: true, status: 400, payload: undefined, session: '' };
    const formattedValues = { ...req.body, authorized_ips: '[]' };
    try {
      const newMember = await FamilyMember.create(formattedValues);
      await newMember.save();

      response.status = 200;
      response.error = false;
      response.message = 'Family Member Created Succesfully';
      res.status(200);

    } catch (e: unknown) {
      response.status = 400;
      response.message = `Caught ERR ${e}`;
      res.status(400);
    }

    res.json(response);
  }

  // ! TOFIX: easy typing here 
  public async bulkCreate(members: any) {
    const operations: any = [];
    members?.forEach((member: any) => {
      operations.push(this.insert(member));
    });

    return Promise.all(operations);
  }

  public async createFamilyUnit(members: any) {
    const ids = [];
    let father: any = null;
    
    try {
      const mother = await FamilyMember.create({...members.mother, gender: 2});
      ids.push(mother.id);

      if (members?.father) {
        father = await FamilyMember.create({ ...members.father, gender: 1 });
        ids.push(father.id);
      }

      if (members.siblings.length) {
        await Promise.all(members.siblings.map(async (sibling: any) => {
          if (sibling) {
            console.log({sibling});
            
            const member = await FamilyMember.create(sibling);
            ids.push(member.id);

            member.parent_1 = (await mother).id;
            if (father) {
              member.parent_2 = father.id;
            }

            member.save();
          }
        }));
      }

      return ids;
    } catch (e: unknown) {
      return [e];
    }
  }
  // public async delete(req: Request, res: Response) {
  //   const response: DEndpointResponse = { error: true, status: 400, payload: undefined, session: '' };
  //   const treeId = req.body.id;
  //   try {
  //     const currentTree = await FamilyTree.findByPk(treeId);
  //     if (currentTree) {

  //       await currentTree.destroy();
  //       response.status = 200;
  //       response.error = false;
  //       response.message = 'Family Tree Deleted Succesfully';
  //       res.status(200);
  //     } else {
  //       response.status = 400;
  //       response.error = true;
  //       response.message = 'Family Tree Does not Exist';
  //       res.status(400);
  //     }

  //   } catch (e: unknown) {
  //     response.status = 400;
  //     response.message = `Caught ERR ${e}`;
  //     res.status(400);
  //   }

  //   res.json(response);
  // }

  public async getSiblings(req: Request, res: Response) {
    const response: DEndpointResponse = { error: true, status: 400, payload: undefined, session: '' };
    const member = req.body.member;
    const treeId = req.body.id;
    let siblings: number[] = [];

    // try {
    //   const currentTree = await FamilyMember.findAll({where: {[Op.eq]: treeId}});
    //   if (currentTree) {
    //     if (currentTree.members) {
    //       treeMembers = [...JSON.parse(currentTree.members), newMember];
    //       console.log({ treeMembers });
    //     } else {
    //       treeMembers = [newMember];
    //     }

    //     await currentTree.update({ members: JSON.stringify(treeMembers) });
    //     response.status = 200;
    //     response.error = false;
    //     response.message = 'Family Member Added Succesfully';
    //     res.status(200);
    //   } else {
    //     response.status = 400;
    //     response.error = true;
    //     response.message = 'Family Tree Does not Exist';
    //     res.status(400);
    //   }

    // } catch (e: unknown) {
    //   response.status = 400;
    //   response.message = `Caught ERR ${e}`;
    //   res.status(400);
    // }

    // res.json(response);
  }

  public async getMembersChildren(req: Request, res: Response) {
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

  private async insert(member: any) { // ! TOFIX: no any
    const newMember = await FamilyMember.create(member);
    await newMember.save()
      .catch((e) => {
        return false;
      }); // ! TODO: logging and err handling. easy

    return true;
  }
}

export default FamilyMemberController;