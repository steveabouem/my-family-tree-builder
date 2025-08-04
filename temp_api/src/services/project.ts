// import { Op } from "sequelize";
// import { ServiceResponseWithPayload } from "./types";
// import { generateResponseData } from "./serviceHelpers";
// import logger from "../utils/logger";
// import Project from "../models/Project";
// import User from "../models/User";
// import Team from "../models/Team";
// import { 
//   CreateProjectRequestPayload, 
//   UpdateProjectRequestPayload, 
//   AssignTeamToProjectRequestPayload,
//   APIProjectResponse 
// } from "./types";

// // Helper function to check if user is authorized to manage a project
// const isUserAuthorizedForProject = async (userId: number, projectId: number): Promise<boolean> => {
//   try {
//     const project = await Project.findByPk(projectId);
//     if (!project) {
//       return false;
//     }

//     // If project has no teams, no CRUD is allowed
//     if (!project.teams || project.teams.length === 0) {
//       return false;
//     }

//     const user = await User.findByPk(userId);
//     if (!user) {
//       return false;
//     }

//     // Check if user is a team lead and their team is assigned to the project
//     const userTeams = user.teams || [];
//     const userLeadership = user.leadership || [];
    
//     // Check if user leads any team that is assigned to this project
//     const hasAuthorizedTeam = project.teams.some(teamId => 
//       userLeadership.includes(teamId) && userTeams.includes(teamId)
//     );

//     return hasAuthorizedTeam;
//   } catch (error) {
//     logger.error('Error checking project authorization:', error);
//     return false;
//   }
// };

// export const createProject = async (payload: CreateProjectRequestPayload): Promise<ServiceResponseWithPayload<APIProjectResponse | null>> => {
//   const response: ServiceResponseWithPayload<APIProjectResponse | null> = generateResponseData(null);

//   try {
//     const { data, userId } = payload;

//     // Check if user is a team lead
//     const user = await User.findByPk(userId);
//     if (!user || !user.leadership || user.leadership.length === 0) {
//       response.error = true;
//       response.message = 'Only team leads can create projects';
//       response.code = 403;
//       return response;
//     }

//     // Create the project
//     const project = await Project.create({
//       ...data,
//       createdAt: new Date()
//     });

//     response.payload = {
//       id: project.id,
//       goal: project.goal,
//       budget: project.budget,
//       expenses: project.expenses,
//       projectLead: project.projectLead,
//       teams: project.teams,
//       status: project.status,
//       createdAt: project.createdAt,
//       updatedAt: project.updatedAt
//     };
//     response.error = false;
//     response.code = 201;
//     logger.info('Project created successfully:', { projectId: project.id, userId });

//   } catch (error) {
//     response.error = true;
//     response.message = 'Failed to create project';
//     response.code = 500;
//     logger.error('Error creating project:', error);
//   }

//   return response;
// };

// export const getProject = async (projectId: number, userId: number): Promise<ServiceResponseWithPayload<APIProjectResponse | null>> => {
//   const response: ServiceResponseWithPayload<APIProjectResponse | null> = generateResponseData(null);

//   try {
//     const project = await Project.findByPk(projectId);
//     if (!project) {
//       response.error = true;
//       response.message = 'Project not found';
//       response.code = 404;
//       return response;
//     }

//     // Check authorization
//     const isAuthorized = await isUserAuthorizedForProject(userId, projectId);
//     if (!isAuthorized) {
//       response.error = true;
//       response.message = 'Not authorized to access this project';
//       response.code = 403;
//       return response;
//     }

//     response.payload = {
//       id: project.id,
//       goal: project.goal,
//       budget: project.budget,
//       expenses: project.expenses,
//       projectLead: project.projectLead,
//       teams: project.teams,
//       status: project.status,
//       createdAt: project.createdAt,
//       updatedAt: project.updatedAt
//     };
//     response.error = false;
//     response.code = 200;

//   } catch (error) {
//     response.error = true;
//     response.message = 'Failed to retrieve project';
//     response.code = 500;
//     logger.error('Error retrieving project:', error);
//   }

//   return response;
// };

// export const updateProject = async (payload: UpdateProjectRequestPayload): Promise<ServiceResponseWithPayload<APIProjectResponse | null>> => {
//   const response: ServiceResponseWithPayload<APIProjectResponse | null> = generateResponseData(null);

//   try {
//     const { projectId, data, userId } = payload;

//     // Check authorization
//     const isAuthorized = await isUserAuthorizedForProject(userId, projectId);
//     if (!isAuthorized) {
//       response.error = true;
//       response.message = 'Not authorized to update this project';
//       response.code = 403;
//       return response;
//     }

//     const project = await Project.findByPk(projectId);
//     if (!project) {
//       response.error = true;
//       response.message = 'Project not found';
//       response.code = 404;
//       return response;
//     }

//     // Update the project
//     await project.update({
//       ...data,
//       updatedAt: new Date()
//     });

