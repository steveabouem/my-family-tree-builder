import { Router, Request, Response } from "express";
import { 
  CreateTeamRequestPayload, 
  UpdateTeamRequestPayload,
  APITeamResponse 
} from "../services/types";
import { 
  createTeam, 
  getTeam, 
  updateTeam, 
  deleteTeam,
  getUserTeams 
} from "../services/team";
import { sendRouteHandlerResponse } from "./helpers";

const router = Router();

// Create a new team
router.post('/create', (req: Request<{}, {}, CreateTeamRequestPayload, {}>, res: Response) => {
  sendRouteHandlerResponse<CreateTeamRequestPayload, APITeamResponse | null>(req.body, createTeam, res, 'Create Team');
});

// Get a specific team
router.get('/:id', (req: Request<{ id: string }, {}, {}, { userId: string }>, res: Response) => {
  const teamId = parseInt(req.params.id);
  const userId = parseInt(req.query.userId);
  
  if (isNaN(teamId) || isNaN(userId)) {
    res.status(400).json({ error: true, message: 'Invalid team ID or user ID' });
    return;
  }
  
  sendRouteHandlerResponse<{ teamId: number, userId: number }, APITeamResponse | null>(
    { teamId, userId }, 
    async (payload) => getTeam(payload.teamId, payload.userId), 
    res, 
    'Get Team'
  );
});

// Update a team
router.put('/:id', (req: Request<{ id: string }, {}, UpdateTeamRequestPayload, {}>, res: Response) => {
  const teamId = parseInt(req.params.id);
  const payload = { ...req.body, teamId };
  
  sendRouteHandlerResponse<UpdateTeamRequestPayload, APITeamResponse | null>(payload, updateTeam, res, 'Update Team');
});

// Delete a team
router.delete('/:id', (req: Request<{ id: string }, {}, {}, { userId: string }>, res: Response) => {
  const teamId = parseInt(req.params.id);
  const userId = parseInt(req.query.userId);
  
  if (isNaN(teamId) || isNaN(userId)) {
    res.status(400).json({ error: true, message: 'Invalid team ID or user ID' });
    return;
  }
  
  sendRouteHandlerResponse<{ teamId: number, userId: number }, boolean>(
    { teamId, userId }, 
    async (payload) => deleteTeam(payload.teamId, payload.userId), 
    res, 
    'Delete Team'
  );
});

// Get user's teams
router.get('/user/:userId', (req: Request<{ userId: string }, {}, {}, {}>, res: Response) => {
  const userId = parseInt(req.params.userId);
  
  if (isNaN(userId)) {
    res.status(400).json({ error: true, message: 'Invalid user ID' });
    return;
  }
  
  sendRouteHandlerResponse<number, APITeamResponse[]>(userId, getUserTeams, res, 'Get User Teams');
});

export default router; 