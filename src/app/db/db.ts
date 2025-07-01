// Make sure to install the 'pg' package
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { appConfig } from "../config";

export const pool = new Pool({
  connectionString: appConfig.database.dataBase_uri,
});
export const db = drizzle({ client: pool });
