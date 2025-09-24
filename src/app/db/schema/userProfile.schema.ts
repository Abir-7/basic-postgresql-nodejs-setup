import {
  pgTable,
  uuid,
  varchar,
  date,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { User } from "./user.schema";

import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const UserProfile = pgTable(
  "user_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    full_name: varchar("full_name").notNull(),
    date_of_birth: date("date_of_birth"),
    phone: varchar("phone"),
    address: varchar("address"),
    image: varchar("image"),
    image_id: varchar("image_id"),
    is_deleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
    user_id: uuid("user_id")
      .notNull()
      .unique() // ensures one-to-one
      .references(() => User.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("user_id_idx").on(table.user_id)]
);

export const UserProfileRelations = relations(UserProfile, ({ one }) => ({
  user: one(User, {
    fields: [UserProfile.user_id], // FK on this table
    references: [User.id], // PK on User
  }),
}));

export type UserProfileInsert = InferInsertModel<typeof UserProfile>;
export type UserProfileSelect = InferSelectModel<typeof UserProfile>;
