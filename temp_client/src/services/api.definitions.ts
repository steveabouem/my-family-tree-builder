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


export type APIGetFamilyTreeResponse = Partial<APIFamilyTreeDTO> & { members: APIFamilyMemberRecord[] };
export type APIGetAllTreesResponse = APIRequestPayload<FamilyTree[]>;

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
export interface FamilyMember {
    id?: number;
    node_id: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    dod?: string;
    age?: number;
    gender: number; // 1: Male, 2: Female
    marital_status: string;
    occupation: string;
    description?: string;
    profile_url?: string;
    parents: any; //TODO: either JSON string or array
    children: any; //TODO: either JSON string or array
    siblings: any; //TODO: either JSON string or array
    spouses: any; //TODO: either JSON string or array
    position?: any;
    // position?: { x: number; y: number };
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

export interface APIUserSimplifiedDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    tasks: string;
    roles: string;
    authorizedIps: string;
    ip_authority: number;
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

export interface User {
    userId?: number
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


export interface APIAdminRegistrationFields { //registration form fields

}

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

export type ManageTreeAPIResponse = Promise<ServiceResponseWithPayload<APIGetFamilyTreeResponse | null>>;
export type GetTreeAPIResponse = Promise<ServiceResponseWithPayload<FamilyTree | null>>;

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
    firstName: string;
    gender: number; //1 || 2
    lastName: string;
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
    firstName: string;
    gender: number; //1 || 2
    id: number;
    lastName: string;
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
    firstName: string;
    lastName: string;
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
interface DApiResponseRoot {
    error: boolean;
    code: number;
    sessionId?: string;
    message?: string;
}
export type DApiResponse<B> = DApiResponseRoot & B;
export interface DUserRelatedFamily {
    id: number;
    name: string;
}
export interface DUserDTO {
    userId?: number;
    firstName: string;
    lastName: string;
    age: number;
    occupation: string;
    partner?: number;
    marital_status: string;
    password: string;
    email: string;
    is_parent: number;
    has_ipa?: number;
    gender: number; // 1: M; 2:F
    assigned_ips: string[];
    profile_url: string;
    description: string;
    imm_family: number;
    related_to: number[];
    sessionToken?: string;
}

export interface DUserSession {
    authenticated: boolean;
    email: string;
    sessionId: string;
    userId: number;
    firstName: string;
    lastName: string;
}
export interface DFamilyTreeDAO {
    members: DFamilyMemberDTO[];
    userId: number;
    active?: boolean;
    treeName?: string;
    treeId?: number;
}
export interface DFamilyTreeRecord {
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
export interface DFamilyTreeDTO {
    id?: number;
    name?: string;
    members: {
        [memberId: string]: {
            id: string;
            name: string;
            type?: string;
            children?: string[];
            siblings?: string[];
            spouses?: string[];
        }
    }
}
export interface DFamilyMemberDTO {
    // Zogh attributes
    dob: string;
    email: string;
    firstName: string;
    gender: number; //1 || 2
    lastName: string;
    marital_status: string;
    occupation: string;
    dod?: string;
    id?: number;
    node_id: string;
    parents?: number[];
    age?: number;
    description?: string;
    profile_url?: string;
    userId?: number;
    // ReactFlow attributes
    nodeId?: string;
    name?: string;
    type?: NodeTypes;
    children?: DFamilyMemberDTO[];
    siblings?: DFamilyMemberDTO[];
    spouses?: DFamilyMemberDTO[];
}
export interface DReactFlowNode {
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