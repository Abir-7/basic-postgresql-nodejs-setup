"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getExpiryTime = function (minutes) {
    if (minutes === void 0) { minutes = 10; }
    var now = new Date();
    now.setMinutes(now.getMinutes() + minutes); // Add 10 minutes to the current time
    return now;
};
exports.default = getExpiryTime;
