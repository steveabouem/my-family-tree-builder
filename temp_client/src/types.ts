import { icon } from "@fortawesome/fontawesome-svg-core";
import { Button } from "@mui/material";
import { link } from "fs";
import React, { ReactElement, ReactNode } from "react";
// I like all my types in one place. sue me.
// ============================================================================
// THEME & STYLING
// ============================================================================

export interface ThemeState {
  season: ThemeSeasons;
}

export interface LanguageState {
  current: LanguageEnum;
}

export enum ThemeSeasons {
  'winter' = 'winter',
  'sunny' = 'sunny',
  'default' = 'default',
}

export enum LanguageEnum {
  'english' = 'en',
  'french' = 'fr',
  'bafia' = 'bf'

}

export type seasonalCssVariable =
  | "cancel"
  | "confirm"
  | "dark"
  | "light"
  | "primary"
  | "accentBg"
  | "pillBg"
  | "pillBgInverse"
  | "secondary";

export const seasonalPaletteConfig: Record<seasonalCssVariable, Record<ThemeSeasons, string>> = {
  primary: {
    default: "#1b1322",
    sunny: "#f2c94e",
    winter: "#ffff"
  },
  secondary: {
    default: "#ffd9a8",
    sunny: "#8f7c30",
    winter: "#0e8bb5"
  },
  accentBg: {
    default: "#3f4360",
    sunny: "#51400ba3",
    winter: "#4c5054"
  },
  pillBg: {
    default: "#97d2ffe8",
    sunny: "#9f8451e8",
    winter: "#83b2c7e8"
  },
  pillBgInverse: {
    default: "#2c2450e8",
    sunny: "#9f8451e8",
    winter: "#684f73e8"
  },
  cancel: {
    default: "#ff6b6bff",
    sunny: "#f47d1d",
    winter: "#ea4c89"
  },
  confirm: {
    default: "#85ffa8ff",
    sunny: "#5e8720",
    winter: "#10ce99"
  },
  dark: {
    default: "#ffffffff",
    sunny: "#000000",
    winter: "#0e2232"
  },
  light: {
    default: "#000000ff",
    sunny: "#faeecb",
    winter: "#f3f5f7"
  }
};

export enum themeEnum {
  default =  'default',
  winter =  'winter',
  sunny =  'sunny',
}

export interface IconProps {
  link?: boolean;
  sx?: { [key: string]: string | number };
  color?: string;
  size?: number;
  tooltip?:  string | ReactNode,
  onClick?: () => void;
}

