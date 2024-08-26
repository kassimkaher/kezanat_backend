

import { PrismaClient } from '@prisma/client';


import AlkafeelService from '../services/BooksService';

const booksService = new AlkafeelService();
const prisma = new PrismaClient()




class BookController {

    public constructor() {

    }


    public async migrationAlkafee(req: any, response: any) {

        return await booksService.migrationAlkafee(req, response);

    }
    public async migrationBalagha(req: any, response: any) {

        return await booksService.migrationBalagha(req, response);

    }
    
    public async migrationAdwa(req: any, response: any) {

        return await booksService.migrationAdwaOnHussein(req, response);

    }
  
    public async getBookById(req: any, response: any) {
        const  id:number  = Number.parseInt(req.params.id);
        

        return response.status(200).json(await booksService.getDataOfBook(id));

    }
   
    public async deleteBook(req: any, response: any) {
        const  id:number  = Number.parseInt(req.params.id);
        

        return response.status(200).json(await booksService.deleteBook(id));

    }
   

    public async getAllBooks(req: any, response: any) {

        return await booksService.getAllBooks(req, response);

    }



}
export default BookController;