import BaseController from "../Base.controller";
import { Request, response, Response } from "express";
import { APIRequestPayload } from "../controllers.definitions";
import FamilyTree from "../../models/FamilyTree";
import { Op } from "sequelize";
import FamilyMemberController from "../familyMember/FamilyMemberController";
import logger from "../../utils/logger";
import User from "../../models/User";
import FamilyMember from "../../models/FamilyMember";
import { APIFamilyTreeDAO, APIGetFamilyTreeResponse, DSaveTreeFormStepResponse } from "./familyTree.definitions";
import { APIFamilyMemberDAO } from "../familyMember/familyMember.definitions";

class FamilyTreeController extends BaseController<any> {
  constructor() {
    super('trees');
  }

  public getAll = async (req: Request, res: Response): Promise<FamilyTree[]> => {
    const userId = req.query.member;
    let treeList: FamilyTree[] = [];

    try {
      treeList = await FamilyTree.findAll({ where: { members: { [Op.like]: `%${userId}%` } } });
    } catch (e: unknown) {
      logger.error('Unable to fetch trees ', e);
    }

    return treeList;
  }

  /* 
  * receives info on members of the family, 
  * create the records for each members with the FamilyMemberController callback,
  * creates the tree. 
  * can only be initiated by a registered user. 
  */
  public saveNewTreeFormStep = async (members: any, name: string, userId: number): Promise<DSaveTreeFormStepResponse> => {
    let response: DSaveTreeFormStepResponse = { lastStep: false, newFields: [] };;

    try {
      const familyMemberController = new FamilyMemberController();
      const membersRecords = await familyMemberController.createRecords(members, userId); //catch block already in the function
      const newTree = await FamilyTree.create({
        active: 0,
        authorized_ips: '[]',
        created_by: userId,
        members: JSON.stringify(membersRecords),
        name,
        public: 0
      })
        .catch((e: unknown) => {
          logger.error('Failed to create tree: ', e);
        });

    } catch (e: unknown) {

    };

    return response;
  }

  /*
 * Position the family members in the tree
 */
  public positionFamilyMembers = (members: APIFamilyMemberDAO[]): APIFamilyMemberDAO[] => {
    const membersWithCoords: any = [];

    Object.values(members).forEach((currentMember: any, index: number) => {
      const position = { x: index * 125, y: 0 };
      const children = JSON.parse(currentMember?.children || '[]');
      const siblings = JSON.parse(currentMember?.siblings || '[]');
      const spouses = JSON.parse(currentMember?.spouses || '[]');
      const parents = JSON.parse(currentMember?.parents || '[]');
      logger.info("Collected all anchor's relatives", { children, parents, spouses, siblings, currentMember });
      /*
      * find all the node children,  position them below it, then update each child's node's position
      */
      if (Array.isArray(children)) {
        /*
        * if the child was already processed through another incoming node (family member), ignore it
        */
        children.forEach((child: any, childIndex: number) => {
          if (membersWithCoords.find((newNode: any) => newNode.node_id === child.node_id)) {
            logger.info('ignoring family member\'s current child as it is a dupe, ', { child });
          } else {
            membersWithCoords.push({
              ...child,
              type: 'custom',
              position: { x: position.x + (125 * childIndex), y: position.y + 125 },
              name: '',
              data: {
                ...child,
                label: `${child.first_name} ${child.last_name}`,
                connections: [...child?.connections || [], { id: `${currentMember.node_id}-${child.node_id}`, source: currentMember.node_id, target: child.node_id }]
              }
            });
          }
        });
      }
      /*
      * find all the node siblings,  position them below it, then update each child's node's position
      */
      if (Array.isArray(siblings)) {
        /*
        * if the child was already processed through another incoming node (family member), ignore it
        */
        siblings.forEach((sibling: any, siblingIndex: number) => {
          if (membersWithCoords.find((newNode: any) => newNode.node_id === sibling.node_id)) {
            logger.info('ignoring family member\'s current sibling as it is a dupe, ', { sibling });
          } else {
            membersWithCoords.push({
              ...sibling,
              type: 'custom',
              position: { x: position.x + (325 * siblingIndex), y: position.y },
              name: '',
              data: {
                ...sibling, label: `${sibling.first_name} ${sibling.last_name}`,
                connections: [...sibling?.connections || [], { id: `${currentMember.node_id}-${sibling.node_id}`, source: currentMember.node_id, target: sibling.node_id }]
              }
            });
          }
        });
      }
      /*
      * find all the node spouses,  position them below it, then update each child's node's position
      */
      if (Array.isArray(spouses)) {
        /*
        * if the child was already processed through another incoming node (family member), ignore it
        */
        spouses.forEach((spouse: any, spousIndex: number) => {
          if (membersWithCoords.find((newNode: any) => newNode.node_id === spouse.node_id)) {
            logger.info('ignoring family member\'s current spouse as it is a dupe, ', { spouse });
          } else {
            membersWithCoords.push({
              ...spouse,
              type: 'custom',
              position: { x: position.x + (325 * spousIndex), y: position.y },
              name: '',
              data: {
                ...spouse,
                label: `${spouse.first_name} ${spouse.last_name}`,
                connections: [...spouse?.connections || [], { id: `${currentMember.node_id}-${spouse.node_id}`, source: currentMember.node_id, target: spouse.node_id }]
              }
            });
          }
        });
      }
      /*
      * find all the node parents,  position them above it, then update each parent's node's position
      */
      if (Array.isArray(parents)) {
        /*
        * if the parent was already processed through another incoming node (family member), ignore it
        */
        parents.forEach((parent: any) => {
          if (membersWithCoords.find((newNode: any) => newNode.node_id === parent.node_id)) {
            logger.info('ignoring family member\'s current spouse as it is a dupe, ', { parent });
          } else {
            const xOffset = parent.gender == 2 ? position.x + 225 : position.x - 125;
            membersWithCoords.push({
              ...parent,
              type: 'custom',
              position: { x: xOffset, y: position.y - 125 },
              name: '',
              data: {
                ...parent,
                label: `${parent.first_name} ${parent.last_name}`,
                connections: [...parent?.connections || [], { id: `${currentMember.node_id}-${parent.node_id}`, source: currentMember.node_id, target: parent.node_id }]
              }
            });
          }
        });
      }
      if (membersWithCoords.find((newNode: any) => newNode.node_id === currentMember.node_id)) {
        logger.info('ignoring family member as it is a dupe, ', { node: currentMember });
      } else {
        membersWithCoords.push({
          ...currentMember,
          type: 'custom',
          position,
          data: { label: `${currentMember.first_name} ${currentMember.last_name}`, ...currentMember }
        });
      }
    });

    logger.info('newNodeState', membersWithCoords);
    return membersWithCoords;
  }

