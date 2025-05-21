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
exports.UserAuthentication = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../user/user.entity");
var UserAuthentication = /** @class */ (function () {
    function UserAuthentication() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], UserAuthentication.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "date", nullable: true, default: null }),
        __metadata("design:type", Object)
    ], UserAuthentication.prototype, "expDate", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "bigint", nullable: true, default: null }),
        __metadata("design:type", Object)
    ], UserAuthentication.prototype, "otp", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true, default: null }),
        __metadata("design:type", Object)
    ], UserAuthentication.prototype, "token", void 0);
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return user_entity_1.User; }, function (user) { return user.authentication; }, {
            onDelete: "CASCADE",
        }),
        (0, typeorm_1.JoinColumn)({ name: "userId" }) // owns the FK column userId
        ,
        __metadata("design:type", user_entity_1.User)
    ], UserAuthentication.prototype, "user", void 0);
    UserAuthentication = __decorate([
        (0, typeorm_1.Entity)({ name: "user_authentication" })
    ], UserAuthentication);
    return UserAuthentication;
}());
exports.UserAuthentication = UserAuthentication;
