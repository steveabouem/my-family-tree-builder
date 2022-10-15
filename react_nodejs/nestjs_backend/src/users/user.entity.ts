import { Household } from 'src/households/households.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoles } from './user.inteface';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  email: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn({ nullable: true })
  updated: Date;

  @Column()
  lastName: string;

  @Column('simple-array')
  roles: UserRoles[];

  @ManyToMany((type) => Household, (household) => household.members)
  @JoinTable({
    name: 'household_users',
    joinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'household',
      referencedColumnName: 'id',
    },
  })
  households: Household[];
}
