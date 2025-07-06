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
exports.FamilyMemberService = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const sequelize_1 = require("sequelize");
const FamilyMember_1 = __importDefault(require("../../models/FamilyMember"));
const FamilyTree_1 = __importDefault(require("../../models/FamilyTree"));
const logger_1 = __importDefault(require("../../utils/logger"));
class FamilyMemberService {
    constructor() {
        this.anchorKey = 'anchor';
        /*
        * Position the family members in the tree
        */
        this.positionFamilyMembers = (members) => {
            const membersWithCoords = [];
            Object.values(members).forEach((currentMember, index) => {
                const position = { x: index * 125, y: 0 };
                const children = JSON.parse((currentMember === null || currentMember === void 0 ? void 0 : currentMember.children) || '[]');
                const siblings = JSON.parse((currentMember === null || currentMember === void 0 ? void 0 : currentMember.siblings) || '[]');
                const spouses = JSON.parse((currentMember === null || currentMember === void 0 ? void 0 : currentMember.spouses) || '[]');
                const parents = JSON.parse((currentMember === null || currentMember === void 0 ? void 0 : currentMember.parents) || '[]');
                logger_1.default.info("Collected all anchor's relatives", { children, parents, spouses, siblings, currentMember });
                /*
                * find all the node children,  position them below it, then update each child's node's position
                */
                if (Array.isArray(children)) {
                    /*
                    * if the child was already processed through another incoming node (family member), ignore it
                    */
                    children.forEach((child, childIndex) => {
                        if (membersWithCoords.find((newNode) => newNode.node_id === child.node_id)) {
                            logger_1.default.info('ignoring family member\'s current child as it is a dupe, ', { child });
                        }
                        else {
                            membersWithCoords.push(Object.assign(Object.assign({}, child), { type: 'custom', position: { x: position.x + (125 * (childIndex + 1)), y: position.y + 125 }, name: '', data: Object.assign(Object.assign({}, child), { label: `${child.first_name} ${child.last_name}`, connections: [...(child === null || child === void 0 ? void 0 : child.connections) || [], { id: `${currentMember.node_id}-${child.node_id}`, source: currentMember.node_id, target: child.node_id }] }) }));
                        }
                    });
                }
                /*
                * find all the node siblings,  position them below it, then update each child's node's position
                */
                if (Array.isArray(siblings)) {
                    /*
                    * if the sibling was already processed through another incoming node (family member), ignore it
                    */
                    siblings.forEach((sibling, siblingIndex) => {
                        if (membersWithCoords.find((newNode) => newNode.node_id === sibling.node_id)) {
                            logger_1.default.info('ignoring family member\'s current sibling as it is a dupe, ', { sibling });
                        }
                        else {
                            membersWithCoords.push(Object.assign(Object.assign({}, sibling), { type: 'custom', position: { x: position.x + (325 * (siblingIndex + 1)), y: position.y }, name: `${sibling.first_name} ${sibling.last_name}`, data: Object.assign(Object.assign({}, sibling), { label: `${sibling.first_name} ${sibling.last_name}`, connections: [...(sibling === null || sibling === void 0 ? void 0 : sibling.connections) || [], { id: `${currentMember.node_id}-${sibling.node_id}`, source: currentMember.node_id, target: sibling.node_id }] }) }));
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
                    spouses.forEach((spouse, spousIndex) => {
                        if (membersWithCoords.find((newNode) => newNode.node_id === spouse.node_id)) {
                            logger_1.default.info('ignoring family member\'s current spouse as it is a dupe, ', { spouse });
                        }
                        else {
                            membersWithCoords.push(Object.assign(Object.assign({}, spouse), { type: 'custom', position: { x: position.x + (325 * (spousIndex + 1)), y: position.y }, name: '', data: Object.assign(Object.assign({}, spouse), { label: `${spouse.first_name} ${spouse.last_name}`, connections: [...(spouse === null || spouse === void 0 ? void 0 : spouse.connections) || [], { id: `${currentMember.node_id}-${spouse.node_id}`, source: currentMember.node_id, target: spouse.node_id }] }) }));
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
                    parents.forEach((parent, parentIndex) => {
                        if (membersWithCoords.find((newNode) => newNode.node_id === parent.node_id)) {
                            logger_1.default.info('ignoring family member\'s current spouse as it is a dupe, ', { parent });
                        }
                        else {
                            const xOffset = parent.gender == 2 ? position.x + (225 * (parentIndex + 1)) : position.x - 125;
                            membersWithCoords.push(Object.assign(Object.assign({}, parent), { type: 'custom', position: { x: xOffset, y: position.y - 125 }, name: '', data: Object.assign(Object.assign({}, parent), { label: `${parent.first_name} ${parent.last_name}`, connections: [...(parent === null || parent === void 0 ? void 0 : parent.connections) || [], { id: `${currentMember.node_id}-${parent.node_id}`, source: currentMember.node_id, target: parent.node_id }] }) }));
                        }
                    });
                }
                if (membersWithCoords.find((newNode) => newNode.node_id === currentMember.node_id)) {
                    logger_1.default.info('ignoring family member as it is a dupe, ', { node: currentMember });
                }
                else {
                    membersWithCoords.push(Object.assign(Object.assign({}, currentMember), { type: 'custom', position, data: Object.assign({ label: `${currentMember.first_name} ${currentMember.last_name}` }, currentMember) }));
                }
            });
            logger_1.default.info('newNodeState', membersWithCoords);
            return membersWithCoords;
        };
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
    createRecords(members, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const anchor = members === null || members === void 0 ? void 0 : members[this.anchorKey];
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
    getMemberByNodeId(nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield FamilyMember_1.default.findOne({ where: { node_id: { [sequelize_1.Op.eq]: nodeId } } });
            }
            catch (e) {
                logger_1.default.error('Failed to get member by node id:', e);
                return null;
            }
        });
    }
    updateMember(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const member = yield FamilyMember_1.default.findByPk(id);
                if (!member)
                    return null;
                yield member.update(updateData);
                return member;
            }
            catch (e) {
                logger_1.default.error('Failed to update member:', e);
                return null;
            }
        });
    }
    deleteMember(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const member = yield FamilyMember_1.default.findByPk(id);
                if (!member)
                    return false;
                yield member.destroy();
                return true;
            }
            catch (e) {
                logger_1.default.error('Failed to delete member:', e);
                return false;
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
                c.parents = JSON.stringify([...(c === null || c === void 0 ? void 0 : c.parents) || [], data]);
            });
            siblings === null || siblings === void 0 ? void 0 : siblings.forEach((s) => {
                s.siblings = JSON.stringify([...s.siblings || [], data]);
                s.age = today.diff((0, dayjs_1.default)(s.dob), 'years');
            });
            parents === null || parents === void 0 ? void 0 : parents.forEach((p) => {
                p.age = today.diff((0, dayjs_1.default)(p.dob), 'years');
                p.children = JSON.stringify([...(p === null || p === void 0 ? void 0 : p.children) || [], data]);
            });
            spouses === null || spouses === void 0 ? void 0 : spouses.forEach((s) => {
                s.age = today.diff((0, dayjs_1.default)(s.dob), 'years');
                s.spouses = JSON.stringify([...(s === null || s === void 0 ? void 0 : s.spouses) || [], data]);
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
                    const addedRecord = yield FamilyMember_1.default.create(Object.assign(Object.assign({}, m), { description: (m === null || m === void 0 ? void 0 : m.description) || '', user_id: (m === null || m === void 0 ? void 0 : m.userId) || 0, created_by: 1, parents: JSON.stringify(m.parents), spouses: JSON.stringify(m.spouses), siblings: JSON.stringify(m.siblings), children: JSON.stringify(m.children) }))
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
                            const treeMembers = matchingTree.dataValues.members;
                            logger_1.default.info('Members in related tree before update ', treeMembers);
                            const indexOfUpdatedRecord = treeMembers.findIndex((member) => {
                                member.id == (updatedRecord === null || updatedRecord === void 0 ? void 0 : updatedRecord.id) || 0;
                            });
                            if (indexOfUpdatedRecord) {
                                treeMembers.splice(indexOfUpdatedRecord, 1, updatedRecord);
                                logger_1.default.info('Found the member in a given tree and updated the members array with the new info: ', treeMembers);
                                yield matchingTree.update({ members: treeMembers });
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
exports.FamilyMemberService = FamilyMemberService;
