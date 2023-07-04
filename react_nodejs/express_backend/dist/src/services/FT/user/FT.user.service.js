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
exports.FTUserService = void 0;
const sequelize_1 = require("sequelize");
const FT_user_1 = __importDefault(require("../../../models/FT.user"));
const base_service_1 = require("../../base/base.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class FTUserService extends base_service_1.BaseService {
    constructor() {
        super('FTUsers');
        this.create = (p_values) => __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = bcryptjs_1.default.hashSync(p_values.password, this.salt);
            // TODO: implement search by name as user enter their last name. 
            // Does it make sense to offer them choices given the security aspect?
            const formattedValues = Object.assign(Object.assign({}, p_values), { related_to: [1], imm_family: 2, password: hashedPassword, created_at: new Date });
            const fieldsValid = yield this.validateFTUserFields(formattedValues);
            let newUser = null;
            if (fieldsValid) {
                newUser = yield FT_user_1.default.create(formattedValues).catch((e) => {
                    console.log(e); //TODO: LOGGING
                    return null;
                });
                return Object.assign(Object.assign({}, newUser === null || newUser === void 0 ? void 0 : newUser.dataValues), { password: undefined });
            }
            return null;
        });
        // TODO: No any. fix typing, should related_to be added to the dto?
        this.getUserData = (p_id) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield FT_user_1.default.findByPk(p_id, { attributes: { exclude: ['id', 'password'] } });
            if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.dataValues) {
                const relatedFamilies = yield this.getRelatedFamilies(p_id);
                return (Object.assign(Object.assign({}, currentUser.dataValues), { relatedTo: [...relatedFamilies] }));
            }
        });
        this.getRelatedFamilies = (p_id) => __awaiter(this, void 0, void 0, function* () {
            const select = `
      SELECT id, name
      FROM FTFams 
      WHERE JSON_CONTAINS(members, :id);
    `;
            const relatedFamilies = yield this.dataBase.query(select, {
                type: sequelize_1.QueryTypes.SELECT,
                replacements: { id: `${p_id}` }
            }).catch(() => false);
            return relatedFamilies;
        });
        // TODO: no any
        this.getExtendedFamiliesDetails = (p_id) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield this.getUserData(p_id)
                .catch((e) => {
                // TODO: logging
                console.log('ERROR', e);
            });
            console.log(currentUser.partner);
            // using user partner id
            // const select = `
            //   SELECT * 
            //   FROM FTUsers user 
            //   JOIN FTFams family ON family.id = user.imm_family 
            //   WHERE JSON_CONTAINS(family.members, :partner)) 
            // `;
            const select = `
      SELECT * 
      FROM FTUsers user 
      JOIN FTFams family ON family.id = user.imm_family 
      WHERE JSON_CONTAINS(family.members, :partner) ;
    `;
            const extendedFamilies = yield this.dataBase.query(select, {
                type: sequelize_1.QueryTypes.SELECT,
                replacements: { partner: `${currentUser.partner}` }
            }).catch(() => false);
            return extendedFamilies;
        });
        this.validateFTUserFields = (p_values) => {
            var _a;
            if (p_values.age < 0 || !p_values.age) {
                console.log('missing age'); //TODO: LOGGING
                return false;
            }
            if (!((_a = p_values === null || p_values === void 0 ? void 0 : p_values.assigned_ips) === null || _a === void 0 ? void 0 : _a.length) || !p_values.assigned_ips) {
                console.log('missing .'); //TODO: LOGGING
                return false;
            }
            if (!p_values.description) {
                console.log('missing description'); //TODO: LOGGING
                return false;
            }
            if (!p_values.first_name) {
                console.log('missing first_name'); //TODO: LOGGING
                return false;
            }
            if (!p_values.gender) {
                console.log('missing gender'); //TODO: LOGGING
                return false;
            }
            if (p_values.is_parent === null || p_values.is_parent === undefined) {
                // must be explicitly identified
                console.log('missing is_parent'); //TODO: LOGGING
                return false;
            }
            if (!p_values.email || !p_values.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
                console.log('missing email'); //TODO: LOGGING
                return false;
            }
            if (!p_values.last_name) {
                console.log('missing last_name'); //TODO: LOGGING
                return false;
            }
            if (!p_values.imm_family) {
                console.log('missing imm_family'); //TODO: LOGGING
                return false;
            }
            if (!p_values.marital_status) {
                console.log('missing marital_status'); //TODO: LOGGING
                return false;
            }
            if (!p_values.password || p_values.password.length < 14) {
                console.log('missing password'); //TODO: LOGGING
                return false;
            }
            return true;
        };
    }
}
exports.FTUserService = FTUserService;
// // ME
// INSERT INTO FTUsers VALUES(1, 'Steve', 'Abouem', 40, 'sabo@cc', 'Admin', 2, 'Married', '123456789012', 1, 1, 1, '[]', 'Admin URL', 'Admin desc', 1, '[1, 2]', '2023-06-07', NULL);
// // JO
// INSERT INTO FTUsers VALUES(2, 'JOhane', 'Nouala', 33, 'j.n@cc', 'Spouse', 1, 'Married', '123456789012', 1, 0, 2, '[]', 'Spouse URL', 'Spouse desc', 2, '[1, 2]', '2023-06-07', NULL);
// // Abouem
// INSERT INTO FTFams VALUES(1, 'Abouem', 'Abouem URL', 10, 'Abouems DEsc', 1, 3, 4, 1, '[1]', 1, '2023-06-07', NULL);
// // Nouala
// INSERT INTO FTFams VALUES(2, 'Nouala', 'Nouala URL', 5, 'Noualas DEsc', 1, 5, 6, 2, '[2]', 2, '2023-06-07', NULL);
// INSERT INTO FTFams VALUES(3, 'Bouchard', 'Boucahrd URL', 2, 'Bouchard DEsc', 1, 10, 12, 10, '[1, 10]', 3, '2023-06-07', NULL);
