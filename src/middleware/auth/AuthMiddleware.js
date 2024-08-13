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
exports.checkAuth = checkAuth;
exports.isVerify = isVerify;
exports.isAdmin = isAdmin;
exports.isUser = isUser;
exports.logout = logout;
exports.validate = validate;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ResponseInterFace_1 = require("../../interfaces/ResponseInterFace");
const prisma = new client_1.PrismaClient();
function checkAuth(req, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (token == null) {
            return response.status(401).json({ "status": false, "message": "token is required" });
        }
        try {
            const user = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY);
            req.user_id = user.id;
            req.role_id = user.role_id;
            const code = user.code;
            const isFound = yield prisma.token.findMany({
                where: {
                    user_id: user.id,
                    code: code
                },
                orderBy: {
                    id: 'desc',
                },
                take: 1,
            });
            if (!isFound) {
                return response.status(401).json({ "status": false, "message": "token is blacklist" });
            }
            return next();
        }
        catch (error) {
            return response.status(401).json({ "status": false, "message": error, });
        }
    });
}
function isVerify(req, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.user_id;
        if (id == null) {
            return response.status(401).json({ "status": false, "message": "user not found" });
        }
        const user1 = yield prisma.user.findFirst({
            where: {
                id
            },
        });
        if (user1.verified) {
            req.id = user1.id;
            return next();
        }
        return response.status(401).json({ "status": false, "message": "user not verfied", });
    });
}
function isAdmin(req, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.user_id;
        if (id == null) {
            return response.status(401).json({ "status": false, "message": "user not found" });
        }
        const user1 = yield prisma.user.findFirst({
            where: {
                id
            },
        });
        if (user1.role_id == client_1.UserRoles.ADMIN) {
            return next();
        }
        return response.status(401).json({ "status": false, "message": "user not permition", });
    });
}
function isUser(req, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.user_id;
        const role_id = req.role_id;
        if (id == null) {
            return response.status(401).json({ "status": false, "message": "user not found" });
        }
        if (role_id == client_1.UserRoles.USER) {
            return next();
        }
        return response.status(401).json({ "status": false, "message": "user not permition", });
    });
}
function logout(req, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers.authorization;
        try {
            const user = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY);
            const code = user.code;
            yield prisma.token.delete({
                where: {
                    code
                }
            });
            return response.status(200).json({ "status": true, "message": "user is logout" });
        }
        catch (error) {
            return response.status(402).json({ "status": false, "message": "error logout", });
        }
    });
}
function validate(req, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, phone, email, password, gander, barthday } = req.body;
        // Validate user input
        if (!(name && phone && email && password && gander)) {
            return response.status(400).send((0, ResponseInterFace_1.errorResponse)("All Input required", "All Input required"));
        }
        if (isNaN(Date.parse(barthday))) {
            return response.status(400).send((0, ResponseInterFace_1.errorResponse)("date is not valid", "date is not valid"));
        }
        return next();
    });
}
