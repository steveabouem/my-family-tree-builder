import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity()
export class Household {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  created: Date;

  @Column()
  updated: Date;

  @Column()
  description: string;

  @ManyToMany(() => User, (user) => user.households)
  members: User[];
}
