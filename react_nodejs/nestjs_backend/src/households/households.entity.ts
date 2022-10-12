import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from 'src/users/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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
  admin: string;

  @ManyToMany(() => User, (user) => user.households)
  members: User[];
}
