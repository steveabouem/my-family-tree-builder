import { Household } from 'src/households/households.entity';
import { Task } from 'src/tasks/tasks.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRoles } from './users.inteface';

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

  @ManyToMany((type) => Household, (h) => h.members)
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

  @OneToMany((type) => Task, (t) => t.createdBy)
  tasks: Task[];
}
