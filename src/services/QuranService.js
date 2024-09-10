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
const functions_1 = require("../utils/functions");
const cheerio = require('cheerio');
const prisma = new client_1.PrismaClient();
class QuranService {
    constructor() {
    }
    createSuraModel() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = "https://equran.me/";
            const { data } = yield axios_1.default.get(url);
            const $ = cheerio.load(data);
            const suras = $('.surah');
            let dataS = [];
            $(suras).each((index, element) => {
                const sureNumebrElement = $(element).find('span').text();
                let sureNumeber = sureNumebrElement.match(/\d+/)[0];
                const sureName = $(element).find(' a:nth-of-type(2)').text();
                console.log(sureName);
                console.log("====================================");
                dataS.push({ sura_number: sureNumeber, sura_name: sureName });
                // prisma.sura.create({   
                //     data: {
                //         sura_name: ayaElement.text(),
                //         sura_number:sureNumeber,
                //         count:
                //     }});
            });
            return dataS;
        });
    }
    createQuran(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let juzuObj = { n: 1 };
            let suraData = {
                id: -1,
                sura_name: "",
                sura_number: 1,
                count: 0
            };
            var ayat = [];
            try {
                for (let index = 1; index < 605; index++) {
                    const result = yield this.readQuranPage(index, juzuObj, suraData);
                    if (result && result.length > 0) {
                        ayat.push(result);
                    }
                }
                return response.status(200).json({ "status": true, "message": "Quran created successfully", data: ayat });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    readQuranPage(page, juzuObj, suraData) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = "https://equran.me/page-" + page + ".html";
            const { data } = yield axios_1.default.get(url);
            const $ = cheerio.load(data);
            const pageDocument = $('.read-surah');
            var ayat = [];
            try {
                const elements = $(pageDocument).find('ul').children().toArray();
                for (const element of elements) {
                    if (element.name === 'div') {
                        if ($(element).attr('id') != 'juz' && $(element).text().includes("جزء")) {
                            (0, functions_1.kdp)(url, 'm');
                            juzuObj.n++;
                            continue;
                        }
                        const title = $(element).find('#juz > a').text();
                        if (title != null && title.length > 1 && suraData.sura_name != title && (!title.includes("متابعة القراءة من"))) {
                            (0, functions_1.kdp)("oldtitle=" + suraData.title + "title==" + title + "\n" + "page=" + page, 'm');
                            suraData['sura_number'] = suraData.sura_number + 1;
                            suraData['sura_name'] = title;
                        }
                        const suraModelID = yield this.insertSuraInfo(suraData);
                        suraData.id = suraModelID.id;
                        continue;
                    }
                    const ayaElement = $(element).find('a');
                    let number = 0;
                    if (ayaElement.find('span').length > 0) {
                        const arabicNumber = ayaElement.find('span').text().replace("﴾", '').replace("﴿", '');
                        number = (0, functions_1.convertArabicToEnglishNumbers)(arabicNumber);
                        ayaElement.find('span').remove();
                    }
                    const text = ayaElement.text().includes("۩") ? ayaElement.text().replace("۩", '')
                        : ayaElement.text();
                    const ayaModel = yield prisma.ayah.create({
                        data: {
                            sura_id: suraData.id,
                            text: text,
                            number: number,
                            page: page,
                            sajda: ayaElement.text().includes("۩") ? client_1.Sajda.REQUIRED : client_1.Sajda.NONE,
                            juzu: juzuObj.n,
                            is_book: false
                        }
                    });
                    ayat.push(ayaModel);
                }
                ;
                return ayat;
            }
            catch (error) {
                throw error;
            }
        });
    }
    insertSuraInfo(suraData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sura = yield prisma.sura.findFirst({ where: { OR: [{ sura_name: suraData.sura_name }, { sura_number: suraData.sura_number }] } });
                if (sura) {
                    yield prisma.sura.update({
                        where: { id: sura.id },
                        data: {
                            count: sura.count + 1
                        }
                    });
                    return sura;
                }
                return yield prisma.sura.create({
                    // where: { OR: [{ sura_name: suraData.sura_name }, { sura_number: suraData.sura_number }] },
                    // update: {
                    //     count: { increment: 1 }
                    // },
                    data: {
                        sura_name: suraData.sura_name,
                        sura_number: suraData.sura_number,
                        count: 1
                    }
                });
            }
            catch (error) {
                console.error("error=============" + suraData.sura_number + "===" + error);
                return -1;
            }
        });
    }
    createAhya(sura_id, text, number, page, sajda, juzu) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate user input
            if (!(sura_id && text && number && page && sajda && juzu)) {
                return false;
            }
            try {
                const ahya = yield prisma.ayah.create({
                    data: {
                        sura_id,
                        text,
                        number,
                        page,
                        sajda,
                        juzu,
                        is_book: false
                    }
                });
                return true;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    getQuran(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const suras = yield prisma.ayah.findMany({ include: { sura: true }, orderBy: { id: 'asc' } });
                return response.status(200).json({ "status": true, "message": "Quran fetched successfully", "data": suras });
            }
            catch (error) {
                return response.status(400).json({ "status": false, "message": "Quran fetched error", "error": error });
            }
        });
    }
    createQuranOld(req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let index = 2;
            let juzu = 1;
            let suraData = {
                sura_name: "",
                sura_number: index,
                count: 0
            };
            const url = "https://equran.me/read-" + index + ".html";
            const { data } = yield axios_1.default.get(url);
            const $ = cheerio.load(data);
            const sura = $('.read-surah');
            const title = $('section > h1');
            var ayat = [];
            const list = $(sura).find('ul');
            suraData['sura_name'] = title.text().split(" ")[2];
            suraData['count'] = list.find('li').length;
            try {
                let number = 0;
                $(sura).find('ul').children().each((num, element) => __awaiter(this, void 0, void 0, function* () {
                    if (element.name === 'div') {
                        if ($(element).attr('class') == "juz") {
                            juzu++;
                        }
                        return;
                    }
                    number++;
                    const ayaElement = $(element).find('a');
                    ayaElement.find('span').remove();
                    const text = ayaElement.text().includes("۩") ? ayaElement.text().replace("۩", '')
                        : ayaElement.text();
                    //   const ayaModel = await prisma.ayah.create({
                    //     data: {
                    //         sura_id:suraModel.id,
                    //         text: text,
                    //         number: number,
                    //         page: 1,
                    //         sajda: ayaElement.text().includes("۩")?Sajda.REQUIRED:Sajda.NONE,
                    //         juzu: 1,
                    //         is_book:false
                    //     }});
                    ayat.push({
                        sura_id: 3,
                        text: text,
                        number: number,
                        page: 1,
                        sajda: ayaElement.text().includes("۩") ? client_1.Sajda.REQUIRED : client_1.Sajda.NONE,
                        juzu: juzu,
                        is_book: false
                    });
                }));
                return response.status(200).json({ "status": true, "message": "Quran created successfully", data: ayat });
            }
            catch (error) {
                return response.status(400).json({ "status": false, "message": error });
            }
        });
    }
}
exports.default = QuranService;
