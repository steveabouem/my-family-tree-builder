"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTree = exports.updateTree = exports.getTreeById = exports.createTree = exports.positionFamilyMembers = exports.getAllTrees = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const sequelize_1 = require("sequelize");
const FamilyTree_1 = __importDefault(require("../models/FamilyTree"));
const const_1 = require("@shared/const");
const logger_1 = __importDefault(require("../utils/logger"));
const User_1 = __importDefault(require("../models/User"));
const FamilyMember_1 = __importDefault(require("../models/FamilyMember"));
const serviceHelpers_1 = require("./serviceHelpers");
//#region getAllTrees
const getAllTrees = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(userId);
    let response = { code: 500, error: true, payload: [] };
    let treeList = [];
    try {
        const userRecord = yield User_1.default.findByPk(id);
        logger_1.default.info('Curr user ', { userRecord: userRecord === null || userRecord === void 0 ? void 0 : userRecord.email });
        if (userRecord) {
            treeList = yield FamilyTree_1.default.findAll({
                where: {
                    emails: {
                        [sequelize_1.Op.like]: `%${userRecord.email}%`
                    }
                }
            });
            logger_1.default.info('Trees ', { treeList });
            response.payload = treeList;
            response.code = 200;
            response.error = false;
            response.message = 'Fetched tree successfully.';
        }
    }
    catch (e) {
        response.code = 500;
        logger_1.default.error('Unable to fetch trees ', e);
    }
    response.payload = treeList;
    return response;
});
exports.getAllTrees = getAllTrees;
//#endregion
//#region positionFamilyMembers
/**
 * ? Receives FamilyMember[], update the position properties and return the list of RAW (dataValues) records post update
 * @param members
 * @param anchorNodeId
 * @returns APIFamilyMemberRecord[]
 */
const positionFamilyMembers = (members, anchorNodeId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const membersWithCoords = [];
    const anchor = members.find(m => m.dataValues.node_id === anchorNodeId);
    // go through all the anchor and its relative, and update the positions based on the anchor's position. make sure to use existing position if already available
    if (anchor) {
        // position every one of the anchor's relatives
        const position = JSON.parse(((_a = anchor === null || anchor === void 0 ? void 0 : anchor.dataValues) === null || _a === void 0 ? void 0 : _a.position) || '{ "x": 0, "y": 0 }');
        const childrenNodeIds = JSON.parse(((_b = anchor === null || anchor === void 0 ? void 0 : anchor.dataValues) === null || _b === void 0 ? void 0 : _b.children) || '[]');
        const siblingsNodeIds = JSON.parse(((_c = anchor === null || anchor === void 0 ? void 0 : anchor.dataValues) === null || _c === void 0 ? void 0 : _c.siblings) || '[]');
        const spousesNodeIds = JSON.parse(((_d = anchor === null || anchor === void 0 ? void 0 : anchor.dataValues) === null || _d === void 0 ? void 0 : _d.spouses) || '[]');
        const parentsNodeIds = JSON.parse(((_e = anchor === null || anchor === void 0 ? void 0 : anchor.dataValues) === null || _e === void 0 ? void 0 : _e.parents) || '[]');
        const childrenList = yield bulkUpdateRecordsPosition(childrenNodeIds, members, position, const_1.KinshipEnum.child, anchorNodeId);
        const siblingsList = yield bulkUpdateRecordsPosition(siblingsNodeIds, members, position, const_1.KinshipEnum.sibling, anchorNodeId);
        const parentsList = yield bulkUpdateRecordsPosition(parentsNodeIds, members, position, const_1.KinshipEnum.parent, anchorNodeId);
        const spousesList = yield bulkUpdateRecordsPosition(spousesNodeIds, members, position, const_1.KinshipEnum.spouse, anchorNodeId);
        // add them all to the list of members
        // @ts-ignore
        membersWithCoords.push(...childrenList);
        // @ts-ignore
        membersWithCoords.push(...siblingsList);
        // @ts-ignore
        membersWithCoords.push(...parentsList);
        // @ts-ignore
        membersWithCoords.push(...spousesList);
        // once thats done, position the current member themselves
        membersWithCoords.push(Object.assign(Object.assign({}, anchor.dataValues), { 
            // type: 'custom',
            // @ts-ignore
            position: JSON.stringify(position) }));
        logger_1.default.info('newNodeState', membersWithCoords);
        return membersWithCoords;
    }
    else {
        logger_1.default.error('No anchor provided. ', members);
    }
    return [];
});
exports.positionFamilyMembers = positionFamilyMembers;
//#endregion
//#region createTree
/**
 * ? used to create a record for each and to build the members array in the new tree instance
 * ? the returned payload only holds the member's node ids for simplicity
 * @param createData : form values for each tree member.
 * @returns FamilyTree
 */
