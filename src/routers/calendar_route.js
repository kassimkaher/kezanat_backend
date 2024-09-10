"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CalendarController_1 = __importDefault(require("../controllers/calendar/CalendarController"));
const AuthMiddleware_1 = require("../middleware/auth/AuthMiddleware");
const calendarController = new CalendarController_1.default();
const calendarRouter = (0, express_1.default)();
calendarRouter.route("/")
    .get(calendarController.getCalendar)
    .post(AuthMiddleware_1.checkAuth, AuthMiddleware_1.isVerify, AuthMiddleware_1.isAdmin, calendarController.update);
exports.default = calendarRouter;
