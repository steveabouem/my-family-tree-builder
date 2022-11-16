import { Objective } from 'src/objectives/objectives.entity';
import { User } from 'src/users/users.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  expense: number;

  @Column()
  created: Date;

  @Column({ nullable: true })
  updated: Date;

  @ManyToOne((type) => User, (u) => u.tasks)
  createdBy: User;

  @ManyToMany((type) => Objective, (o) => o.tasks)
  objectives: Objective[];
}
