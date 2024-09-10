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
const functions_1 = require("../utils/functions");
const prisma = new client_1.PrismaClient();
class SeedService {
    constructor() {
        // this.migrationNahjAlbalaga(null,null);
    }
    createBook() {
        return __awaiter(this, void 0, void 0, function* () {
            let id = [];
            const kafeeId = yield this.createAlkafeeBookInfo();
            const adwahId = yield this.createAdwaOnhusseinBook();
            const balaghId = yield this.createNahjAlbalagaBookInfo();
            id.push(kafeeId);
            id.push(adwahId);
            id.push(balaghId);
            return id;
        });
    }
    createNahjAlbalagaBookInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield yield prisma.bookItems.findFirst({ where: { book_name: "نهج البلاغة", book_type: client_1.BookType.BOOK } });
                if (data) {
                    return data.id;
                }
                const data1 = yield prisma.bookItems.create({ data: { book_name: "نهج البلاغة", book_type: client_1.BookType.BOOK } });
                (0, functions_1.kdp)("albalagha book added", 'g');
                return data1.id;
            }
            catch (e) {
                (0, functions_1.kdp)("albalagha book error" + e, 'r');
                return -1;
            }
        });
    }
    createSaheefaAlsajadeaBook() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield yield prisma.bookItems.findFirst({ where: { book_name: "الصحيفة السجادية", book_type: client_1.BookType.BOOK } });
                if (data) {
                    return data.id;
                }
                const data1 = yield prisma.bookItems.create({ data: { book_name: "الصحيفة السجادية", book_type: client_1.BookType.BOOK } });
                (0, functions_1.kdp)("alsahefa alsajadea book  added", 'g');
                return data1.id;
            }
            catch (e) {
                (0, functions_1.kdp)("alsahefa alsajadea error" + e, 'e');
                return -1;
            }
        });
    }
    createAlkafeeBookInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            let bookId = -1;
            try {
                const data = yield yield prisma.bookItems.findFirst({ where: { book_name: "اصول الكافي", book_type: client_1.BookType.BOOK } });
                if (data) {
                    return data.id;
                }
                const book = yield prisma.bookItems.create({ data: { book_name: "اصول الكافي", book_type: client_1.BookType.BOOK } });
                bookId = book.id;
                (0, functions_1.kdp)("alkafee book added", 'g');
                return bookId;
            }
            catch (e) {
                (0, functions_1.kdp)("alkafee book error" + e, 'r');
                return bookId;
            }
        });
    }
    createAdwaOnhusseinBook() {
        return __awaiter(this, void 0, void 0, function* () {
            let bookId = -1;
            try {
                const data = yield yield prisma.bookItems.findFirst({ where: { book_name: "أضواء على ثورة الحسين", book_type: client_1.BookType.BOOK } });
                if (data) {
                    return data.id;
                }
                const book = yield prisma.bookItems.create({ data: { book_name: "أضواء على ثورة الحسين", book_type: client_1.BookType.BOOK } });
                bookId = book.id;
                (0, functions_1.kdp)("createAdwaOnhusseinBook book added", 'g');
                return bookId;
            }
            catch (e) {
                (0, functions_1.kdp)("createAdwaOnhusseinBook book error" + e, 'r');
                return bookId;
            }
        });
    }
}
exports.default = SeedService;
