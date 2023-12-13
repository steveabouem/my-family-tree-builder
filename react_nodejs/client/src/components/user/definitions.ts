export interface DProfileProps {
  updateUser: (user: any) => void;
}

export interface DFamilyMember {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  avatarUrl?: string; // will have a check if user profile exists, and will use said user's info to populate
}