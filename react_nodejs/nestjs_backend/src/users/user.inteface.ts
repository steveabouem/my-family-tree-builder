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
  SUPER_ADMIN, // 1
  ADMIN, // 2
  MEMBER, // 3
  GUEST, // 4
}
