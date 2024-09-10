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
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const BooksService_1 = __importDefault(require("./BooksService"));
const SeedService_1 = __importDefault(require("./SeedService"));
const seedService = new SeedService_1.default();
const booksService = new BooksService_1.default();
const prisma = new client_1.PrismaClient();
const baseUrl = "https://www.aqaedalshia.com/books/sahifa/";
const homeUrl = baseUrl + "index.htm";
let bookId;
class SahefaAlsajadeaService {
    constructor() {
        seedService.createSaheefaAlsajadeaBook().then((id) => {
            bookId = id;
        });
    }
    migration(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("start SahefaAlsajadeaService");
            try {
                const mainCategories = [];
                let data = [];
                const urls = yield this.getMainCategory();
                for (const url in urls) {
                    const mainCat = yield booksService.createCategory({ book_item_id: bookId, index_name: urls[url].name, type: client_1.BookType.INDEX });
                    if (mainCat == null) {
                        continue;
                    }
                    mainCategories.push({ id: mainCat.id, url: urls[url].url });
                }
                for (let page = 0; page < mainCategories.length; page++) {
                    const result = yield this.readContent(mainCategories[page].id, mainCategories[page].url, page);
                    data.push(...result);
                }
                console.log("finish SahefaAlsajadeaService");
                return response.status(200).json({ "status": true, "message": "Nahj Albalaga created successfully", data: data });
                // return response.status(200).json({ "status": true, "message": "Nahj Albalaga created successfully", data: mainCategories });
            }
            catch (error) {
                console.log(error);
                return response.status(400).json({ "status": false, "message": "Nahj Albalaga error", error: error });
            }
        });
    }
    readContent(categoryId, url, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield axios_1.default.get(url);
            const $ = cheerio_1.default.load(data);
            let object = [];
            const elements = $('p,h1').children().toArray();
            for (const element of elements) {
                const font = $(element).find('font').filter(function () {
                    return $(this).attr('size') == '6';
                });
                if (!$(font)) {
                    continue;
                }
                if ($(font).attr('color') == "#336699") {
                    const result = yield booksService.createBookItemContent($(font).text(), "", true, categoryId, page, -1, []);
                    if (result) {
                        object.push(result);
                    }
                }
                else if ($(font).text() != "") {
                    const result = yield booksService.createBookItemContent($(font).text(), "", false, categoryId, page, -1, []);
                    if (result) {
                        object.push(result);
                    }
                }
            }
            return object;
        });
    }
    getMainCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield axios_1.default.get(homeUrl);
            const $ = cheerio_1.default.load(data);
            let cat = [];
            $('td').each((index, element) => {
                const a = $(element).find('a').filter(function () {
                    return $(this).attr('href') != null;
                });
                if (a && $(a).attr('href')) {
                    const contentUrl = baseUrl + $(a).attr('href');
                    cat.push({ name: $(a).text(), url: contentUrl });
                }
            });
            return cat;
        });
    }
    createListtitle(url, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield axios_1.default.get(url);
            const $ = cheerio_1.default.load(data);
            let cat = [];
            $('div').each((index, element) => {
                var _a;
                const a = $(element).find('a').filter(function () {
                    return $(this).attr('href') != null;
                });
                if (a) {
                    const contentUrl = url.replace("index.htm", (_a = $(a).attr('href')) !== null && _a !== void 0 ? _a : "");
                    cat.push({ name: $(a).text(), url: contentUrl, parent: id });
                }
            });
            return cat;
        });
    }
}
exports.default = SahefaAlsajadeaService;
