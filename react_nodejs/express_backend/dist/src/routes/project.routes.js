"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProjectController_1 = __importDefault(require("../controllers/project/ProjectController"));
const router = (0, express_1.Router)();
router.post("/", ProjectController_1.default.createProject);
router.get("/", ProjectController_1.default.getProjects);
router.get("/:id", ProjectController_1.default.getProjectById);
router.put("/:id", ProjectController_1.default.updateProject);
router.delete("/:id", ProjectController_1.default.deleteProject);
exports.default = router;
