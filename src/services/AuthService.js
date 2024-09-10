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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const ResponseInterFace_1 = require("../interfaces/ResponseInterFace");
const prisma = new client_1.PrismaClient();
const MailService_1 = __importDefault(require("../services/MailService"));
const functions_1 = require("../utils/functions");
const mailService = new MailService_1.default();
class AuthService {
    constructor() {
    }
    createAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield prisma.user.findUnique({
                where: {
                    phone: "9647700000000"
                }
            });
            if (admin != null) {
                return;
            }
            const sal = yield bcrypt_1.default.genSalt(10);
            const hashpasswowrd = yield bcrypt_1.default.hash("12345678", sal);
            const user = yield prisma.user.create({
                data: {
                    name: "admin",
                    phone: "9647700000000",
                    email: "admin@admin.com",
                    password: hashpasswowrd,
                    gander: "gander",
                    onesignal_id: null,
                    role_id: client_1.UserRoles.ADMIN,
                    code: '12345678',
                    verified: true,
                    verified_date: new Date(),
                    enable: true,
                    barthday: new Date(),
                }
            });
        });
    }
    create(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, phone, email, password, gander, barthday } = req.body;
            // Validate user input
            if (!(name && phone && email && password && gander)) {
                return response.status(400).send((0, ResponseInterFace_1.errorResponse)("All Input required", "All Input required"));
            }
            if (isNaN(Date.parse(barthday))) {
                return response.status(400).send((0, ResponseInterFace_1.errorResponse)("date is not valid", "date is not valid"));
            }
            const oldUser = yield prisma.user.findFirst({
                where: {
                    OR: [
                        {
                            email: email,
                        },
                        {
                            phone: phone,
                        },
                    ],
                },
            });
            if (oldUser) {
                return response.status(400).send((0, ResponseInterFace_1.errorResponse)("email  or phone is used", "email  or phone is used"));
            }
            try {
                const sal = yield bcrypt_1.default.genSalt(10);
                const hashpasswowrd = yield bcrypt_1.default.hash(password, sal);
                const newCode = otp_generator_1.default.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
                const user = yield prisma.user.create({
                    data: {
                        name: name,
                        phone: phone,
                        email: email,
                        password: hashpasswowrd,
                        gander: gander,
                        onesignal_id: null,
                        role_id: "USER",
                        code: newCode,
                        verified_date: new Date(),
                        barthday: new Date(barthday),
                        enable: true
                    }
                });
                mailService.sendCode(newCode, user.email);
                // Create token
                const token = jsonwebtoken_1.default.sign({ id: user.id, role_id: user.role_id, code: newCode }, process.env.TOKEN_KEY, {
                    expiresIn: "1d",
                });
                return response.send((0, ResponseInterFace_1.sucessResponse)("account created", token));
            }
            catch (error) {
                console.error(error);
                return response.status(400).send((0, ResponseInterFace_1.errorResponse)("catch error", error));
            }
        });
    }
    update(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, phone, email, gander, jop_title_id, parthday, onesignal_id } = req.body;
            // Validate user input
            if (!(name && phone && email && gander && jop_title_id && parthday)) {
                return response.status(402).send({ "status": false, "message": "All Input required" });
            }
            const oldUser = yield prisma.user.findFirst({
                where: {
                    id: req.user_id
                },
            });
            if (!oldUser) {
                return response.status(402).send({ "status": false, "message": "account not found" });
            }
            try {
                yield prisma.user.update({
                    where: {
                        id: req.user_id
                    },
                    data: {
                        name,
                        phone,
                        email: email,
                        gander: gander,
                        onesignal_id,
                        barthday: new Date(req.body.parthday),
                    }
                });
                return response.send({ "status": true, "message": "sucess" });
            }
            catch (error) {
                console.error(error);
                return response.status(402).send({ "status": false, "message": req.user_id });
            }
        });
    }
    verifyUser(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.body;
            const id = req.user_id;
            // Validate user input
            if (!(code && id)) {
                return response.status(400).send({ "status": 1, "message": "All Input required" });
            }
            const user = yield prisma.user.findFirst({
                where: {
                    id
                },
                include: {
                // address: true,
                // company: {
                //     include: {
                //         certificate_image: true
                //     }
                // },
                // profile_image: true
                }
            });
            if (!user) {
                return response.status(402).send({ "status": 2, "message": "user not found " });
            }
            try {
                var dif = (new Date().getTime() - user.verified_date.getTime()) / 1000;
                if (dif > 120) {
                    return response.status(403).send({ "status": false, "message": "code is expire" });
                }
                if (user.code == code) {
                    const user2 = yield prisma.user.update({
                        where: {
                            email: user.email
                        },
                        data: {
                            verified: true
                        }
                    });
                    const token = jsonwebtoken_1.default.sign({ id: user.id, role_id: user.role_id, code: code }, process.env.TOKEN_KEY, {
                        expiresIn: "1d",
                    });
                    yield prisma.token.create({
                        data: {
                            user_id: user.id,
                            code: code
                        }
                    });
                    return response.send({ "status": true, token: token, data: user });
                }
                return response.status(403).send({ "status": true, "data": "code not correct" });
            }
            catch (error) {
                console.error(error);
                return response.status(402).send({ "status": false, "message": error });
            }
        });
    }
    reSendCode(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.user_id;
            //    console.error(req)
            // Validate user input
            if (!(id)) {
                return response.status(402).send({ "status": false, "message": "All Input required" });
            }
            const user = yield prisma.user.findFirst({
                where: {
                    id
                },
            });
            if (!user) {
                return response.status(402).send({ "status": false, "message": "user not found " });
            }
            try {
                const newCode = otp_generator_1.default.generate(6, { upperCaseAlphabets: true, specialChars: false });
                const user2 = yield prisma.user.update({
                    where: {
                        email: user.email
                    },
                    data: {
                        code: newCode,
                        verified_date: new Date()
                    }
                });
                mailService.sendCode(newCode, user.email);
                return response.send({ "status": true, "data": "code is resent" });
            }
            catch (error) {
                console.error(error);
                return response.status(402).send({ "status": false, "message": error });
            }
        });
    }
    login(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = req.session;
            const { phone, email, password } = req.body;
            // Validate user input
            if (!((phone || email) && password)) {
                return response.status(400).send((0, ResponseInterFace_1.errorResponse)("All Input required", "All Input required"));
            }
            const user = yield prisma.user.findFirst({
                where: {
                    OR: [{ phone, email }]
                },
            });
            const pass = user ? yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password) : null;
            if (user == null || !pass) {
                return response.status(400).send((0, ResponseInterFace_1.errorResponse)("user not found", "user not found"));
            }
            try {
                const newCode = otp_generator_1.default.generate(16, { upperCaseAlphabets: false, specialChars: false });
                // Create token
                const token = jsonwebtoken_1.default.sign({ id: user.id, role_id: user.role_id }, process.env.TOKEN_KEY, {
                    expiresIn: "1d",
                });
                yield prisma.token.create({
                    data: {
                        user_id: user.id,
                        code: newCode
                    }
                });
                if (!(user === null || user === void 0 ? void 0 : user.verified)) {
                    (0, functions_1.kdp)("" + process.env.TOKEN_KEY, 'm');
                    mailService.sendCode(user.code, user.email);
                    return response.status(402).send((0, ResponseInterFace_1.needVerifiyResponse)(token));
                }
                if (user.role_id == client_1.UserRoles.USER || user.role_id == client_1.UserRoles.ADMIN) {
                    let us = exclude(user, "password");
                    us["token"] = token;
                    return response.send((0, ResponseInterFace_1.sucessResponse)("sucess", us));
                }
                if (user.role_id == client_1.UserRoles.COMPANY && user.enable) {
                    let us = exclude(user, "password");
                    us["token"] = token;
                    return response.send((0, ResponseInterFace_1.sucessResponse)("sucess", us));
                }
                else {
                    return response.status(400).send((0, ResponseInterFace_1.errorResponse)("complete company info", "user not enable"));
                }
            }
            catch (error) {
                return response.status(400).send((0, ResponseInterFace_1.errorResponse)("catch error", error));
            }
        });
    }
    profile(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization;
            if (token == null) {
                return response.status(401).json((0, ResponseInterFace_1.errorResponse)("token is expire", "token not found"));
            }
            try {
                const user1 = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY);
                const userData = yield prisma.user.findFirst({
                    where: {
                        id: user1.id,
                    },
                    // include: {
                    //     jop_title: true,
                    //     // expereance:true,
                    //     address: true,
                    //     company: {
                    //         include: {
                    //             certificate_image: true
                    //         }
                    //     },
                    //     profile_image: true
                    // }
                });
                userData.password = "";
                //  delete userData!.password!;
                const userWithoutPassword = exclude(userData, 'password');
                if (userData != null) {
                    return response.send({ "status": true, "data": userWithoutPassword });
                }
                return response.status(402).send({ "status": false, "message": "user data null" });
            }
            catch (error) {
                console.error(error);
                return response.status(402).send({ "status": false, "message": error });
            }
        });
    }
    getUsers(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma.user.findMany({
                    where: {
                        role_id: client_1.UserRoles.USER
                    }
                });
                return response.status(200).send({ status: true, users: user, count: user.length });
            }
            catch (error) {
                console.error(error);
                return response.status(402).send({ "status": false, "message": error });
            }
        });
    }
}
exports.default = AuthService;
function exclude(userData, key) {
    delete userData[key];
    return userData;
}
