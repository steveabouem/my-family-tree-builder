import BaseController from "../Base.controller";
import { Request, Response } from "express";
import { DEndpointResponse } from "../controllers.definitions";
import FamilyMember from "../../models/FamilyMember";
import FamilyTree from "../../models/FamilyTree";
import { DFamilyMemberRecord, DFamilyTreeNodeDTO } from "./familyMember.definitions";
import { Op } from "sequelize";
import logger from "../../utils/logger";
import dayjs from "dayjs";
import profiles from '../../utils/dummy/profiles';

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
  ? Fill in the first 3 generations of a given tree. Each member will be able to also
  ? be updated with their own family unit once tree is created (see this.addFamilyUnit)
  ? expects form data with all the members of the immediate family of the current user
  ? creates FamilyMember record for each of the members declared
  ? returns tree data objects array
  */
  public async createFamilyUnit(members: any) { // ! TODO: no any, easy fix
    //! TODO:  before running the bulk create, create an array with first, last name and dob. Run a WHERE IN to find duplicates and if any found, avoid creating new record but instead use existing to build blueprint
    const today = dayjs();
    let treeMembersById: any = {};
    let father: any = {}
    let mother: any = {}
    let currentFamilyMemberSpouse: any = {};

    try {
      if (members?.current) {
        const currentFamilyMember: any = members.current;
        // update current user's hasmap values
        treeMembersById[currentFamilyMember.id] = {
          ...currentFamilyMember, siblings: [], parents: [], spouses: [], children: []
        };
        if (members?.mother) {
          console.log('Mother provided ', members.mother);

          mother = await FamilyMember.create({
            ...members.mother, profile_url: profiles[Math.floor(Math.random() * 200) + 1],
            age: today.diff(dayjs(members.mother.dob), 'years'),
            gender: 2
          });

          // update mother's hasmap values
          treeMembersById[mother.dataValues.id] = { ...mother.dataValues, children: [currentFamilyMember.id], spouses: [], siblings: [], parents: [] };
          // add mother to the current user's hasmap values
          treeMembersById[currentFamilyMember.id].parents.push(mother.dataValues.id)
        }

        if (members?.father) {
          console.log('father provided ', members.father);

          father = await FamilyMember.create({
            ...members.father,
            profile_url: profiles[Math.floor(Math.random() * 200) + 1],
            age: today.diff(dayjs(members.father.dob), 'years'),
            gender: 1
          });
          // update tree members map (father, mother and mutual relationship)
          treeMembersById[father.dataValues.id] = {
            ...father.dataValues,
            children: [currentFamilyMember.id],
            spouses: mother?.dataValues ? [mother.dataValues.id] : [],
            siblings: [],
            parents: []
          };
          if (mother?.dataValues) {
            treeMembersById[mother?.dataValues?.id].spouses = [father?.dataValues?.id];
          }
          //update current user's hasmap values with father
          treeMembersById[currentFamilyMember.id].parents.push(father?.dataValues?.id)
        }

        if (members?.siblings?.length) {
          console.log('siblings provided ', members.siblings);
          const siblingsRecords = await FamilyMember.bulkCreate(
            members.siblings.map((s: any) => (
              { ...s, age: today.diff(dayjs(s.dob), 'years'), parent_1: mother?.id || null }
            ))).catch((e: any) => {
              logger.error('! createFamilyUnit ! bulk create siblings #106', e);
              return null;
            });

          siblingsRecords?.forEach(({ dataValues }: any) => {
            const siblingsParents = [];
            const siblingsMappedIds = siblingsRecords.filter((r: any) => (
              r.id !== dataValues.id));

            if (currentFamilyMember?.id) {
              siblingsParents.push(currentFamilyMember.id)
            }

            if (currentFamilyMemberSpouse?.id) {
              siblingsParents.push(currentFamilyMemberSpouse.id)
            }

            treeMembersById[dataValues.id] = {
              ...dataValues,
              siblings: [...siblingsMappedIds,
              currentFamilyMember.id],
              parents: siblingsParents, spouses: [], children: []
            };
          })
        }

        if (members?.spouse) {
          console.log('spouse provided ', members.spouse);

          // if spouse has no familyMember record, create it, otherwise use existing record. Add it to RFT mapping 
          const spouseFamilyMemberRecord = await FamilyMember.findOne({
            where: {
              [Op.and]: [{ first_name: members.spouse.first_name }, { last_name: members.spouse.last_name }, { dob: members.spouse.dob }, { partner: currentFamilyMember.id }]
            }
          });

          if (spouseFamilyMemberRecord) {
            currentFamilyMemberSpouse = spouseFamilyMemberRecord.dataValues;
          } else {
            const spouseRecord = await FamilyMember.create({ ...members.spouse, partner: currentFamilyMember.id, profile_url: profiles[Math.floor(Math.random() * 200) + 1] });
            currentFamilyMemberSpouse = spouseRecord.dataValues;
          }

          await FamilyMember.update({ partner: currentFamilyMemberSpouse.id }, { where: { id: { [Op.eq]: currentFamilyMember.id } } })
          // update tree members map (spouses array)
          treeMembersById[currentFamilyMemberSpouse.id] = {
            ...currentFamilyMemberSpouse, children: [], parents: [],
            siblings: [], spouses: [currentFamilyMember.id]
          };
          treeMembersById[currentFamilyMember.id].spouses = [currentFamilyMemberSpouse.id]
        }

        if (members?.children?.length) {
          console.log('children provided ', members.children);

          const childrenRecords = await FamilyMember.bulkCreate(members.children.map((c: any) => ({ ...c, parent_1: mother?.id || null }))).catch((e: any) => {
            logger.error('! createFamilyUnit ! bulk create children #158', e);
            return null;
          });

          if (childrenRecords?.length) {
            // update blueprint with all children and their relation to user and spouse (ensure the siblings array of each child does not contain their own id)
            const childrenMappedIds = childrenRecords?.map(({ dataValues }: any) => (dataValues.id)) || [];

            treeMembersById[currentFamilyMember.id].children = childrenMappedIds;
            childrenRecords.forEach(({ dataValues }: any) => {
              const childsParents = [];

              if (currentFamilyMember?.id) {
                childsParents.push(currentFamilyMember.id)
              }

              if (currentFamilyMemberSpouse?.id) {
                childsParents.push(currentFamilyMemberSpouse.id)
              }

              treeMembersById[dataValues.id] = {
                ...dataValues,
                profile_url: profiles[Math.floor(Math.random() * 200) + 1],
                parents: childsParents,
                siblings: [...childrenMappedIds.filter((id: any) => id !== dataValues.id), currentFamilyMember.id], spouses: []
              }
            });
          }
        }
        console.log('Final tree memebers ', treeMembersById);
      } else {
        logger.error('! missing current family member');
      }

      return treeMembersById;
    } catch (e: unknown) {
      logger.error('! create family unit. #191', e);
      return null;
    }
  }

  public async addFamilyUnit(data: any) {
    //! TODO:  before running the bulk create, create an array with first, last name and dob. Run a WHERE IN to find duplicates and if any found, avoid creating new record but instead use existing to build blueprint
    const {
      treeId,
      anchorId,
      father,
      mother,
      siblings,
      spouse,
      children
    } = data;
    let subFamily: any = [];

    if (!anchorId) {
      logger.error('! FamilyMember.addFamilyUnit !. Member not provided.');
    }

    const anchorFamilyMemberRecord = await FamilyMember.findByPk(anchorId);

    if (anchorFamilyMemberRecord?.dataValues) {
      subFamily = await this.createFamilyUnit({ father, mother, siblings, spouse, children, current: anchorFamilyMemberRecord.dataValues });
    } else {
      logger.error('! FamilyMember.addFamilyUnit !. Member not provided.');
    }

    return subFamily;
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
}

export default FamilyMemberController;
