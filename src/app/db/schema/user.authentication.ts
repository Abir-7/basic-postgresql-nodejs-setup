import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { User } from "./user.schema";

export const UserAuthentication = pgTable(
  "user_authentications",
  {
    id: t.uuid().primaryKey().defaultRandom(),

    exp_date: t.timestamp(), // nullable timestamp

    otp: t.varchar(), // nullable bigint

    token: t.varchar(), // nullable varchar

    user_id: t
      .uuid()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
  },
  (table) => [
    t.uniqueIndex("user_authentication_user_id_idx").on(table.user_id),
  ]
);
