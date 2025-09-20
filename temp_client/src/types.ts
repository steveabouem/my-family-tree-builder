import React, { ReactElement, ReactNode } from "react";
import { NodeTypes } from "@xyflow/react";


// theme
export interface ThemeState {
  season: ThemeSeasons;
};
export enum ThemeSeasons {
'fall' = 'fall' ,
'winter' = 'winter' ,
'spring'= 'spring',
'summer'= 'summer',
'default'= 'default',
};

export type seasonalCssVariable =
  "cancel" |
  "confirm" |
  "dark" |
  "light" |
  "primary" |
  "accentBg" |
  "pillBg" |
  "pillBgInverse" |
  "secondary" ;
export const seasonalPaletteConfig: Record<seasonalCssVariable, Record<ThemeSeasons, string>> = {
  primary: {
    default: "#000",
    fall: "#000",
    spring: "#e8fff4",
    summer: "#f2c94e",
    winter: "#ffff"
  },
  secondary: {
    default: "#000",
    fall: "#000",
    spring: "#e8fff4",
    summer: "#8f7c30",
    winter: "#0e8bb5"
  },
   accentBg: {
    default: "#000",
    fall: "#000",
    spring: "#e8fff4",
    summer: "#51400ba3",
    winter: "#4c5054"
  },
  pillBg: {
    default: "#ffffffe8",
    fall: "#ffffffe8",
    spring: "#ffffffe8",
    summer: "#ffffffe8",
    winter: "#83b2c7e8"
  },
  pillBgInverse: {
    default: "#ffffffe8",
    fall: "#ffffffe8",
    spring: "#ffffffe8",
    summer: "#ffffffe8",
    winter: "#684f73e8"
  },
  cancel: {
    default: "#000",
    fall: "#000",
    spring: "#e8fff4",
    summer: "#f47d1d",
    winter: "#ea4c89"
  },
  confirm: {
    default: "#000",
    fall: "#000",
    spring: "#e8fff4",
    summer: "#85c370",
    winter: "#b6ebff"
  },
  dark: {
    default: "#000",
    fall: "#000",
    spring: "#2a3c2b",
    summer: "#000000",
    winter: "#0e2232"
  },
  light: {
    default: "#000",
    fall: "#000",
    spring: "#2a3c2b",
    summer: "#faeecb",
    winter: "#f3f5f7"
  }
};

// stepform
export type StepFormState = {
  currentFormStepDetails: StepDetails;
  currentFormStep: number;
  updating: boolean;
  globalValues: any;
  totalSteps: number;
  stepTree?: { [name: string]: FormField[] };
  mode?: string;
};
export interface StepDetails {
  name: string;
  fields: FormField[];
  title?: ReactNode;
  subtitle?: ReactNode;
}
export type DChangeStepPayload = {
  success: boolean;
};

export enum stepFormModes {
  'edit' = 'edit',
  'create' = 'create',
}
//family tree
export interface FamilyTreeState {
  updating: boolean;
  treeId: number;
  currentFamilyTree?: FamilyTree;
  name?: string;
  list: any[];
}

// user
export interface UserState {
  updating: boolean;
  currentUser?: LoggedInUser;
}

export type LoggedInUser = Partial<User> & {authenticated?: boolean};

export interface AuthProps {
  mode: DAuthMode | undefined;
  changeMode: (mode: DAuthMode | undefined) => void;
  id?: number;
}

export type DAuthMode = 'login' | 'register';
export interface FamilyMember {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  avatarUrl?: string; // will have a check if user profile exists, and will use said user's info to populate
};

export interface ChangePasswordValues {
  email: string;
  password: string;
  newPassword: string;
  repeatNewPassword: string;
  id: number;
};



