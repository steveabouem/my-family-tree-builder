import { UserRoles } from '../users.inteface';

export class FetchUserDto {
  readonly id?: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly created: Date;
  readonly updated?: Date;
  readonly role?: UserRoles;
}
