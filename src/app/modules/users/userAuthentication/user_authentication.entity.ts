import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "user_authentication" })
export class UserAuthentication {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "timestamp", nullable: true, default: null })
  expDate!: Date | null;

  @Column({ type: "bigint", nullable: true, default: null })
  otp!: string | null;

  @Column({ type: "varchar", nullable: true, default: null })
  token!: string | null;
}
