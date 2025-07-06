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
const services_1 = require("../../services");
class FamilyTreeController extends Base_controller_1.default {
    constructor() {
        super('trees');
        /*
        * Controller methods take the request and send the service payload to the
        * response helper method. The response to the client is handled there
        */
        this.getAll = (req) => __awaiter(this, void 0, void 0, function* () {
            const service = new services_1.FamilyTreeService();
            return yield service.getAllTrees(req.body.userId);
        });
        this.create = (req) => __awaiter(this, void 0, void 0, function* () {
            const service = new services_1.FamilyTreeService();
            return yield service.createTree(req.body, req.body.userId);
        });
        this.getOne = (req) => __awaiter(this, void 0, void 0, function* () {
            const service = new services_1.FamilyTreeService();
            return yield service.getTreeById(req.body.id);
        });
        this.delete = (req) => __awaiter(this, void 0, void 0, function* () {
            return true;
        });
        this.update = (req) => __awaiter(this, void 0, void 0, function* () {
            const service = new services_1.FamilyTreeService();
            return yield service.updateTree(req.body.updateData);
        });
        this.getMembers = (req) => __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
}
exports.default = FamilyTreeController;
