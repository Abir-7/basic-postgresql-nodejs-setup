// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/app/db/schema",
  dbCredentials: {
    url: "postgresql://postgres:postgres@localhost:5432/mydatabase",
  },
});
