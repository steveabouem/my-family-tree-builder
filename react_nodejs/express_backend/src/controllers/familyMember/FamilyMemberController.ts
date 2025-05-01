import BaseController from "../Base.controller";
import { Request, Response } from "express";
import dayjs from "dayjs";
import { Op } from "sequelize";
import FamilyMember from "../../models/FamilyMember";
import { DFamilyMemberDAO, DFamilyMemberDTO } from "./familyMember.definitions";
import logger from "../../utils/logger";

class FamilyMemberController extends BaseController<any> {
  anchorKey: string;
  constructor() {
    super('family_trees');
    this.anchorKey = 'anchor';
  }

  /*
  * Using this function for both bulk and single operation
  * Receives an array of family members, within which each member has a list of children, siblings and spouses
  * loops through the arrays and creates a familyMember record for each member,
  * for the next member, check if the member already exists in the DB, if not create it
  * create the tree
  * as all the family members are created, crete a mirror obect if the incoming DAO, but this time with the DB ids.
  * return the resulting DAO
  */
  public async createRecords(members: { [stepName: string]: DFamilyMemberDAO }, userId: number): Promise<{ [id: string]: DFamilyMemberDAO } | null> {
    const today = dayjs();
    let res: any = [];
    const anchor = members?.[this.anchorKey];

    try {
      if (anchor) {
        const duplicate = await FamilyMember.findOne({
          where: {
            [Op.and]: [{ first_name: anchor.first_name }, { last_name: anchor.last_name }, { dob: anchor.dob }]
          }
        })
          .catch((e: unknown) => {
            logger.error('Error finding duplicate anchor ', e)
          });

        if (duplicate?.dataValues) {
          logger.error('Family member record appears to be a duplicate', { anchor, duplicate });
          return null;
        }

        const payload = this.getMembersFromCreateAction(anchor, userId);
        return payload;
      } else {
        logger.error('No record created, missing anchor node. Returning empty array', res);
        return null;
      }
    } catch (e: unknown) {
      logger.error('Unable to bulk create members ', e);
    }

    return res;
  }

  /*
  * @request: {data: DFamilyMemberDTO[], treeId: number}
  * Receives an array of family members from the same, existing tree
  * Update their individual records in db
  * Update the tree's members value
  * Returns updated tree and members
  */
  public async updateRecordAndRelations(req: Request, res: Response) {
    // TODO: inactive trees should not allow this operation

    try {
      let response = { error: true, code: 400 };
      const data: DFamilyMemberDAO = req.body.data;
      const nodeId = data.node_id;
      const userId: number = req.body.userId;
      const matchingMembers = await FamilyMember.findOne({ where: { node_id: { [Op.eq]: nodeId } } })
        .catch((e: unknown) => {
          logger.info('forwarding error to Base controller method ', e);
        });
      logger.info('The matchingMembers results: ', matchingMembers);

      if (matchingMembers) {
        logger.info('Found matching member: ', matchingMembers);
        const payload = await this.getMembersFromUpdateAction(data, userId);
        response.code = 200;
        res.status(200);
        return ({ ...response, ...payload });
      } else {
        logger.info('No matching data found', data);
      }
      return response;
    } catch (e: unknown) {
      logger.error('Forwarding error to base controller ', e);
    }

  }

