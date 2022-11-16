import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { Objective } from 'src/objectives/objectives.entity';

@Entity()
export class Household {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  created: Date;

  @Column({ nullable: true })
  updated: Date;

  @Column()
  description: string;

  @Column()
  admin: number;

  @ManyToMany((type) => User, (u) => u.households, {
    eager: true,
    cascade: true,
  })
  members: User[];

  @ManyToMany((type) => Objective, (o) => o.households)
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
  objectives: Objective[];
}
