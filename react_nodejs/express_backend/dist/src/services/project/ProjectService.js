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
exports.ProjectService = void 0;
const Project_1 = __importDefault(require("../../models/Project"));
const logger_1 = __importDefault(require("../../utils/logger"));
class ProjectService {
    createProject(projectData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Project_1.default.create(projectData);
            }
            catch (error) {
                logger_1.default.error('Failed to create project:', error);
                throw error;
            }
        });
    }
    getAllProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Project_1.default.findAll();
            }
            catch (error) {
                logger_1.default.error('Failed to fetch projects:', error);
                throw error;
            }
        });
    }
    getProjectById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield Project_1.default.findByPk(id);
                if (!project) {
                    logger_1.default.error(`Project not found: id=${id}`);
                }
                return project;
            }
            catch (error) {
                logger_1.default.error('Failed to fetch project by id:', error);
                throw error;
            }
        });
    }
    updateProject(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield Project_1.default.findByPk(id);
                if (!project) {
                    logger_1.default.error(`Project not found for update: id=${id}`);
                    return null;
                }
                yield project.update(updateData);
                return project;
            }
            catch (error) {
                logger_1.default.error('Failed to update project:', error);
                throw error;
            }
        });
    }
    deleteProject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield Project_1.default.findByPk(id);
                if (!project) {
                    logger_1.default.error(`Project not found for deletion: id=${id}`);
                    return false;
                }
                yield project.destroy();
                return true;
            }
            catch (error) {
                logger_1.default.error('Failed to delete project:', error);
                throw error;
            }
        });
    }
}
exports.ProjectService = ProjectService;
