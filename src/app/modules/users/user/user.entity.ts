import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { UserAuthentication } from "../userAuthentication/user_authentication.entity";

import { UserProfile } from "../userProfile/userProfile.entity";
import {
  TUserRole,
  userRole,
  userRoles,
} from "../../../middlewares/auth/auth.interface";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "enum", enum: userRole, default: userRoles.USER })
  role!: TUserRole;

  @Column({ type: "varchar" })
  password!: string;

  @Column({ type: "boolean", default: false })
  isVerified!: boolean;

  @Column({ type: "boolean", default: false })
  needToResetPass!: boolean;

  @Column({ type: "boolean", default: false })
  isDeleted!: boolean;

  @Column({ type: "boolean", default: false })
  isBlocked!: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @OneToOne(() => UserAuthentication, (authentication) => authentication, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  authentication!: UserAuthentication;

  @OneToOne(() => UserProfile, (userProfile) => userProfile, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  userProfile?: UserProfile;
}
