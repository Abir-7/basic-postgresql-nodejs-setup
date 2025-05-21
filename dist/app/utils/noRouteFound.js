"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noRouteFound = void 0;
var noRouteFound = function (req, res, next) {
    res.status(404).send({
        success: false,
        statusCode: 404,
        message: "Api not found!",
    });
};
exports.noRouteFound = noRouteFound;
