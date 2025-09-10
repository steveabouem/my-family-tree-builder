import { NodeTypes } from "@xyflow/react";

export interface APIEndpointResponse {
    sessionId?: string;
    error: boolean;
    code: number;
    message?: string;
}

export interface APIRequestPayload<P> extends APIEndpointResponse {
    payload: P;
}

// LOGIN
export interface LoginRequestPayload {
    email: string;
    password: string;
}
export interface APILoginResponse {
    authenticated: boolean;
    email?: string;
    firstName?: string;
    lastName?: string;
    userId?: number;
}

export type APIGetFamilyTreeResponse = Partial<FamilyTree> & { members: APIFamilyMemberRecord[] };
export type APIGetAllTreesResponse = APIRequestPayload<FamilyTree[]>;

// ? used for tree create/update requests
export interface FamilyTreeDataPayload { 
    treeId: number;
    treeName?: string;
    members: FamilyMember[];
    anchor: string;
    userId: number;
}

//? raw DB model with parsed json values
export interface FamilyMember {
    tree_ids: string | null;
    age?: number;
    children: string[]; // node_ids
    connections?: {
        id: string;
        source: string;
        target: string;
    }[];
    created_at?: Date;
    created_by?: number;
    description?: string;
    dob: string;
    dod?: string;
    email: string;
    firstName: string;
    gender: number; // 1: Male, 2: Female
    id?: number;
    lastName: string;
    marital_status: string;
    node_id: string;
    occupation: string;
    parents: string[]; // node_ids
    position?: { x: number; y: number };
    profile_url?: string;
    siblings: string[]; // node_ids
    spouses: string[]; // node_ids
    tree_idd?: number;
    type?: string;
    updated_at?: Date;
    user_id?: number;
}

//? raw DB model with parsed json values
export interface FamilyTree {
    id?: number;
    name: string;
    members: string[]; // node_ids
    memberRecords?: FamilyMember[]; // node_ids
    emails: string[]; // member emails
    public: boolean;
    active: boolean;
    authorized_ips: string;
    created_by: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    dob: string;
    age?: number;
    gender: number; // 1: Male, 2: Female
    occupation: string;
    marital_status: string;
    description?: string;
    profile_url?: string;
    assigned_ips: string[];
    role_id: number;
    has_ipa?: number;
    leadership: number[];
    teams: number[];
    created_at?: Date;
    updated_at?: Date;
}

export interface PasswordChangeRequest {
    email: string;
    currentPassword: string;
    newPassword: string;
}

export interface UserSession {
    userId: number;
    authenticated: boolean;
    email: string;
    firstName: string;
    lastName: string;
    sessionId?: string;
}

export interface RegistrationRequestPayload {
    firstName: string,
    lastName: string,
    age: number,
    occupation: string,
    marital_status: string,
    password: string,
    email: string,
    gender: 0 | 1,
    profile_url: string,
    description: string,
}

export interface PasswordChangeRequest {
    email: string;
    currentPassword: string;
    newPassword: string;
}

export interface APIRegistrationResponse {
    authenticated: boolean;
    email: string;
    userId?: number;
    message?: string;
}

export interface APILogoutResponse {
    authenticated: boolean;
    email: string;
    userId?: number;
}

export interface APIRegistrationFields { //registration form fields
    firstName: string;
    lastName: string;
    age: number;
    occupation?: string;
    partner?: string;
    maritalStatus?: string;
    isParent: number; //1/0
    description: string;
    gender: string;
    profileUrl?: string;
}

export interface APIFTLoginFields { //registration form fields
    email: string;
    password: string;
}

export type APIFamilyMemberRecord = FamilyMember;
export type ManageTreeAPIEndpointResponse = Promise<APIRequestPayload<APIGetFamilyTreeResponse | null>>;
export type GetTreeAPIEndpointResponse = Promise<APIRequestPayload<FamilyTree | null>>;
export type APIFamilyMemberArrayKeys = keyof Pick<FamilyMember, 'children' | 'parents' | 'siblings' | 'spouses'>;


export interface APISessionUser {
    userId: number;
    authenticated: boolean;
    ip?: string;
    ipIsValid?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    familyTree?: FamilyTree;
}



export interface UserRegistrationData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    assigned_ips: string[];
    created_at: any;
}


export interface PasswordChangeRequestPayload {
    email: string;
    currentPassword: string;
    newPassword: string;
}

export interface ManageTreeRequestPayload {
    data: FamilyTreeDataPayload;
    userId: number
}

// Project and Team Types
export interface Expense {
    name: string;
    description: string;
    date: Date;
    deadline: Date;
}

export interface ProjectData {
    goal: string;
    budget: number;
    expenses: Expense[];
    projectLead: number;
    teams: number[];
    status: number;
}

export interface TeamData {
    name: string;
    members: number[];
    lead: number;
    description: string;
}

export interface CreateProjectRequestPayload {
    data: ProjectData;
    userId: number;
}

export interface UpdateProjectRequestPayload {
    projectId: number;
    data: Partial<ProjectData>;
    userId: number;
}

export interface AssignTeamToProjectRequestPayload {
    projectId: number;
    teamId: number;
    userId: number;
}

export interface CreateTeamRequestPayload {
    data: TeamData;
    userId: number;
}

export interface UpdateTeamRequestPayload {
    teamId: number;
    data: Partial<TeamData>;
    userId: number;
}

export interface APIProjectResponse {
    id: number;
    goal: string;
    budget: number;
    expenses: Expense[];
    projectLead: number;
    teams: number[];
    status: number;
    createdAt: Date;
    updatedAt?: Date;
}

export interface APITeamResponse {
    id: number;
    name: string;
    members: number[];
    lead: number;
    description: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface MappedFamilyMembers {
    [id: string]: FamilyMember
}

export interface APICreateFamilyResponse extends APIEndpointResponse {
    payload: {
        created_at: string;
        id: number;
        active: number;
        authorized_ips: string;
        members: FamilyMember[];
        emails: string; //emails[]
        name: string;
        public: number; //1|0
    }
}
export interface ChangePasswordRequestPayload {
    email: string;
    password: string;
    newPassword: string;
    repeatNewPassword: string;
    id: number;
};



// OLD
interface APIEndpointResponseRoot {
    error: boolean;
    code: number;
    sessionId?: string;
    message?: string;
}
export interface UserRelatedFamily {
    id: number;
    name: string;
}

export interface FamilyTreeRecord {
    id: number;
    authorized_ips: string;
    members: string;
    name: string;
    public: 1 | 0;
    active: 1 | 0;
    created_at: string;
    created_by: number;
    updated_at: string | null;
}

export interface ReactFlowNode {
    id: string;
    age?: number;
    children?: string[];
    created_by?: number;
    data: any;
    description: string;
    dob: string;
    email: string;
    firstName: string;
    gender: number;
    lastName: string;
    marital_status: string;
    node_id: string;
    occupation: string;
    parents: string;
    profile_url: string;
    siblings?: string[];
    spouses?: string[];
    type?: string;
    user_id: number;
}