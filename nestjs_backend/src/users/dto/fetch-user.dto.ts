import { UserRoles } from '../user.inteface';

export class FetchUserDto {
  readonly id?: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly created: Date;
  readonly updated?: Date;
  readonly role?: UserRoles;
}
