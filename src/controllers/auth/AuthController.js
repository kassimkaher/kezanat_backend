"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = __importDefault(require("../../services/AuthService"));
const authService = new AuthService_1.default();
class AuthController {
    constructor() {
        authService.createAdmin();
    }
    createUser(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return authService.create(req, response);
        });
    }
    updateUser(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return authService.update(req, response);
        });
    }
    verifyUser(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return authService.verifyUser(req, response);
        });
    }
    reSendCode(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return authService.reSendCode(req, response);
        });
    }
    login(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return authService.login(req, response);
        });
    }
    profile(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return authService.profile(req, response);
        });
    }
    getUsers(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return authService.getUsers(req, response);
        });
    }
}
exports.default = AuthController;
