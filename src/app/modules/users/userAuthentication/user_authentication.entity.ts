import { EntitySchema } from "typeorm";
import { IUserAuthentication } from "./user_authentication.interface";

export const UserAuthentication = new EntitySchema<IUserAuthentication>({
  name: "UserAuthentication",
  tableName: "user_authentication",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    expDate: {
      type: "date",
      default: null,
    },
    otp: {
      type: "int64",
      default: null,
    },
    token: {
      type: "varchar",
      default: null,
    },
    userId: {
      type: "uuid",
      nullable: false,
    },
  },
  relations: {
    user: {
      type: "one-to-one",
      target: "User",
      joinColumn: { name: "userId" },
      onDelete: "CASCADE",
    },
  },
});
