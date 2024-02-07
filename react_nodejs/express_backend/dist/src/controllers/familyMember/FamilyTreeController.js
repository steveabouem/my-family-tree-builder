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
const FamilyTree_1 = __importDefault(require("../../models/FamilyTree"));
const sequelize_1 = require("sequelize");
class FamilyTreeController extends Base_controller_1.default {
    constructor() {
        super('family_trees');
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { error: true, status: 400, data: undefined, session: '' };
            const userId = req.query.member;
            try {
                const treeList = yield FamilyTree_1.default.findAll({ where: { members: { [sequelize_1.Op.like]: `%${userId}%` } } });
                response.status = 200;
                response.error = false;
                response.data = [...treeList];
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
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { error: true, status: 400, data: undefined, session: '' };
            const formattedValues = Object.assign(Object.assign({}, req.body), { authorized_ips: '[]' });
            try {
                const newTree = yield FamilyTree_1.default.create(formattedValues);
                yield newTree.save();
                response.status = 200;
                response.error = false;
                response.message = 'Family Tree Created Succesfully';
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
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { error: true, status: 400, data: undefined, session: '' };
            const treeId = req.body.id;
            try {
                const currentTree = yield FamilyTree_1.default.findByPk(treeId);
                if (currentTree) {
                    yield currentTree.destroy();
                    response.status = 200;
                    response.error = false;
                    response.message = 'Family Tree Deleted Succesfully';
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
    addMembers(req, res) {
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
}
exports.default = FamilyTreeController;
