import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { User } from "./user.schema";

export const UserProfile = pgTable(
  "user_profiles",
  {
    id: t.uuid().primaryKey().defaultRandom(),

    full_name: t.varchar().notNull(),

    date_of_birth: t.date(),

    phone: t.varchar(),

    address: t.varchar(),

    image: t.varchar(),

    is_deleted: t.boolean().default(false),

    createdAt: t.timestamp().defaultNow().notNull(),

    updatedAt: t.timestamp(),

    user_id: t
      .uuid()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
  },
  (table) => [t.uniqueIndex("userId_idx").on(table.user_id)]
);
