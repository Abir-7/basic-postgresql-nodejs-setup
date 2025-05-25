import { DataSource } from "typeorm";
import { User } from "../modules/users/user/user.entity";
import { UserProfile } from "../modules/users/userProfile/userProfile.entity";

import { UserAuthentication } from "../modules/users/userAuthentication/user_authentication.entity";

export const myDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "017016",
  //password: "postgres", office
  database: "testdb",
  entities: [User, UserProfile, UserAuthentication],
  //logging: true,
  synchronize: true,
});