const createTree = (createData) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: there is no check for existing members with same name and dob (or other prop). Duplicates are possible as it stands
    // !one way could be to encode every node_id with the treeID, so that any family member I cant think of a check that involves anything else than the family tree name.
    // ! last names can be very common, there could be two Abanda families for which the dad's first name is the same.
    // ! I could check query the db for members with same name and dob, and block if more than 1/2 has the exact same last name/dob. But it feels risky
    // ! a reasonable approach top of mind would be finding any trees where current user's user_id exist, and either limit to 1 tree per user id, or check number of duplicates in the list of memebers? 
    const { data, userId } = createData;
    let response = { code: 500, error: true, payload: null };
    try {
        const currentUser = yield (0, serviceHelpers_1.extractSingleDataValuesFrom)(User_1.default, { id: userId });
        if (currentUser) {
            const membersRecords = yield generateTreeMembersRecords(data.members, userId);
            if (membersRecords) {
                const withCoords = yield (0, exports.positionFamilyMembers)(Object.values(membersRecords), data.anchor);
                logger_1.default.info('Members After positionning', { withCoords });
                const nodeIdList = withCoords.map((curr) => curr.node_id);
                const emailList = withCoords.map((curr) => curr.email);
                const newTree = yield FamilyTree_1.default.create({
                    active: 1,
                    authorized_ips: '',
                    created_by: userId,
                    members: JSON.stringify(nodeIdList),
                    emails: JSON.stringify(emailList),
                    name: (data === null || data === void 0 ? void 0 : data.treeName) || '',
                    public: 0
                })
                    .catch((e) => {
                    logger_1.default.error('Unable to create a tree ', e);
                });
                response.code = 200;
                response.error = false;
                // members key will have the list of memebers, even if the db only has the list of node_ids
                response.payload = Object.assign(Object.assign({}, newTree === null || newTree === void 0 ? void 0 : newTree.dataValues), { members: withCoords });
            }
            else {
                logger_1.default.error('Unable to create members: records array empty');
            }
        }
        else {
            response.code = 500;
            response.message = 'Invalid entries';
            response.error = true;
            logger_1.default.error('User not found');
        }
    }
    catch (e) {
        logger_1.default.error('! FamilyTree.create !', e);
        response.code = 500;
    }
    return response;
});
exports.createTree = createTree;
//#endregion
//#region getTreeById
const getTreeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let response = { code: 500, error: true, payload: null };
    try {
        const tree = yield FamilyTree_1.default.findByPk(Number(id));
        if (!tree) {
            response.code = 404;
            response.error = true;
            response.message = 'Family tree not found';
            response.payload = null;
        }
        else {
            response.code = 200;
            response.error = false;
            response.message = 'Family tree fetched successfully';
            response.payload = tree;
        }
        return response;
    }
    catch (e) {
        logger_1.default.error('! FamilyTree.getOne !', e);
        response.message = 'Internal server error';
        return response;
    }
});
exports.getTreeById = getTreeById;
//#endregion
//#region updateTree
/**
 * ? Receives info on an existing Tree (list of members to update and requesting user),
 * ? updates the selected members' positions, connections and potentially properties. Returns the updated tree info
 * @param updateData: list of existing/new family members. List is not automacially exhaustive, since update will typically be based on either a single member, or a list of new ones.
 * Deletions will be handled separately
 * @returns FamilyTree
 */
