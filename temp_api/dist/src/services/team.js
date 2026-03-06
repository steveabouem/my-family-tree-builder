"use strict";
// import { ServiceResponseWithPayload } from "@shared/types";
// import { generateResponseData } from "./serviceHelpers";
// import logger from "../utils/logger";
// import Team from "../models/Team";
// import User from "../models/User";
// import { Op } from "sequelize";
// // import { 
// //   CreateTeamRequestPayload, 
// //   UpdateTeamRequestPayload,
// //   APITeamResponse 
// // } from "./types";
// export const createTeam = async (payload: CreateTeamRequestPayload): Promise<ServiceResponseWithPayload<APITeamResponse | null>> => {
//   const response: ServiceResponseWithPayload<APITeamResponse | null> = generateResponseData(null);
//   try {
//     const { data, userId } = payload;
//     // Check if user exists
//     const user = await User.findByPk(userId);
//     if (!user) {
//       response.error = true;
//       response.message = 'User not found';
//       response.code = 404;
//       return response;
//     }
//     // Create the team
//     const team = await Team.create({
//       ...data,
//       createdAt: new Date()
//     });
//     // Update user's leadership and teams arrays
//     const userLeadership = user.leadership || [];
//     const userTeams = user.teams || [];
//     if (!userLeadership.includes(team.id)) {
//       userLeadership.push(team.id);
//     }
//     if (!userTeams.includes(team.id)) {
//       userTeams.push(team.id);
//     }
//     await user.update({
//       leadership: userLeadership,
//       teams: userTeams
//     });
//     response.payload = {
//       id: team.id,
//       name: team.name,
//       members: team.members,
//       lead: team.lead,
//       description: team.description,
//       createdAt: team.createdAt,
//       updatedAt: team.updatedAt
//     };
//     response.error = false;
//     response.code = 201;
//     logger.info('Team created successfully:', { teamId: team.id, userId });
//   } catch (error) {
//     response.error = true;
//     response.message = 'Failed to create team';
//     response.code = 500;
//     logger.error('Error creating team:', error);
//   }
//   return response;
// };
// export const getTeam = async (teamId: number, userId: number): Promise<ServiceResponseWithPayload<APITeamResponse | null>> => {
//   const response: ServiceResponseWithPayload<APITeamResponse | null> = generateResponseData(null);
//   try {
//     const team = await Team.findByPk(teamId);
//     if (!team) {
//       response.error = true;
//       response.message = 'Team not found';
//       response.code = 404;
//       return response;
//     }
//     // Check if user is a member of the team
//     const user = await User.findByPk(userId);
//     if (!user || !user.teams || !user.teams.includes(teamId)) {
//       response.error = true;
//       response.message = 'Not authorized to access this team';
//       response.code = 403;
//       return response;
//     }
//     response.payload = {
//       id: team.id,
//       name: team.name,
//       members: team.members,
//       lead: team.lead,
//       description: team.description,
//       createdAt: team.createdAt,
//       updatedAt: team.updatedAt
//     };
//     response.error = false;
//     response.code = 200;
//   } catch (error) {
//     response.error = true;
//     response.message = 'Failed to retrieve team';
//     response.code = 500;
//     logger.error('Error retrieving team:', error);
//   }
//   return response;
// };
// export const updateTeam = async (payload: UpdateTeamRequestPayload): Promise<ServiceResponseWithPayload<APITeamResponse | null>> => {
//   const response: ServiceResponseWithPayload<APITeamResponse | null> = generateResponseData(null);
//   try {
//     const { teamId, data, userId } = payload;
//     const team = await Team.findByPk(teamId);
//     if (!team) {
//       response.error = true;
//       response.message = 'Team not found';
//       response.code = 404;
//       return response;
//     }
//     // Check if user is the team lead
//     if (team.lead !== userId) {
//       response.error = true;
//       response.message = 'Only team leads can update team information';
//       response.code = 403;
//       return response;
//     }
//     // Update the team
//     await team.update({
//       ...data,
//       updatedAt: new Date()
//     });
//     response.payload = {
//       id: team.id,
//       name: team.name,
//       members: team.members,
//       lead: team.lead,
//       description: team.description,
//       createdAt: team.createdAt,
//       updatedAt: team.updatedAt
//     };
//     response.error = false;
//     response.code = 200;
//     logger.info('Team updated successfully:', { teamId, userId });
//   } catch (error) {
//     response.error = true;
//     response.message = 'Failed to update team';
//     response.code = 500;
//     logger.error('Error updating team:', error);
//   }
//   return response;
// };
// export const deleteTeam = async (teamId: number, userId: number): Promise<ServiceResponseWithPayload<boolean>> => {
//   const response: ServiceResponseWithPayload<boolean> = generateResponseData(false);
//   try {
//     const team = await Team.findByPk(teamId);
//     if (!team) {
//       response.error = true;
//       response.message = 'Team not found';
//       response.code = 404;
//       return response;
//     }
//     // Check if user is the team lead
//     if (team.lead !== userId) {
//       response.error = true;
//       response.message = 'Only team leads can delete teams';
//       response.code = 403;
//       return response;
//     }
//     // Remove team from all users' teams and leadership arrays
//     const users = await User.findAll({
//       where: {
//         [Op.or]: [
//           { teams: { [Op.contains]: [teamId] } },
//           { leadership: { [Op.contains]: [teamId] } }
//         ]
//       }
//     });
//     for (const user of users) {
//       const userTeams = user.teams || [];
//       const userLeadership = user.leadership || [];
//       const updatedTeams = userTeams.filter(id => id !== teamId);
//       const updatedLeadership = userLeadership.filter(id => id !== teamId);
//       await user.update({
//         teams: updatedTeams,
//         leadership: updatedLeadership
//       });
//     }
//     await team.destroy();
//     response.payload = true;
//     response.error = false;
//     response.code = 200;
//     logger.info('Team deleted successfully:', { teamId, userId });
//   } catch (error) {
//     response.error = true;
//     response.message = 'Failed to delete team';
//     response.code = 500;
//     logger.error('Error deleting team:', error);
//   }
//   return response;
// };
// export const getUserTeams = async (userId: number): Promise<ServiceResponseWithPayload<APITeamResponse[]>> => {
//   const response: ServiceResponseWithPayload<APITeamResponse[]> = generateResponseData([]);
//   try {
//     const user = await User.findByPk(userId);
//     if (!user) {
//       response.error = true;
//       response.message = 'User not found';
//       response.code = 404;
//       return response;
//     }
//     const userTeams = user.teams || [];
//     if (userTeams.length === 0) {
//       response.payload = [];
//       response.error = false;
//       response.code = 200;
//       return response;
//     }
//     const teams = await Team.findAll({
//       where: {
//         id: {
//           [Op.in]: userTeams
//         }
//       }
//     });
//     response.payload = teams.map(team => ({
//       id: team.id,
//       name: team.name,
//       members: team.members,
//       lead: team.lead,
//       description: team.description,
//       createdAt: team.createdAt,
//       updatedAt: team.updatedAt
//     }));
//     response.error = false;
//     response.code = 200;
//   } catch (error) {
//     response.error = true;
//     response.message = 'Failed to retrieve user teams';
//     response.code = 500;
//     logger.error('Error retrieving user teams:', error);
//   }
//   return response;
// }; 