export interface GlobalContextProps {
  theme: themeEnum;
  loading: boolean;
  toggleLoading: (value?: boolean) => void;
  updateModal: (values: Partial<ModalProps>) => void;
  clearModal: () => void;
  session?: string;
  modal?: Partial<ModalProps>;
  tree?: Partial<FamilyTree>;
  updateTheme?: (value: themeEnum) => void;
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

export interface PageProps {
  title: string | ReactNode;
  subtitle: string | ReactNode;
  children?: React.ReactNode;
  loading?: boolean;
  bg?: string;
  prevUrl?: string;
  error?: boolean;
}

export interface NavigationLink {
  link: string | ReactNode;
  path: string | ReactNode;
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

export interface BaseDropDownProps {
  options: DropdownOption[];
  name: string;
  selectedOption?: DropdownOption;
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

export interface FieldAndLabelProps {
  label: string | ReactNode;
  fieldName: string;
  direction: 'row' | 'column';
  required?: boolean;
  children?: ReactNode;
  fieldType?: string;
  sx?: { [key: string]: string | number };
  labelStyles?: { [key: string]: string | number };
  fieldStyles?: { [key: string]: string | number };
}

export interface EmptyListProps {
  handleAdd: () => void;
  handleRefresh: () => void;
  message?: string;
  icon?: ReactNode;
}
// ============================================================================
// FORMS
// ============================================================================

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
  options?: { label: string | ReactElement, value: any }[];
}

export interface FieldsSection {
  title: ReactNode;
  fields: FormField[];
  required?: boolean;
}

export interface BaseFormProps {
  name?: string | ReactNode;
  withPaper?: boolean;
  rows?: number;
  mode?: 'read' | 'write',
  title?: string | ReactNode;
  fields: FormField[];
  handleSubmit: () => void;
  size?: string | ReactNode;
  locked?: boolean;
  initialValues?: any;
  handleFieldValueChange?: (field: string, value: string | number) => void;
  validations?: any;
}

export interface StepFormSectionsProps {
  sections: FieldsSection[];
  mode?: string;
  locked?: boolean;
  duplicateBottomActions: boolean;
}

export type StepFormState = {
  currentFormStepDetails: StepDetails;
  currentFormStep: number;
  updating: boolean;
  globalValues: any;
  totalSteps: number;
  files?: FormImageInfo[];
  stepTree?: { [name: string]: FormField[] };
  mode?: string;
}

export interface FormImageInfo {
  fieldName: string;
  file: string; //base64 image
}

export interface StepDetails {
  name: string;
  fields: FormField[];
  title?: ReactNode;
  subtitle?: ReactNode;
}

export type DChangeStepPayload = {
  success: boolean;
}

export enum stepFormModes {
  'edit' = 'edit',
  'create' = 'create',
}

export interface StepFormProps<V> {
  sx?: { [key: string]: string | number };
  handleSave: () => void;
  duplicateBottomActions?: boolean;
  handleNext?: (step: number) => void;
  handlePrev?: (step: number) => void;
}

// ============================================================================
// MODALS
// ============================================================================

export type ModalType = 'error' | 'success' | 'info' | 'warning';

export interface ModalProps {
  hidden: boolean;
  id: string;
  title: string | ReactNode;
  buttons: { cancel: boolean, confirm: boolean, confirmText?: ReactNode, cancelText?: ReactNode }; //the text will be wrapped in a translation component
  type: ModalType;
  transferData?: any;
  onConfirm?: (v?: any) => void;
  onCancel?: (v?: any) => void;
  content?: string | ReactNode;
  children?: ReactNode;
}

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export interface UserState {
  updating: boolean;
  currentUser?: APILoginResponse;
}

export interface AuthProps {
  mode: DAuthMode | undefined;
  changeMode: (mode: DAuthMode | undefined) => void;
  id?: number;
}

export type DAuthMode = 'login' | 'register';

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
export interface UserSession {
  userId: number;
  authenticated: boolean;
  email: string;
  firstName: string;
  lastName: string;
  sessionId?: string;
}

export interface ChangePasswordValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  new_password: string;
  repeat_new_password: string;
  id: number;
}

export interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  assigned_ips: string[];
  created_at: any;
}

export type APIGetProfileResponse = APIEndpointResponse<User & {membersRecordsCount: number, treesCount: number}>;

// ============================================================================
// FAMILY TREE & RELATIONSHIPS
// ============================================================================

export interface FamilyTreeState {
  updating: boolean;
  treeId: number;
  currentFamilyTree?: FamilyTreeRecord;
  name?: string;
  list: any[];
}

export interface FamilyMember {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  avatarUrl?: string;
}

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
  userId?: number;
}

export interface FamilyTreeFormData {
  // Base anchor fields (always present)
  anchor_node_id?: string;
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
}

export interface FamilyTreeRecord {
  created_at: string,
  id: number;
  active: BoolEnum;
  members: FamilyMemberDTO[],
  emails: string;
  name: string;
  public: BoolEnum;
  created_by?: number;
  updated_at?: string | null;
}

export interface UserRelatedFamily {
  id: number;
  name: string;
}

export interface FTContext {
  currentFamilyTree: Partial<FamilyTree>;
  familyTrees: Partial<FamilyTree>[];
  updateUser?: (values?: Partial<UserSession>) => void;
  updateFamilyTrees?: (values: Partial<FamilyTree>[]) => void;
  updateCurrentFamilyTree?: (values: Partial<FamilyTree>) => void;
  error?: boolean;
}

// ============================================================================
// FAMILY MEMBERS & KINSHIP
// ============================================================================

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

