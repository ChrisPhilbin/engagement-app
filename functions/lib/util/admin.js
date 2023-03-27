"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = exports.db = exports.admin = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const config_1 = require("./config");
const storage_1 = require("firebase-admin/storage");
exports.admin = firebase_admin_1.default.initializeApp(config_1.config);
exports.db = exports.admin.firestore();
exports.bucket = (0, storage_1.getStorage)().bucket("profile-pictures");
//# sourceMappingURL=admin.js.map