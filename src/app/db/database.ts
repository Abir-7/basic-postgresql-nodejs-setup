import { DataSource } from "typeorm";

export const myDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "017016",
  database: "testdb",
  entities: [],
  logging: true,
  synchronize: true,
});
