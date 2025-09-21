import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { User } from "./user.schema";

export const UserAuthentication = pgTable(
  "user_authentication",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    exp_date: timestamp("exp_date"), // nullable
    otp: varchar("otp"), // nullable
    token: varchar("token"), // nullable
    user_id: uuid("user_id")
      .notNull()
      .unique() // ensures one-to-one
      .references(() => User.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("user_authentication_user_id_idx").on(table.user_id)]
);

export const UserAuthenticationRelations = relations(
  UserAuthentication,
  ({ one }) => ({
    user: one(User, {
      fields: [UserAuthentication.user_id], // FK on this table
      references: [User.id], // PK on User
    }),
  })
);
