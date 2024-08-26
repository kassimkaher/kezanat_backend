

import { PrismaClient, Sajda } from '@prisma/client';

import axios from 'axios';
import { convertArabicToEnglishNumbers, kdp } from '../utils/functions';

const cheerio = require('cheerio');

const prisma = new PrismaClient()




class QuranService {

    public constructor() {

    }

    public async createSuraModel(): Promise<any> {

        const url = "https://equran.me/"
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const suras = $('.surah');
        let dataS: { sura_number: any; sura_name: any; }[] = [];
        $(suras).each((index: any, element: any) => {
            const sureNumebrElement = $(element).find('span').text();

            let sureNumeber: number = sureNumebrElement.match(/\d+/)[0];
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
    }
    public async createQuran(req: any, response: any) {

        let juzuObj = { n: 1 };
        let suraData = {
            id: -1,
            sura_name: "",
            sura_number: 1,
            count: 0
        }
        var ayat: any[] = [];
        try {
            for (let index = 1; index < 605; index++) {
                const result = await this.readQuranPage(index, juzuObj, suraData);
                if (result && result.length > 0) {
                    ayat.push(result);
                }
            }

            return response.status(200).json({ "status": true, "message": "Quran created successfully", data: ayat });
        } catch (error) {
            console.log(error);
        }

    }
    public async readQuranPage(page: number, juzuObj: { n: number }, suraData: any) {






        const url = "https://equran.me/page-" + page + ".html"
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const pageDocument = $('.read-surah');

        var ayat: any[] = [];

        try {

            const elements = $(pageDocument).find('ul').children().toArray();

            for (const element of elements) {
                if (element.name === 'div') {

                    if ($(element).attr('id') != 'juz' && $(element).text().includes("جزء")) {
                        kdp(url, 'm');
                        juzuObj.n++;
                        continue;
                    }
                    const title = $(element).find('#juz > a').text();
                    if (title != null && title.length > 1 && suraData.sura_name != title && (!title.includes("متابعة القراءة من"))) {

                        kdp("oldtitle="+suraData.title+"title==" + title + "\n" +"page="+ page, 'm');
                        suraData['sura_number'] = suraData.sura_number + 1;
                        suraData['sura_name'] = title;
                    }



                    const suraModelID = await this.insertSuraInfo(suraData);



                    suraData.id = suraModelID.id;

                    continue;

                }




                const ayaElement = $(element).find('a');
                let number = 0;
                if (ayaElement.find('span').length > 0) {
                    const arabicNumber = ayaElement.find('span').text().replace("﴾", '').replace("﴿", '');

                    number = convertArabicToEnglishNumbers(arabicNumber);
                    ayaElement.find('span').remove();

                }

                const text = ayaElement.text().includes("۩") ? ayaElement.text().replace("۩", '')
                    : ayaElement.text();
                const ayaModel = await prisma.ayah.create({
                    data: {
                        sura_id: suraData.id,
                        text: text,
                        number: number,
                        page: page,
                        sajda: ayaElement.text().includes("۩") ? Sajda.REQUIRED : Sajda.NONE,
                        juzu: juzuObj.n,
                        is_book: false
                    }
                });

                ayat.push(ayaModel);

            };

            return ayat;
        } catch (error) {

            throw error;

        }
    }
    private async insertSuraInfo(suraData: any): Promise<any> {


        try {
            const sura = await prisma.sura.findFirst({ where: { OR: [{ sura_name: suraData.sura_name }, { sura_number: suraData.sura_number }] } });


            if (sura) {
                await prisma.sura.update({
                    where: { id: sura.id },
                    data: {
                        count: sura.count + 1
                    }
                });
                return sura;

            }
            return await prisma.sura.create({
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
        } catch (error) {
            console.error("error=============" + suraData.sura_number + "===" + error);
            return -1;
        }



    }

    public async createAhya(sura_id: any, text: string, number: any, page: any, sajda: any, juzu: any) {



        // Validate user input
        if (!(sura_id && text && number && page && sajda && juzu)) {
            return false;

        }


        try {
            const ahya = await prisma.ayah.create({
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
        } catch (error) {
            console.error(error)
            return false;
        }
    }

    public async getQuran(req: any, response: any) {
        try {

            const suras = await prisma.ayah.findMany({ include: { sura: true }, orderBy: { id: 'asc' } });


            return response.status(200).json({ "status": true, "message": "Quran fetched successfully", "data": suras });

        } catch (error) {
            return response.status(400).json({ "status": false, "message": "Quran fetched error", "error": error });

        }
    }
    public async createQuranOld(req: any, response: any) {
        let index: number = 2;
        let juzu: number = 1;
        let suraData = {
            sura_name: "",
            sura_number: index,
            count: 0
        }


        const url = "https://equran.me/read-" + index + ".html"
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const sura = $('.read-surah');
        const title = $('section > h1');
        var ayat: any[] = [];

        const list = $(sura).find('ul');
        suraData['sura_name'] = title.text().split(" ")[2];
        suraData['count'] = list.find('li').length;

        try {

            let number = 0;
            $(sura).find('ul').children().each(async (num: any, element: any) => {


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
                    sajda: ayaElement.text().includes("۩") ? Sajda.REQUIRED : Sajda.NONE,
                    juzu: juzu,
                    is_book: false
                });

            });

            return response.status(200).json({ "status": true, "message": "Quran created successfully", data: ayat });

        } catch (error) {
            return response.status(400).json({ "status": false, "message": error });

        }
    }

}
export default QuranService;