  /*
  * @data: the info of the member to create
  * @userId
  * returns a hashmap of the records keyed to their ids, for all members and their respective  connections
  */
  private async getMembersFromCreateAction(data: DFamilyMemberDAO, userId: number): Promise<{ [id: string]: DFamilyMemberDAO } | null> {
    const today = dayjs();
    const children = data?.children || [];
    const siblings = data?.siblings || [];
    const spouses = data?.spouses || [];
    const parents = data?.parents || [];

    data.age = today.diff(dayjs(data.dob), 'years');
    children?.forEach((c: any) => {
      c.age = today.diff(dayjs(c.dob), 'years');
      c.parents = JSON.stringify([...c?.parents || [], data]);
    });
    siblings?.forEach((s: any) => {
      s.siblings = JSON.stringify([...s.siblings || [], data]);
      s.age = today.diff(dayjs(s.dob), 'years');
    });
    parents?.forEach((p: any) => {
      p.age = today.diff(dayjs(p.dob), 'years');
      p.children = JSON.stringify([...p?.children || [], data]);
    });
    spouses?.forEach((s: any) => {
      s.age = today.diff(dayjs(s.dob), 'years');
      s.spouses = JSON.stringify([...s?.spouses || [], data]);
    });

    const payload: any = [data, ...children, ...siblings, ...parents, ...spouses];

    logger.info("Resulting flat array for members: ", { payload });
    /*
    * since we're using a step form, we don't have to worry about drilling through the array.
    * every member's info is at the first level of the array. The repetition is necessary for the ui library responsible for rendering the tree
    */
    //  TODO: avoid duplicate, this function will also be used to update existing records
    const newMemberGroup = await FamilyMember.bulkCreate(payload.map((m: DFamilyMemberDAO) => ({
      ...m,
      description: m?.description || '',
      user_id: m?.userId || 0,
      created_by: 1,
      parents: JSON.stringify(m.parents),
      siblings: JSON.stringify(m.siblings),
      children: JSON.stringify(m.children),
    })))
      .catch((e: unknown) => {
        logger.error('Unable to bulk create members, unknown error ', e);
      });

    if (!!newMemberGroup) {
      logger.info('All new members created: ', { newMemberGroup });
      const newMembersMap = newMemberGroup.reduce((map: { [nodeId: string]: FamilyMember }, currentMember: FamilyMember) => {
        return ({ ...map, [currentMember.id]: currentMember });
      }, {});
      return newMembersMap;
    } else {
      logger.error('Unable to bulk create members, no records created');
    }
    return null;
  }

