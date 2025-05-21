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
exports.sendEmail = sendEmail;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var nodemailer_1 = __importDefault(require("nodemailer"));
var http_status_1 = __importDefault(require("http-status"));
var AppError_1 = __importDefault(require("../errors/AppError"));
var config_1 = require("../config");
var logger_1 = __importDefault(require("./logger"));
function sendEmail(email, subject, text) {
    return __awaiter(this, void 0, void 0, function () {
        var transporter, info, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    transporter = nodemailer_1.default.createTransport({
                        host: config_1.appConfig.email.host,
                        port: Number(config_1.appConfig.email.port),
                        secure: false,
                        auth: {
                            user: config_1.appConfig.email.user,
                            pass: config_1.appConfig.email.pass,
                        },
                    });
                    return [4 /*yield*/, transporter.sendMail({
                            from: "\"AiFinanceHub\" ".concat(config_1.appConfig.email.from), // Sender address
                            to: email, // Recipient's email
                            subject: "".concat(subject),
                            text: text,
                            html: "\n        <!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n          <meta charset=\"UTF-8\">\n          <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n          <title>Promotional Email</title>\n          <style>\n            /* Reset styles */\n            body, html {\n              margin: 0;\n              padding: 0;\n              font-family: Arial, sans-serif;\n            }\n    \n            /* Container styles */\n            .container {\n              max-width: 600px;\n              margin: 20px auto;\n              padding: 20px;\n              border: 1px solid #ccc;\n              border-radius: 10px;\n              background-color: #fff;\n              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n            }\n    \n            /* Header styles */\n            .header {\n              background-color: #caccd1; /* New blue background */\n              padding: 20px;\n              border-radius: 10px 10px 0 0;\n              color: #000000;\n              text-align: center;\n            }\n            .header h1 {\n              margin: 0;\n            }\n    \n            /* Content styles */\n            .content {\n              padding: 20px;\n              text-align: left;\n              font-size: 16px;\n              line-height: 1.6;\n              color: #333;\n            }\n    \n            /* Footer styles */\n            .footer {\n              background-color: #caccd1; /* New green background */\n              padding: 15px;\n              border-radius: 0 0 10px 10px;\n              text-align: center;\n              color: #000000;\n              font-size: 12px;\n            }\n    \n            /* Button styles */\n            .btn {\n              display: inline-block;\n              padding: 10px 20px;\n              margin-top: 10px;\n              background-color: #FF6600;\n              color: #fff;\n              text-decoration: none;\n              border-radius: 5px;\n              font-weight: bold;\n            }\n    \n            /* Responsive styles */\n            @media (max-width: 600px) {\n              .container {\n                padding: 10px;\n              }\n              .content {\n                font-size: 14px;\n              }\n            }\n          </style>\n        </head>\n        <body>\n          <div class=\"container\">\n            <div class=\"header\">\n              <h1>".concat(subject, "</h1>\n            </div>\n            <div class=\"content\">\n              <p>").concat(text, "</p>\n            </div>\n            <div class=\"footer\">\n              <p>&copy; ").concat(new Date().getFullYear(), " AiFinanceHub. All rights reserved.</p>\n            </div>\n          </div>\n        </body>\n        </html>\n      "),
                        })];
                case 1:
                    info = _a.sent();
                    return [2 /*return*/, info];
                case 2:
                    error_1 = _a.sent();
                    logger_1.default.error("Error sending email", error_1);
                    throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Error sending email");
                case 3: return [2 /*return*/];
            }
        });
    });
}
