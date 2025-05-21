import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user/user.entity";

export interface IUserProfile {
  id: string;
  fullName: string;
  nickname?: string;
  dateOfBirth?: Date;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
  user: User;
}

@Entity({ name: "user_profiles" })
export class UserProfile {
  @PrimaryGeneratedColumn("uuid")
  id!: string; // you should add an ID column, missing in EntitySchema

  @Column({ type: "varchar" })
  fullName!: string;

  @Column({ type: "varchar", nullable: true })
  nickname?: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth?: Date;

  @Column({ type: "varchar" })
  email!: string;

  @Column({ type: "varchar", nullable: true })
  phone?: string;

  @Column({ type: "varchar", nullable: true })
  address?: string;

  @Column({ type: "varchar", nullable: true })
  image?: string;

  // Relation with User entity - One-to-One
  @OneToOne(() => User, (user) => user.userProfile)
  user!: User;
}
