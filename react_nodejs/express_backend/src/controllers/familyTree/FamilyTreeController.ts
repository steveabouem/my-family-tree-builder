import BaseController from "../Base.controller";
import { Request, Response } from "express";
import { DEndpointResponse } from "../controllers.definitions";
import FamilyTree from "../../models/FamilyTree";
import { Op } from "sequelize";
import FamilyMemberController from "../familyMember/FamilyMemberController";
import logger from "../../utils/logger";
import User from "../../models/User";
import FamilyMember from "../../models/FamilyMember";
import dayjs from "dayjs";

class FamilyTreeController extends BaseController<any> {
  constructor() {
    super('trees');
  }

  public async getAll(req: Request, res: Response) {
    const response: Partial<DEndpointResponse<FamilyTree[]>> = { error: true, code: 500, session: '' };
    let responseBody = {  };
    
    const userId = req.query.member;

    try {
      const treeList = await FamilyTree.findAll({ where: { members: { [Op.like]: `%${userId}%` } } });
      response.code = 200;
      response.error = false;
      responseBody = [...treeList];
      res.status(200);
    } catch (e: unknown) {
      response.code = 400;
      response.message = `Caught ERR ${e}`;
      res.status(400);
    }

    res.json(responseBody);
  }

  /* 
    ? receives info on members of the family, 
    ? create the records for each members with the FamilyMemberController callback,
    ? creates the tree. 
    ? can only be initiated by a registered user. 
    ? Used for brand new tree, meaning registered user has no familyMember record for this tree yet
  */
  public async create(req: Request, res: Response) {
    const response: Partial<DEndpointResponse<FamilyTree>> = { error: true, code: 400, session: '' };
    let responseBody = {};
    const today = dayjs();
    try {
      const {
        father,
        user_id,
        is_public,
        mother,
        siblings,
        tree_name,
        spouse,
        children
      } = req.body;
      const currentUser = await User.findByPk(user_id);

      if (currentUser?.dataValues) {
        const familyMemberController = new FamilyMemberController();
        const userFamilyMemberRecord = await FamilyMember.create({
          ...currentUser.dataValues, id: undefined, user_id, created_by: user_id,
          age: currentUser?.dob ? today.diff(dayjs(currentUser.dob), 'years') : null,
        })
          .catch((e: unknown) => {
            logger.error('!family tree.create current member ', e);
          });

        // create all the records for family members described in form and return them
        const familyMembers: any = await familyMemberController
          .createFamilyUnit({ siblings, father, mother, current: userFamilyMemberRecord?.dataValues, spouse, children })
          .catch((e: unknown) => {
            logger.info('BREAKS : ', e);
          });
        const newTree = await FamilyTree.create(
          {
            active: 1, name: tree_name, members: JSON.stringify(familyMembers),
            public: is_public, authorized_ips: '[]',
            created_at: new Date(), created_by: user_id
          }
        ).catch((e: any) => {
          logger.error("! create family tree !", e)
        });

        responseBody = {...newTree};
        response.code = 200;
        response.error = false;
        response.message = 'Family Tree Created Succesfully';
      } else {
        response.code = 400;
        response.message = 'Creating User not found';
        res.status(400);
      }
    } catch (e: unknown) {
      logger.error('! FamilyTree.create !', e);
      response.code = 400;
      response.message = 'FAIL';
      res.status(400);
    }

    res.json(response);
  }

  /* 
    ? add a family around existing tree member.
    ? anchor may or may not have a user profile 
    ? can only be initiated by a registered user
  */
  public async addFamilyUnit(req: Request, res: Response) {
    // const response: DEndpointResponse = { error: true, status: 400, payload: undefined, session: '' };

    // if (req.body?.anchorId) {
    //   try {
    //     const currentTree = await FamilyTree.findByPk(req.body?.treeId)
    //       .catch((e: any) => {
    //         logger.error('! FamilyTree.addUnit', e);
    //       });
    //     const anchorFamilyMemberRecord = await FamilyMember.findByPk(req.body.anchorId)
    //       .catch((e: unknown) => {
    //         logger.error('!family tree.add sub #119 ', e);
    //       });

    //     if (currentTree?.dataValues && anchorFamilyMemberRecord?.dataValues) {
    //       console.log('\n \n FOUND TREE ND ANCHOR');

    //       const familyMemberController = new FamilyMemberController();
    //       // create all the records for family members described in form and return them
    //       const anchorsFamily: any = await familyMemberController
    //         .addFamilyUnit({ ...req.body, current: anchorFamilyMemberRecord.dataValues })
    //         .catch((e: unknown) => {
    //           logger.info('BREAKS : ', e);
    //         });

    //       if (anchorsFamily) {
    //         const updatedMembersList = { ...JSON.parse(currentTree.members), ...anchorsFamily };
    //         console.log(`\n\n new list , \n ${JSON.stringify(updatedMembersList)}, \n ${JSON.parse(currentTree.members)}`);

    //         await FamilyTree.update({ members: JSON.stringify(updatedMembersList) }, { where: { id: { [Op.eq]: req.body.treeId } } });
    //       }
    //       console.log('\n \n RESULTING SUB ', anchorsFamily);

    //       response.payload = anchorsFamily;
    //       response.status = 200;
    //       response.error = false;
    //       response.message = 'Family member updated Succesfully';
    //     } else {
    //       response.status = 400;
    //       response.message = 'FAmily member recored not found';
    //       res.status(400);
    //     }
    //   } catch (e: unknown) {
    //     logger.error('! FamilyTree.addUnit !', e);
    //     response.status = 400;
    //     response.message = 'FAIL';
    //     res.status(400);
    //   }
    // } else {
    //   logger.error('! FamilyTree.addUnit ! No anchor provided');
    //   response.error = true;
    //   response.message = 'No anchor provided';
    // }

    return true;
    // return res.json(response);
  }

