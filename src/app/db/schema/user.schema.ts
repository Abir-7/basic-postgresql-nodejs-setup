import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { userRoles } from "../../middlewares/auth/auth.interface";
import * as t from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", userRoles);

export const User = pgTable(
  "users",
  {
    id: t.uuid().primaryKey().defaultRandom(),
    email: t.varchar().notNull(),
    role: rolesEnum().default("USER"),
    password: t.varchar(),
    is_verified: t.boolean().default(false),
    need_to_reset_pass: t.boolean().default(false),
    is_blocked: t.boolean().default(false),
    is_deleted: t.boolean().default(false),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t.timestamp(),
  },
  (table) => [t.uniqueIndex("email_idx").on(table.email)]
);
