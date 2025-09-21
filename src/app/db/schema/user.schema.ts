import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";

import { userRoles } from "../../middlewares/auth/auth.interface";
import { UserProfile } from "./userProfile.schema";
import { relations } from "drizzle-orm";

export const rolesEnum = pgEnum("roles", userRoles);

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
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("email_idx").on(table.email)]
);

export const UserRelations = relations(User, ({ one }) => ({
  profile: one(UserProfile),
}));
