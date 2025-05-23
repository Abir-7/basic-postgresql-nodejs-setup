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
import { AdminProfile } from "../adminProfile/adminProfile.entity";
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

  @OneToOne(() => AdminProfile, (adminProfile) => adminProfile, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  adminProfile?: AdminProfile;

  @OneToOne(() => UserProfile, (userProfile) => userProfile, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  userProfile?: UserProfile;
}
