"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SahefaAlsajadeaController_1 = __importDefault(require("../controllers/SahefaAlsajadeaController"));
const sahefaAlsajadeaController = new SahefaAlsajadeaController_1.default();
const sahefaAlsajadeaRout = (0, express_1.default)();
sahefaAlsajadeaRout.route("/")
    .post(sahefaAlsajadeaController.migration);
exports.default = sahefaAlsajadeaRout;
