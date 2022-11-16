import { Household } from 'src/households/households.entity';
import { Task } from 'src/tasks/tasks.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Objective {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  expenses: number;

  @Column()
  budget: number;

  @Column()
  created: Date;

  @Column()
  createdBy: number;

  @Column({ nullable: true })
  updated: Date;

  @ManyToMany((type) => Household, (h) => h.objectives)
  households: Household[];

  @ManyToMany((type) => Task, (t) => t.objectives)
  tasks: Task[];
}
