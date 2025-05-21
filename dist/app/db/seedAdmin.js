"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_interface_1 = require("../middlewares/auth/auth.interface");
var adminProfile_entity_1 = require("../modules/users/adminProfile/adminProfile.entity");
var user_entity_1 = require("../modules/users/user/user.entity");
var getHashedPassword_1 = __importDefault(require("../utils/helper/getHashedPassword"));
var database_1 = require("./database");
function seedAdmin() {
    return __awaiter(this, void 0, void 0, function () {
        var adminData, userRepo, existingAdmin, adminUser, adminProfile, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {
                        email: "admin@example.com"
                    };
                    return [4 /*yield*/, (0, getHashedPassword_1.default)("admin123")];
                case 1:
                    adminData = (_a.password = _b.sent(),
                        _a.role = auth_interface_1.userRoles.SUPER_ADMIN,
                        _a.isVerified = true,
                        _a.needToResetPass = false,
                        _a);
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 8, , 9]);
                    userRepo = database_1.myDataSource.getRepository(user_entity_1.User);
                    return [4 /*yield*/, userRepo.findOne({
                            where: { role: adminData.role },
                        })];
                case 3:
                    existingAdmin = _b.sent();
                    if (!existingAdmin) return [3 /*break*/, 5];
                    console.log("Admin user already exists, skipping seed.");
                    return [4 /*yield*/, database_1.myDataSource.destroy()];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
                case 5:
                    adminUser = userRepo.create(adminData);
                    adminProfile = new adminProfile_entity_1.AdminProfile();
                    adminProfile.fullName = "Default Admin";
                    adminProfile.email = adminUser.email;
                    adminProfile.user = adminUser;
                    adminUser.adminProfile = adminProfile;
                    // 4. Save user with cascade for adminProfile
                    return [4 /*yield*/, userRepo.save(adminUser)];
                case 6:
                    // 4. Save user with cascade for adminProfile
                    _b.sent();
                    console.log("Admin user seeded successfully!");
                    return [4 /*yield*/, database_1.myDataSource.destroy()];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _b.sent();
                    console.error("Error seeding admin user:", err_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
