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
const nodemailer_1 = __importDefault(require("nodemailer"));
const ResponseInterFace_1 = require("../interfaces/ResponseInterFace");
class MailService {
    sendCode(code, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let transporter = nodemailer_1.default.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: 'kezanat.alsama@gmail.com', // generated ethereal user
                        pass: 'uiya ijdk vbcz prnb', // generated ethereal password
                    },
                });
                // send mail with defined transport object
                let info = transporter.sendMail({
                    from: '"bahar', // sender address
                    to: email, // list of receivers
                    subject: "verfication Code", // Subject line
                    text: "your code is ", // plain text body
                    html: "<b>" + code + "</b>", // html body
                });
                return (0, ResponseInterFace_1.sucessResponse)("info.messageId", email);
            }
            catch (error) {
                return (0, ResponseInterFace_1.errorResponse)("error", error);
            }
        });
    }
}
exports.default = MailService;
