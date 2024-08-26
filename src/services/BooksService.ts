

import { BookType, PrismaClient } from '@prisma/client';

import axios from 'axios';
import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import iconv from 'iconv-lite';
import { kdp } from '../utils/functions';
import SeedService from './SeedService';
const seedService = new SeedService();

const prisma = new PrismaClient()


const alkafeeUrl = "http://shiaonlinelibrary.com/الكتب/1122_الكافي-الشيخ-الكليني-ج-١/الصفحة_49";
let alKafeeBookId = -1;
let adwaBookId = -1;
let albalaghaBookId = -1;




let instance: BooksService;
class BooksService {

    public constructor() {
        // this.migrationNahjAlbalaga(null,null);

        instance = this;


        seedService.createBook().then((res) => {

            alKafeeBookId = res[0];
            adwaBookId = res[1];
            albalaghaBookId = res[2];
        });




    }
    public getAlkafeePageUrl(page: number) {
        return alkafeeUrl.replace("49", page.toString());

    }
    public getNahjAlbahlaghUrls(page: number) {

        return ["https://alseraj.net/nahj_al-balagha/الخطبة-" + this.toArabicDigits(page.toString()) + "/",
        "https://alseraj.net/nahj_al-balagha/الكتاب-" + this.toArabicDigits(page.toString()) + "/",
            "https://alseraj.net/حكم-نهج-البلاغة/"
        ];

    }


    public async createNoveler(name: string, index: number | null) {
        if (index == null) {
            return null;
        }
        const novelist = await prisma.noveler.findUnique({ where: { id: index } });
        try {
            if (novelist) {
                return novelist;

            }
            return await prisma.noveler.create({ data: { name: name, id: index, } });

        } catch (error) {
            return null;
        }
    }
    public async createBookItemContent(text: string, footer: string, isTitle: boolean, bookId: number, page: number, juzu: number, noverers: any[], type: BookType = BookType.CONTENT, bookName: string = "") {
        try {


            const insert = await prisma.bookItems.create({ data: { book_name: bookName, book_content: text, book_footer: footer, book_item_id: bookId, is_title: isTitle, page: page, juzu: juzu, book_type: BookType.CONTENT, } });


            const result = await prisma.bookItems.update({ where: { id: insert.id }, data: { noverlers: { connect: noverers } } });

            return result;
        } catch (e) {
            kdp("createPargraph==" + e, 'r');
            kdp("createPargraph========" + noverers, 'y');
            return null;
        }

    }
    async createCategory(data: { book_item_id: number, index_name: string; type: BookType }) {
        try {
            const cat = await prisma.bookItems.findFirst({ where: { index_name: data.index_name, book_item_id: data.book_item_id } });
            if (cat) {
                return cat;
            }
            return await prisma.bookItems.create({ data: { book_item_id: data.book_item_id, index_name: data.index_name, book_type: data.type, book_name: "" } });
        } catch (e) {
            console.log("createCategory==" + e);
        }
    }
    public async migrationAlkafee(req: any, response: any) {

        try {
            const indexing = await this.getAlkafeeIndexing(this.getAlkafeePageUrl(48 + 1), 1, alKafeeBookId);

            for (let index = 0; index < indexing.length; index++) {

                if (index + 1 < indexing.length) {
                    await this.readAlkafeeContent(1, indexing[index].id!, indexing[index].number!, indexing[index + 1].number);
                    continue;
                }
                await this.readAlkafeeContent(1, indexing[index].id!, indexing[index].number!, 555);

            }
            const data = await this.getDataOfBook(alKafeeBookId);

            console.log("finish migrationAlkafee");

            return response.status(200).json({ "status": true, "message": "migrationAlkafee  created successfully", data: data });


        } catch (error) {
            console.log(error);
            return response.status(400).json({ "status": false, "message": "Nahj Albalaga error", error: error });

        }

    }

