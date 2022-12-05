import {
  CreatedAndUpdatedBy,
  NameAndDesc,
} from 'src/common/entities/global-column-types';
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

  /**TODO: Embedded entities pattern*/
  @Column({ default: 'auto' })
  itemName: string;

  @Column({ nullable: true })
  itemDescription: string;

  @Column({ default: () => 'NOW()' })
  recordCreated: Date;

  @Column({ nullable: true })
  recordUpdated: Date;

  @Column({ nullable: true })
  recordCreatedBy: number;

  @Column({ nullable: true })
  recordUpdatedBy: number;
  /*End*/

  @ManyToMany((type) => Objective, (o) => o.tasks)
  objectives: Objective[];
}