  /*
  * @data: the info of the member to update
  * @userId
  * Receives a familyMember DAO with additional data to update the record with (including a kinship array potentially)
  * returns a hashmap of the records keyed to their ids, for all members and their respective  connections
  */
  private async getMembersFromUpdateAction(data: DFamilyMemberDAO, userId: number): Promise<{ [id: string]: DFamilyMemberDAO } | null> {
    const childrenNodeIds = data?.children?.map((c: DFamilyMemberDAO) => c.node_id) || [];
    const siblingsNodeIds = data?.siblings?.map((s: DFamilyMemberDAO) => s.node_id) || [];
    const spousesNodeIds = data?.spouses?.map((s: DFamilyMemberDAO) => s.node_id) || [];
    const parentsNodeIds = data?.parents?.map((p: DFamilyMemberDAO) => p.node_id) || [];
    const matchingRecord = await FamilyMember.findOne({ where: { node_id: { [Op.eq]: data.node_id } } })
      .catch((e: unknown) => {
        logger.error('Forward error to base: ', e);
      });

    if (matchingRecord?.dataValues) {
      let payload = {};
      logger.info('Found matching family member: ', matchingRecord);
      //  TODO: avoid duplicate, this function will also be used to update existing records
      /*
      * Create records for any additional children
      */
      if (data?.children?.length) {
        const existingChildren = await FamilyMember.findAll({ where: { node_id: { [Op.in]: childrenNodeIds } } })
          .catch((e: unknown) => {
            logger.error('Failed to lookup duplicate children', e);
          });
        const existingChildrenNodeIds = existingChildren?.map((c: FamilyMember) => c.node_id);
        const newChildren = data.children.filter((c: DFamilyMemberDAO) => !existingChildrenNodeIds?.includes(c.node_id));
        logger.info('List of children to be added after check: ', { newChildren, existingChildren });

        newChildren.forEach(async (c: DFamilyMemberDAO) => {
          const childreRecords = await this.getMembersFromCreateAction(c, userId)
            .catch((e: unknown) => {
              logger.error('Update for childreRecords failed ', e);
            });
          payload = { ...payload, ...childreRecords };
          logger.info('Payload after ', childreRecords);
        });
        await matchingRecord.update({
          ...matchingRecord.dataValues,
          children: JSON.stringify([...newChildren, ...existingChildren || []])
        })
          .catch((e: unknown) => {
            logger.error('Failed to update record with new children ', e);
          });
        logger.info('Resulting list of new children: ', newChildren);
      }

      if (data?.siblings?.length) {
        const existingSiblings = await FamilyMember.findAll({ where: { node_id: { [Op.in]: siblingsNodeIds } } })
          .catch((e: unknown) => {
            logger.error('Failed to lookup duplicate siblings', e);
          });

        const existingSiblingsNodeIds = existingSiblings?.map((s: FamilyMember) => s.node_id);
        const newSiblings = data.siblings.filter((s: DFamilyMemberDAO) => !existingSiblingsNodeIds?.includes(s.node_id));
        logger.info('List of siblings to be added after check: ', { newSiblings, existingSiblings });

        newSiblings.forEach(async (s: DFamilyMemberDAO) => {
          const siblingRecords = await this.getMembersFromCreateAction(s, userId);
          payload = { ...payload, ...siblingRecords };
          logger.info('Payload after ', siblingRecords);
        });
        await matchingRecord.update({
          ...matchingRecord.dataValues,
          siblings: JSON.stringify([...newSiblings, ...existingSiblings || []])
        })
          .catch((e: unknown) => {
            logger.error('Failed to update record with new children ', e);
          });
        logger.info('Resulting list of new siblings: ', newSiblings);
      }

      if (data?.spouses?.length) {
        const existingSpouses = await FamilyMember.findAll({ where: { node_id: { [Op.in]: spousesNodeIds } } })
          .catch((e: unknown) => {
            logger.error('Failed to lookup duplicate spouses', e);
          });

        const existingSpousesNodeIds = existingSpouses?.map((s: FamilyMember) => s.node_id);
        const newSpouses = data.spouses.filter((s: DFamilyMemberDAO) => !existingSpousesNodeIds?.includes(s.node_id));
        logger.info('List of spouses to be added after check: ', { newSpouses, existingSpouses });

        newSpouses.forEach(async (s: DFamilyMemberDAO) => {
          const spouseRecords = await this.getMembersFromCreateAction(s, userId);
          payload = { ...payload, ...spouseRecords };
          logger.info('Payload after ', spouseRecords);
        });
        await matchingRecord.update({
          ...matchingRecord.dataValues,
          spouses: JSON.stringify([...newSpouses, ...existingSpouses || []])
        })
          .catch((e: unknown) => {
            logger.error('Failed to update record with new children ', e);
          });
        logger.info('Resulting list of new spouses: ', newSpouses);
      }

      if (data?.parents?.length) {
        const existingParents = await FamilyMember.findAll({ where: { node_id: { [Op.in]: parentsNodeIds } } })
          .catch((e: unknown) => {
            logger.error('Failed to lookup duplicate parents', e);
          });

        const existingParentsNodeIds = existingParents?.map((p: FamilyMember) => p.node_id);
        const newParents = data.parents.filter((p: DFamilyMemberDAO) => !existingParentsNodeIds?.includes(p.node_id));
        logger.info('List of parents to be added after check: ', { newParents, existingParents });

        newParents.forEach(async (p: DFamilyMemberDAO) => {
          const parentRecords = await this.getMembersFromCreateAction(p, userId);
          payload = { ...payload, ...parentRecords };
          logger.info('Payload after ', parentRecords);
        });
        await matchingRecord.update({
          ...matchingRecord.dataValues,
          parents: JSON.stringify([...newParents, ...existingParents || []])
        })
          .catch((e: unknown) => {
            logger.error('Failed to update record with new children ', e);
          });
        logger.info('Resulting list of new parents: ', newParents);
      }
      logger.info('Final payload ', { ...payload });

      return { ...payload, [matchingRecord.id]: matchingRecord };
    } else {
      logger.error('No record matches the member to update ', data);
    }

    return null;
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

}

export default FamilyMemberController;