    public async getAlkafeeIndexing(url: string, juzu: number, bookId: number) {

        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const categoryItms = $('div.toc').find('tr'); // Get all the contents of the div (text nodes + elements)
        let catArry = [];

        for (let index = 0; index < categoryItms.length; index++) {

            const title = $(categoryItms[index]).find('a').text();
            const number = Number.parseInt($(categoryItms[index]).find('td').last().text());
            const bookItem = await this.createCategory({ book_item_id: bookId, index_name: title, type: BookType.INDEX });
            catArry.push({ id: bookItem?.id, number: number });

        }
        return catArry;
    }
    public async readAlkafeeContent(juzu: number, bookId: number, startPage: number, endPage: number) {
        let novelistIds: any[] = [];
        let text = "";
        for (let page = startPage; page < endPage; page++) {
            const url = this.getAlkafeePageUrl(48 + page);

            const { data } = await axios.get(url);
            const $ = cheerio.load(data);



            const elements = $('div.text').contents(); // Get all the contents of the div (text nodes + elements)
            const footer = $('div.footnote').text();
            for (const element in elements) {
                if (elements[element].type === 'text') {

                    if ($(elements[element]).text().slice(-1) == '.') {
                        text += " " + $(elements[element]).text().trim();
                        await this.createBookItemContent(text, "", false, bookId, page, juzu, novelistIds);
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

                    const novelist = await this.createNoveler($(elements[element]).text().trim(), id);
                    if (novelist) {
                        novelistIds.push(novelist);

                    }


                }
            }
            //    if (footer.length > 0) {
            //     await this.createBookItemContent(footer, false, bookId, page, juzu, [],BookType.FOOTER);

            //    }



        }

    }
    public async migrationBalagha(req: any, response: any) {


        try {

            //  const indexing = await this.getAlkafeeIndexing(this.getNahjAlbahlaghPageUrl(1),1, albalaghaBookId);

            kdp("migrationBalagha========kutba", 'y');
            for (let index = 1; index < 242; index++) {


                await this.readNahjAlbalaghaContent(this.getNahjAlbahlaghUrls(index)[0], index);

            }
            for (let index = 1; index < 80; index++) {


                await this.readNahjAlbalaghaContent(this.getNahjAlbahlaghUrls(index)[1], index);

            }



            await this.readNahjAlbalaghaHikam(this.getNahjAlbahlaghUrls(0)[2], 322);


            const data = await this.getDataOfBook(alKafeeBookId);

            kdp("migrationBalagha========", 'g');

            return response.status(200).json({ "status": true, "message": "migrationAlkafee  created successfully", data: data });


        } catch (error) {
            console.log(error);
            return response.status(400).json({ "status": false, "message": "Nahj Albalaga error", error: error });

        }

    }



    public async readNahjAlbalaghaContent(url: string, page: number) {



        kdp("readNahjAlbalaghaContent==" + url, 'm');
        try {





            const { data } = await axios.get(url);
            const $ = cheerio.load(data);


            const title = $('h1.elementor-heading-title').text();
            const cat = await this.createCategory({ book_item_id: albalaghaBookId, index_name: title, type: BookType.INDEX });




            const section = $(".dce-acf-repeater-grid").children().toArray(); // Get all the contents of the div (text nodes + elements)

            for (const element in section) {
                kdp("readNahjAlbalaghaContent==" + element, 'r');
                const title = $(section[element]).find("div.dynamic-content-for-elementor-acf").text(); // Get all the contents of the div (text nodes + elements)
                const paregraph = $(section[element]).find("p").text(); // Get all the contents of the div (text nodes + elements)
                
               
                await this.createBookItemContent(paregraph, "", false, cat!.id, page, 0, [],BookType.CONTENT,title);


            }

       

        }
        catch (e) {
            kdp("readNahjAlbalaghaContent==87234" + e, 'r');
            await this.readNahjAlbalaghaContent(url, page);
        }
    }
    public async readNahjAlbalaghaHikam(url: string, page: number) {

        const cat = await this.createCategory({ book_item_id: albalaghaBookId, index_name: "حكم نهج البلاغة", type: BookType.INDEX });


        kdp("readNahjAlbalaghaHikam==" + url, 'm');
        try {

            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const hikam = $('span.dynamic-content-for-elementor-acf').toArray(); // Get all the contents of the div (text nodes + elements)

            for (const element in hikam) {
                const content = $(hikam[element]).text(); // Get all the contents of the div (text nodes + elements)


                kdp("readNahjAlbalaghaContent==" + content, 'g');

                await this.createBookItemContent(content, "", false, cat!.id, page, 0, []);


            }



        }
        catch (e) {
            kdp("readNahjAlbalaghaContent==87234" + e, 'r');
            await this.readNahjAlbalaghaContent(url, page);
        }
    }

    public async getMainPages(url: string) {

        const { data } = await axios.get(url);
        const $ = cheerio.load(data);


        let cat: { name: string; url: string; }[] = []
        $('p').each((index: number, element: Element) => {
            const font: Cheerio<Element> = $(element).find('font').filter(function () {
                return $(this).attr('size') == '4';
            });

            const a: Cheerio<Element> = $(font).find('a').filter(function () {
                return $(this).attr('href') != null;
            });
            if (font && a && $(a).attr('href')) {

                const contentUrl = url + $(a).attr('href');


                cat.push({ name: $(a).text(), url: contentUrl })



            }
        });

        return cat;


    }

    public getId($: CheerioAPI, element: Element): number {
        const indexClass = $(element).attr('class');
        if (indexClass) {
            const match = indexClass.match(/index-(\d+)/);
            if (match) {
                const indexNumber = match[1]; // Extracted number as a string
                return parseInt(indexNumber);
            }
            return -1;
        } else {
            return -1;
        }
    }


    public parseText(textContent: string): boolean {


        const match = textContent.match(/\d+\s*-\s*/g);
        if (match) {
            const number = match[1]; // Extracted number as a string

            return true;
        }

        return false;


    }


    public async migrationAdwaOnHussein(req: any, response: any) {


        try {
            const pages = [];


            const data = await this.readAdwaaContent();
            //  const data = await prisma.books.findUnique({ where: { id: adwaBookId }, include: { bookItems: true } });

            console.log("finish migrationAAdwa");

            return response.status(200).json({ "status": true, "message": "migrationAAdwa  created successfully", data: data });


        } catch (error) {
            console.log(error);
            return response.status(400).json({ "status": false, "message": "migrationAAdwa error", error: error });

        }

    }
    public async getDataOfBook(id: number) {


        try {

            let respoceData: any;



            const resultQuery = await prisma.bookItems.findFirst({
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

        } catch (error) {
            kdp("error==" + error, 'r');
            return { "status": false, "message": "book fetched error", "error": error };

        }
    }

    public async deleteBook(id: number) {


        try {

            let respoceData: any;



            const resultQuery = await prisma.bookItems.deleteMany({ where: { book_item_id: id }, });



            return { "status": true, "message": "  deleteBook successfully" };

        } catch (error) {
            kdp("error==" + error, 'r');
            return { "status": false, "message": "deleteBook  error", "error": error };

        }
    }

    public async readAdwaaContent() {
        const host = "https://www.alsadrain.com/sader2/books/adhwa/1.htm";


        let page = 1;
        for (let index = 1; index < 5; index++) {
            const url = host.replace("1", index.toString());

            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                headers: {

                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Accept-Language': 'en-US,en;q=0.9',

                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',

                }
            });

            const decodedData = iconv.decode(Buffer.from(response.data), 'windows-1256');

            const $ = cheerio.load(decodedData);



            const elements = $('blockquote').children().toArray(); // Get all the contents of the div (text nodes + elements)
            for (const element in elements) {

                if (elements[element].tagName === 'p' && $(elements[element]).attr("align") === 'justify') {
                    const r = this.getAdwaPages($, elements[element], page);
                    page = page + (await r).length;

                    continue;

                }
            }




        }

        return;
    }

    public async getAdwaPages($: CheerioAPI, element: Element, page: number): Promise<any> {
        const paregraph = $(element).contents();

        let text = "";
        let pages = [];


        for (const index in paregraph) {
            if (paregraph[index].type != 'text') { continue; }
            const item = $(paregraph[index]).text().trim();
            if (/^[_¬ـ\s]+$/.test(item) && item.length > 5) {


                pages.push(await this.createBookItemContent(text, "", false, adwaBookId, page, -1, []));

                page++;
                text = "";
                continue
            }

            text += " " + $(paregraph[index]).text().trim();

        }
        if (text.length > 0) {

            pages.push(await this.createBookItemContent(text, "", false, adwaBookId, page, -1, []));

        }
        return pages;

    }

public async getAllBooks(req: any, response: any) {

        try {

            let respoceData: any;

            const resultQuery = await prisma.bookItems.findMany({ where:{book_type:BookType.BOOK,book_item_id:null} } );
            respoceData = resultQuery;

            
             return response.status(200).json( { "status": true, "message": "books fetched successfully", "data": respoceData });
        } catch (error) {
            kdp("error==" + error, 'r');
            return response.status(404).json( { "status": false, "message": "books fetched error", "error": error });

        }
    }

  public toArabicDigits(number: string): string {
        var id = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
        return number.replace(/[0-9]/g, function(w){
          return id[+w];
         });
        };

}

  

export default BooksService;