const updateTree = (updateData) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    let response = { code: 500, error: true, payload: null };
    const { userId, data } = updateData;
    try {
        const tree = yield FamilyTree_1.default.findByPk((data === null || data === void 0 ? void 0 : data.treeId) || 0);
        if (!((_f = tree === null || tree === void 0 ? void 0 : tree.dataValues) === null || _f === void 0 ? void 0 : _f.id)) {
            logger_1.default.error('Invalid entries ', data);
        }
        else {
            const updatedMembersRecords = yield updateTreeMembers(tree, userId, data);
            // use data from the members post update: important properties may have changed. i.e name or kinship
            const membersRecordsFromUpdate = yield FamilyMember_1.default.findAll({ where: { node_id: { [sequelize_1.Op.in]: Object.keys(updatedMembersRecords || []) } } });
            const withCoords = yield (0, exports.positionFamilyMembers)(membersRecordsFromUpdate, data.anchor);
            const nodeIdList = withCoords.map((curr) => curr.node_id);
            const emailList = withCoords.map((curr) => curr.email);
            logger_1.default.info('withcoords', withCoords);
            const updatedTree = yield tree.update(Object.assign(Object.assign({}, updateData), { members: JSON.stringify(nodeIdList), emails: JSON.stringify(emailList) }));
            response.payload = Object.assign(Object.assign({}, updatedTree.dataValues), { members: withCoords });
            response.error = false;
            response.code = 200;
        }
    }
    catch (e) {
        logger_1.default.error('Unable to update tree ', e);
    }
    return response;
});
exports.updateTree = updateTree;
//#endregion
/**
 *
 * @param tree : includes list of members as currently stored in db
 * @param userId
 * @param updateData: member and tree updates
 */
