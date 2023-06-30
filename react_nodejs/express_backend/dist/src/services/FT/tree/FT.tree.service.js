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
exports.FTTreeService = void 0;
const FT_tree_1 = __importDefault(require("../../../models/FT.tree."));
const date_utils_1 = require("../../../utils/FT/date.utils");
const base_service_1 = require("../../base/base.service");
class FTTreeService extends base_service_1.BaseService {
    constructor() {
        super('FTTrees');
        this.create = (p_values) => __awaiter(this, void 0, void 0, function* () {
            // TODO: creation date has a default value in models. I might possibly skip this formatting,
            //  and adjust the DTO to make the prop optional. leaving it for now as it makes validation simpler
            const formattedValues = Object.assign(Object.assign({}, p_values), { created_at: new Date, active: true });
            const valid = this.validateFTTreeFields(formattedValues);
            if (valid) {
                yield FT_tree_1.default.create(Object.assign({}, formattedValues))
                    .catch(e => {
                    console.log('Error creating tree'); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
                    return false;
                });
                return true;
            }
            else {
                console.log('Fields are not valid');
                return false;
            }
        });
        this.getTree = (p_id) => __awaiter(this, void 0, void 0, function* () {
            const currentTree = yield this.getById(p_id);
            return currentTree;
        });
        this.getFamilies = (p_id) => __awaiter(this, void 0, void 0, function* () {
            const currentTree = yield FT_tree_1.default.findByPk(p_id, { attributes: { exclude: ['id'] } });
            if (currentTree) {
                const fams = currentTree.FTTreeFAmilies;
                console.log({ fams });
                return JSON.parse(fams);
            }
            console.log('No tree matching');
            return undefined;
        });
        this.addFamily = (p_id, p_family) => __awaiter(this, void 0, void 0, function* () {
            const currentTree = yield FT_tree_1.default.findByPk(p_id);
            if (currentTree) {
                const relatedFamilies = JSON.parse(currentTree.FTTreeFAmilies);
                relatedFamilies.push(p_family);
                console.log({ relatedFamilies });
                yield currentTree.update({ families: JSON.stringify(relatedFamilies) });
                yield currentTree.save();
                return true;
            }
            return false;
        });
        this.removeFamily = (p_family, p_id) => __awaiter(this, void 0, void 0, function* () {
            const currentTree = yield FT_tree_1.default.findOne({ where: { id: p_id }, attributes: { exclude: ['id'] } });
            if (currentTree) {
                const relatedFamilies = JSON.parse(currentTree.FTTreeFAmilies).filter((id) => id != p_family);
                console.log({ relatedFamilies });
                yield currentTree.update({ families: JSON.stringify(relatedFamilies) })
                    .catch(e => {
                    // TODO: LOGGING
                    console.log('Error while updating ', e);
                });
                currentTree.save();
                return true;
            }
            else {
                console.log('No tree found for update');
                return false;
            }
        });
        this.update = (p_values, p_id) => __awaiter(this, void 0, void 0, function* () {
            // TODO: once individual field validations are there, use it here
            // const valid = this.validateFTTreeFields(p_values);
            // if (valid) {
            const currentTree = yield FT_tree_1.default.findByPk(p_id);
            const formattedValues = yield this.formatUpdateValues(p_values, p_id);
            if (currentTree) {
                yield (currentTree === null || currentTree === void 0 ? void 0 : currentTree.update(Object.assign({}, formattedValues), { where: { id: p_id } }).catch(e => {
                    console.log('Error updating tree');
                    return false;
                }));
                currentTree === null || currentTree === void 0 ? void 0 : currentTree.save();
                console.log('Update completed');
                return true;
            }
            return false;
        });
        this.validateFTTreeFields = (p_values) => {
            // TODO: you will need individual field validations, 
            // in order to validate any type of operation without worrying about required fields
            if (!p_values.created_at || !(0, date_utils_1.dateValid)(p_values.created_at)) {
                console.log('Missing or incorrect creation date');
                return false;
            }
            if (!p_values.created_by) {
                console.log('Missing creator value');
                return false;
            }
            if (!p_values.name) {
                console.log('Missing name');
                return false;
            }
            if (p_values.public === undefined || p_values.public === null) {
                console.log('Missing public');
                return false;
            }
            if (!(0, date_utils_1.dateValid)(p_values.updated_at)) {
                console.log('Incorrect update date');
                return false;
            }
            if (!p_values.active) {
                console.log('Missing active');
                return false;
            }
            return true;
        };
        // return type uses a partial here to not have to deal with the id property present in the update DTO
        this.formatUpdateValues = (p_values, p_id) => __awaiter(this, void 0, void 0, function* () {
            const currentTree = yield FT_tree_1.default.findOne({ where: { id: p_id }, attributes: { exclude: ['id'] } });
            let formattedValues = {};
            if (!currentTree) {
                return;
            }
            if (p_values.authorized_ips) {
                const treeIPs = JSON.parse((currentTree === null || currentTree === void 0 ? void 0 : currentTree.FTTreeAuthorized_ips) || '');
                const formattedIPs = JSON.stringify([...treeIPs, ...p_values.authorized_ips]);
                formattedValues = Object.assign(Object.assign({}, p_values), { authorized_ips: formattedIPs });
            }
            if (p_values.families) {
                const treeFamilies = JSON.parse((currentTree === null || currentTree === void 0 ? void 0 : currentTree.FTTreeFAmilies) || '');
                const formattedFamilies = JSON.stringify([...treeFamilies, ...p_values.families]);
                formattedValues = Object.assign(Object.assign({}, p_values), { families: formattedFamilies });
            }
            return (Object.assign(Object.assign({}, formattedValues), { updated_at: new Date }));
        });
    }
}
exports.FTTreeService = FTTreeService;
