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
exports.FTFamilyService = void 0;
const sequelize_1 = require("sequelize");
const FT_family_1 = __importDefault(require("../../../models/FT.family"));
const FT_tree_1 = __importDefault(require("../../../models/FT.tree."));
const FT_user_1 = __importDefault(require("../../../models/FT.user"));
const base_service_1 = require("../../base/base.service");
class FTFamilyService extends base_service_1.BaseService {
    constructor() {
        super('FTFams');
        this.create = (values) => __awaiter(this, void 0, void 0, function* () {
            const formattedValues = Object.assign(Object.assign({}, values), { created_at: new Date });
            const fieldsValid = yield this.validateFTFamFields(formattedValues);
            if (fieldsValid) {
                yield FT_family_1.default.create(formattedValues).catch((e) => {
                    console.log(e); //TODO: LOGGING
                    return false;
                });
                return true;
            }
            return false;
        });
        this.update = (values, id) => __awaiter(this, void 0, void 0, function* () {
            const currentFamily = yield FT_family_1.default.findOne({ where: { id: id }, attributes: { exclude: ['id'] } });
            if (currentFamily) {
                const formattedValues = yield this.formatUpdateValues(values, id);
                yield FT_family_1.default.update(Object.assign({}, formattedValues), { where: { id: id } })
                    .catch(e => {
                    console.log('Error updating: ', e);
                    return false;
                });
                currentFamily.save();
                return true;
            }
            return false;
        });
        this.getFamily = (id) => __awaiter(this, void 0, void 0, function* () {
            const fam = yield this.getById(id);
            return fam;
        });
        this.linkToTree = (id, tree) => __awaiter(this, void 0, void 0, function* () {
            const currentFamily = yield FT_family_1.default.findOne({ where: { id: id }, attributes: { exclude: ['id'] } });
            const currentTree = yield FT_tree_1.default.findOne({ where: { id: tree }, attributes: { exclude: ['id'] } });
            if (!currentFamily || !currentTree) {
                console.log('Tree or family do not exist'); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
                return false;
            }
            else {
                yield currentFamily.update({ tree: tree });
                currentFamily.save();
                return true;
            }
        });
        this.getTree = (id) => __awaiter(this, void 0, void 0, function* () {
            const currentFamily = yield FT_family_1.default.findOne({ where: { id }, attributes: { exclude: ['id'] } });
            if (currentFamily) {
                const tree = currentFamily.tree;
                return tree;
            }
            console.log('No Tree Found');
            return undefined;
        });
        this.getBulkData = (ids) => __awaiter(this, void 0, void 0, function* () {
            const parseIds = ids.split(',').map((id) => parseInt(id));
            const families = yield FT_family_1.default.findAll({
                where: {
                    id: {
                        [sequelize_1.Op.in]: parseIds
                    }
                }
            });
            return families;
        });
        this.formatUpdateValues = (values, id) => __awaiter(this, void 0, void 0, function* () {
            const currentFamily = yield FT_family_1.default.findOne({ where: { id: id }, attributes: { exclude: ['id'] } });
            let formattedValues = {};
            if (!currentFamily) {
                return;
            }
            if (values.members) {
                const familyMembers = JSON.parse((currentFamily === null || currentFamily === void 0 ? void 0 : currentFamily.FTFamMembers) || '');
                const formattedMembers = JSON.stringify([...familyMembers, ...values.members]);
                formattedValues = Object.assign(Object.assign({}, values), { members: formattedMembers });
            }
            return (Object.assign(Object.assign(Object.assign({}, values), formattedValues), { updated_at: new Date }));
        });
        this.validateFTFamFields = (values) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield FT_user_1.default.findOne({ where: { id: values.created_by }, attributes: { exclude: ['id'] } });
            if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.FTUserImmediateFamily) && (currentUser === null || currentUser === void 0 ? void 0 : currentUser.last_name) === values.name) {
                console.log("A nuclear family for user was already created");
                return false;
            }
            if (!values.created_at) {
                console.log('missing ceation date'); //TODO: LOGGING
                return false;
            }
            if (!values.created_by) {
                console.log('missing creating user'); //TODO: LOGGING
                return false;
            }
            if (!values.head_1) {
                console.log('missing head of family'); //TODO: LOGGING
                return false;
            }
            if (!values.name) {
                console.log('missing family name'); //TODO: LOGGING
                return false;
            }
            return true;
        });
    }
}
exports.FTFamilyService = FTFamilyService;
