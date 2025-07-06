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
exports.FamilyTreeRelationshipService = void 0;
const FamilyTree_1 = __importDefault(require("../../models/FamilyTree"));
const FamilyMember_1 = __importDefault(require("../../models/FamilyMember"));
const logger_1 = __importDefault(require("../../utils/logger"));
class FamilyTreeRelationshipService {
    /**
     * Get a family tree with all its members
     */
    getTreeWithMembers(treeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tree = yield FamilyTree_1.default.findByPk(treeId, {
                    include: [{
                            model: FamilyMember_1.default,
                            as: 'FamilyMembers',
                            attributes: ['id', 'first_name', 'last_name', 'email', 'gender', 'dob', 'age', 'occupation', 'marital_status']
                        }]
                });
                return tree;
            }
            catch (error) {
                logger_1.default.error('Error fetching tree with members:', error);
                return null;
            }
        });
    }
    /**
     * Get all trees that a member belongs to
     */
    getTreesForMember(memberId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const member = yield FamilyMember_1.default.findByPk(memberId, {
                    include: [{
                            model: FamilyTree_1.default,
                            as: 'FamilyTrees',
                            attributes: ['id', 'name', 'public', 'active']
                        }]
                });
                return (member === null || member === void 0 ? void 0 : member.FamilyTrees) || [];
            }
            catch (error) {
                logger_1.default.error('Error fetching trees for member:', error);
                return [];
            }
        });
    }
    /**
     * Check if a member belongs to a specific tree
     */
    isMemberInTree(memberId, treeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield FamilyTree_1.default.count({
                    where: { id: treeId },
                    include: [{
                            model: FamilyMember_1.default,
                            as: 'FamilyMembers',
                            where: { id: memberId }
                        }]
                });
                return count > 0;
            }
            catch (error) {
                logger_1.default.error('Error checking if member is in tree:', error);
                return false;
            }
        });
    }
    /**
     * Get all members of a tree with their relationships
     */
    getTreeMembersWithRelationships(treeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tree = yield FamilyTree_1.default.findByPk(treeId, {
                    include: [{
                            model: FamilyMember_1.default,
                            as: 'FamilyMembers',
                            attributes: [
                                'id', 'first_name', 'last_name', 'email', 'gender',
                                'dob', 'age', 'occupation', 'marital_status', 'parents',
                                'siblings', 'spouses', 'children', 'description', 'profile_url'
                            ]
                        }]
                });
                return (tree === null || tree === void 0 ? void 0 : tree.members) || [];
            }
            catch (error) {
                logger_1.default.error('Error fetching tree members with relationships:', error);
                return [];
            }
        });
    }
}
exports.FamilyTreeRelationshipService = FamilyTreeRelationshipService;
