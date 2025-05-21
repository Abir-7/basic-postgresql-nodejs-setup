"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var typeorm_1 = require("typeorm");
var user_authentication_entity_1 = require("../userAuthentication/user_authentication.entity");
var adminProfile_entity_1 = require("../adminProfile/adminProfile.entity");
var userProfile_entity_1 = require("../userProfile/userProfile.entity");
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], User.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", unique: true }),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "enum", enum: ["admin", "user", "guest"], default: "user" }),
        __metadata("design:type", Object)
    ], User.prototype, "role", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar" }),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "boolean", default: false }),
        __metadata("design:type", Boolean)
    ], User.prototype, "isVerified", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "boolean", default: false }),
        __metadata("design:type", Boolean)
    ], User.prototype, "needToResetPass", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
        __metadata("design:type", Date)
    ], User.prototype, "createdAt", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
        __metadata("design:type", Date)
    ], User.prototype, "updatedAt", void 0);
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return user_authentication_entity_1.UserAuthentication; }, function (authentication) { return authentication.user; }, {
            cascade: true,
            eager: true, // load automatically with User; optional
        }),
        (0, typeorm_1.JoinColumn)() // owns the relation (FK stored here)
        ,
        __metadata("design:type", user_authentication_entity_1.UserAuthentication)
    ], User.prototype, "authentication", void 0);
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return adminProfile_entity_1.AdminProfile; }, function (adminProfile) { return adminProfile.user; }, {
            cascade: true,
            eager: true,
        }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", adminProfile_entity_1.AdminProfile)
    ], User.prototype, "adminProfile", void 0);
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return userProfile_entity_1.UserProfile; }, function (userProfile) { return userProfile.user; }, {
            cascade: true,
            eager: true,
        }),
        (0, typeorm_1.JoinColumn)(),
        __metadata("design:type", userProfile_entity_1.UserProfile)
    ], User.prototype, "userProfile", void 0);
    User = __decorate([
        (0, typeorm_1.Entity)({ name: "users" })
    ], User);
    return User;
}());
exports.User = User;
