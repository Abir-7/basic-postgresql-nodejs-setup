import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const userProfile = pgTable(
  "user_profiles",
  {
    id: t.uuid().primaryKey().defaultRandom(),

    fullName: t.varchar().notNull(),

    dateOfBirth: t.date(),

    phone: t.varchar(),

    address: t.varchar(),

    image: t.varchar(),

    isDeleted: t.boolean().default(false),

    createdAt: t.timestamp().defaultNow().notNull(),

    updatedAt: t.timestamp(),

    userId: t
      .uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [t.uniqueIndex("userId_idx").on(table.userId)]
);
