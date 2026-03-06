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
exports.getAllRelativesData = exports.deleteTree = exports.updateMemberPositions = exports.deleteTreeMember = exports.updateTree = exports.getTreeById = exports.createTree = exports.positionFamilyMembers = exports.getAllTrees = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const sequelize_1 = require("sequelize");
const FamilyTree_1 = __importDefault(require("../models/FamilyTree"));
const logger_1 = __importDefault(require("../utils/logger"));
const User_1 = __importDefault(require("../models/User"));
const FamilyMember_1 = __importDefault(require("../models/FamilyMember"));
const serviceHelpers_1 = require("./serviceHelpers");
const types_1 = require("./types");
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
                    [sequelize_1.Op.or]: {
                        emails: {
                            [sequelize_1.Op.like]: `%${userRecord.email}%`
                        },
                        created_by: {
                            [sequelize_1.Op.eq]: id
                        }
                    }
                },
            });
            yield Promise.all(treeList.map((t) => __awaiter(void 0, void 0, void 0, function* () {
                const memberRecords = yield FamilyMember_1.default.findAll({ where: { node_id: { [sequelize_1.Op.in]: JSON.parse(t.members) } } });
                // @ts-ignore: I dont feel like fixing this. Its a simple fix, but I dont feel like it rn
                t.members = memberRecords === null || memberRecords === void 0 ? void 0 : memberRecords.map(m => formatFamilyMemberToFront(m));
            })));
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
 * @returns FamilyMember[]
 */