//     response.payload = {
//       id: project.id,
//       goal: project.goal,
//       budget: project.budget,
//       expenses: project.expenses,
//       projectLead: project.projectLead,
//       teams: project.teams,
//       status: project.status,
//       createdAt: project.createdAt,
//       updatedAt: project.updatedAt
//     };
//     response.error = false;
//     response.code = 200;
//     logger.info('Project updated successfully:', { projectId, userId });

//   } catch (error) {
//     response.error = true;
//     response.message = 'Failed to update project';
//     response.code = 500;
//     logger.error('Error updating project:', error);
//   }

//   return response;
// };

// export const deleteProject = async (projectId: number, userId: number): Promise<ServiceResponseWithPayload<boolean>> => {
//   const response: ServiceResponseWithPayload<boolean> = generateResponseData(false);

//   try {
//     // Check authorization
//     const isAuthorized = await isUserAuthorizedForProject(userId, projectId);
//     if (!isAuthorized) {
//       response.error = true;
//       response.message = 'Not authorized to delete this project';
//       response.code = 403;
//       return response;
//     }

//     const project = await Project.findByPk(projectId);
//     if (!project) {
//       response.error = true;
//       response.message = 'Project not found';
//       response.code = 404;
//       return response;
//     }

//     await project.destroy();
//     response.payload = true;
//     response.error = false;
//     response.code = 200;
//     logger.info('Project deleted successfully:', { projectId, userId });

//   } catch (error) {
//     response.error = true;
//     response.message = 'Failed to delete project';
//     response.code = 500;
//     logger.error('Error deleting project:', error);
//   }

//   return response;
// };

// export const assignTeamToProject = async (payload: AssignTeamToProjectRequestPayload): Promise<ServiceResponseWithPayload<APIProjectResponse | null>> => {
//   const response: ServiceResponseWithPayload<APIProjectResponse | null> = generateResponseData(null);

//   try {
//     const { projectId, teamId, userId } = payload;

//     // Check if user is the team lead
//     const team = await Team.findByPk(teamId);
//     if (!team || team.lead !== userId) {
//       response.error = true;
//       response.message = 'Only team leads can assign teams to projects';
//       response.code = 403;
//       return response;
//     }

//     const project = await Project.findByPk(projectId);
//     if (!project) {
//       response.error = true;
//       response.message = 'Project not found';
//       response.code = 404;
//       return response;
//     }

//     // Add team to project if not already assigned
//     const currentTeams = project.teams || [];
//     if (!currentTeams.includes(teamId)) {
//       const updatedTeams = [...currentTeams, teamId];
//       await project.update({
//         teams: updatedTeams,
//         updatedAt: new Date()
//       });
//     }

//     response.payload = {
//       id: project.id,
//       goal: project.goal,
//       budget: project.budget,
//       expenses: project.expenses,
//       projectLead: project.projectLead,
//       teams: project.teams,
//       status: project.status,
//       createdAt: project.createdAt,
//       updatedAt: project.updatedAt
//     };
//     response.error = false;
//     response.code = 200;
//     logger.info('Team assigned to project successfully:', { projectId, teamId, userId });

//   } catch (error) {
//     response.error = true;
//     response.message = 'Failed to assign team to project';
//     response.code = 500;
//     logger.error('Error assigning team to project:', error);
//   }

//   return response;
// };

// export const getUserProjects = async (userId: number): Promise<ServiceResponseWithPayload<APIProjectResponse[]>> => {
//   const response: ServiceResponseWithPayload<APIProjectResponse[]> = generateResponseData([]);

//   try {
//     const user = await User.findByPk(userId);
//     if (!user) {
//       response.error = true;
//       response.message = 'User not found';
//       response.code = 404;
//       return response;
//     }

//     const userTeams = user.teams || [];
//     const userLeadership = user.leadership || [];

//     // Get all projects where user's teams are assigned
//     const projects = await Project.findAll({
//       where: {
//         teams: {
//           [Op.overlap]: userTeams
//         }
//       }
//     });

//     // Filter projects where user is authorized (team lead of assigned team)
//     const authorizedProjects = projects.filter(project => {
//       const projectTeams = project.teams || [];
//       return projectTeams.some(teamId => 
//         userLeadership.includes(teamId) && userTeams.includes(teamId)
//       );
//     });

//     response.payload = authorizedProjects.map(project => ({
//       id: project.id,
//       goal: project.goal,
//       budget: project.budget,
//       expenses: project.expenses,
//       projectLead: project.projectLead,
//       teams: project.teams,
//       status: project.status,
//       createdAt: project.createdAt,
//       updatedAt: project.updatedAt
//     }));
//     response.error = false;
//     response.code = 200;

//   } catch (error) {
//     response.error = true;
//     response.message = 'Failed to retrieve user projects';
//     response.code = 500;
//     logger.error('Error retrieving user projects:', error);
//   }

//   return response;
// }; 