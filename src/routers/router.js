"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_router_1 = __importDefault(require("./books_router"));
const calendar_route_1 = __importDefault(require("./calendar_route"));
const quran_router_1 = __importDefault(require("./quran_router"));
const sahefa_alsajadea_1 = __importDefault(require("./sahefa_alsajadea"));
const user_route_1 = __importDefault(require("./user_route"));
const router = (0, express_1.default)();
router.use('/auth', user_route_1.default);
router.use('/calendar', calendar_route_1.default);
router.use('/quran', quran_router_1.default);
router.use('/sahefaAlsajadea', sahefa_alsajadea_1.default);
router.use('/book', books_router_1.default);
exports.default = router;
