import { appConfig } from "./src/app/config/index";
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/app/db/schema",
  dbCredentials: {
    url: appConfig.database.dataBase_uri as string,
  },
});
