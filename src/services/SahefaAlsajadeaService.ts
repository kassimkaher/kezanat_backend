

import { BookType, PrismaClient } from '@prisma/client';

import axios from 'axios';
import cheerio, { Cheerio, Element } from 'cheerio';
import BooksService from './BooksService';
import SeedService from './SeedService';
const seedService = new SeedService();
const booksService = new BooksService();
const prisma = new PrismaClient()


const baseUrl = "https://www.aqaedalshia.com/books/sahifa/";
const homeUrl = baseUrl + "index.htm";
let bookId: number;
class SahefaAlsajadeaService {

    public constructor() {
        seedService.createSaheefaAlsajadeaBook().then((id) => {
            bookId = id;
        });
   
    }
    public async migration(req: any, response: any) {
        console.log("start SahefaAlsajadeaService");

        try {
            const mainCategories = [];
            let data = [];
            const urls = await this.getMainCategory();

            for (const url in urls) {

                const mainCat = await booksService.createCategory({ book_item_id: bookId, index_name: urls[url].name, type: BookType.INDEX });

                if (mainCat == null) {

                    continue;
                }


                mainCategories.push({ id: mainCat.id, url: urls[url].url });
            }

            for (let  page =0;page<mainCategories.length;  page++) {


                const result = await this.readContent(mainCategories[page].id, mainCategories[page].url,page);
                data.push(...result);


            }


            console.log("finish SahefaAlsajadeaService");

            return response.status(200).json({ "status": true, "message": "Nahj Albalaga created successfully", data: data });

            // return response.status(200).json({ "status": true, "message": "Nahj Albalaga created successfully", data: mainCategories });



        } catch (error) {
            console.log(error);
            return response.status(400).json({ "status": false, "message": "Nahj Albalaga error", error: error });

        }

    }
   
    public async readContent(categoryId: number, url: string,page:number) {

        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let object = [];


        const elements = $('p,h1').children().toArray();

        for (const element of elements) {



            const font: Cheerio<Element> = $(element).find('font').filter(function () {
                return $(this).attr('size') == '6';
            });



            if (!$(font)) {
                continue;
            }

            if ($(font).attr('color') == "#336699") {


                const result = await booksService.createBookItemContent($(font).text(), true,categoryId, page,-1,[]);

                if (result) {
                    object.push(result)
                }


            } else if ($(font).text() != "") {


                const result = await booksService.createBookItemContent($(font).text(),false, categoryId,page ,-1,[]);

                if (result) {
                    object.push(result)
                }

            }

        }
        return object;


    }
    public async getMainCategory() {


        const { data } = await axios.get(homeUrl);
        const $ = cheerio.load(data);


        let cat: { name: string; url: string; }[] = []
        $('td').each((index: number, element: Element) => {

            const a: Cheerio<Element> = $(element).find('a').filter(function () {
                return $(this).attr('href') != null;
            });
            if (a && $(a).attr('href')) {

                const contentUrl = baseUrl + $(a).attr('href');


                cat.push({ name: $(a).text(), url: contentUrl })



            }
        });

        return cat;


    }



    public async createListtitle(url: string, id: number) {


        const { data } = await axios.get(url);
        const $ = cheerio.load(data);


        let cat: { name: string; url: string; parent: number | null; }[] = []
        $('div').each((index: number, element: Element) => {


            const a: Cheerio<Element> = $(element).find('a').filter(function () {
                return $(this).attr('href') != null;
            });
            if (a) {

                const contentUrl = url.replace("index.htm", $(a).attr('href') ?? "");


                cat.push({ name: $(a).text(), url: contentUrl, parent: id })



            }
        });

        return cat;


    }



}
export default SahefaAlsajadeaService;