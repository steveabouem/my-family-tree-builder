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
exports.getMemberByNodeId = void 0;
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("../utils/logger"));
const FamilyMember_1 = __importDefault(require("../models/FamilyMember"));
const FamilyTree_1 = __importDefault(require("../models/FamilyTree"));
const User_1 = __importDefault(require("../models/User"));
//#region getByNodeId
const getMemberByNodeId = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let response = {
        code: 500,
        error: true,
        payload: null,
    };
    try {
        const { memberId, userId } = payload;
        if (!userId) {
            response.code = 403;
            response.error = true;
            response.message = "Unauthenticated";
            return response;
        }
        const member = yield FamilyMember_1.default.findOne({ where: { node_id: { [sequelize_1.Op.like]: memberId } } });
        if (!member) {
            response.code = 500;
            response.error = true;
            response.message = "Family member not found";
            response.payload = null;
            return response;
        }
        // Check that the current user has access to at least one tree
        // that includes this member's node_id in its members list
        const userRecord = yield User_1.default.findByPk(userId);
        if (!userRecord) {
            response.code = 403;
            response.error = true;
            response.message = "User not found or unauthorized";
            return response;
        }
        const trees = yield FamilyTree_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: {
                    emails: {
                        [sequelize_1.Op.like]: `%${userRecord.email}%`,
                    },
                    created_by: {
                        [sequelize_1.Op.eq]: userId,
                    },
                },
            },
        });
        const memberNodeId = member.node_id;
        const memberIsInUserTrees = trees.some((tree) => {
            try {
                const nodeIds = Array.isArray(tree.members)
                    ? tree.members
                    : JSON.parse(tree.members || "[]");
                return nodeIds.includes(memberNodeId);
            }
            catch (e) {
                logger_1.default.error("Failed to parse tree members when checking access to member", {
                    error: e,
                    treeId: tree.id,
                });
                return false;
            }
        });
        if (!memberIsInUserTrees) {
            response.code = 403;
            response.error = true;
            response.message = "You are not authorized to view this family member";
            response.payload = null;
            return response;
        }
        response.code = 200;
        response.error = false;
        response.message = "Family member fetched successfully";
        response.payload = member;
        return response;
    }
    catch (e) {
        logger_1.default.error("! FamilyMember.getOne !", e);
        response.message = "Internal server error";
        return response;
    }
});
exports.getMemberByNodeId = getMemberByNodeId;
//#endregion
