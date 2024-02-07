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
const Base_controller_1 = __importDefault(require("../Base.controller"));
const FamilyMember_1 = __importDefault(require("../../models/FamilyMember"));
const FamilyTree_1 = __importDefault(require("../../models/FamilyTree"));
class FamilyMemberController extends Base_controller_1.default {
    constructor() {
        super('family_trees');
    }
    // ! THERE ARE A LOOOT OF ANYS in Headers. FIX. EASY TYPING
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { error: true, status: 400, data: undefined, session: '' };
            const formattedValues = Object.assign(Object.assign({}, req.body), { authorized_ips: '[]' });
            try {
                const newMember = yield FamilyMember_1.default.create(formattedValues);
                yield newMember.save();
                response.status = 200;
                response.error = false;
                response.message = 'Family Member Created Succesfully';
                res.status(200);
            }
            catch (e) {
                response.status = 400;
                response.message = `Caught ERR ${e}`;
                res.status(400);
            }
            res.json(response);
        });
    }
    // ! TOFIX: easy typing here 
    bulkCreate(members) {
        return __awaiter(this, void 0, void 0, function* () {
            const operations = [];
            members === null || members === void 0 ? void 0 : members.forEach((member) => {
                operations.push(this.insert(member));
            });
            return Promise.all(operations);
        });
    }
    createFamilyUnit(members) {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = [];
            let father = null;
            try {
                const mother = yield FamilyMember_1.default.create(Object.assign(Object.assign({}, members.mother), { gender: 2 }));
                ids.push(mother.id);
                if (members === null || members === void 0 ? void 0 : members.father) {
                    father = yield FamilyMember_1.default.create(Object.assign(Object.assign({}, members.father), { gender: 1 }));
                    ids.push(father.id);
                }
                if (members.siblings.length) {
                    yield Promise.all(members.siblings.map((sibling) => __awaiter(this, void 0, void 0, function* () {
                        if (sibling) {
                            console.log({ sibling });
                            const member = yield FamilyMember_1.default.create(sibling);
                            ids.push(member.id);
                            member.parent_1 = (yield mother).id;
                            if (father) {
                                member.parent_2 = father.id;
                            }
                            member.save();
                        }
                    })));
                }
                return ids;
            }
            catch (e) {
                return [e];
            }
        });
    }
    // public async delete(req: Request, res: Response) {
    //   const response: DEndpointResponse = { error: true, status: 400, data: undefined, session: '' };
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
    getSiblings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { error: true, status: 400, data: undefined, session: '' };
            const member = req.body.member;
            const treeId = req.body.id;
            let siblings = [];
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
        });
    }
    getMembersChildren(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { error: true, status: 400, data: undefined, session: '' };
            const newMember = req.body.member;
            const treeId = req.body.id;
            let treeMembers = [];
            try {
                const currentTree = yield FamilyTree_1.default.findByPk(treeId);
                if (currentTree) {
                    if (currentTree.members) {
                        treeMembers = [...JSON.parse(currentTree.members), newMember];
                        console.log({ treeMembers });
                    }
                    else {
                        treeMembers = [newMember];
                    }
                    yield currentTree.update({ members: JSON.stringify(treeMembers) });
                    response.status = 200;
                    response.error = false;
                    response.message = 'Family Member Added Succesfully';
                    res.status(200);
                }
                else {
                    response.status = 400;
                    response.error = true;
                    response.message = 'Family Tree Does not Exist';
                    res.status(400);
                }
            }
            catch (e) {
                response.status = 400;
                response.message = `Caught ERR ${e}`;
                res.status(400);
            }
            res.json(response);
        });
    }
    insert(member) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMember = yield FamilyMember_1.default.create(member);
            yield newMember.save()
                .catch((e) => {
                return false;
            }); // ! TODO: logging and err handling. easy
            return true;
        });
    }
}
exports.default = FamilyMemberController;
