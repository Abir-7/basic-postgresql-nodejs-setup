"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myDataSource = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../modules/users/user/user.entity");
var userProfile_entity_1 = require("../modules/users/userProfile/userProfile.entity");
var adminProfile_entity_1 = require("../modules/users/adminProfile/adminProfile.entity");
var user_authentication_entity_1 = require("../modules/users/userAuthentication/user_authentication.entity");
exports.myDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "testdb",
    entities: [user_entity_1.User, userProfile_entity_1.UserProfile, adminProfile_entity_1.AdminProfile, user_authentication_entity_1.UserAuthentication],
    //logging: true,
    synchronize: true,
});
