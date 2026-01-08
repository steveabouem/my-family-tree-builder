import FamilyMember from "@/models/FamilyMember";
import FamilyTree from "@/models/FamilyTree";
import { InferAttributes } from "sequelize";

// #region CORE API TYPES
export interface ApiResponse<T = any> {
    error: boolean;
    code: number;
    message?: string;
    payload: T;
    sessionId?: string;
}
export interface APIEndpointResponse {
    sessionId?: string;
    error: boolean;
    code: number;
    message?: string;
}

export interface APIRequestPayload<P> extends APIEndpointResponse {
    payload: P;
}

export type ServiceResponseWithPayload<G> = APIRequestPayload<G>;

// #region AUTHENTICATION & USER MANAGEMENT TYPES
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


export interface RegistrationRequestPayload {
    first_name: string,
    last_name: string,
    age: number,
    occupation: string,
    marital_status: string,
    password: string,
    email: string,
    gender: 0 | 1,
    profile_url: string,
    description: string,
}

export interface APIRegistrationResponse {
    authenticated: boolean;
    email: string;
    sessionId: string | null;
    userId?: number;
    message?: string;
}

export interface APIGetSessionResponse {
    active: boolean;
    user: UserSession | null;
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
//#endregion
// #region FAMILY TREE TYPES
export interface ManageTreeRequestPayload {
    data: FamilyTreeFormData;
    userId: number
}

export interface DeleteTreeRequestPayload { userId: number, id: number };

export interface ManageMembersRequestPayload {
    data: MemberPosition[];
    userId: number
}

export interface DeleteMembersRequestPayload {
    node_id: string;
    treeId: number;
}

export interface MemberPosition {
    node_id: string,
    new_position: { x: number, y: number }
}
export interface MappedFamilyMembers {
    [id: string]: FamilyMember
}

export type APIFamilyMemberArrayKeys = keyof Pick<FamilyMemberData, 'children' | 'parents' | 'siblings' | 'spouses'>;

export interface FamilyTreeCreateRequest {
    treeName: string;
    members: FamilyMemberData[];
    anchor: string; // node_id of anchor member
    userId: number;
}

export interface FamilyTreeUpdateRequest extends FamilyTreeCreateRequest {
    treeId: number;
}

export type ManageTreeAPIResponse = Promise<ServiceResponseWithPayload<APIGetFamilyTreeResponse | null>>;
export type GetTreeAPIResponse = Promise<ServiceResponseWithPayload<FamilyTree | null>>;

export interface FamilyTreeFormData {
    members: FamilyMemberData[];
    userId: number;
    anchor: string;
    active?: boolean;
    treeName?: string;
    treeId?: number;
}

export interface APIFamilyTree {
    public: number;
    name: string;
    authorized_ips: string;
    id: number;
    created_at: Date;
    created_by: number;
    updated_at: Date;
    active: number;
}

export type APIGetFamilyTreeResponse = Partial<APIFamilyTree> & { members: FamilyMemberData[] };

export type APIStepFormFieldDTO = {
    fieldName: string;
    index: number;
    label: string;
};

export interface APIReactFlowNode {
    id: string;
    name: string;
    children?: FamilyMemberData[];
    siblings?: FamilyMemberData[];
    spouses?: FamilyMemberData[];
    type?: any;
}

export type FamilyMemberRelativesNodeIds = {
    parents: string[]; // node_ids
    children: string[]; // node_ids
    siblings: string[]; // node_ids
    spouses: string[]; // node_ids
};

export type FamilyMemberRelativesData = {
    parents: FamilyMemberData[]; // node_ids
    children: FamilyMemberData[]; // node_ids
    siblings: FamilyMemberData[]; // node_ids
    spouses: FamilyMemberData[]; // node_ids
};

export type FamilyMemberData = FamilyMemberRelativesNodeIds & Omit<InferAttributes<FamilyMember>,
    'parents' |
    'children' |
    'siblings' |
    'spouses' |
    'position' |
    'connections'
> & {
    node_id: string;
    position?: { x: number; y: number };
    tree_idd?: number;
    created_by?: number;
    type?: string;
    connections?: {
        id: string;
        source: string;
        target: string;
    }[];
}

export type FamilyMemberDetailedData = FamilyMemberRelativesData & Omit<InferAttributes<FamilyMember>,
    'parents' |
    'children' |
    'siblings' |
    'spouses' |
    'position' |
    'connections'
> & {
    node_id: string;
    position?: { x: number; y: number };
    tree_idd?: number;
    created_by?: number;
    type?: string;
    connections?: {
        id: string;
        source: string;
        target: string;
    }[];
};
export interface User {
    id?: number;
    first_name: string;
    last_name: string;
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

export interface UserSession {
    userId: number;
    authenticated: boolean;
    email: string;
    firstName: string;
    lastName: string;
    sessionId?: string;
}

/** ADMIN */


export interface APIFTLoginFields { //registration form fields
    email: string;
    password: string;
}



export interface APIUserSimplifiedDTO {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    tasks: string;
    roles: string;
    authorizedIps: string;
    ip_authority: number;
}

export interface APIUserDTO {
    first_name: string,
    last_name: string,
    dob: string,
    occupation: string,
    id: number;
    marital_status: string,
    password: string,
    email: string,
    is_parent: number,
    parent_1: number | null,
    parent_2: number | null,
    role_id: number,
    gender: number, // 1: M, 2:F
    assigned_ips: string[],
    profile_url: string,
    description: string,
    imm_family: number,
    has_ipa?: number,
    partner?: number,
    realated_to: number[],
    created_at: Date,
    updated_at?: Date,
}

export interface APISessionUser {
    userId: number;
    authenticated: boolean;
    ip?: string;
    ipIsValid?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    familyTree?: APIFamilyTree;
}


export interface UserRegistrationData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    assigned_ips: string[];
    created_at: any;
}


export interface UpdateUserRequestPayload {
    userId: number;
    email?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    new_password?: string;
    repeat_new_password?: string;
}

// #region PROJECT & TEAM TYPES
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

export interface ChangePasswordRequestPayload {
    email: string;
    password: string;
    newPassword: string;
    repeatNewPassword: string;
    id: number;
};

// #region COMMON UTILITY TYPES & ENUMS
export interface PaginationParams {
    page?: number;
    limit?: number;
    offset?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface ValidationError {
    field: string;
    message: string;
    value?: any;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

export enum Gender {
    Male = 1,
    Female = 2
}

export enum MaritalStatus {
    Single = 'single',
    Married = 'married',
    Divorced = 'divorced',
    Widowed = 'widowed',
    Separated = 'separated'
}

export enum KinshipEnum {
    'sibling' = 'sibling',
    'parent' = 'parent',
    'spouse' = 'spouse',
    'child' = 'child'
} 