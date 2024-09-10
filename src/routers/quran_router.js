"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const QuranController_1 = __importDefault(require("../../src/controllers/QuranController"));
const quranController = new QuranController_1.default();
const quranRouter = (0, express_1.default)();
quranRouter.route("/")
    .get(quranController.getQuran)
    .post(quranController.createQuran);
exports.default = quranRouter;
