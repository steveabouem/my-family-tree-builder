import { User } from '../users/user.entity';

export interface HouseholdInterface {
  name: string;
  description?: string;
  admin: string;
  members?: User[];
  objectives?: any[];
  created: Date;
  updated?: Date;
}