// create was once again returning an empty arrayBuffer. I had mistyped the members arg.
// need to make sure to always extract the actual attributes. By creataing actualMemberDataList
// I bypassed the error for create, but I need to cleanup and ideally avoid the workaroud.
// it should be clearer  what goes in and what comes out and ideally the same for create and update
const positionFamilyMembers = (members, anchorNodeId) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: review crud and decide on FamilyMember[] and InferAttributes<FamilyMember>[]
    const actualMemberDataList = members.map(m => (m === null || m === void 0 ? void 0 : m.dataValues) || m);
    const membersWithCoords = [];
    let anchor = actualMemberDataList.find(m => m.node_id === anchorNodeId);
    logger_1.default.info('FOUND ANCHOR ', { anchor, actualMemberDataList });
    // go through  the anchor and its relative, and update the positions based on the anchor's position. make sure to use existing position if already available
    if (anchor) {
        // Always fetch anchor's position from database to ensure we have the latest value
        // This is important because updateTreeMembers may have preserved the existing position
        const anchorRecord = yield FamilyMember_1.default.findOne({ where: { node_id: { [sequelize_1.Op.eq]: anchorNodeId } } });
        let anchorPosition = { x: 0, y: 0 };
        if (anchorRecord) {
            const formattedAnchor = formatFamilyMemberToFront(anchorRecord);
            anchorPosition = formattedAnchor.position || { x: 0, y: 0 };
            // Update anchor object with position from database
            anchor = Object.assign(Object.assign({}, anchor), { position: anchorPosition });
        }
        else if (anchor.position) {
            // Fallback to anchor's position if DB record not found
            anchorPosition = anchor.position;
        }
        logger_1.default.info('Anchor data is ', { anchor, anchorPosition });
        // position every one of the anchor's relatives
        const position = anchorPosition;
        const childrenNodeIds = (anchor === null || anchor === void 0 ? void 0 : anchor.children) || [];
        const siblingsNodeIds = (anchor === null || anchor === void 0 ? void 0 : anchor.siblings) || [];
        const spousesNodeIds = (anchor === null || anchor === void 0 ? void 0 : anchor.spouses) || [];
        const parentsNodeIds = (anchor === null || anchor === void 0 ? void 0 : anchor.parents) || [];
        const childrenList = yield bulkUpdateRecordsPosition(childrenNodeIds, actualMemberDataList, position, types_1.KinshipEnum.child, anchorNodeId);
        const siblingsList = yield bulkUpdateRecordsPosition(siblingsNodeIds, actualMemberDataList, position, types_1.KinshipEnum.sibling, anchorNodeId);
        const parentsList = yield bulkUpdateRecordsPosition(parentsNodeIds, actualMemberDataList, position, types_1.KinshipEnum.parent, anchorNodeId);
        const spousesList = yield bulkUpdateRecordsPosition(spousesNodeIds, actualMemberDataList, position, types_1.KinshipEnum.spouse, anchorNodeId);
        // add them all to the list of members
        membersWithCoords.push(...childrenList);
        membersWithCoords.push(...siblingsList);
        membersWithCoords.push(...parentsList);
        membersWithCoords.push(...spousesList);
        // once thats done, position the current member themselves
        // Update anchor's position in database (it may have been preserved from existing record)
        yield FamilyMember_1.default.update({ position: JSON.stringify(position) }, { where: { node_id: { [sequelize_1.Op.eq]: anchorNodeId } } });
        membersWithCoords.push(Object.assign(Object.assign({}, anchor), { type: 'custom', position // position is already set from database fetch above
            // name: `${anchor.first_name} ${anchor.last_name}`
         }));
        logger_1.default.info('newNodeState', membersWithCoords);
        return membersWithCoords;
    }
    else {
        logger_1.default.error('No anchor provided. ', actualMemberDataList);
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
    // !one way could be to encode every node_id with the treeID,  I cant think of a check that involves anything else than the family tree name/id
    // ! last names can be very common, there could be two Abanda families for which the dad's first name is the same.
    // ! I could check query the db for members with same name and dob, and block if more than 1/2 has the exact same last name/dob. But it feels risky
    // ! a reasonable approach top of mind would be finding any trees where current user's user_id exist, and either limit to 1 tree per user id, or check number of duplicates in the list of members? 
    const { data, userId } = createData;
    let response = { code: 500, error: true, payload: null };
    try {
        const currentUser = yield (0, serviceHelpers_1.extractSingleDataValuesFrom)(User_1.default, { id: userId });
        if (currentUser) {
            // TODO: it would be best if positionnning happens before creating the record so that db is only updated once instead of twice +
            const membersRecords = yield generateTreeMembersRecords(data.members, userId);
            logger_1.default.info('RETURNED MEMBER RECORDS', { membersRecords });
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
                const detailedListOfMembers = yield (0, exports.getAllRelativesData)(newTree);
                logger_1.default.info('Detailed list of members ', detailedListOfMembers);
                response.payload = Object.assign(Object.assign({}, newTree === null || newTree === void 0 ? void 0 : newTree.dataValues), { members: detailedListOfMembers || [] });
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
            const memberRecords = yield FamilyMember_1.default.findAll({ where: { node_id: { [sequelize_1.Op.in]: JSON.parse(tree.members) } } });
            // @ts-ignore: I dont feel like fixing this. Its a simple fix, but I dont feel like it rn
            tree.members = memberRecords === null || memberRecords === void 0 ? void 0 : memberRecords.map(m => formatFamilyMemberToFront(m));
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
 * @param updateData: list of existing/new family members. List is not automacially exhaustive,
 * since update will typically be based on either a single member, or a list of new ones.
 * Deletions will be handled separately
 * @returns FamilyTree
 */
const updateTree = (updateData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let response = { code: 500, error: true, payload: null };
    const { userId, data } = updateData;
    if (data === null || data === void 0 ? void 0 : data.treeId) {
        try {
            const tree = yield FamilyTree_1.default.findByPk(data.treeId);
            logger_1.default.info('Tree and incoming updates: ', { tree, updateData });
            if (!((_a = tree === null || tree === void 0 ? void 0 : tree.dataValues) === null || _a === void 0 ? void 0 : _a.id)) {
                logger_1.default.error('Invalid entries ', data);
            }
            else {
                // ! only the members passed by the form will be here. 
                // ! If the tree already had existing members and they're not being updated, they wont be in this variable
                const updatedMembersRecords = yield updateTreeMembers(tree, userId, data);
                logger_1.default.info('updateTree: updatedMembersRecords from updateTreeMembers', { updatedMembersRecords, keys: Object.keys(updatedMembersRecords || {}) });
                const withCoords = yield (0, exports.positionFamilyMembers)(Object.values(updatedMembersRecords || {}), data.anchor);
                logger_1.default.info('updateTree: with coords ', { withCoords });
                // ! in order to have all the records sent back to the user, query all the tree members before updating the positions
                const prevNodeIds = JSON.parse(tree.dataValues.members);
                logger_1.default.info('Members list before tree update with new positions ', { prevNodeIds });
                const incomingnodeIdList = data.members.map(m => m.node_id);
                incomingnodeIdList.forEach((n) => {
                    if (!prevNodeIds.includes(n)) {
                        logger_1.default.info('This node id is new: ', { n });
                        prevNodeIds.push(n);
                    }
                    else {
                        logger_1.default.info('This node id already existed: ', { n });
                    }
                });
                logger_1.default.info('full node list', { prevNodeIds });
                const emailList = withCoords.map((curr) => curr.email);
                logger_1.default.info('withcoords', withCoords);
                const updatedTree = yield tree.update(Object.assign(Object.assign({}, updateData), { members: JSON.stringify(prevNodeIds), emails: JSON.stringify(emailList) }));
                const updatedMembers = yield FamilyMember_1.default.findAll({
                    where: {
                        node_id: {
                            [sequelize_1.Op.in]: prevNodeIds
                        }
                    }
                });
                const membersFormatted = updatedMembers.map((m) => formatFamilyMemberToFront(m));
                logger_1.default.info('members at the end: ', { updatedMembers, membersFormatted }); // ! CURRENT FOCUS: THIS SEEMS TO HAVE ALL THE MEMBERS UP TO DATE (tried with 2)
                response.payload = Object.assign(Object.assign({}, updatedTree.dataValues), { members: membersFormatted });
                response.error = false;
                response.code = 200;
            }
        }
        catch (e) {
            logger_1.default.error('Unable to update tree ', e);
        }
    }
    else {
        response.message = 'No id provided';
    }
    return response;
});
exports.updateTree = updateTree;
//#endregion
/**
 *
 * @param tree : includes list of members as currently stored in db
 * @param userId
 * @param updateData: member and tree updates (including both new and existing members)
 */
//#region updateTreeMembers
// TODO: there are more validations to be done here.
const updateTreeMembers = (tree, userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingMembersNodeIds = JSON.parse(tree.members);
    const recordsFormattedAndUpdated = [];
    let newMembersFormData = [];
    let membersRecordsCreated = [];
    let existingMembersFormData = [];
    const today = (0, dayjs_1.default)();
    logger_1.default.info('updateTreeMembers: Tree members array', { existingMembersNodeIds });
    logger_1.default.info('updateTreeMembers: All incoming members', { allMembers: updateData.members });
    // prepare update of incoming basic attributes (positionning is done separately for now)
    for (const m of updateData.members) {
        if (tree.members.includes(m.node_id)) {
            existingMembersFormData.push(Object.assign(Object.assign({}, m), { description: (m === null || m === void 0 ? void 0 : m.description) || '', 
                // Don't stringify position here - it will be handled by positionFamilyMembers
                // Only stringify if position is explicitly provided, otherwise preserve existing
                position: m.position ? JSON.stringify(m.position) : undefined, profile_url: (0, serviceHelpers_1.processIncomingImage)(m === null || m === void 0 ? void 0 : m.profile_url) || undefined, connections: JSON.stringify(m.connections || []), parents: JSON.stringify(Array.isArray(m.parents) ? m.parents : (m.parents ? [m.parents] : [])), spouses: JSON.stringify(Array.isArray(m.spouses) ? m.spouses : (m.spouses ? [m.spouses] : [])), siblings: JSON.stringify(Array.isArray(m.siblings) ? m.siblings : (m.siblings ? [m.siblings] : [])), children: JSON.stringify(Array.isArray(m.children) ? m.children : (m.children ? [m.children] : [])) }));
        }
        else {
            newMembersFormData.push(Object.assign(Object.assign({}, m), { age: today.diff((0, dayjs_1.default)(m.dob), 'years'), description: (m === null || m === void 0 ? void 0 : m.description) || '', created_by: userId, position: JSON.stringify(m.position || { x: 0, y: 0 }), connections: JSON.stringify(m.connections || []), parents: JSON.stringify(Array.isArray(m.parents) ? m.parents : (m.parents ? [m.parents] : [])), spouses: JSON.stringify(Array.isArray(m.spouses) ? m.spouses : (m.spouses ? [m.spouses] : [])), siblings: JSON.stringify(Array.isArray(m.siblings) ? m.siblings : (m.siblings ? [m.siblings] : [])), children: JSON.stringify(Array.isArray(m.children) ? m.children : (m.children ? [m.children] : [])), profile_url: (0, serviceHelpers_1.processIncomingImage)(m === null || m === void 0 ? void 0 : m.profile_url) || undefined }));
        }
        // create records for any family member that doesnt already have one. 
        if (newMembersFormData.length) {
            logger_1.default.info("updateTreeMembers: Ready for bulk create: ", { newRecords: newMembersFormData });
            // @ts-ignore
            membersRecordsCreated = yield FamilyMember_1.default.bulkCreate(newMembersFormData);
            // Add formatted new records to the result
            membersRecordsCreated.forEach((member) => {
                const formattedRecord = formatFamilyMemberToFront(member);
                recordsFormattedAndUpdated.push(formattedRecord);
            });
        }
        // update records for any family member that already has one. 
        if (existingMembersFormData.length) {
            logger_1.default.info("updateTreeMembers: Ready for bulk update]: ", { newRecords: membersRecordsCreated });
            yield Promise.all(existingMembersFormData.map((memberData) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const existingMemberRecord = yield FamilyMember_1.default.findOne({
                    where: {
                        node_id: { [sequelize_1.Op.eq]: memberData.node_id }
                    }
                });
                if (existingMemberRecord) {
                    logger_1.default.info('Found record for existing member in list. REady for single update', { existingMemberRecord });
                    const updatedRecord = yield existingMemberRecord.update(Object.assign(Object.assign(Object.assign({}, existingMemberRecord.dataValues), memberData), { age: existingMemberRecord.dataValues.age, 
                        // Update JSON fields if provided - memberData already contains stringified values from existingMembersFormData
                        // Preserve existing position if not explicitly provided (positioning will be handled by positionFamilyMembers)
                        position: (_a = memberData.position) !== null && _a !== void 0 ? _a : existingMemberRecord.dataValues.position, connections: memberData.connections || existingMemberRecord.dataValues.connections, children: memberData.children || existingMemberRecord.dataValues.children, parents: memberData.parents || existingMemberRecord.dataValues.parents, siblings: memberData.siblings || existingMemberRecord.dataValues.siblings, spouses: memberData.spouses || existingMemberRecord.dataValues.spouses }));
                    // Add formatted record to the result
                    const formattedRecord = formatFamilyMemberToFront(updatedRecord);
                    recordsFormattedAndUpdated.push(formattedRecord);
                }
                else {
                    logger_1.default.info('NOT FOUND EXISTING MEMBER');
                }
            })));
        }
    }
    ;
    const result = recordsFormattedAndUpdated.reduce((map, curr) => (Object.assign(Object.assign({}, map), { [curr.node_id]: curr })), {});
    logger_1.default.info('updateTreeMembers: Final result object', { result, resultKeys: Object.keys(result) });
    return result; //includes both new and existing records
    //#endregion
});
/**
 *
 */
