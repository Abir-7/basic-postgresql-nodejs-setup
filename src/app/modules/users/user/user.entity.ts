import { EntitySchema } from "typeorm";
import { IBaseUser } from "./user.interface";

export const User = new EntitySchema<IBaseUser>({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    email: {
      type: "varchar",
      unique: true,
    },
    role: {
      type: "enum",
      enum: ["admin", "user", "guest"],
      default: "user",
    },
    password: {
      type: "varchar",
    },
    isVerified: {
      type: "boolean",
      default: false,
    },
    needToResetPass: {
      type: "boolean",
      default: false,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    authentication: {
      type: "one-to-one",
      target: "UserAuthentication",
      inverseSide: "user",
    },
    adminProfile: {
      type: "one-to-one",
      target: "AdminProfile",
      inverseSide: "user", // When the user is an admin, this relation points to the admin profile.
    },
    userProfile: {
      type: "one-to-one",
      target: "UserProfile",
      inverseSide: "user", // When the user is a standard user, this relation points to the user profile.
    },
  },
});
