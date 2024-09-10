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
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const functions_1 = require("../utils/functions");
const SeedService_1 = __importDefault(require("./SeedService"));
const seedService = new SeedService_1.default();
const prisma = new client_1.PrismaClient();
const alkafeeUrl = "http://shiaonlinelibrary.com/الكتب/1122_الكافي-الشيخ-الكليني-ج-١/الصفحة_49";
let alKafeeBookId = -1;
let adwaBookId = -1;
let albalaghaBookId = -1;
let instance;
class BooksService {
    constructor() {
        // this.migrationNahjAlbalaga(null,null);
        instance = this;
        seedService.createBook().then((res) => {
            alKafeeBookId = res[0];
            adwaBookId = res[1];
            albalaghaBookId = res[2];
        });
    }
    getAlkafeePageUrl(page) {
        return alkafeeUrl.replace("49", page.toString());
    }
    getNahjAlbahlaghUrls(page) {
        return ["https://alseraj.net/nahj_al-balagha/الخطبة-" + this.toArabicDigits(page.toString()) + "/",
            "https://alseraj.net/nahj_al-balagha/الكتاب-" + this.toArabicDigits(page.toString()) + "/",
            "https://alseraj.net/حكم-نهج-البلاغة/"
        ];
    }
    createNoveler(name, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (index == null) {
                return null;
            }
            const novelist = yield prisma.noveler.findUnique({ where: { id: index } });
            try {
                if (novelist) {
                    return novelist;
                }
                return yield prisma.noveler.create({ data: { name: name, id: index, } });
            }
            catch (error) {
                return null;
            }
        });
    }
    createBookItemContent(text_1, footer_1, isTitle_1, bookId_1, page_1, juzu_1, noverers_1) {
        return __awaiter(this, arguments, void 0, function* (text, footer, isTitle, bookId, page, juzu, noverers, type = client_1.BookType.CONTENT, bookName = "") {
            try {
                const insert = yield prisma.bookItems.create({ data: { book_name: bookName, book_content: text, book_footer: footer, book_item_id: bookId, is_title: isTitle, page: page, juzu: juzu, book_type: client_1.BookType.CONTENT, } });
                const result = yield prisma.bookItems.update({ where: { id: insert.id }, data: { noverlers: { connect: noverers } } });
                return result;
            }
            catch (e) {
                (0, functions_1.kdp)("createPargraph==" + e, 'r');
                (0, functions_1.kdp)("createPargraph========" + noverers, 'y');
                return null;
            }
        });
    }
    createCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cat = yield prisma.bookItems.findFirst({ where: { index_name: data.index_name, book_item_id: data.book_item_id } });
                if (cat) {
                    return cat;
                }
                return yield prisma.bookItems.create({ data: { book_item_id: data.book_item_id, index_name: data.index_name, book_type: data.type, book_name: "" } });
            }
            catch (e) {
                console.log("createCategory==" + e);
            }
        });
    }
    migrationAlkafee(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const indexing = yield this.getAlkafeeIndexing(this.getAlkafeePageUrl(48 + 1), 1, alKafeeBookId);
                for (let index = 0; index < indexing.length; index++) {
                    if (index + 1 < indexing.length) {
                        yield this.readAlkafeeContent(1, indexing[index].id, indexing[index].number, indexing[index + 1].number);
                        continue;
                    }
                    yield this.readAlkafeeContent(1, indexing[index].id, indexing[index].number, 555);
                }
                const data = yield this.getDataOfBook(alKafeeBookId);
                console.log("finish migrationAlkafee");
                return response.status(200).json({ "status": true, "message": "migrationAlkafee  created successfully", data: data });
            }
            catch (error) {
                console.log(error);
                return response.status(400).json({ "status": false, "message": "Nahj Albalaga error", error: error });
            }
        });
    }
    getAlkafeeIndexing(url, juzu, bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield axios_1.default.get(url);
            const $ = cheerio_1.default.load(data);
            const categoryItms = $('div.toc').find('tr'); // Get all the contents of the div (text nodes + elements)
            let catArry = [];
            for (let index = 0; index < categoryItms.length; index++) {
                const title = $(categoryItms[index]).find('a').text();
                const number = Number.parseInt($(categoryItms[index]).find('td').last().text());
                const bookItem = yield this.createCategory({ book_item_id: bookId, index_name: title, type: client_1.BookType.INDEX });
                catArry.push({ id: bookItem === null || bookItem === void 0 ? void 0 : bookItem.id, number: number });
            }
            return catArry;
        });
    }
    readAlkafeeContent(juzu, bookId, startPage, endPage) {
        return __awaiter(this, void 0, void 0, function* () {
            let novelistIds = [];
            let text = "";
            for (let page = startPage; page < endPage; page++) {
                const url = this.getAlkafeePageUrl(48 + page);
                const { data } = yield axios_1.default.get(url);
                const $ = cheerio_1.default.load(data);
                const elements = $('div.text').contents(); // Get all the contents of the div (text nodes + elements)
                const footer = $('div.footnote').text();
                for (const element in elements) {
                    if (elements[element].type === 'text') {
                        if ($(elements[element]).text().slice(-1) == '.') {
                            text += " " + $(elements[element]).text().trim();
                            yield this.createBookItemContent(text, "", false, bookId, page, juzu, novelistIds);
                            novelistIds = [];
                            text = "";
                            continue;
                        }
                        text += " " + $(elements[element]).text().trim();
                    }
                    else if (elements[element].type === 'tag' && elements[element].tagName === 'span') {
                        // This is a span element
                        text += " " + $(elements[element]).text().trim();
                        const id = instance.getId($, elements[element]);
                        const novelist = yield this.createNoveler($(elements[element]).text().trim(), id);
                        if (novelist) {
                            novelistIds.push(novelist);
                        }
                    }
                }
                //    if (footer.length > 0) {
                //     await this.createBookItemContent(footer, false, bookId, page, juzu, [],BookType.FOOTER);
                //    }
            }
        });
    }
    migrationBalagha(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //  const indexing = await this.getAlkafeeIndexing(this.getNahjAlbahlaghPageUrl(1),1, albalaghaBookId);
                (0, functions_1.kdp)("migrationBalagha========kutba", 'y');
                for (let index = 1; index < 242; index++) {
                    yield this.readNahjAlbalaghaContent(this.getNahjAlbahlaghUrls(index)[0], index);
                }
                for (let index = 1; index < 80; index++) {
                    yield this.readNahjAlbalaghaContent(this.getNahjAlbahlaghUrls(index)[1], index);
                }
                yield this.readNahjAlbalaghaHikam(this.getNahjAlbahlaghUrls(0)[2], 322);
                const data = yield this.getDataOfBook(alKafeeBookId);
                (0, functions_1.kdp)("migrationBalagha========", 'g');
                return response.status(200).json({ "status": true, "message": "migrationAlkafee  created successfully", data: data });
            }
            catch (error) {
                console.log(error);
                return response.status(400).json({ "status": false, "message": "Nahj Albalaga error", error: error });
            }
        });
    }
    readNahjAlbalaghaContent(url, page) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, functions_1.kdp)("readNahjAlbalaghaContent==" + url, 'm');
            try {
                const { data } = yield axios_1.default.get(url);
                const $ = cheerio_1.default.load(data);
                const title = $('h1.elementor-heading-title').text();
                const cat = yield this.createCategory({ book_item_id: albalaghaBookId, index_name: title, type: client_1.BookType.INDEX });
                const section = $(".dce-acf-repeater-grid").children().toArray(); // Get all the contents of the div (text nodes + elements)
                for (const element in section) {
                    (0, functions_1.kdp)("readNahjAlbalaghaContent==" + element, 'r');
                    const title = $(section[element]).find("div.dynamic-content-for-elementor-acf").text(); // Get all the contents of the div (text nodes + elements)
                    const paregraph = $(section[element]).find("p").text(); // Get all the contents of the div (text nodes + elements)
                    yield this.createBookItemContent(paregraph, "", false, cat.id, page, 0, [], client_1.BookType.CONTENT, title);
                }
            }
            catch (e) {
                (0, functions_1.kdp)("readNahjAlbalaghaContent==87234" + e, 'r');
                yield this.readNahjAlbalaghaContent(url, page);
            }
        });
    }
    readNahjAlbalaghaHikam(url, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const cat = yield this.createCategory({ book_item_id: albalaghaBookId, index_name: "حكم نهج البلاغة", type: client_1.BookType.INDEX });
            (0, functions_1.kdp)("readNahjAlbalaghaHikam==" + url, 'm');
            try {
                const { data } = yield axios_1.default.get(url);
                const $ = cheerio_1.default.load(data);
                const hikam = $('span.dynamic-content-for-elementor-acf').toArray(); // Get all the contents of the div (text nodes + elements)
                for (const element in hikam) {
                    const content = $(hikam[element]).text(); // Get all the contents of the div (text nodes + elements)
                    (0, functions_1.kdp)("readNahjAlbalaghaContent==" + content, 'g');
                    yield this.createBookItemContent(content, "", false, cat.id, page, 0, []);
                }
            }
            catch (e) {
                (0, functions_1.kdp)("readNahjAlbalaghaContent==87234" + e, 'r');
                yield this.readNahjAlbalaghaContent(url, page);
            }
        });
    }
    getMainPages(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield axios_1.default.get(url);
            const $ = cheerio_1.default.load(data);
            let cat = [];
            $('p').each((index, element) => {
                const font = $(element).find('font').filter(function () {
                    return $(this).attr('size') == '4';
                });
                const a = $(font).find('a').filter(function () {
                    return $(this).attr('href') != null;
                });
                if (font && a && $(a).attr('href')) {
                    const contentUrl = url + $(a).attr('href');
                    cat.push({ name: $(a).text(), url: contentUrl });
                }
            });
            return cat;
        });
    }
    getId($, element) {
        const indexClass = $(element).attr('class');
        if (indexClass) {
            const match = indexClass.match(/index-(\d+)/);
            if (match) {
                const indexNumber = match[1]; // Extracted number as a string
                return parseInt(indexNumber);
            }
            return -1;
        }
        else {
            return -1;
        }
    }
    parseText(textContent) {
        const match = textContent.match(/\d+\s*-\s*/g);
        if (match) {
            const number = match[1]; // Extracted number as a string
            return true;
        }
        return false;
    }
    migrationAdwaOnHussein(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pages = [];
                const data = yield this.readAdwaaContent();
                //  const data = await prisma.books.findUnique({ where: { id: adwaBookId }, include: { bookItems: true } });
                console.log("finish migrationAAdwa");
                return response.status(200).json({ "status": true, "message": "migrationAAdwa  created successfully", data: data });
            }
            catch (error) {
                console.log(error);
                return response.status(400).json({ "status": false, "message": "migrationAAdwa error", error: error });
            }
        });
    }
    getDataOfBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let respoceData;
                const resultQuery = yield prisma.bookItems.findFirst({
                    where: { parent: null, id: id },
                    include: {
                        children: {
                            orderBy: { id: 'asc' },
                            include: {
                                noverlers: true,
                                children: {
                                    orderBy: { id: 'asc' },
                                    include: {
                                        children: {
                                            orderBy: { id: 'asc' },
                                            include: { noverlers: true }
                                        },
                                        noverlers: true
                                    }
                                }
                            }
                        },
                        noverlers: true
                    }
                });
                respoceData = resultQuery;
                return { "status": true, "message": "adwhaa  fetched successfully", "data": respoceData };
            }
            catch (error) {
                (0, functions_1.kdp)("error==" + error, 'r');
                return { "status": false, "message": "book fetched error", "error": error };
            }
        });
    }
    deleteBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let respoceData;
                const resultQuery = yield prisma.bookItems.deleteMany({ where: { book_item_id: id }, });
                return { "status": true, "message": "  deleteBook successfully" };
            }
            catch (error) {
                (0, functions_1.kdp)("error==" + error, 'r');
                return { "status": false, "message": "deleteBook  error", "error": error };
            }
        });
    }
    readAdwaaContent() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = "https://www.alsadrain.com/sader2/books/adhwa/1.htm";
            let page = 1;
            for (let index = 1; index < 5; index++) {
                const url = host.replace("1", index.toString());
                const response = yield axios_1.default.get(url, {
                    responseType: 'arraybuffer',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                        'Accept-Encoding': 'gzip, deflate, br, zstd',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
                    }
                });
                const decodedData = iconv_lite_1.default.decode(Buffer.from(response.data), 'windows-1256');
                const $ = cheerio_1.default.load(decodedData);
                const elements = $('blockquote').children().toArray(); // Get all the contents of the div (text nodes + elements)
                for (const element in elements) {
                    if (elements[element].tagName === 'p' && $(elements[element]).attr("align") === 'justify') {
                        const r = this.getAdwaPages($, elements[element], page);
                        page = page + (yield r).length;
                        continue;
                    }
                }
            }
            return;
        });
    }
    getAdwaPages($, element, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const paregraph = $(element).contents();
            let text = "";
            let pages = [];
            for (const index in paregraph) {
                if (paregraph[index].type != 'text') {
                    continue;
                }
                const item = $(paregraph[index]).text().trim();
                if (/^[_¬ـ\s]+$/.test(item) && item.length > 5) {
                    pages.push(yield this.createBookItemContent(text, "", false, adwaBookId, page, -1, []));
                    page++;
                    text = "";
                    continue;
                }
                text += " " + $(paregraph[index]).text().trim();
            }
            if (text.length > 0) {
                pages.push(yield this.createBookItemContent(text, "", false, adwaBookId, page, -1, []));
            }
            return pages;
        });
    }
    getAllBooks(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let respoceData;
                const resultQuery = yield prisma.bookItems.findMany({ where: { book_type: client_1.BookType.BOOK, book_item_id: null } });
                respoceData = resultQuery;
                return response.status(200).json({ "status": true, "message": "books fetched successfully", "data": respoceData });
            }
            catch (error) {
                (0, functions_1.kdp)("error==" + error, 'r');
                return response.status(404).json({ "status": false, "message": "books fetched error", "error": error });
            }
        });
    }
    toArabicDigits(number) {
        var id = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return number.replace(/[0-9]/g, function (w) {
            return id[+w];
        });
    }
    ;
}
exports.default = BooksService;
