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

  @Column({ nullable: true })
  updated: Date;

  @Column()
  description: string;

  @Column()
  admin: User;

  @ManyToMany(() => User, (user) => user.households)
  members: User[];
}