  /*
  * Receives an array of family members, within which each member has a list of children, siblings, parents and spouses
  * loops through the arrays and creates a familyMember record for each member,
  * for the next member, check if the member already exists in the DB, if not create it
  * create the tree
  * as all the family members are created, crete a mirror obect of the incoming DAO, but this time with the DB ids.
  * return the resulting DTO
  */
  public create = async (req: Request<{}, {}, APIFamilyTreeDAO, {}>, res: Response<APIGetFamilyTreeResponse, {}>) => {
    let response: APIGetFamilyTreeResponse = { code: 500, error: true };
    const userId = req.body.userId;

    try {
      /*
      * Only registered users can do CRUD on trees
      */
      const currentUser = await User.findByPk(userId);

      if (currentUser?.dataValues) {
        const familyMemberController = new FamilyMemberController();
        const membersRecords = await familyMemberController.createRecords(req.body.members, userId)
          .catch((e: unknown) => {
            logger.error('Unable to bulk create members. Function call failed', e);
          });
        /*
        * tree will usually be created through a step form. front will provide the user with the option to activate
        */
        logger.info('membersRecords array', membersRecords);
        if (membersRecords) {
          const membersByNodeId =
            Object.values(membersRecords).reduce((nodeList: { [nodeId: string]: any }, curr: any) => {
              return ({ ...nodeList, [curr.node_id]: curr.dataValues });
            }, {});
          logger.info("Prepared object to create positions and edges", { membersByNodeId });
          const withCoords = this.positionFamilyMembers(Object.values(membersByNodeId));
          const newTree = await FamilyTree.create({
            active: 1,
            authorized_ips: '',
            created_by: req.body.userId,
            members: JSON.stringify(withCoords),
            name: req.body?.treeName || 'temporary_tree_name', //Translation key
            public: 0
          })
            .catch((e: unknown) => {
              logger.error('Unable to create a tree ', e);
            });

          response.code = 200;
          response.error = false;
          response.message = 'Family Tree Created Succesfully';
          // @ts-ignore: the typeing here is incorrect, need a better union type
          response = { ...response, ...newTree?.dataValues, members: withCoords };
        } else {
          response.code = 400;
          response.error = true;
          response.message = 'Unable to create members';
          logger.error('Unable to create members: records array empty');
        }
      } else {
        response.code = 400;
        response.message = 'Creating User not found';
        logger.error('User not found');
      }
    } catch (e: unknown) {
      logger.error('! FamilyTree.create !', e);
      response.code = 400;
      response.message = 'FAIL';
    }

    return response;
  }

