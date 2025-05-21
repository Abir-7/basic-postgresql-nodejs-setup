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
exports.AuthController = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
var http_status_1 = __importDefault(require("http-status"));
var catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
var sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
var auth_service_1 = require("./auth.service");
var userLogin = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, auth_service_1.AuthService.userLogin(req.body)];
            case 1:
                result = _a.sent();
                // res.cookie("refreshToken", result.refreshToken, {
                //   secure: appConfig.server.node_env === "production",
                //   httpOnly: true,
                // });
                (0, sendResponse_1.default)(res, {
                    success: true,
                    statusCode: http_status_1.default.OK,
                    message: "User login successfull",
                    data: result,
                });
                return [2 /*return*/];
        }
    });
}); });
var verifyUser = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, otp = _a.otp;
                return [4 /*yield*/, auth_service_1.AuthService.verifyUser(email, Number(otp))];
            case 1:
                result = _b.sent();
                (0, sendResponse_1.default)(res, {
                    success: true,
                    statusCode: http_status_1.default.OK,
                    message: "Email successfully verified.",
                    data: result,
                });
                return [2 /*return*/];
        }
    });
}); });
var forgotPasswordRequest = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                return [4 /*yield*/, auth_service_1.AuthService.forgotPasswordRequest(email)];
            case 1:
                result = _a.sent();
                (0, sendResponse_1.default)(res, {
                    success: true,
                    statusCode: http_status_1.default.OK,
                    message: "A verification code is sent to your email.",
                    data: result,
                });
                return [2 /*return*/];
        }
    });
}); });
var resetPassword = (0, catchAsync_1.default)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenWithBearer, token, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tokenWithBearer = req.headers.authorization;
                token = tokenWithBearer.split(" ")[1];
                return [4 /*yield*/, auth_service_1.AuthService.resetPassword(token, req.body)];
            case 1:
                result = _a.sent();
                (0, sendResponse_1.default)(res, {
                    success: true,
                    statusCode: http_status_1.default.OK,
                    message: "Password reset successfully",
                    data: result,
                });
                return [2 /*return*/];
        }
    });
}); });
var getNewAccessToken = (0, catchAsync_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                refreshToken = req.cookies.refreshToken;
                return [4 /*yield*/, auth_service_1.AuthService.getNewAccessToken(refreshToken)];
            case 1:
                result = _a.sent();
                (0, sendResponse_1.default)(res, {
                    data: result,
                    success: true,
                    statusCode: http_status_1.default.OK,
                    message: "New access-token is created.",
                });
                return [2 /*return*/];
        }
    });
}); });
var updatePassword = (0, catchAsync_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user.userId;
                return [4 /*yield*/, auth_service_1.AuthService.updatePassword(userId, req.body)];
            case 1:
                result = _a.sent();
                (0, sendResponse_1.default)(res, {
                    data: result,
                    success: true,
                    statusCode: http_status_1.default.OK,
                    message: "Password successfully updated",
                });
                return [2 /*return*/];
        }
    });
}); });
exports.AuthController = {
    verifyUser: verifyUser,
    forgotPasswordRequest: forgotPasswordRequest,
    resetPassword: resetPassword,
    userLogin: userLogin,
    getNewAccessToken: getNewAccessToken,
    updatePassword: updatePassword,
};
