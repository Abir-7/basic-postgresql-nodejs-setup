"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var routes_1 = __importDefault(require("./app/routes"));
var http_1 = __importDefault(require("http"));
var path_1 = __importDefault(require("path"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
var noRouteFound_1 = require("./app/utils/noRouteFound");
var app = (0, express_1.default)();
var corsOption = {
    origin: ["*"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOption));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", routes_1.default);
app.get("/", function (req, res) {
    res.send("Hello World! This app name is Ai_Finance_Hub");
});
app.use(express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(noRouteFound_1.noRouteFound);
var server = http_1.default.createServer(app);
exports.default = server;
