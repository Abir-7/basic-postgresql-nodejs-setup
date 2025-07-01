import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const userAuthentication = pgTable(
  "user_authentication",
  {
    id: t.uuid().primaryKey().defaultRandom(),

    expDate: t.timestamp(), // nullable timestamp

    otp: t.varchar(), // nullable bigint

    token: t.varchar(), // nullable varchar

    userId: t
      .uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [t.uniqueIndex("user_authentication_user_id_idx").on(table.userId)]
);
