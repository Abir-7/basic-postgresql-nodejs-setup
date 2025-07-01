import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { userRoles } from "../../middlewares/auth/auth.interface";
import * as t from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", userRoles);

export const users = pgTable(
  "users",
  {
    id: t.uuid().primaryKey().defaultRandom(),
    email: t.varchar().notNull(),
    role: rolesEnum().default("USER"),
    password: t.varchar(),
    isVerified: t.boolean().default(false),
    needToResetPass: t.boolean().default(false),
    isBlocked: t.boolean().default(false),
    isDeleted: t.boolean().default(false),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t.timestamp(),
  },
  (table) => [t.uniqueIndex("email_idx").on(table.email)]
);
