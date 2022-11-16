export interface UserInterface {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created: Date;
  updated?: Date;
  role?: UserRoles;
  password: string;
}

export enum UserRoles {
  APP_ADMIN, // 1
  HOUSEHOLD_ADMIN, // 2
  HOUSEHOLD_MEMBER, // 3
  GUEST, // 4
}