//#region updateTreeMembers
// TODO: there are more validations to be done here
const updateTreeMembers = (tree, userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingMembersNodeIds = JSON.parse(tree.members);
    logger_1.default.info('This should be an array of node_id', { existingMembersNodeIds, members: updateData.members });
    const newRecords = []; //TODO: fix bulkcreate ops typing
    const updatedRecords = [];
    const newMembers = updateData.members.filter((m) => !existingMembersNodeIds.includes(m.node_id));
    let newMembersRecords = [];
    logger_1.default.info('This should not contain anything else than brand new memebers', { newMembersRecords });
    if (newMembers.length) {
        const today = (0, dayjs_1.default)();
        logger_1.default.info('Tree update includes new members', newMembers);
        for (const m of newMembers) {
            // there shouldnt be any duplicates here
            logger_1.default.info('Current tree member ', m, tree);
            newRecords.push(Object.assign(Object.assign({}, m), { age: today.diff((0, dayjs_1.default)(m.dob), 'years'), description: (m === null || m === void 0 ? void 0 : m.description) || '', created_by: userId, parents: m.parents, spouses: m.spouses, siblings: m.siblings, children: m.children }));
        }
        ;
    }
    if (newRecords.length) {
        // create records for any family member that doesnt already have one. 
        // No need to update the existing relatives, since node_id remains the same
        newMembersRecords = yield FamilyMember_1.default.bulkCreate(newRecords);
        // (...)
    }
    //add the newly created records to the mapped records object
    newMembersRecords.forEach((r) => {
        logger_1.default.info('Newly created record to add ', r);
        updatedRecords.push(Object.assign({}, r));
    });
    yield Promise.all(updateData.members.map((m) => __awaiter(void 0, void 0, void 0, function* () {
        var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        // todo: its better to do the findall then loop the result of that. 1 query instead of potential dozen
        const memberRecord = yield FamilyMember_1.default.findOne({ where: { node_id: { [sequelize_1.Op.eq]: m.node_id } } });
        if (memberRecord === null || memberRecord === void 0 ? void 0 : memberRecord.dataValues) { // TODO: what if any of htese arrays exist and are just being expanded rather than replaced? Front must handle that?
            const newChildren = ((_g = m === null || m === void 0 ? void 0 : m.children) === null || _g === void 0 ? void 0 : _g.length) ? JSON.stringify(m === null || m === void 0 ? void 0 : m.children) : (_h = memberRecord.dataValues) === null || _h === void 0 ? void 0 : _h.children;
            const newParents = ((_j = m === null || m === void 0 ? void 0 : m.parents) === null || _j === void 0 ? void 0 : _j.length) ? JSON.stringify(m === null || m === void 0 ? void 0 : m.parents) : (_k = memberRecord.dataValues) === null || _k === void 0 ? void 0 : _k.parents;
            const newSiblings = ((_l = m === null || m === void 0 ? void 0 : m.siblings) === null || _l === void 0 ? void 0 : _l.length) ? JSON.stringify(m === null || m === void 0 ? void 0 : m.siblings) : (_m = memberRecord.dataValues) === null || _m === void 0 ? void 0 : _m.siblings;
            const newSpouses = ((_o = m === null || m === void 0 ? void 0 : m.spouses) === null || _o === void 0 ? void 0 : _o.length) ? JSON.stringify(m === null || m === void 0 ? void 0 : m.spouses) : (_p = memberRecord.dataValues) === null || _p === void 0 ? void 0 : _p.spouses;
            const newPosition = ((_q = m === null || m === void 0 ? void 0 : m.position) === null || _q === void 0 ? void 0 : _q.x) ? JSON.stringify(m.position) : (_r = memberRecord.dataValues) === null || _r === void 0 ? void 0 : _r.position;
            const newConnections = ((_s = m === null || m === void 0 ? void 0 : m.connections) === null || _s === void 0 ? void 0 : _s.length) ? JSON.stringify(m.connections) : (_t = memberRecord.dataValues) === null || _t === void 0 ? void 0 : _t.connections;
            const recordWithUpdates = yield memberRecord.update(Object.assign(Object.assign(Object.assign({}, memberRecord.dataValues), m), { position: newPosition, connections: newConnections, children: newChildren, parents: newParents, siblings: newSiblings, spouses: newSpouses, age: memberRecord.age // form comes in with null for age. avoid replacing it
             }));
            logger_1.default.info('Updated. Return value is ', recordWithUpdates);
            updatedRecords.push(Object.assign({}, recordWithUpdates.dataValues));
        }
        else {
            logger_1.default.error('Invalid record provided ', m);
        }
    })));
    logger_1.default.info('Records After all updates', updatedRecords);
    const result = updatedRecords.reduce((map, curr) => (Object.assign(Object.assign({}, map), { [curr.node_id]: curr })), {});
    return result; //includes both new and existing records
});
//#endregion
//#region deleteTree
const deleteTree = (treeId) => __awaiter(void 0, void 0, void 0, function* () {
    let response = { code: 500, error: true, payload: null };
    const tree = yield FamilyTree_1.default.findByPk(treeId);
    if (!tree) {
        logger_1.default.error('Tree does not exist. Cannot delete', { treeId });
    }
    else {
        yield tree.destroy();
        response = Object.assign(Object.assign({}, response), { code: 200, error: false });
    }
    return response;
});
exports.deleteTree = deleteTree;
//#endregion
// async function canUserViewTree(treeId: number, userId: number): Promise<boolean> {
//   try {
//     const tree = await FamilyTree.findByPk(treeId);
//     if (!tree) return false;
//     const members = convertToFamilyMembers(tree.members);
//     return members.some((member: FamilyMember) => member.user_id == userId);
//   } catch (e: unknown) {
//     logger.error('! FamilyTree.isUserAuthorizedOntree ! ', e);
//     return false;
//   }
// }
// export const function = async  canUserUpdateTree(treeId: number, userId: number): Promise<boolean> {
//   try {
//     const tree = await FamilyTree.findByPk(treeId);
//     if (!tree) return false;
//     return tree.created_by === userId;
//   } catch (e: unknown) {
//     logger.error('! FamilyTree.isUserAuthorizedOntree ! ', e);
//     return false;
//   }
// };
//#region generateTreeMembersRecords
/**
 * ? Goes through all the family members submintted, creates records for each
 * ? is ignored if any of those memeber already has a record since this is part of the initial create action
 * @param members
 * @param userId
 */