const deleteTreeMember = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let response = { code: 500, error: true, payload: null };
    try {
        const currentMember = yield FamilyMember_1.default.findOne({ where: { node_id: data.node_id } });
        const matchingTree = yield FamilyTree_1.default.findByPk(data.treeId);
        logger_1.default.info('vars', { currentMember, matchingTree });
        if (currentMember && matchingTree) {
            const nodes = JSON.parse(matchingTree.dataValues.members);
            const memberIndex = nodes.indexOf(currentMember.node_id);
            const updatedNodes = nodes.filter(n => n != currentMember.node_id);
            logger_1.default.info('DELETE M: ', { nodes, memberIndex, updatedNodes });
            // nodes.splice(memberIndex, 1);
            const done = yield matchingTree.update('members', JSON.stringify(updatedNodes));
            logger_1.default.info('DELETE M: after splice', { nodes, matchingTree, done });
            yield currentMember.destroy();
            response.payload = Object.assign(Object.assign({}, done.dataValues), { members: JSON.parse(done.dataValues.members) });
            response.code = 200;
            response.error = false;
        }
    }
    catch (e) {
        logger_1.default.error('Delete member failed: ', { error: e });
        response.message = 'Invalid member';
    }
    return response;
});
exports.deleteTreeMember = deleteTreeMember;
//#region update positions
/**
 * Used to save family members new positions (single or in bulk alike)
 * @param members
 * @param userId
 */
