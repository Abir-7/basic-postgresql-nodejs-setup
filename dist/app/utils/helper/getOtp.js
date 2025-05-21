"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getOtp = function (digits) {
    var min = Math.pow(10, digits - 1);
    var max = Math.pow(10, digits) - 1;
    var otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp;
};
exports.default = getOtp;
