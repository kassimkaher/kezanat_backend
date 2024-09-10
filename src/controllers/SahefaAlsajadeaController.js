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
const SahefaAlsajadeaService_1 = __importDefault(require("../services/SahefaAlsajadeaService"));
const sahefaAlsajadeaService = new SahefaAlsajadeaService_1.default();
const prisma = new client_1.PrismaClient();
class SahefaAlsajadeaController {
    constructor() {
    }
    migration(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sahefaAlsajadeaService.migration(req, response);
        });
    }
}
exports.default = SahefaAlsajadeaController;