const updateMemberPositions = (positions) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: return entire list of members to refresh the tree in the front
    let response = { code: 500, error: true, payload: null };
    try {
        if (positions.userId) {
            const nodeIds = positions.data.map(m => m.node_id);
            const memberRecords = yield FamilyMember_1.default.findAll({
                where: {
                    node_id: {
                        [sequelize_1.Op.in]: nodeIds
                    }
                }
            });
            if (memberRecords === null || memberRecords === void 0 ? void 0 : memberRecords.length) {
                yield Promise.all(memberRecords.map(m => {
                    const newCoords = positions.data.find(p => p.node_id === m.node_id);
                    m.position = JSON.stringify(newCoords === null || newCoords === void 0 ? void 0 : newCoords.new_position);
                    m.save();
                }));
            }
            response.payload = memberRecords;
            response.code = 200;
            response.error = false;
        }
        else {
            response.message = 'Invalid entry';
        }
    }
    catch (e) {
        response.message = 'Failed operation';
    }
    return response;
});
exports.updateMemberPositions = updateMemberPositions;
//#endregion
//#region deleteTree
const deleteTree = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let response = { code: 500, error: true, payload: null };
    logger_1.default.info('payload ', { data });
    try {
        const tree = yield FamilyTree_1.default.findByPk(data.id);
        const user = yield User_1.default.findByPk(data.userId);
        const isAllowed = !!(tree === null || tree === void 0 ? void 0 : tree.dataValues) && tree.dataValues.created_by == (user === null || user === void 0 ? void 0 : user.id);
        if (isAllowed) {
            yield tree.destroy();
            response = Object.assign(Object.assign({}, response), { code: 200, error: false });
        }
        else {
            logger_1.default.error('updateTreeMembers: Invalid delete entries');
        }
    }
    catch (e) {
        logger_1.default.error('Delete tree, ', { e });
    }
    return response;
});
exports.deleteTree = deleteTree;
//#endregion
// TODO: you need to separate the action of updating a single member's data with the action of adding relatives to a member.
//  This is to avoir always running an update on the members records even when all youre doing is adding relatives to it. make sure to also make that distinction in the frontend's CTAs
// export const updateSingleMemberData = (memberDAta: FamilyTreeFormData, memberId: number)
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
 * ? Goes through all the family members submitted, creates records for each
 * ? is ignored if any of those memeber already has a record since this is part of the initial create action
 * @param members
 * @param userId
 */