export interface MappedFamilyMember {
  [id: string]: FamilyMemberDTO
}

export interface MembersPositions {
  data: MemberPosition[];
  userId: number
}

export interface MemberPosition {
  node_id: string,
  new_position: { x: number, y: number }
}

export type DKinsCount = {
  [kinshipEnum.siblings]: { display: boolean; total: number };
  [kinshipEnum.partner]: boolean;
  [kinshipEnum.parents]: { mother: { display: boolean }; father: { display: boolean } };
}

export interface StepsFieldsByKin {
  [kinshipEnum.siblings]: { fields: FormField[]; exist: boolean; total: number };
  [kinshipEnum.partner]?: FormField[];
  [kinshipEnum.parents]: { father?: FormField[], mother: FormField[] };
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

// ============================================================================
// TREE VISUALIZATION & NODES
// ============================================================================

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
  siblings: Partial<FamilyMemberDTO>;
  spouses: Partial<FamilyMemberDTO>;
  children: Partial<FamilyMemberDTO>;
}

export type ReactFlowNode = Partial<FamilyMemberDTO> & {
  type: string;
  position: { x: number, y: number },
  children: string;
  spouses: string;
  data: Partial<FamilyMemberDTO>;
}

export interface ReactFlowEdge {
  id: string;
  position: { x: number, y: number };
  data: { label: string };
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
}

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export enum Gendersenum {
  male = 1,
  female = 2,
}

export enum BoolEnum {
  true = 1,
  false = 0
}

// ============================================================================
// DROPDOWN OPTIONS
// ============================================================================

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

// ============================================================================
// PROJECTS & TEAMS
// ============================================================================

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

// ============================================================================
// API TYPES
// ============================================================================

export interface APIEndpointResponse<P> {
  sessionId?: string;
  error: boolean;
  code: number;
  message?: string;
  payload: P;
}

// Authentication API
export interface LoginRequestPayload {
  email: string;
  password: string;
}

export interface APILoginResponse {
  email?: string;
  firstName?: string;
  lastName?: string;
  userId?: number;
}

export interface RegistrationRequestPayload {
  firstName: string,
  lastName: string,
  occupation: string,
  password: string,
  email: string,
  gender: 0 | 1,
  profile_url: string,
  description: string,
}

export interface APIRegistrationResponse {
  email: string;
  userId?: number;
  message?: string;
}

export interface APILogoutResponse {
  authenticated: boolean;
  email: string;
  userId?: number;
}

export interface APIRegistrationFields {
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

export interface APIFTLoginFields {
  email: string;
  password: string;
}

export interface PasswordChangeRequest {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface PasswordChangeRequestPayload {
  email: string;
  password: string;
  newPassword: string;
  repeatNewPassword: string;
  id: number;
}

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


// Family Tree API
export interface FamilyTreeDataPayload {
  treeId: number;
  treeName?: string;
  members: FamilyMemberDTO[];
  anchor: string;
  userId: number;
}

export type APICreateFamilyResponse = APIEndpointResponse<FamilyTreeRecord>;
export interface ManageTreeRequestPayload {
  data: FamilyTreeDataPayload;
  userId: number
}

export type APIGetProfileDataResponse = Pick<User, 'age' | 'created_at' | 'firstName' | 'id' | 'marital_status' | 'updated_at' | 'profile_url' | 'email' | 'lastName'> & {
  treesCount: number;
  status: 'active' | 'inactive';
  membersRecordsCount: number; // how many FamilyMember records use this same user ID
}

export type ManageTreeAPIEndpointResponse = Promise<APIEndpointResponse<FamilyTreeRecord[]> | null>;
export type APIDeleteTreeResponse = Promise<APIEndpointResponse<void> | null>;
export type GetTreeAPIEndpointResponse = Promise<APIEndpointResponse<FamilyTree | null>>;
export type APIFamilyMemberArrayKeys = keyof Pick<FamilyMemberDTO, 'children' | 'parents' | 'siblings' | 'spouses'>;
export interface DeleteMembersRequestPayload {
  nodeId: string;
  treeId: number;
}
// Project & Team API
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