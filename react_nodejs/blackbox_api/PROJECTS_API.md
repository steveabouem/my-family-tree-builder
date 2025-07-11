# Projects and Teams API Documentation

This document describes the new Projects and Teams workspace API endpoints that follow the same pattern as the existing authentication system.

## Overview

The Projects workspace allows team leads to create and manage projects with the following features:
- Project CRUD operations with authorization based on team leadership
- Team management with member assignments
- Project-team assignments
- Budget and expense tracking
- Project status management (1-5 scale)

## Authorization Rules

- **Project CRUD Operations**: Only users who are team leads AND whose team is assigned to the project can perform CRUD operations
- **Team Management**: Only team leads can update/delete their teams
- **Project Assignment**: Only team leads can assign their teams to projects
- **No Teams**: If a project has no teams assigned, no CRUD operations are allowed

## API Endpoints

### Teams

#### Create Team
- **POST** `/api/teams/create`
- **Body**: `CreateTeamRequestPayload`
- **Description**: Creates a new team and assigns the creator as team lead

#### Get Team
- **GET** `/api/teams/:id?userId=:userId`
- **Description**: Retrieves team information (user must be a team member)

#### Update Team
- **PUT** `/api/teams/:id`
- **Body**: `UpdateTeamRequestPayload`
- **Description**: Updates team information (only team lead can update)

#### Delete Team
- **DELETE** `/api/teams/:id?userId=:userId`
- **Description**: Deletes a team (only team lead can delete)

#### Get User Teams
- **GET** `/api/teams/user/:userId`
- **Description**: Retrieves all teams the user is a member of

### Projects

#### Create Project
- **POST** `/api/projects/create`
- **Body**: `CreateProjectRequestPayload`
- **Description**: Creates a new project (only team leads can create)

#### Get Project
- **GET** `/api/projects/:id?userId=:userId`
- **Description**: Retrieves project information (user must be authorized)

#### Update Project
- **PUT** `/api/projects/:id`
- **Body**: `UpdateProjectRequestPayload`
- **Description**: Updates project information (user must be authorized)

#### Delete Project
- **DELETE** `/api/projects/:id?userId=:userId`
- **Description**: Deletes a project (user must be authorized)

#### Assign Team to Project
- **POST** `/api/projects/:id/assign-team`
- **Body**: `AssignTeamToProjectRequestPayload`
- **Description**: Assigns a team to a project (only team lead can assign)

#### Get User Projects
- **GET** `/api/projects/user/:userId`
- **Description**: Retrieves all projects the user is authorized to access

## Data Models

### Project
```typescript
interface Project {
  id: number;
  goal: string;
  budget: number; // DECIMAL(10,2)
  expenses: Expense[];
  projectLead: number;
  teams: number[];
  status: number; // 1-5
  createdAt: Date;
  updatedAt?: Date;
}
```

### Team
```typescript
interface Team {
  id: number;
  name: string;
  members: number[];
  lead: number;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
}
```

### Expense
```typescript
interface Expense {
  name: string;
  description: string;
  date: Date;
  deadline: Date;
}
```

### User (Updated)
```typescript
interface User {
  // ... existing fields
  leadership: number[]; // Team IDs where user is lead
  teams: number[]; // Team IDs where user is member
}
```

## Request/Response Types

### CreateProjectRequestPayload
```typescript
{
  data: ProjectData;
  userId: number;
}
```

### UpdateProjectRequestPayload
```typescript
{
  projectId: number;
  data: Partial<ProjectData>;
  userId: number;
}
```

### AssignTeamToProjectRequestPayload
```typescript
{
  projectId: number;
  teamId: number;
  userId: number;
}
```

### CreateTeamRequestPayload
```typescript
{
  data: TeamData;
  userId: number;
}
```

### UpdateTeamRequestPayload
```typescript
{
  teamId: number;
  data: Partial<TeamData>;
  userId: number;
}
```

## Response Format

All endpoints follow the same response pattern as the existing auth system:

```typescript
{
  error: boolean;
  code: number;
  message?: string;
  payload: T;
}
```

## Database Migrations

The following migrations need to be run:

1. `20250226155800-add-leadership-teams-to-users.js` - Adds leadership and teams fields to users table
2. `20250226155900-create-teams.js` - Creates the teams table
3. `20250226156000-create-projects.js` - Creates the projects table

## Usage Examples

### Creating a Team
```javascript
POST /api/teams/create
{
  "data": {
    "name": "Development Team",
    "members": [1, 2, 3],
    "lead": 1,
    "description": "Main development team"
  },
  "userId": 1
}
```

### Creating a Project
```javascript
POST /api/projects/create
{
  "data": {
    "goal": "Build a new web application",
    "budget": 50000.00,
    "expenses": [],
    "projectLead": 1,
    "teams": [1],
    "status": 1
  },
  "userId": 1
}
```

### Assigning Team to Project
```javascript
POST /api/projects/1/assign-team
{
  "projectId": 1,
  "teamId": 2,
  "userId": 1
}
``` 