  public async getOne(req: Request, res: Response) {
    const response: Partial<DEndpointResponse<FamilyTree>> = { error: true, code: 400, session: '' };
    let responseBody = {};
    try {
      const id = req.query.id;
      const userId = req.session?.details?.userId || 0;
      // const canViewTree = await this.canUserViewTree(Number(id), userId);

      // if (canViewTree) {
      // @ts-ignore 
      const tree = await FamilyTree.findByPk(id).catch((e: unknown) => {
        logger.error('! FamilyTree.getOne !', e);
        response.code = 500;
        response.message = 'Tree cannot be retrieved.';
        res.status(500);
      });

      response.code = 200;
      response.error = false;
      res.status(200);

      if (tree) {
        responseBody = tree;
        response.message = 'Family Tree Fetched Succesfully';

        req.session.details = {
          ...req.session.details,
          authenticated: true,
          familyTree: tree
        }
        req.session.save();
      } else {
        response.message = 'Tree requested not found';
        logger.error('! FamilyTree.get ! Tree requested not found');
      }
      // } else {
      //   res.status(403);
      //   response.status = 403;
      //   response.message = 'User is not allowed to view this tree.';
      // }
    } catch (e: unknown) {
      logger.error('! FamilyTree.get !', e);
      response.code = 500;
      response.message = 'Tree cannot be retrieved.';
      res.status(500);
    }

    res.json(responseBody);
  }

  public async getTreeLayout(req: Request, res: Response) {
    // const response: DEndpointResponse = { error: true, status: 400, payload: undefined, session: '' };
    // const treeId = req.query?.id;
    // response.payload = `<Box>Test HTML ${treeId}</Box>`;
    // response.status = 200;

    // res.json(response);
    return true;
  }

  public async delete(req: Request, res: Response) {
    const response: Partial<DEndpointResponse<any>> = { error: true, code: 400, session: '' };
    const treeId = req.body.id;
    const userId = req.session?.details?.userId || 0;
    const canUpdateTree = await this.canUserUpdateTree(treeId, userId);

    if (canUpdateTree) {
      try {
        const currentTree = await FamilyTree.findByPk(treeId);
        if (currentTree) {
          await currentTree.destroy();

          response.code = 200;
          response.error = false;
          response.message = 'Family Tree Deleted Succesfully';
          res.status(200);
        } else {
          response.code = 500;
          response.error = true;
          response.message = 'Family Tree Does not Exist';
          res.status(500);
        }

      } catch (e: unknown) {
        logger.error('! FamilyTree.delete ! ', e)
        response.code = 500;
        response.message = `Caught ERR ${e}`;
        res.status(500);
      }
    } else {
      res.status(403);
      response.error = false;
      response.code = 403;
      response.message = 'User is not allowed to view this tree.';
    }

    res.json(response);
  }

  public async addMembers(req: Request, res: Response) { // ! TODO: use family member model here?
    const newMembers = req.body.members;
    const treeId = req.body.id;
    const userId = req.session?.details?.userId || 0;
    const response = await this.processAddMembers(treeId, newMembers, userId);

    res.status(response.status);
    res.json(response);
  }

  public async removeMembers(req: Request, res: Response) {
    // const response: DEndpointResponse = { error: true, status: 400, payload: undefined, session: '' };
    // const treeId: number = req.body.tree;
    // const membersToRemove: number[] = JSON.parse(req.body.members);
    // const userId = req.session?.details?.userId || 0;
    // const canUpdateTree = await this.canUserUpdateTree(treeId, userId);

    // if (canUpdateTree) {
    //   const tree = await FamilyTree.findByPk(treeId).catch((e: unknown) => {
    //     logger.error('! FamilyTree.removeMembers ! ', e)
    //     response.status = 500;
    //     response.message = `Caught ERR ${e}`;
    //     res.status(500);
    //   });

    //   if (tree) {
    //     const remainingTreeMembers = JSON.parse(tree.members)?.filter((member: number) => !membersToRemove?.includes(member));

    //     await tree.update({ members: JSON.stringify(remainingTreeMembers) }).catch((e: unknown) => {
    //       logger.error('! FamilyTree.removeMembers ! ', e)
    //       response.status = 500;
    //       response.message = `Caught ERR ${e}`;
    //       res.status(500);
    //     });

    //     response.error = false;
    //     response.message = 'Tree updated successfully';
    //     response.status = 200;
    //     res.status(200);
    //   } else {
    //     logger.info('! FamilyTree.removeMembers ! No tree with the given Id')
    //     response.status = 500;
    //     response.message = 'No matching tree found.';
    //     res.status(500);
    //   }
    // } else {
    //   res.status(403);
    //   response.error = false;
    //   response.status = 403;
    //   response.message = 'User is not allowed to view this tree.';
    // }

    return true;
  }

