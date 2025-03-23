import { EntitySchema } from "typeorm";
import { IUserProfile } from "./userProfile.interface";

export const UserProfileEntity = new EntitySchema<IUserProfile>({
  name: "UserProfile",
  tableName: "user_profiles",
  columns: {
    fullName: {
      type: "varchar",
    },
    nickname: {
      type: "varchar",
      nullable: true,
    },
    dateOfBirth: {
      type: "date",
      nullable: true,
    },
    email: {
      type: "varchar",
    },
    phone: {
      type: "varchar",
      nullable: true,
    },
    address: {
      type: "varchar",
      nullable: true,
    },
    image: {
      type: "varchar",
      nullable: true,
    },
    userId: {
      type: "uuid",
    },
  },
  relations: {
    user: {
      type: "one-to-one",
      target: "User",
      joinColumn: true,
      inverseSide: "userProfile",
    },
  },
});
