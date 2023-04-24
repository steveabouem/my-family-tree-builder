import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Objective } from 'src/objectives/objectives.entity';

@Entity()
export class Household {
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

  @Column()
  admin: number;

  @ManyToMany((type) => User, (u) => u.households, {
    eager: true,
    cascade: true,
  })
  members: User[];

  @ManyToMany((type) => Objective, (o) => o.households, {
    eager: true,
    cascade: true,
  })
  objectives: Objective[];
}
