import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user/user.entity";

export interface IAdminProfile {
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

@Entity({ name: "admin_profiles" })
export class AdminProfile {
  @PrimaryGeneratedColumn("uuid")
  id!: string; // add primary key column

  @Column({ type: "varchar" })
  fullName!: string;

  @Column({ type: "varchar", nullable: true })
  nickname?: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth?: Date;

  @Column({ type: "varchar", nullable: true })
  phone?: string;

  @Column({ type: "varchar", nullable: true })
  address?: string;

  @Column({ type: "varchar", nullable: true })
  image?: string;
}
