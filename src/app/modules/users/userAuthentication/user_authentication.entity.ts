import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../user/user.entity";

export interface IUserAuthentication {
  id: string;
  expDate: Date | null;
  otp: number | null;
  token: string | null;
  user: User;
}

@Entity({ name: "user_authentication" })
export class UserAuthentication {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "date", nullable: true, default: null })
  expDate!: Date | null;

  @Column({ type: "bigint", nullable: true, default: null })
  otp!: number | null;

  @Column({ type: "varchar", nullable: true, default: null })
  token!: string | null;

  // One-to-one relation with User entity
  @OneToOne(() => User, (user) => user.authentication, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" }) // owns the FK column userId
  user!: User;
}
