"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../controllers/auth/AuthController"));
const AuthMiddleware_1 = require("../middleware/auth/AuthMiddleware");
const auth = new AuthController_1.default();
const userRouter = (0, express_1.default)();
userRouter.route("/user")
    .get(AuthMiddleware_1.checkAuth, AuthMiddleware_1.isVerify, auth.profile)
    .put(AuthMiddleware_1.checkAuth, auth.verifyUser)
    .post(auth.createUser)
    .patch(AuthMiddleware_1.checkAuth, auth.reSendCode);
userRouter.route("/login")
    .post(auth.login);
exports.default = userRouter;