  public async getMembers(req: Request, res: Response) {
    //! TODO: declare a DTO to match React-Family-tree typing below
    const response: Partial<DEndpointResponse<FamilyMember[]>> = { error: true, code: 400, session: '' };
    let responseBody = {};
    const userId = req.session?.details?.userId || 0;
    const id = req.query.id;
    const canViewTree = await this.canUserViewTree(Number(id), userId);

    if (canViewTree) {
      try {
        // @ts-ignore 
        const tree = await FamilyTree.findByPk(id);
        const familyMembers = JSON.parse(tree?.members || '[]');

        response.code = 200;
        response.error = false;
        res.status(200);

        if (familyMembers?.length) {
          response.message = 'Family Tree members Fetched Succesfully';
        } else {
          response.message = 'Tree members not found';
        }
        responseBody = familyMembers;
      } catch (e: unknown) {
        logger.error('! FamilyTree.getmembers !', e);
        response.code = 400;
        response.message = 'Tree members cannot be retrieved.';
        res.status(400);
      }
    } else {
      res.status(403);
      response.error = false;
      response.code = 403;
      response.message = 'User is not allowed to view this tree.';
    }

    res.json(response);
  }

  public async canUserViewTree(treeId: number, userId: number): Promise<boolean> {
    let isPartOfTree = false;
    const tree = await FamilyTree.findByPk(treeId).catch((e: unknown) => {
      logger.error('! FamilyTree.isUserAuthorizedOntree ! ', e)
    });

    const members = JSON.parse(tree?.dataValues?.members || '[]');
    console.log('\n \n \n WHAT I HAVE : ', userId, JSON.stringify(members));

    if (members?.find((m: any) => m.id == userId)) {
      isPartOfTree = true;
    }

    return isPartOfTree;
  }

  public async canUserUpdateTree(treeId: number, userId: number): Promise<boolean> {
    const tree = await FamilyTree.findByPk(treeId).catch((e: unknown) => {
      logger.error('! FamilyTree.isUserAuthorizedOntree ! ', e)
    });

    return tree?.created_by === userId;
  }

  private async processAddMembers(treeId: number, newMembers: number[], userId: number): Promise<any> { // ! TODO: no any
    // const response: DEndpointResponse = { error: true, status: 400, payload: undefined, session: '' };
    // const canUpdateTree = await this.canUserUpdateTree(treeId, userId);
    // let treeMembers: number[] = [];

    // if (canUpdateTree) {
    //   try {
    //     const currentTree = await FamilyTree.findByPk(treeId).catch((e: unknown) => {
    //       logger.error('! FamilyTree.addmembers ! ', e);
    //       response.status = 500;
    //       response.message = `Caught ERR ${e}`;
    //     });

    //     if (currentTree) {
    //       const currentTreeMembers = JSON.parse(currentTree?.members);
    //       if (currentTreeMembers?.length) {
    //         const membersAlreadyExists = currentTreeMembers.find((m: number) => newMembers.includes(m));

    //         if (membersAlreadyExists) {
    //           response.status = 200;
    //           response.error = false;
    //           response.message = 'Family Member is already part of the tree';

    //           return response;
    //         } else {
    //           treeMembers = [...currentTreeMembers, ...newMembers];
    //         }
    //       } else {
    //         treeMembers = newMembers;
    //       }

    //       if (treeMembers.length) {
    //         await currentTree.update({ members: JSON.stringify(treeMembers) }).catch((e: unknown) => {
    //           logger.error('! FamilyTree.addmembers ! ', e);
    //           response.status = 500;
    //           response.message = `Caught ERR ${e}`;
    //         });

    //         response.status = 200;
    //         response.error = false;
    //         response.message = 'Family Member Added Succesfully';

    //         return response;
    //       } else {
    //         response.status = 200; //technically a 304 but 304s don't return the json object
    //         response.error = false;
    //         response.message = 'No valid Family Member were submitted.';

    //         return response;
    //       }
    //     } else {
    //       response.status = 400;
    //       response.error = true;
    //       response.message = 'Family Tree Does not Exist';

    //       return response;
    //     }
    //   } catch (e: unknown) {
    //     response.status = 400;
    //     response.message = `Caught ERR ${e}`;

    //     return response;
    //   }
    // } else {
    //   response.error = true;
    //   response.status = 403;
    //   response.message = 'User is not allowed to view this tree.';

    //   return response;
    // }
    return true;
  }
}

export default FamilyTreeController;