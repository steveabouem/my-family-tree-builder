import { Household } from 'src/households/households.entity';
import { Task } from 'src/tasks/tasks.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Objective {
  @PrimaryGeneratedColumn()
  id: number;

  /**TODO: Embedded entities pattern*/
  @Column({ default: 'auto' })
  itemName: string;

  @Column({ nullable: true })
  itemDescription: string;

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

  @Column({ nullable: true })
  expenses: number;

  @Column({ nullable: true })
  budget: number;

  @ManyToMany((type) => Household, (h) => h.objectives)
  @JoinTable({
    name: 'households_objectives',
    joinColumn: {
      name: 'objectives',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'households',
      referencedColumnName: 'id',
    },
  })
  households: Household[];

  @ManyToMany((type) => Task, (t) => t.objectives)
  tasks: Task[];
}
