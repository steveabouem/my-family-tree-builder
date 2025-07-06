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
exports.FamilyTreeService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const sequelize_1 = require("sequelize");
const FamilyTree_1 = __importDefault(require("../../models/FamilyTree"));
const FamilyMember_1 = __importDefault(require("../../models/FamilyMember"));
const User_1 = __importDefault(require("../../models/User"));
const logger_1 = __importDefault(require("../../utils/logger"));
class FamilyTreeService {
    /**
    * Convert JSON data to FamilyMember instances
    */
    convertToFamilyMembers(membersData) {
        if (!membersData)
            return [];
        const data = typeof membersData === 'string'
            ? JSON.parse(membersData)
            : membersData;
        return data.map((memberData) => {
            const member = new FamilyMember_1.default();
            Object.assign(member, memberData);
            return member;
        });
    }
    /**
    * Convert FamilyMember instances to JSON data for storage
    */
    convertToJSON(members) {
        return members.map(member => member.toJSON());
    }
    getAllTrees(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = { code: 500, error: true, payload: [] };
            let treeList = [];
            try {
                if (userId) {
                    // Since members is stored as JSON in the database, we need to search within the JSON array
                    // Look for trees where any member has a user_id that matches the provided userId
                    treeList = yield FamilyTree_1.default.findAll({
                        where: {
                            members: {
                                [sequelize_1.Op.like]: `%"user_id":${userId}%`
                            }
                        }
                    });
                    response.code = 200;
                    response.error = false;
                    response.message = 'Fetched tree successfully.';
                }
                else {
                    response.message = 'Fetched tree error.';
                    logger_1.default.error('Unable to fetch trees. No user Id');
                    response.code = 400;
                }
            }
            catch (e) {
                response.code = 500;
                logger_1.default.error('Unable to fetch trees ', e);
            }
            response.payload = treeList;
            return response;
        });
    }
    positionFamilyMembers(members) {
        const membersWithCoords = [];
        Object.values(members).forEach((currentMember, index) => {
            const position = { x: index * 125, y: 0 };
            const children = (currentMember === null || currentMember === void 0 ? void 0 : currentMember.children) || '[]';
            const siblings = (currentMember === null || currentMember === void 0 ? void 0 : currentMember.siblings) || '[]';
            const spouses = (currentMember === null || currentMember === void 0 ? void 0 : currentMember.spouses) || '[]';
            const parents = (currentMember === null || currentMember === void 0 ? void 0 : currentMember.parents) || '[]';
            logger_1.default.info("Collected all anchor's relatives", { children, parents, spouses, siblings, currentMember });
            // Process children
            if (Array.isArray(children)) {
                children.forEach((child, childIndex) => {
                    if (!membersWithCoords.find((newNode) => newNode.node_id === child.node_id)) {
                        membersWithCoords.push(Object.assign(Object.assign({}, child), { type: 'custom', position: { x: position.x + (125 * (childIndex + 1)), y: position.y + 125 }, name: '', data: Object.assign(Object.assign({}, child), { label: `${child.first_name} ${child.last_name}`, connections: [...(child === null || child === void 0 ? void 0 : child.connections) || [], {
                                        id: `${currentMember.node_id}-${child.node_id}`,
                                        source: currentMember.node_id,
                                        target: child.node_id
                                    }] }) }));
                    }
                    else {
                        logger_1.default.info('ignoring family member\'s current child as it is a dupe, ', { child });
                    }
                });
            }
            // Process siblings
            if (Array.isArray(siblings)) {
                siblings.forEach((sibling, siblingIndex) => {
                    if (!membersWithCoords.find((newNode) => newNode.node_id === sibling.node_id)) {
                        membersWithCoords.push(Object.assign(Object.assign({}, sibling), { type: 'custom', position: { x: position.x + (325 * (siblingIndex + 1)), y: position.y }, name: `${sibling.first_name} ${sibling.last_name}`, data: Object.assign(Object.assign({}, sibling), { label: `${sibling.first_name} ${sibling.last_name}`, connections: [...(sibling === null || sibling === void 0 ? void 0 : sibling.connections) || [], {
                                        id: `${currentMember.node_id}-${sibling.node_id}`,
                                        source: currentMember.node_id,
                                        target: sibling.node_id
                                    }] }) }));
                    }
                    else {
                        logger_1.default.info('ignoring family member\'s current sibling as it is a dupe, ', { sibling });
                    }
                });
            }
            // Process spouses
            if (Array.isArray(spouses)) {
                spouses.forEach((spouse, spousIndex) => {
                    if (!membersWithCoords.find((newNode) => newNode.node_id === spouse.node_id)) {
                        membersWithCoords.push(Object.assign(Object.assign({}, spouse), { type: 'custom', position: { x: position.x + (325 * (spousIndex + 1)), y: position.y }, name: '', data: Object.assign(Object.assign({}, spouse), { label: `${spouse.first_name} ${spouse.last_name}`, connections: [...(spouse === null || spouse === void 0 ? void 0 : spouse.connections) || [], {
                                        id: `${currentMember.node_id}-${spouse.node_id}`,
                                        source: currentMember.node_id,
                                        target: spouse.node_id
                                    }] }) }));
                    }
                    else {
                        logger_1.default.info('ignoring family member\'s current spouse as it is a dupe, ', { spouse });
                    }
                });
            }
            // Process parents
            if (Array.isArray(parents)) {
                parents.forEach((parent, parentIndex) => {
                    if (!membersWithCoords.find((newNode) => newNode.node_id === parent.node_id)) {
                        const xOffset = parent.gender == 2 ? position.x + (225 * (parentIndex + 1)) : position.x - 125;
                        membersWithCoords.push(Object.assign(Object.assign({}, parent), { type: 'custom', position: { x: xOffset, y: position.y - 125 }, name: '', data: Object.assign(Object.assign({}, parent), { label: `${parent.first_name} ${parent.last_name}`, connections: [...(parent === null || parent === void 0 ? void 0 : parent.connections) || [], {
                                        id: `${currentMember.node_id}-${parent.node_id}`,
                                        source: currentMember.node_id,
                                        target: parent.node_id
                                    }] }) }));
                    }
                    else {
                        logger_1.default.info('ignoring family member\'s current parent as it is a dupe, ', { parent });
                    }
                });
            }
            // Add current member
            if (!membersWithCoords.find((newNode) => newNode.node_id === currentMember.node_id)) {
                membersWithCoords.push(Object.assign(Object.assign({}, currentMember), { type: 'custom', position, data: Object.assign({ label: `${currentMember.first_name} ${currentMember.last_name}` }, currentMember) }));
            }
            else {
                logger_1.default.info('ignoring family member as it is a dupe, ', { node: currentMember });
            }
        });
        logger_1.default.info('newNodeState', membersWithCoords);
        return membersWithCoords;
    }
    createTree(treeData, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = { code: 500, error: true, payload: null };
            try {
                //? Only registered users can do CRUD on trees
                const currentUser = yield User_1.default.findByPk(userId);
                if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.dataValues) {
                    const membersRecords = yield this.generateTreeMembersRecords(treeData.members, userId)
                        .catch((e) => {
                        logger_1.default.error('Unable to bulk create members. Function call failed', e);
                    });
                    //? tree will usually be created through a step form. front will provide the user with the option to activate
                    logger_1.default.info('membersRecords array', membersRecords);
                    if (membersRecords) {
                        const membersByNodeId = Object.values(membersRecords).reduce((nodeList, curr) => {
                            return (Object.assign(Object.assign({}, nodeList), { [curr.node_id]: curr.dataValues }));
                        }, {});
                        logger_1.default.info("Prepared object to create positions and edges", { membersByNodeId });
                        const withCoords = this.positionFamilyMembers(Object.values(membersByNodeId));
                        const newTree = yield FamilyTree_1.default.create({
                            active: 1,
                            authorized_ips: '',
                            created_by: userId,
                            members: withCoords,
                            name: (treeData === null || treeData === void 0 ? void 0 : treeData.treeName) || 'temporary_tree_name',
                            public: 0
                        })
                            .catch((e) => {
                            logger_1.default.error('Unable to create a tree ', e);
                        });
                        response.code = 200;
                        response.error = false;
                        response.payload = Object.assign(Object.assign({}, newTree === null || newTree === void 0 ? void 0 : newTree.dataValues), { members: withCoords });
                    }
                    else {
                        response.code = 400;
                        response.error = true;
                        logger_1.default.error('Unable to create members: records array empty');
                    }
                }
                else {
                    response.code = 400;
                    response.message = 'Invalid entries';
                    response.error = true;
                    logger_1.default.error('User not found');
                }
            }
            catch (e) {
                logger_1.default.error('! FamilyTree.create !', e);
                response.code = 400;
            }
            return response;
        });
    }
    getTreeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
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
    }
    //! TODO: this type `any` below is what you are trying to fix. All CRUD should use a single type definition for the tree, especially the members
    //! front should ONLY worry about sending form values, nothing else, no business logic
    //! there should be  function that parses form values into a proper tree, and another that parses it to send back to front (replacing the formatting functions in the cmponent)
    updateTree(updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = { code: 500, error: true, payload: null };
            const { members, userId, treeId } = updateData;
            try {
                const tree = yield FamilyTree_1.default.findByPk(treeId);
                if (!tree) {
                    logger_1.default.error('Invalid treeId ', treeId);
                    response.code = 400;
                }
                else {
                    const membersRecords = yield this.updateRecordAndRelations(members, userId, treeId);
                    const withCoords = this.positionFamilyMembers(Object.values(membersRecords || {}));
                    yield tree.update(Object.assign(Object.assign({}, updateData), { members: JSON.stringify(withCoords) }));
                    response.payload = tree;
                    response.error = false;
                    response.code = 200;
                }
            }
            catch (e) {
                logger_1.default.error('Unable to update tree ', e);
            }
            return response;
        });
    }
    deleteTree(treeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tree = yield FamilyTree_1.default.findByPk(treeId);
                if (!tree)
                    return false;
                yield tree.destroy();
                return true;
            }
            catch (e) {
                logger_1.default.error('Failed to delete tree ', e);
                return false;
            }
        });
    }
    addMembersToTree(treeId, newMembers, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tree = yield FamilyTree_1.default.findByPk(treeId);
                if (!tree)
                    return null;
                const currentMembers = JSON.parse(tree.members || '[]');
                const updatedMembers = [...currentMembers, ...newMembers];
                yield tree.update({ members: JSON.stringify(updatedMembers) });
                return tree;
            }
            catch (e) {
                logger_1.default.error('Failed to add members to tree ', e);
                return null;
            }
        });
    }
    removeMembersFromTree(treeId, membersToRemove) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tree = yield FamilyTree_1.default.findByPk(treeId);
                if (!tree)
                    return false;
                const currentMembers = JSON.parse(tree.members || '[]');
                const remainingMembers = currentMembers.filter((member) => !membersToRemove.includes(member));
                yield tree.update({ members: JSON.stringify(remainingMembers) });
                return true;
            }
            catch (e) {
                logger_1.default.error('Failed to remove members from tree ', e);
                return false;
            }
        });
    }
    getTreeMembers(treeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tree = yield FamilyTree_1.default.findByPk(treeId);
                if (!tree)
                    return [];
                // Use the helper method to convert JSON to FamilyMember instances
                return this.convertToFamilyMembers(tree === null || tree === void 0 ? void 0 : tree.members);
            }
            catch (e) {
                logger_1.default.error('! FamilyTree.getmembers !', e);
                return [];
            }
        });
    }
    updateTreeMembers(treeId, members) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tree = yield FamilyTree_1.default.findByPk(treeId);
                if (!tree)
                    return null;
                // Use the helper method to convert FamilyMember instances to JSON
                const membersJSON = this.convertToJSON(members);
                yield tree.update({ members: membersJSON });
                return tree;
            }
            catch (e) {
                logger_1.default.error('Failed to update tree members ', e);
                return null;
            }
        });
    }
    canUserViewTree(treeId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tree = yield FamilyTree_1.default.findByPk(treeId);
                if (!tree)
                    return false;
                // Use the helper method to convert JSON to FamilyMember instances
                const members = this.convertToFamilyMembers(tree.members);
                return members.some((member) => member.user_id == userId);
            }
            catch (e) {
                logger_1.default.error('! FamilyTree.isUserAuthorizedOntree ! ', e);
                return false;
            }
        });
    }
    canUserUpdateTree(treeId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tree = yield FamilyTree_1.default.findByPk(treeId);
                if (!tree)
                    return false;
                return tree.created_by === userId;
            }
            catch (e) {
                logger_1.default.error('! FamilyTree.isUserAuthorizedOntree ! ', e);
                return false;
            }
        });
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
    generateTreeMembersRecords(members = [], userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const anchor = members.find(m => !!(m === null || m === void 0 ? void 0 : m.currentAnchor));
            try {
                if (anchor) {
                    const duplicate = yield FamilyMember_1.default.findOne({
                        where: {
                            [sequelize_1.Op.and]: [{ first_name: anchor.first_name }, { last_name: anchor.last_name }, { dob: anchor.dob }]
                        }
                    });
                    if (duplicate === null || duplicate === void 0 ? void 0 : duplicate.dataValues) {
                        logger_1.default.error('Family member record appears to be a duplicate', { anchor, duplicate });
                        return null;
                    }
                    return yield this.getMembersFromCreateAction(anchor, userId);
                }
                else {
                    logger_1.default.error('No record created, missing anchor node. Returning empty array');
                    return null;
                }
            }
            catch (e) {
                logger_1.default.error('Unable to bulk create members ', e);
                return null;
            }
        });
    }
    /*
   * @data: the info of the member to create
   * @userId
   * returns a hashmap of the records keyed to their ids, for all members and their respective  connections
   */
    getMembersFromCreateAction(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = (0, dayjs_1.default)();
            const children = (data === null || data === void 0 ? void 0 : data.children) || [];
            const siblings = (data === null || data === void 0 ? void 0 : data.siblings) || [];
            const spouses = (data === null || data === void 0 ? void 0 : data.spouses) || [];
            const parents = (data === null || data === void 0 ? void 0 : data.parents) || [];
            logger_1.default.info('Received info to generate record ', data);
            data.age = today.diff((0, dayjs_1.default)(data.dob), 'years');
            children === null || children === void 0 ? void 0 : children.forEach((c) => {
                c.age = today.diff((0, dayjs_1.default)(c.dob), 'years');
                c.parents = [...(c === null || c === void 0 ? void 0 : c.parents) || [], data];
            });
            siblings === null || siblings === void 0 ? void 0 : siblings.forEach((s) => {
                s.siblings = [...s.siblings || [], data];
                s.age = today.diff((0, dayjs_1.default)(s.dob), 'years');
            });
            parents === null || parents === void 0 ? void 0 : parents.forEach((p) => {
                p.age = today.diff((0, dayjs_1.default)(p.dob), 'years');
                p.children = [...(p === null || p === void 0 ? void 0 : p.children) || [], data];
            });
            spouses === null || spouses === void 0 ? void 0 : spouses.forEach((s) => {
                s.age = today.diff((0, dayjs_1.default)(s.dob), 'years');
                s.spouses = [...(s === null || s === void 0 ? void 0 : s.spouses) || [], data];
            });
            const payload = [data, ...children, ...siblings, ...parents, ...spouses];
            logger_1.default.info("Resulting flat array for members: ", { payload });
            /*
            * since we're using a step form, we don't have to worry about drilling through the array.
            * every member's info is at the first level of the array. The repetition is necessary for the ui library responsible for rendering the tree
            */
            const newMemberGroup = [];
            // ? for of are usually best for async
            for (const m of payload) {
                const duplicateRecord = yield FamilyMember_1.default.findOne({ where: { node_id: { [sequelize_1.Op.eq]: m.node_id } } });
                if (!(duplicateRecord === null || duplicateRecord === void 0 ? void 0 : duplicateRecord.dataValues)) {
                    const addedRecord = yield FamilyMember_1.default.create(Object.assign(Object.assign({}, m), { description: (m === null || m === void 0 ? void 0 : m.description) || '', user_id: (m === null || m === void 0 ? void 0 : m.userId) || 0, created_by: 1, parents: m.parents, spouses: m.spouses, siblings: m.siblings, children: m.children }))
                        .catch((e) => {
                        logger_1.default.error('Failed adding new record ', e);
                    });
                    if (addedRecord)
                        newMemberGroup.push(addedRecord);
                }
            }
            ;
            if (!!newMemberGroup) {
                logger_1.default.info('All new members created: ', { newMemberGroup });
                const newMembersMap = newMemberGroup.reduce((map, currentMember) => {
                    return (Object.assign(Object.assign({}, map), { [currentMember.id]: currentMember }));
                }, {});
                return newMembersMap;
            }
            else {
                logger_1.default.error('Unable to bulk create members, no records created');
            }
            return null;
        });
    }
    /*
    * @request: {members: {[nodeId: string]: APIFamilyMemberDAO}, userId: number, treeId?: number}
    * Receives an array of family members from the same, existing tree
    * Update their individual records in db
    * Update the tree's members value
    * Returns updated tree and members
    */
    updateRecordAndRelations(members, userId, treeId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: inactive trees should not allow this operation
            /*
            * The anchor is the initial step of the family tree step form,
            * on which all the relations are based
            */
            const data = members === null || members === void 0 ? void 0 : members.anchor;
            if (data) {
                const payload = yield this.getMembersFromUpdateAction(data, treeId || 0);
                return payload;
            }
            else {
                logger_1.default.error('No anchor provided for update ', members);
            }
            return null;
        });
    }
    /*
    * @data: the info of the member to update
    * @treeId
    * Receives a familyMember DAO with additional data to update the record with (including a kinship array potentially)
    * returns a hashmap of the records keyed to their ids, for all members and their respective  connections
    */
    getMembersFromUpdateAction(data, treeId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const matchingRecord = yield FamilyMember_1.default.findOne({ where: { node_id: { [sequelize_1.Op.eq]: data.node_id } } });
            const matchingTree = yield FamilyTree_1.default.findByPk(treeId);
            const kinshipMapping = [
                { relation: 'children', inverseRelation: 'parents' }, { relation: 'siblings', inverseRelation: 'siblings' },
                { relation: 'parents', inverseRelation: 'children' }, { relation: 'spouses', inverseRelation: 'spouses' }
            ];
            let updatedRecord;
            if ((matchingRecord === null || matchingRecord === void 0 ? void 0 : matchingRecord.dataValues) && (matchingTree === null || matchingTree === void 0 ? void 0 : matchingTree.dataValues)) { // if no tree exists for this member, no execution should lead here
                let unsavedfamilyMembers = [];
                let payload = {};
                logger_1.default.info('Found matching family member: ', matchingRecord.dataValues);
                /*
                * Create records for any additional kin (children, siblings, parents, spouses), and update the incoming family member record accordingly
                */
                for (const { relation, inverseRelation } of kinshipMapping) {
                    // ? Go through each type of relation
                    const nodeIdsForKinshipType = ((data === null || data === void 0 ? void 0 : data[relation]) || []).map((c) => c.node_id) || [];
                    if ((_a = data === null || data === void 0 ? void 0 : data[relation]) === null || _a === void 0 ? void 0 : _a.length) {
                        // ? If the current relation type has a family member associtated to it, check for duplicates then create records for non duplicates
                        const existingRecords = yield FamilyMember_1.default.findAll({ where: { node_id: { [sequelize_1.Op.in]: nodeIdsForKinshipType } } });
                        const existingRecordsData = existingRecords.map((r) => r.dataValues);
                        logger_1.default.info('List of existing records ', existingRecordsData);
                        const nodeIdsForExistingRecords = existingRecordsData === null || existingRecordsData === void 0 ? void 0 : existingRecordsData.map((r) => {
                            return r.node_id;
                        });
                        // ? non duplicates 
                        const unsavedRecords = ((_b = data === null || data === void 0 ? void 0 : data[relation]) === null || _b === void 0 ? void 0 : _b.filter((member) => !(nodeIdsForExistingRecords === null || nodeIdsForExistingRecords === void 0 ? void 0 : nodeIdsForExistingRecords.includes(member.node_id)))) || [];
                        unsavedfamilyMembers = [...unsavedfamilyMembers, ...unsavedRecords];
                        logger_1.default.info('List of records to be added after check: ', { unsavedRecords, existingRecordsData });
                        yield Promise.all(
                        // ? create records for non duplicates
                        unsavedRecords.map((c) => __awaiter(this, void 0, void 0, function* () {
                            // ? include current related member into the correct kinship array, then update the current record witht that info
                            const savedRecord = yield this.getMembersFromCreateAction(Object.assign(Object.assign({}, c), { [inverseRelation]: [data] }), (data === null || data === void 0 ? void 0 : data.userId) || 0);
                            logger_1.default.info("saved record looks like this ", savedRecord);
                            payload = Object.assign(Object.assign({}, payload), savedRecord);
                        })));
                        // ? update the matching record and add the new memebers to the matching kinship array
                        updatedRecord = yield matchingRecord.update({
                            [relation]: JSON.stringify([...unsavedRecords, ...existingRecordsData || []])
                        });
                        logger_1.default.info('Resulting list of new records: ', { unsavedRecords, updatedRecord });
                        if (updatedRecord === null || updatedRecord === void 0 ? void 0 : updatedRecord.id) {
                            // ? update matching tree's members array
                            const treeMembers = JSON.parse(matchingTree.dataValues.members);
                            logger_1.default.info('Members in related tree before update ', treeMembers);
                            const indexOfUpdatedRecord = treeMembers.findIndex((member) => {
                                member.id == (updatedRecord === null || updatedRecord === void 0 ? void 0 : updatedRecord.id) || 0;
                            });
                            if (indexOfUpdatedRecord) {
                                treeMembers.splice(indexOfUpdatedRecord, 1, updatedRecord);
                                logger_1.default.info('Found the member in a given tree and updated the members array with the new info: ', treeMembers);
                                yield matchingTree.update({ members: JSON.stringify(treeMembers) });
                                // ? add the updated record to the mapping of family members in order to return it to the route handler
                                treeMembers.forEach((member) => {
                                    logger_1.default.info('Does this have the actual record data? ', { member });
                                    payload[member.id] = member;
                                });
                            }
                        }
                    }
                }
                logger_1.default.info('Final payload ', Object.assign({}, payload));
                return payload;
            }
            else {
                logger_1.default.error('No record matches the member to update ', data);
            }
            return null;
        });
    }
}
exports.FamilyTreeService = FamilyTreeService;
