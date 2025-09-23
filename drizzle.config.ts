import { app_config } from "./src/app/config/index";
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/app/db/schema",
  dbCredentials: {
    url: app_config.database.dataBase_uri as string,
  },
});
