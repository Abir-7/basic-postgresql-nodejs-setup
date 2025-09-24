// Make sure to install the 'pg' package

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { app_config } from "../config";
import { User, UserRelations } from "./schema/user.schema";

import {
  UserAuthentication,
  UserAuthenticationRelations,
} from "./schema/user.authentication";
import { UserProfile, UserProfileRelations } from "./schema/userProfile.schema";

export const pool = new Pool({
  connectionString: app_config.database.dataBase_uri,
});
export const db = drizzle(pool, {
  schema: {
    User,
    UserProfile,
    UserAuthentication,
    //-------------------//
    UserProfileRelations,
    UserRelations,
    UserAuthenticationRelations,
  },
});
