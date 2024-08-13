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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const ResponseInterFace_1 = require("../../interfaces/ResponseInterFace");
const prisma = new client_1.PrismaClient();
class CalendarController {
    constructor() {
    }
    update(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { arabic_date, english_date, hijreeMarabic_month_name } = req.body;
            // Validate user input
            if (!(arabic_date && english_date && hijreeMarabic_month_name)) {
                return response.status(400).send((0, ResponseInterFace_1.errorResponse)("All Input required", "All Input required"));
            }
            if (isNaN(Date.parse(english_date)) || isNaN(Date.parse(arabic_date))) {
                return response.status(400).send((0, ResponseInterFace_1.errorResponse)("date is not valid", "date is not valid"));
            }
            try {
                const calendar = yield prisma.calendar.create({
                    data: {
                        english_date: new Date(english_date),
                        arabic_date: new Date(arabic_date),
                        hijreeMarabic_month_name: hijreeMarabic_month_name
                    }
                });
                return response.send((0, ResponseInterFace_1.sucessResponse)("data sucess", null));
            }
            catch (error) {
                console.error(error);
                return response.status(400).send((0, ResponseInterFace_1.errorResponse)("catch error", error));
            }
        });
    }
    getCalendar(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const calendar = yield prisma.calendar.findMany({
                    orderBy: {
                        id: 'desc',
                    },
                    take: 1,
                });
                if (calendar == null) {
                    return response.send((0, ResponseInterFace_1.errorResponse)("No data found", "No data found"));
                }
                return response.send((0, ResponseInterFace_1.sucessResponse)("data sucess", calendar));
            }
            catch (error) {
                return response.status(400).send((0, ResponseInterFace_1.errorResponse)("catch error", error));
            }
        });
    }
}
exports.default = CalendarController;
