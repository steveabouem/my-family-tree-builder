import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from 'src/users/users.entity';

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
  admin_id: string;

  @ManyToMany((type) => User, (user) => user.households, {
    eager: true,
    cascade: true,
  })
  members: User[];
}
