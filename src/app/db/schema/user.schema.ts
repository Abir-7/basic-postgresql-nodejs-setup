import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";

import { user_roles } from "../../middlewares/auth/auth.interface";

import { relations } from "drizzle-orm";
import { UserAuthentication } from "./user.authentication";
import { UserProfile } from "./userProfile.schema";

export const rolesEnum = pgEnum("roles", user_roles);

export const User = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email").notNull().unique(),
    role: rolesEnum().default("USER"),
    password: varchar("password").notNull(),
    is_verified: boolean("is_verified").default(false),
    need_to_reset_pass: boolean("need_to_reset_pass").default(false),
    is_blocked: boolean("is_blocked").default(false),
    is_deleted: boolean("is_deleted").default(false),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("email_idx").on(table.email)]
);

export const UserRelations = relations(User, ({ one }) => ({
  profile: one(UserProfile),
  auth_data: one(UserAuthentication),
}));