  public getOne = async (req: Request, res: Response): Promise<APIRequestPayload<FamilyTree>> => {
    const response: APIRequestPayload<FamilyTree> = this.defaultResponse;
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
      });

      response.code = 200;
      response.error = false;

      if (tree) {
        response.payload = tree;
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
    } catch (e: unknown) {
      logger.error('! FamilyTree.get !', e);
      response.code = 500;
      response.message = 'Tree cannot be retrieved.';
      res.status(500);
    }

    return response;
  }

  public getTreeLayout = async (req: Request, res: Response) => {
    // const response: DEndpointResponse = { error: true, status: 400, payload: undefined, session: '' };
    // const treeId = req.query?.id;
    // response.payload = `<Box>Test HTML ${treeId}</Box>`;
    // response.status = 200;

    // res.json(response);
    return true;
  }

  public delete = async (req: Request, res: Response) => {
    // const response: Partial<DEndpointResponse<any>> = { error: true, code: 400, session: '' };
    // const treeId = req.body.id;
    // const userId = req.session?.details?.userId || 0;
    // const canUpdateTree = await this.canUserUpdateTree(treeId, userId);

    // if (canUpdateTree) {
    //   try {
    //     const currentTree = await FamilyTree.findByPk(treeId);
    //     if (currentTree) {
    //       await currentTree.destroy();

    //       response.code = 200;
    //       response.error = false;
    //       response.message = 'Family Tree Deleted Succesfully';
    //       res.status(200);
    //     } else {
    //       response.code = 500;
    //       response.error = true;
    //       response.message = 'Family Tree Does not Exist';
    //       res.status(500);
    //     }

    //   } catch (e: unknown) {
    //     logger.error('! FamilyTree.delete ! ', e)
    //     response.code = 500;
    //     response.message = `Caught ERR ${e}`;
    //     res.status(500);
    //   }
    // } else {
    //   res.status(403);
    //   response.error = false;
    //   response.code = 403;
    //   response.message = 'User is not allowed to view this tree.';
    // }

    // res.json(response);
  }

  public update = async (req: Request, res: Response) => {
    const response: APIRequestPayload<FamilyTree | null> = this.defaultResponse;

    try {
      const familyMemberController = new FamilyMemberController();
      const matchingTree = await FamilyTree.findByPk(req.body.treeId);
      logger.info('Found matching tree',  matchingTree);
      if (matchingTree?.dataValues?.active) {
        const membersRecords = await familyMemberController.updateRecordAndRelations(req, res);
        const withCoords = this.positionFamilyMembers(Object.values(membersRecords || {}));

        await matchingTree.update({
          ...matchingTree.dataValues,
          members: JSON.stringify(withCoords)
        });
        logger.info('Route handler returns this response ', matchingTree);
        response.code = 200;
        response.error = false;
        response.payload = matchingTree;
      } else {
        logger.error('Invalid treeId ', req.body.treeId);
        response.code = 500;
        response.error = true;
        response.payload = null;
      }
    } catch (e: unknown) {
      logger.error('Unable to update tree ', e);
      response.code = 500;
      response.error = true;
      response.payload = null;
    }

    return response;
  }

  /*
  * can be called from the initial step form rsponsible for creating the tree,
  * or an update made to an active tree by a registered user with appropriate permissions
  */
  public addMembers = async (req: Request, res: Response) => { // ! TODO: use family member model here=> ?
    const newMembers = req.body.members;
    const treeId = req.body.id;
    const userId = req.session?.details?.userId || 0;
    const response = await this.processAddMembers(treeId, newMembers, userId);

    res.status(response.status);
    res.json(response);
  }

  public removeMembers = async (req: Request, res: Response) => {
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

  public getMembers = async (req: Request, res: Response): Promise<APIRequestPayload<FamilyMember[]>> => {
    const response: APIRequestPayload<FamilyMember[]> = this.defaultResponse;
    const userId = req.session?.details?.userId || 0;
    const id = req.query.id;
    const canViewTree = await this.canUserViewTree(Number(id), userId);

    if (canViewTree) {
      try {
        // @ts-ignore 
        const tree = await FamilyTree.findByPk(id)
          .catch((e: unknown) => {
            logger.error('failed', e);
          });
        const familyMembers = JSON.parse(tree?.members || '[]');
        response.code = 200;
        response.error = false;
        if (familyMembers?.length) {
          response.message = 'Family Tree members Fetched Succesfully';
        } else {
          response.message = 'Tree members not found';
        }
        response.payload = familyMembers;
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

    return response;
  }

  public updateTreeMembers = async (req: Request, res: Response): Promise<APIRequestPayload<FamilyTree>> => {
    const response = this.defaultResponse;
    try {

    } catch (e: unknown) {
      logger.info('send error to helper function: updateTreeMembers ');
    }

    return response;
  }

  /*
  * Promise<{ step: number; members: []; }> => {DFormField[] | []} 
  * if no further steps, return empty array
  */
  public saveGenealogyFormStep = async (req: Request, res: Response) => {

  }

  public canUserViewTree = async (treeId: number, userId: number): Promise<boolean> => {
    // TODO: PERMISSION from DB
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

  public canUserUpdateTree = async (treeId: number, userId: number): Promise<boolean> => {
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