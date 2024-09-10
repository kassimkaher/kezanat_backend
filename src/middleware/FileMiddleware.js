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
exports.isFile = isFile;
const util_1 = __importDefault(require("util"));
const multer_1 = __importDefault(require("multer"));
const formidable_1 = __importDefault(require("formidable"));
function isFile(req, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var form = (0, formidable_1.default)({ multiples: false });
        try {
            form.parse(req, function (err, fields, files) {
                if (files != null) {
                    req.file = files.file;
                    return next();
                }
                return response.status(401).json({ "status": false, "message": "file not found" });
            });
        }
        catch (error) {
            return response.status(401).json({ "status": false, "message": error });
        }
    });
}
const maxSize = 2 * 1024 * 1024;
let storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.PUBLICPATH);
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, file.originalname);
    },
});
let uploadFile = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");
let uploadFileMiddleware = util_1.default.promisify(uploadFile);
exports.default = uploadFileMiddleware;
