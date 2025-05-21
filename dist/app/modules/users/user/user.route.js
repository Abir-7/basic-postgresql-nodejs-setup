"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
var express_1 = require("express");
var user_controller_1 = require("./user.controller");
var user_validation_1 = require("./user.validation");
var zodValidator_1 = __importDefault(require("../../../middlewares/zodValidator"));
var auth_1 = require("../../../middlewares/auth/auth");
var fileUploadHandler_1 = require("../../../middlewares/fileUpload/fileUploadHandler");
var router = (0, express_1.Router)();
router.post("/create-user", (0, zodValidator_1.default)(user_validation_1.zodCreateUserSchema), user_controller_1.UserController.createUser);
router.patch("/update-profile-image", (0, auth_1.auth)("SUPER_ADMIN", "USER"), fileUploadHandler_1.upload.single("file"), user_controller_1.UserController.updateProfileImage);
router.patch("/update-profile-data", (0, auth_1.auth)("SUPER_ADMIN", "USER"), user_controller_1.UserController.updateProfileData);
exports.UserRoute = router;
