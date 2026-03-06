"use strict";
// import { Router, Request, Response } from "express";
// import { 
//   CreateProjectRequestPayload, 
//   UpdateProjectRequestPayload, 
//   AssignTeamToProjectRequestPayload,
//   APIProjectResponse 
// } from "@shared/types";
// // import { 
// //   createProject, 
// //   getProject, 
// //   updateProject, 
// //   deleteProject, 
// //   assignTeamToProject,
// //   getUserProjects 
// // } from "../services/project";
// import { sendRouteHandlerResponse } from "./helpers";
// const router = Router();
// // Create a new project
// router.post('/create', (req: Request<{}, {}, CreateProjectRequestPayload, {}>, res: Response) => {
//   sendRouteHandlerResponse<CreateProjectRequestPayload, APIProjectResponse | null>(req.body, createProject, res, 'Create Project');
// });
// // Get a specific project
// router.get('/:id', (req: Request<{ id: string }, {}, {}, { userId: string }>, res: Response) => {
//   const projectId = parseInt(req.params.id);
//   const userId = parseInt(req.query.userId);
//   if (isNaN(projectId) || isNaN(userId)) {
//     res.status(400).json({ error: true, message: 'Invalid project ID or user ID' });
//     return;
//   }
//   sendRouteHandlerResponse<{ projectId: number, userId: number }, APIProjectResponse | null>(
//     { projectId, userId }, 
//     async (payload) => getProject(payload.projectId, payload.userId), 
//     res, 
//     'Get Project'
//   );
// });
// // Update a project
// router.put('/:id', (req: Request<{ id: string }, {}, UpdateProjectRequestPayload, {}>, res: Response) => {
//   const projectId = parseInt(req.params.id);
//   const payload = { ...req.body, projectId };
//   sendRouteHandlerResponse<UpdateProjectRequestPayload, APIProjectResponse | null>(payload, updateProject, res, 'Update Project');
// });
// // Delete a project
// router.delete('/:id', (req: Request<{ id: string }, {}, {}, { userId: string }>, res: Response) => {
//   const projectId = parseInt(req.params.id);
//   const userId = parseInt(req.query.userId);
//   if (isNaN(projectId) || isNaN(userId)) {
//     res.status(400).json({ error: true, message: 'Invalid project ID or user ID' });
//     return;
//   }
//   sendRouteHandlerResponse<{ projectId: number, userId: number }, boolean>(
//     { projectId, userId }, 
//     async (payload) => deleteProject(payload.projectId, payload.userId), 
//     res, 
//     'Delete Project'
//   );
// });
// // Assign team to project
// router.post('/:id/assign-team', (req: Request<{ id: string }, {}, AssignTeamToProjectRequestPayload, {}>, res: Response) => {
//   const projectId = parseInt(req.params.id);
//   const payload = { ...req.body, projectId };
//   sendRouteHandlerResponse<AssignTeamToProjectRequestPayload, APIProjectResponse | null>(payload, assignTeamToProject, res, 'Assign Team to Project');
// });
// // Get user's projects
// router.get('/user/:userId', (req: Request<{ userId: string }, {}, {}, {}>, res: Response) => {
//   const userId = parseInt(req.params.userId);
//   if (isNaN(userId)) {
//     res.status(400).json({ error: true, message: 'Invalid user ID' });
//     return;
//   }
//   sendRouteHandlerResponse<number, APIProjectResponse[]>(userId, getUserProjects, res, 'Get User Projects');
// });
// export default router; 
