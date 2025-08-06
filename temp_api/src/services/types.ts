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

// Shared Family Tree Types
export interface FamilyMember {
    id?: number;
    node_id: string;
    first_name: string;
    last_name: string;
    email: string;
    dob: string;
    dod?: string;
    age?: number;
    gender: number; // 1: Male, 2: Female
    marital_status: string;
    occupation: string;
    description?: string;
    profile_url?: string;
    parents: string[]; // node_ids
    children: string[]; // node_ids
    siblings: string[]; // node_ids
    spouses: string[]; // node_ids
    position?: { x: number; y: number };
    connections?: Array<{
        id: string;
        source: string;
        target: string;
    }>;
    created_by?: number;
    user_id?: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface FamilyTree {
    id?: number;
    name: string;
    members: string[]; // node_ids
    emails: string[]; // member emails
    public: boolean;
    active: boolean;
    authorized_ips: string;
    created_by: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface FamilyTreeCreateRequest {
    treeName: string;
    members: FamilyMember[];
    anchor: string; // node_id of anchor member
    userId: number;
}

export interface FamilyTreeUpdateRequest {
    treeId: number;
    treeName?: string;
    members: FamilyMember[];
    anchor: string;
    userId: number;
}

// Shared User Types
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

export interface LoginRequest {
    email: string;
    password: string;
}

export interface PasswordChangeRequest {
    email: string;
    currentPassword: string;
    newPassword: string;
}

// Shared User Types
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

export interface LoginRequest {
    email: string;
    password: string;
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

export interface PasswordChangeRequest {
    email: string;
    currentPassword: string;
    newPassword: string;
}

export interface APIGetSessionResponse {
    active: boolean;
}

export interface APIRegistrationResponse {
    authenticated: boolean;
    email: string;
    sessionId: string | null;
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

/** ADMIN */

export interface DAdminRegistrationFields { //registration form fields

}

export interface APIEndpointResponse {
    sessionId?: string;
    error: boolean;
    code: number;
    message?: string;
}

export interface APITrackerRegistrationFields { //registration form fields

}

export interface APIFTRegistrationFields { //registration form fields
    firstName: string;
    lastName: string;
    age?: number;
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


/** ADMIN */

export interface APIAdminRegistrationFields { //registration form fields

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
    // ! -TOFIX: replace with association
    realated_to: number[],
    created_at: Date,
    updated_at?: Date,
}

// // DAOs
export type APIFamilyMemberRecord = FamilyMember;

export interface APIFamilyTreeDAO {
    //! TODO: keep an eye here, it was previously an object keyed with the noe id for the front. the conversion functions will be used for that if necessary
    members: APIFamilyMemberDAO[];
    userId: number;
    anchor: string;
    active?: boolean;
    treeName?: string;
    treeId?: number;
}

// Responses
export type ManageTreeAPIResponse = Promise<ServiceResponseWithPayload<APIGetFamilyTreeResponse | null>>;
export type GetTreeAPIResponse = Promise<ServiceResponseWithPayload<FamilyTree | null>>;

//DTOs
export interface APIFamilyTreeDTO {
    public: number;
    name: string;
    authorized_ips: string;
    id: number;
    created_at: Date;
    created_by: number;
    updated_at: Date;
    active: number;
}

export type APIGetFamilyTreeResponse = Partial<APIFamilyTreeDTO> & { members: APIFamilyMemberRecord[] };

export type APIStepFormFieldDTO = {
    fieldName: string;
    index: number;
    label: string;
};

export interface APIReactFlowNode {
    id: string;
    name: string;
    children?: APIFamilyMemberDAO[];
    siblings?: APIFamilyMemberDAO[];
    spouses?: APIFamilyMemberDAO[];
    type?: any;
}

// /*
// * DAOs are typycally sent from front, and  expect the matching DTO in response
// */

// DAOs
export interface APIFamilyMemberDAO {
    // Default attributes
    dob: string;
    node_id: string;
    email: string;
    first_name: string;
    gender: number; //1 || 2
    last_name: string;
    marital_status: string;
    occupation: string;
    dod?: string;
    age?: number;
    description?: string;
    profile_url?: string;
    userId?: number;
    // ReactFlow related attributes
    name?: string;
    type?: string;
    position?: { x: number; y: number };
    connections?: { id: string; source: string; target: string }[],
    parents?: string[];
    children?: string[];
    siblings?: string[];
    spouses?: string[];
    tree_id?: number;
    created_by?: number;
}

// DTOs
export interface APIFamilyMemberDTO {
    age: number;
    created_at: Date;
    created_by: number;
    description: string;
    email: string;
    first_name: string;
    gender: number; //1 || 2
    id: number;
    last_name: string;
    marital_status: string;
    occupation: string;
    parent_1: number;
    parent_2: number;
    partner: number;
    profile_url: string;
    tree_id: number;
    updated_at: Date;
    dod?: string;
}

export interface APIFamilyTreeNodeDTO {
    age: number;
    first_name: string;
    last_name: string;
    marital_status: string;
    description?: string;
    email?: string;
    occupation?: string;
    profile_url?: string;

    // RFT OBJECT
    id: string;
    gender: "male" | "female";
    parents: {
        id: string,
        type: "blood"
    }[];
    siblings?: {
        id: string,
        type: "blood"
    }[];
    spouses?: {
        id: string,
        type: "married" | "separated"
    }[];
    children?: {
        id: string,
        type: "blood"
    }[];
}

export type APIFamilyMemberArrayKeys = keyof Pick<APIFamilyMemberDAO, 'children' | 'parents' | 'siblings' | 'spouses'>;


export interface APISessionUser {
    userId: number;
    authenticated: boolean;
    ip?: string;
    ipIsValid?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    familyTree?: APIFamilyTreeDTO;
}

export interface APISession {
    type: string;
    user: APISessionUser;
    session: any;
}

export interface UserRegistrationData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    assigned_ips: string[];
    created_at: any;
}


export interface PasswordChangeRequestPayload {
    email: string;
    currentPassword: string;
    newPassword: string;
}

export interface ManageTreeRequestPayload {
    data: APIFamilyTreeDAO;
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

export interface ChangePasswordRequestPayload {
    email: string;
    password: string;
    newPassword: string;
    repeatNewPassword: string;
    id: number;
};// Common utility types and enums
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

export interface ApiResponse<T = any> {
    error: boolean;
    code: number;
    message?: string;
    payload: T;
    sessionId?: string;
}

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

export enum KinshipEnum {
    'sibling' = 'sibling',
    'parent' = 'parent',
    'spouse' = 'spouse',
    'child' = 'child'
} 