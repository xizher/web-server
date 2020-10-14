"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsignedIntegerRegExp = exports.numberRegExp = exports.emailRegExp = exports.passwordRegExp = exports.usernameRegExp = void 0;
exports.usernameRegExp = /^([a-zA-Z0-9_\u4e00-\u9fa5]{1,20})$/;
exports.passwordRegExp = /^[a-zA-Z0-9_]+$/;
exports.emailRegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
exports.numberRegExp = /^[0-9]+$/;
exports.unsignedIntegerRegExp = /^[+]{0,1}(\d+)$/;
