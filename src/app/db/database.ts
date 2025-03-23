import { DataSource } from "typeorm";
import { AdminProfileEntity } from "../modules/users/adminProfile/adminProfile.entity";
import { UserProfileEntity } from "../modules/users/userProfile/userProfile.entity";
import { UserEntity } from "../modules/users/user/user.entity";

export const myDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "017016",
  database: "testdb",
  entities: [AdminProfileEntity, UserProfileEntity, UserEntity],
  logging: true,
  synchronize: true,
});
