import { Household } from 'src/households/households.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { UserRoles } from './user.inteface';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  email: string;

  @Column()
  created: Date;

  @Column({ nullable: true })
  updated: Date;

  @Column()
  lastName: string;

  @Column({ default: [UserRoles.GUEST] })
  role: UserRoles;

  @ManyToMany(() => Household, (household) => household.members)
  households: Household[];
}
