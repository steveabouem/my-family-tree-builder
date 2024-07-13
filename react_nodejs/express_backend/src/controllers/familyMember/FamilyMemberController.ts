import BaseController from "../Base.controller";
import { Request, Response } from "express";
import { DEndpointResponse } from "../controllers.definitions";
import FamilyMember from "../../models/FamilyMember";
import FamilyTree from "../../models/FamilyTree";
import { DFamilyMemberRecord, DFamilyTreeNodeDTO } from "./familyMember.definitions";
import { Op } from "sequelize";
import logger from "../../utils/logger";

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


  /*
  ? expects form data with all the members of the immediate family of the current user
  ? creates FamilyMember record for each of the members declared
  ? for each member of the family create the RFT data set
  ? returns RFT data objects array
  ! NOTE: if any element in the relations array of each member doesn't have the matching object, 
  ! ***the tree will break*** in the front
  */

  public async createTreeMembersArray(members: any) { // ! TODO: no any, easy fix
    // ? the rftBlueprint will be used for the RFT family tree library. As mentionned earlier, each memeber will be represented by an object holding 
    // ? their info plus a set of arrays with ids and relation types of their relations (siblings, parents, spouses, and children)
    // ? To make things easier, we will first an object (similar to a hashmap) and build the array from that. 
    // ? This is to allow us going through each category of members, and as we create their record, update each relationship array in all the other members' objects.
    //! TODO:  before running the bulk create, create an array with first, last name and dob. Run a WHERE IN to find duplicates and if any found, avoid creating new record but instead use existing to build blueprint
    let treeMembersById: any = {};
    let rftBlueprint: any = []; // TODO: no any. Create proper interface for this, you will use it A LOT.
    let father: any = {}
    let currentFamilyMember: any = {};
    let currentFamilyMemberSpouse: any = {};

    if (!members?.currentUser) {
      logger.error('! FamilyMember.createFamilyUnit !. No current user provided.');
      return [];
    }

    try {
      // if user has no Tree, create a familyMember record. Otherwise, use the existing record to populate RFT mapping
      const userFamilyMemberRecord = await FamilyMember.findByPk(members?.currentUser?.dataValues?.id);

      if (!userFamilyMemberRecord?.dataValues) {
        currentFamilyMember = (await FamilyMember.create(members.currentUser.dataValues))?.dataValues;
      } else {
        currentFamilyMember = userFamilyMemberRecord.dataValues;
      }

      // update current user's hasmap values
      treeMembersById[currentFamilyMember.id] = {
        ...currentFamilyMember,
        id: `${currentFamilyMember.id}`, siblings: [], parents: [], spouses: [], children: []
      };

      const mother = await FamilyMember.create({
        ...members.mother, profile_url: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/91/91d963f85581bc0a73e02432085dae7546426e42.jpg",
        gender: 2
      });
      // update mother's hasmap values
      treeMembersById[mother.dataValues.id] = { ...mother.dataValues, id: `${mother.dataValues.id}`, children: [{ id: `${currentFamilyMember.id}` }], spouses: [], siblings: [], parents: [] };
      // add mother to the current user's hasmap values
      treeMembersById[currentFamilyMember.id].parents.push({  ...mother.dataValues, id: `${mother.dataValues.id}` })

      if (members?.father) {
        father = await FamilyMember.create({
          ...members.father,
          profile_url: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/5c/5c2d7e9dfd804434534b6290e9a176bf0cf417aa.jpg',
          gender: 1
        });
        // update tree members map (father, mother and mutual relationship)
        treeMembersById[father.dataValues.id] = {
          ...father.dataValues, id: `${father.dataValues.id}`,
          children: [{...currentFamilyMember, id: `${currentFamilyMember.id}` }],
          spouses: [{...mother.dataValues, id: `${mother.dataValues.id}` }],
          siblings: [],
          parents: []
        };
        treeMembersById[mother.dataValues.id].spouses = [{...father.dataValues, id: `${father.dataValues.id}` }];
        //update current user's hasmap values with father
        treeMembersById[currentFamilyMember.id].parents.push({ ...father.dataValues, id: `${father.dataValues.id}` })
      }

      if (members?.spouse) {
        // if spouse has no familyMember record, create it, otherwise use existing record. Add it to RFT mapping 
        const spouseFamilyMemberRecord = await FamilyMember.findOne({
          where: {
            [Op.and]: [{ first_name: members.spouse.first_name }, { last_name: members.spouse.last_name }, { dob: members.spouse.dob }, { partner: currentFamilyMember.id }]
          }
        });

        if (spouseFamilyMemberRecord) {
          currentFamilyMemberSpouse = spouseFamilyMemberRecord.dataValues;
        } else {
          const spouseRecord = await FamilyMember.create({ ...members.spouse, partner: currentFamilyMember.id });
          currentFamilyMemberSpouse = spouseRecord.dataValues;
        }

        await FamilyMember.update({ partner: currentFamilyMemberSpouse.id }, { where: { id: { [Op.eq]: currentFamilyMember.id } } })
        // update tree members map (spouses array)
        treeMembersById[currentFamilyMemberSpouse.id] = {
          ...currentFamilyMemberSpouse, children: [], parents: [],
          siblings: [], spouses: [{ id: `${currentFamilyMember.id}`, ...currentFamilyMember }]
        };
        treeMembersById[currentFamilyMember.id].spouses = [{ id: `${currentFamilyMemberSpouse.id}`, ...currentFamilyMemberSpouse }]
      }

      if (members?.siblings?.length) {
        const siblingsRecords = await FamilyMember.bulkCreate(members.siblings).catch((e: any) => {
          logger.error('! createFamilyUnit ! bulk create siblings', e);
          return null;
        });

        siblingsRecords?.forEach(({ dataValues }: any) => {
          const siblingsParents = [];

          console.log('\n CREATING SIBLINGS HASHMAP. Mom\'s value: ');

          if (currentFamilyMember?.id) {
            siblingsParents.push({...currentFamilyMember, id: `${currentFamilyMember.id}` })
          }

          if (currentFamilyMemberSpouse?.id) {
            siblingsParents.push({...currentFamilyMemberSpouse, id: `${currentFamilyMemberSpouse.id}` })
          }

          treeMembersById[dataValues.id] = {
            ...dataValues,
            id: `${dataValues.id}`, siblings: [...siblingsRecords.filter((r: any) => r.id !== dataValues.id), {
              id: `${currentFamilyMember.id}`, ...currentFamilyMember
            }], parents: siblingsParents, spouses: [], children: []
          };

          treeMembersById[currentFamilyMember.id].siblings.push(treeMembersById[dataValues.id]);
        })
      }

      if (members?.children?.length) {
        const childrenRecords = await FamilyMember.bulkCreate(members.children).catch((e: any) => {
          logger.error('! createFamilyUnit ! bulk create children', e);
          return null;
        });

        if (childrenRecords?.length) {
          // update blueprint with all children and their relation to user and spouse (ensure the siblings array of each child does not contain their own id)
          const childrenMappedIds = childrenRecords?.map(({ dataValues }: any) => ({ ...dataValues, id: `${dataValues.id}` })) || [];

          treeMembersById[currentFamilyMember.id].children = childrenMappedIds;
          childrenRecords.forEach(({ dataValues }: any) => {
            const childsParents = [];

            if (currentFamilyMember?.id) {
              childsParents.push({...currentFamilyMember, id: `${currentFamilyMember.id}` })
            }

            if (currentFamilyMemberSpouse?.id) {
              childsParents.push({ ...currentFamilyMemberSpouse, id: `${currentFamilyMemberSpouse.id}` })
            }

            treeMembersById[dataValues.id] = {
              ...dataValues, id: `${dataValues.id}`, children: [],
              parents: childsParents,
              siblings: [...childrenRecords.filter((r: any) => r.id !== dataValues.id), {
                id: `${currentFamilyMember.id}`, ...currentFamilyMember
              }], spouses: []
            }
          });
        }
      }

      for (const id in treeMembersById) {
        rftBlueprint.push(treeMembersById[id]);
      }

      return rftBlueprint;
    } catch (e: unknown) {
      logger.error('! create family unit. ', e);
      return null;
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