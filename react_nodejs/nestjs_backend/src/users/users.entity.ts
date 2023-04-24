import { CreatedAndUpdatedBy } from 'src/common/entities/global-column-types';
import { Household } from 'src/households/households.entity';
import { Task } from 'src/tasks/tasks.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { UserRoles } from './users.inteface';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  /**TODO: Embedded entities pattern*/
  @Column({ default: () => 'NOW()' })
  recordCreated: Date;

  @Column({ nullable: true })
  recordUpdated: Date;

  // TODO: check readme
  @Column({ nullable: true })
  recordCreatedBy: number;

  @Column({ nullable: true })
  recordUpdatedBy: number;
  /*End*/

  @Column()
  firstName: string;

  @Column()
  email: string;

  @Column()
  lastName: string;

  @Column('simple-array')
  roles: UserRoles[];

  @ManyToMany((type) => Household, (h) => h.objectives)
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

  @OneToMany((type) => Task, (t) => t.recordCreatedBy)
  tasks: Task[];
}