const generateTreeMembersRecords = (members = [], userId) => __awaiter(void 0, void 0, void 0, function* () {
    const today = (0, dayjs_1.default)();
    const newMemberGroup = [];
    const nodeIdList = members.map(m => m.node_id);
    //! using the native query rather than the helper function, I need the ability to update later on 
    const duplicateRecords = yield FamilyMember_1.default.findAll({ where: { node_id: { [sequelize_1.Op.in]: nodeIdList } } });
    logger_1.default.info('dupli ', { duplicateRecords, nodeIdList });
    for (const m of members) {
        const matchInDulicateRecords = duplicateRecords === null || duplicateRecords === void 0 ? void 0 : duplicateRecords.find((r) => r.dataValues.node_id === m.node_id);
        logger_1.default.info('member in list ', m);
        if (!matchInDulicateRecords) {
            newMemberGroup.push(Object.assign(Object.assign({}, m), { age: today.diff((0, dayjs_1.default)(m.dob), 'years'), description: (m === null || m === void 0 ? void 0 : m.description) || '', created_by: userId, parents: JSON.stringify(m.parents), spouses: JSON.stringify(m.spouses), siblings: JSON.stringify(m.siblings), children: JSON.stringify(m.children) }));
        }
    }
    ;
    if (newMemberGroup.length) {
        const newRecords = yield FamilyMember_1.default.bulkCreate(newMemberGroup);
        logger_1.default.info('All new members created: ', { newRecords });
        const newMembersMap = newRecords.reduce((map, currentMember) => {
            return (Object.assign(Object.assign({}, map), { [currentMember.dataValues.node_id]: currentMember }));
        }, {});
        // @ts-ignore
        return newMembersMap;
    }
    else {
        logger_1.default.error('Unable to bulk create members, no records created');
    }
    return null;
});
//#endregion
//#region bulkUpdateRecordsPosition
/**
 * @param nodeIds
 * @param membersList
 * @param initialPosition
 * @param relation
 * @param anchor
 */
const bulkUpdateRecordsPosition = (nodeIds, membersList, initialPosition, relation, anchor) => __awaiter(void 0, void 0, void 0, function* () {
    const result = [];
    yield Promise.all(nodeIds.map((nodeId, nodeIndex) => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.default.info('Processing member inside the promise all bulk update: ', { nodeIds, membersList, nodeId });
        const existingRecordForRelative = membersList.find((m) => m.dataValues.node_id === nodeId);
        // const formattedDataForRelative = membersWithCoords.find((newNode: any) => newNode.node_id === nodeId);
        let offset = { x: 0, y: 0 };
        // calculate the offset in the graphic tree based on kinship
        switch (relation) {
            case const_1.KinshipEnum.child:
                offset = { x: initialPosition.x + (125 * (nodeIndex + 1)), y: initialPosition.y + 125 };
                break;
            case const_1.KinshipEnum.sibling:
                offset = { x: initialPosition.x + (125 * (nodeIndex + 1)), y: initialPosition.y };
                break;
            case const_1.KinshipEnum.spouse:
                offset = { x: initialPosition.x + (125 * (nodeIndex + 1)), y: initialPosition.y };
                break;
            case const_1.KinshipEnum.parent:
                offset = { x: initialPosition.x + (125 * (nodeIndex + 1)), y: initialPosition.y + 125 };
                break;
        }
        logger_1.default.info('Offset based on current relation ', offset);
        // update record of current relative with the offset
        if (existingRecordForRelative) { //previous version would check if duplicate in an array. see memberwithcoords in commented code
            const relativeUpdated = yield existingRecordForRelative.update({
                position: JSON.stringify(offset),
                connections: JSON.stringify([{
                        id: `${anchor}-${existingRecordForRelative.node_id}`,
                        source: anchor,
                        target: existingRecordForRelative.node_id
                    }])
            });
            result.push(relativeUpdated);
        }
        else {
            logger_1.default.info('ignoring current child as it is a dupe, ', { relative: nodeId });
        }
        // add the anchor and apply the initial position (it may be an existing prop, need to check if equal then update only if !=)
        result.push();
    })));
    logger_1.default.info('Result after all positions updates', result);
    return result;
});
//#endregion