export type DKinsCount = {
  [kinshipEnum.siblings]: { display: boolean; total: number };
  [kinshipEnum.partner]: boolean;
  [kinshipEnum.parents]: { mother: { display: boolean }; father: { display: boolean } };
};
export interface StepsFieldsByKin {
  [kinshipEnum.siblings]: { fields: FormField[]; exist: boolean; total: number };
  [kinshipEnum.partner]?: FormField[];
  [kinshipEnum.parents]: { father?: FormField[], mother: FormField[] };
}
export interface FamilyTreeDTO {
  created_at: string;
  id: number;
  active: number; // 1 | 0
  authorized_ips: string;
  created_by: number;
  members: string; // JSON DFamilymemberDAO[]
  name?: string;
  public: number; // 1 | 0
}
export interface FamilyTreeFormData {
  // Base anchor fields (always present)
  anchor_node_id?: string;
  anchorNode?: string;
  treeName?: string;
  anchor_firstName?: string;
  anchor_lastName?: string;
  anchor_marital_status?: string;
  anchor_occupation?: string;
  anchor_dob?: string;
  anchor_gender?: '1' | '2';
  anchor_email?: string;
  anchor_description?: string;
  next_of_kin?: string;
  [key: string]: string | undefined | '1' | '2';
  // // Dynamic kinship fields with reasonable limits
  // // Siblings (assuming max 10 siblings)
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_firstName`]?: string;
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_lastName`]?: string;
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_marital_status`]?: string;
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_occupation`]?: string;
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_dob`]?: string;
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_gender`]?: number;
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_email`]?: string;
  // [K in `s-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}_description`]?: string;

  // // Parents (max 2)
  // [K in `f-${1 | 2}_firstName`]?: string;
  // [K in `f-${1 | 2}_lastName`]?: string;
  // [K in `f-${1 | 2}_marital_status`]?: string;
  // [K in `f-${1 | 2}_occupation`]?: string;
  // [K in `f-${1 | 2}_dob`]?: string;
  // [K in `f-${1 | 2}_gender`]?: number;
  // [K in `f-${1 | 2}_email`]?: string;
  // [K in `f-${1 | 2}_description`]?: string;

  // [K in `m-${1 | 2}_firstName`]?: string;
  // [K in `m-${1 | 2}_lastName`]?: string;
  // [K in `m-${1 | 2}_marital_status`]?: string;
  // [K in `m-${1 | 2}_occupation`]?: string;
  // [K in `m-${1 | 2}_dob`]?: string;
  // [K in `m-${1 | 2}_gender`]?: number;
  // [K in `m-${1 | 2}_email`]?: string;
  // [K in `m-${1 | 2}_description`]?: string;

  // // Partner (max 1)
  // [K in `h-1_firstName`]?: string;
  // [K in `h-1_lastName`]?: string;
  // [K in `h-1_marital_status`]?: string;
  // [K in `h-1_occupation`]?: string;
  // [K in `h-1_dob`]?: string;
  // [K in `h-1_gender`]?: number;
  // [K in `h-1_email`]?: string;
  // [K in `h-1_description`]?: string;

  // [K in `w-1_firstName`]?: string;
  // [K in `w-1_lastName`]?: string;
  // [K in `w-1_marital_status`]?: string;
  // [K in `w-1_occupation`]?: string;
  // [K in `w-1_dob`]?: string;
  // [K in `w-1_gender`]?: number;
  // [K in `w-1_email`]?: string;
  // [K in `w-1_description`]?: string;
}
export enum kinshipEnum {
  'parents' = 'parents',
  'siblings' = "siblings",
  'partner' = "partner",
}
export enum orientationEnum {
  'vertical' = 'vertical',
  'horizontal' = 'horizontal',
}



/* +++++=> NAVIGATION <= +++++ */
export interface NavigationLink {
  link: string  | ReactNode;
  path: string  | ReactNode;
}

/* +++++=> PAGES <= +++++ */
export interface PageProps {
  title: string | ReactNode;
  subtitle: string | ReactNode;
  children?: React.ReactNode;
  loading?: boolean;
  bg?: string;
  prevUrl?: string;
}

/* +++++=> FORMS <= +++++ */
export interface FormField {
  fieldName: string;
  label: string | ReactNode;
  class?: string;
  id?: string;
  value?: string | number | ReactNode;
  required?: boolean;
  type?: string;
  subComponent?: any;
  updateValue?: () => void;
  callback?: (value: string | number) => void;
  options?: {label: string | ReactElement, value: any}[];
}

export interface BaseFormProps {
  name?: string | ReactNode;
  withPaper?: boolean;
  mode?: 'read' | 'write',
  title?: string | ReactNode;
  fields: FormField[];
  handleSubmit: () => void;
  size?: string | ReactNode;
  locked?: boolean; // controls display of submit button
  initialValues?: any; // will switch to a generic soon
  handleFieldValueChange?: (field: string , value: string  | number) => void;
  // ! -TOFIX: No any, valiation types are not hard
  validations?: any;
}

/* +++++=> MODAL <= +++++ */
export type ModalType =  'error' | 'success' | 'info' | 'warning';

/* +++++=> APP <= +++++ */
export enum Gendersenum {
  male = 1,
  female = 2,
}

export interface StepFormProps<V> {
  sx?: {[key: string]: string | number};
  handleSave: () => void;
  handleNext?: (step: number) => void;
  handlePrev?: (step: number) => void;
}


export interface BaseMenuProps {
  items: MenuItem[];
  position: DPositionEnum;
  children?: ReactNode;
}

export interface MenuItem {
  title: string;
  link: string;
  children?: MenuItem[];
  hasChildren?: boolean;
}

enum DPositionEnum {
  left = 'left',
  right = 'right',
  center = 'center'
}



export interface FieldAndLabelProps {
  label: string | ReactNode;
  fieldName: string;
  direction: 'row' | 'column';
  required?: boolean;
  children?: ReactNode;
  fieldType?: string;
  sx?:  {[key:string]: string | number};
  labelStyles?:  {[key:string]: string | number};
  fieldStyles?:  {[key:string]: string | number};
}

export interface TreeManagerFields {
  relation: keyof typeof relationType | '';
  firstName: string;
  lastName: string;
  id?: number; // FTTreeNode
  siblings?: string[];
  user_id?: number;
  marital_status: string;
}

export interface TreeManagerProps {
  numberOfSiblings: number;
  hasSpouse: boolean;
}

export interface TreeNode {
  id: string;
  hasSubTree?: boolean;
  gender: 'male' | 'female';
  firstName: string;
  lastName: string;
  age: number;
  description?: string;
  marital_status?: string;
  profile_url?: string;
  parents: Partial<FamilyMemberDTO>;
  siblings:Partial<FamilyMemberDTO>;
  spouses: Partial<FamilyMemberDTO>;
  children:Partial<FamilyMemberDTO>;
}

export type ReactFlowNode = Partial<FamilyMemberDTO> & {
    type: string;
    position: {x: number, y: number},
    children: string;
    spouses: string;
    data: Partial<FamilyMemberDTO>;
}
export interface ReactFlowEdge {
  id: string;
  position: { x: number, y: number };
  data: { label: string };
}

export const relationType = {
  a: 'aunt',
  b: 'brother',
  f: 'father',
  gd: 'grand-father',
  gm: 'grand-mother',
  h: 'husband',
  m: 'mother',
  s: 'sister',
  u: 'uncle',
  w: 'wife',
} as const;

export const relationTypeCode = {
  a: 'a',
  b: 'b',
  f: 'f',
  gd: 'gd',
  gm: 'gm',
  h: 'h',
  m: 'm',
  s: 's',
  u: 'u',
  w: 'w',
} as const;

export enum NodeMenuActions {
  edit = 'edit_node',
  add = 'add_node_relative',
  delete = 'delete',
};

//============API//============/
// #region API
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
    members: FamilyMemberDTO[];
    anchor: string;
    userId: number;
}

//? raw DB model with parsed json values
export interface FamilyMemberDTO {
    tree_ids: string | null;
    age?: string;
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
    gender: string; // 1: Male, 2: Female
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
    memberRecords?: FamilyMemberDTO[]; // node_ids
    emails: string[]; // member emails
    public: boolean;
    active: boolean;
    authorized_ips: string;
    created_by: number;
    created_at?: Date;
    updated_at?: Date;
}


export interface MappedFamilyMember {
    [id: string]: FamilyMemberDTO
}

export interface APICreateFamilyResponse extends APIEndpointResponse {
    payload: {
        created_at: string;
        id: number;
        active: number;
        authorized_ips: string;
        members: FamilyMemberDTO[];
        name: string;
        public: number; //1|0
    }
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

export type APIFamilyMemberRecord = FamilyMemberDTO;
export type ManageTreeAPIEndpointResponse = Promise<APIRequestPayload<APIGetFamilyTreeResponse | null>>;
export type GetTreeAPIEndpointResponse = Promise<APIRequestPayload<FamilyTree | null>>;
export type APIFamilyMemberArrayKeys = keyof Pick<FamilyMemberDTO, 'children' | 'parents' | 'siblings' | 'spouses'>;


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

export interface ChangePasswordRequestPayload {
    email: string;
    password: string;
    newPassword: string;
    repeatNewPassword: string;
    id: number;
};



export interface UserRelatedFamily {
    id: number;
    name: string;
}
//#endregion
//============END API//============/

export interface ModalProps {
  hidden: boolean;
  id: string;
  title: string | ReactNode;
  buttons: {cancel: boolean, confirm: boolean};
  type: ModalType;
  transferData?: any;
  onConfirm?: (v?: any) => void;
  onCancel?: (v?: any) => void;
  content?: string | ReactNode;
  children?: ReactNode;
}


export enum themeEnum {
  green = 'DARK-GREEN',
  light = 'LIGHT',
  dark = 'DARK',
};

export interface GlobalContextProps {
  theme: themeEnum;
  loading: boolean;
  toggleLoading: (value?: boolean) => void;
  updateModal: (values: Partial<ModalProps>) => void; // change the modal content
  session?: string;
  modal?: Partial<ModalProps>;
  tree?: Partial<FamilyTree>;
  updateTheme?: (value: themeEnum) => void;
};

export interface BaseDropDownProps {
  options: DropdownOption[];
  name: string;
  additionalClass?: string;
  onChangeCB?: (value: string | number) => void;
  label?: string;
  sx?: { [key: string]: string },
  id?: string;
  displayVal?: string | number;
}

export interface DropdownOption {
  label: string;
  value: string | number;
  active?: boolean;
  additionalClass?: string;
  id?: string;
}

export const genderOptions: DropdownOption[] = [
  {
    label: 'male',
    value: Gendersenum.male,
  },
  {
    label: 'female',
    value: Gendersenum.female,
  },
];
export const parentOptions: DropdownOption[] = [
  {
    label: 'yes',
    value: 1,
    id: 'is-parent-option',
  },
  {
    label: 'no',
    value: 0,
    id: 'not-parent-option',
  },
];

export const relationOptions: DropdownOption[] = [
  {
    label: 'brother',
    value: 'brother',
    id: 'is-brother-option',
  },
  {
    label: 'father',
    value: 'father',
    id: 'is-father-option',
  },
  {
    label: 'husband',
    value: 'husband',
    id: 'is-husband-option',
  },
  {
    label: 'mother',
    value: 'mother',
    id: 'is-mother-option',
  },
  {
    label: 'sister',
    value: 'sister',
    id: 'is-sister-option',
  },
  {
    label: 'wife',
    value: 'wife',
    id: 'is-wife-option',
  },
  {
    label: 'son',
    value: 'son',
    id: 'is-son-option',
  },
  {
    label: 'daughter',
    value: 'daughter',
    id: 'is-daughter-option',
  },
];

export const maritalStatusOptions: DropdownOption[] = [
  {
    label: 'single',
    value: 'Single',
    id: 'single-option',
  },
  {
    label: 'married',
    value: 'Married',
    id: 'married-option',
  },
  {
    label: 'divorced',
    value: 'Divorced',
    id: 'Divorced-option',
  },
  {
    label: 'separated',
    value: 'Separated',
    id: 'separated-option',
  },
  {
    label: 'widowed',
    value: 'Widowed',
    id: 'widowed-option',
  },
  {
    label: 'not telling',
    value: 'Not telling',
    id: 'not-telling-option',
  },
];

export interface FTContext {
  currentFamilyTree: Partial<FamilyTree>;
  familyTrees: Partial<FamilyTree>[];
  updateUser?: (values?: Partial<UserSession>) => void;
  updateFamilyTrees?: (values: Partial<FamilyTree>[]) => void;
  updateCurrentFamilyTree?: (values: Partial<FamilyTree>) => void;
  error?: boolean;
};