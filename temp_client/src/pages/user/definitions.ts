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