const generateTreeMembersRecords = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (members = [], userId) {
    logger_1.default.info("START GENERATION ", members);
    const today = (0, dayjs_1.default)();
    const newMemberGroup = [];
    const nodeIdList = members.map(m => m.node_id);
    //? using the native query rather than the helper function, I need the ability to update later on 
    const duplicateRecords = yield FamilyMember_1.default.findAll({ where: { node_id: { [sequelize_1.Op.in]: nodeIdList } } });
    logger_1.default.info('Checking for duplicate family member before creating tree ', { duplicateRecords, nodeIdList });
    for (const m of members) {
        const currentMemberIsDuplicate = !!(duplicateRecords === null || duplicateRecords === void 0 ? void 0 : duplicateRecords.find((r) => r.dataValues.node_id === m.node_id));
        logger_1.default.info('member in list ', m);
        if (currentMemberIsDuplicate) {
            continue;
        }
        else {
            newMemberGroup.push(Object.assign(Object.assign({}, m), { age: today.diff((0, dayjs_1.default)(m.dob), 'years'), description: (m === null || m === void 0 ? void 0 : m.description) || '', created_by: userId, position: JSON.stringify({ x: 0, y: 0 }), parents: JSON.stringify(m.parents), spouses: JSON.stringify(m.spouses), siblings: JSON.stringify(m.siblings), children: JSON.stringify(m.children), profile_url: (0, serviceHelpers_1.processIncomingImage)(m === null || m === void 0 ? void 0 : m.profile_url) }));
        }
    }
    ;
    if (newMemberGroup.length) {
        const newRecords = yield FamilyMember_1.default.bulkCreate(newMemberGroup);
        logger_1.default.info('All new members created: ', { newRecords });
        const newMembersMap = newRecords.reduce((map, currentMember) => {
            const currentMemberData = formatFamilyMemberToFront(currentMember);
            return (Object.assign(Object.assign({}, map), { [currentMember.dataValues.node_id]: currentMemberData }));
        }, {});
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
const bulkUpdateRecordsPosition = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (nodeIds = [], membersList, initialPosition, relation, anchor) {
    const result = [];
    //! TODO: URGENT instead of creating/getUnpackedSettings, then make another operation for SVGTextPositioningElement, you should 
    // manage the incomning data object for each membersList, use the position function to assign a x and yield, and only then create/ updte the record
    if (Array.isArray(nodeIds)) {
        yield Promise.all(nodeIds.map((nodeId, nodeIndex) => __awaiter(void 0, void 0, void 0, function* () {
            logger_1.default.info('Processing member inside the promise all bulk update: ', { nodeIds, membersList, nodeId, nodeIndex, relation });
            const existingRecordForRelative = membersList.find((m) => m.node_id === nodeId);
            let offset = { x: 0, y: 0 };
            // calculate the offset in the graphic tree based on kinship
            switch (relation) {
                case types_1.KinshipEnum.child:
                    offset = { x: initialPosition.x + (125 * nodeIndex), y: initialPosition.y + 125 };
                    break;
                case types_1.KinshipEnum.sibling:
                    offset = { x: initialPosition.x + (125 * (nodeIndex + 1)), y: initialPosition.y };
                    break;
                case types_1.KinshipEnum.spouse:
                    offset = { x: initialPosition.x + (125 * (nodeIndex + 1)), y: initialPosition.y };
                    break;
                case types_1.KinshipEnum.parent:
                    offset = { x: initialPosition.x + (125 * nodeIndex), y: initialPosition.y - 125 };
                    break;
            }
            logger_1.default.info('Offset based on current relation ', { offset, relation });
            // update record of current relative with the offset
            if (existingRecordForRelative) { //previous version would check if duplicate in an array. see memberwithcoords in commented code
                const relativeUpdated = yield FamilyMember_1.default.update({
                    position: JSON.stringify(offset),
                    connections: JSON.stringify([{
                            id: `${anchor}-${existingRecordForRelative.node_id}`,
                            source: anchor,
                            target: existingRecordForRelative.node_id
                        }])
                }, { where: { node_id: { [sequelize_1.Op.eq]: existingRecordForRelative.node_id } } });
                if ((relativeUpdated === null || relativeUpdated === void 0 ? void 0 : relativeUpdated[0]) && (relativeUpdated === null || relativeUpdated === void 0 ? void 0 : relativeUpdated[0]) === 1) {
                    // if update was successful, add the offset to the raw, formatted object and add to list for return
                    result.push(Object.assign(Object.assign({}, existingRecordForRelative), { position: offset }));
                }
            }
            else {
                logger_1.default.info('ignoring current child as it is a dupe, ', { relative: nodeId });
            }
            result.push(); //don't update array if nothing available. avoid no return statement error
        })));
    }
    else {
        logger_1.default.info('NODE IDS ARE NOT OF TYPE ARRAY ', { nodeIds, membersList });
    }
    logger_1.default.info('Result after all positions updates', result);
    return result;
});
//#endregion
//#region formatFamilyMemberToFront
const formatFamilyMemberToFront = (member) => {
    var _a, _b, _c, _d;
    //! member could be coming from a create or update operation. sequelize returns with datavalues in one case, and the direct object in the other
    const memberObject = (member === null || member === void 0 ? void 0 : member.dataValues) || member;
    // Use processIncomingImage to handle legacy formats and ensure consistent output
    // This will handle: external URLs, data URLs, and plain base64 strings (legacy)
    const memberProfilePic = (0, serviceHelpers_1.processOutgoingImage)(member === null || member === void 0 ? void 0 : member.profile_url);
    logger_1.default.info('Img after formatting ', { memberProfilePic });
    return (Object.assign(Object.assign({}, memberObject), { type: 'custom', children: JSON.parse(((_a = member === null || member === void 0 ? void 0 : member.children) === null || _a === void 0 ? void 0 : _a.length) > 0 ? member === null || member === void 0 ? void 0 : member.children : '[]'), siblings: JSON.parse(((_b = member === null || member === void 0 ? void 0 : member.siblings) === null || _b === void 0 ? void 0 : _b.length) > 0 ? member === null || member === void 0 ? void 0 : member.siblings : '[]'), spouses: JSON.parse(((_c = member === null || member === void 0 ? void 0 : member.spouses) === null || _c === void 0 ? void 0 : _c.length) > 0 ? member === null || member === void 0 ? void 0 : member.spouses : '[]'), parents: JSON.parse(((_d = member === null || member === void 0 ? void 0 : member.parents) === null || _d === void 0 ? void 0 : _d.length) > 0 ? member === null || member === void 0 ? void 0 : member.parents : '[]'), position: JSON.parse((member === null || member === void 0 ? void 0 : member.position) || '{x: 0, y: 0}'), connections: JSON.parse((member === null || member === void 0 ? void 0 : member.connections) || '[]'), profile_url: memberProfilePic || undefined }));
};
//#endregion
/**
 * ? For each member of a family tree,
 * ? populate all the relatives array with their actual data from db, not just node_id
 * @param treeId number
 * @returns
 */
const getAllRelativesData = (treeRecord) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const relativesData = [];
    try {
        if (treeRecord === null || treeRecord === void 0 ? void 0 : treeRecord.dataValues) {
            const nodeIds = JSON.parse(((_a = treeRecord.dataValues) === null || _a === void 0 ? void 0 : _a.members) || '[]');
            logger_1.default.info("current Tree's members", { treeMembers: nodeIds });
            yield Promise.all(nodeIds.map((m) => __awaiter(void 0, void 0, void 0, function* () {
                const memberRecord = yield FamilyMember_1.default.findOne({ where: { node_id: { [sequelize_1.Op.eq]: m } } });
                logger_1.default.info('Found tree member record', { memberRecord });
                if (memberRecord) {
                    const formattedRecord = formatFamilyMemberToFront(memberRecord);
                    relativesData.push(formattedRecord);
                }
            })));
        }
        else {
            logger_1.default.error('Invalid entry for tree record ', treeRecord);
            return null;
        }
    }
    catch (e) {
        logger_1.default.error('FAILED getting relatives', e);
        return null;
    }
    return relativesData;
});
exports.getAllRelativesData = getAllRelativesData;
