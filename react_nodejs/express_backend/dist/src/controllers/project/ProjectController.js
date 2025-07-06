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
const Project_1 = __importDefault(require("../../models/Project"));
const logger_1 = __importDefault(require("../../utils/logger"));
class ProjectController {
    createProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield Project_1.default.create(req.body);
                res.status(201).json(project);
            }
            catch (error) {
                logger_1.default.error('Failed to create project:', error);
                res.status(400).json({ error: error.message });
            }
        });
    }
    getProjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projects = yield Project_1.default.findAll();
                res.json(projects);
            }
            catch (error) {
                logger_1.default.error('Failed to fetch projects:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }
    getProjectById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield Project_1.default.findByPk(req.params.id);
                if (!project) {
                    logger_1.default.error(`Project not found: id=${req.params.id}`);
                    return res.status(404).json({ error: "Project not found" });
                }
                res.json(project);
            }
            catch (error) {
                logger_1.default.error('Failed to fetch project by id:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }
    updateProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield Project_1.default.findByPk(req.params.id);
                if (!project) {
                    logger_1.default.error(`Project not found for update: id=${req.params.id}`);
                    return res.status(404).json({ error: "Project not found" });
                }
                yield project.update(req.body);
                res.json(project);
            }
            catch (error) {
                logger_1.default.error('Failed to update project:', error);
                res.status(400).json({ error: error.message });
            }
        });
    }
    deleteProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield Project_1.default.findByPk(req.params.id);
                if (!project) {
                    logger_1.default.error(`Project not found for deletion: id=${req.params.id}`);
                    return res.status(404).json({ error: "Project not found" });
                }
                yield project.destroy();
                res.status(204).send();
            }
            catch (error) {
                logger_1.default.error('Failed to delete project:', error);
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.default = new ProjectController();
