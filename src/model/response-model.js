"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorModel = exports.SuccessModel = void 0;
class SuccessModel {
    constructor(data, msg = '') {
        this.code = 0;
        this.data = data;
        this.msg = msg;
    }
}
exports.SuccessModel = SuccessModel;
class ErrorModel {
    constructor(msg) {
        this.code = -1;
        this.data = null;
        this.msg = msg;
    }
}
exports.ErrorModel = ErrorModel;
