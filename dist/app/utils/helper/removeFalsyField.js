"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFalsyFields = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
var removeFalsyFields = function (obj) {
    return Object.fromEntries(Object.entries(obj).filter(function (_a) {
        var _ = _a[0], value = _a[1];
        return Boolean(value);
    }));
};
exports.removeFalsyFields = removeFalsyFields;
