"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = void 0;
let isObject = (obj) => obj && obj.constructor && obj.constructor === Object;
exports.isObject = isObject;
