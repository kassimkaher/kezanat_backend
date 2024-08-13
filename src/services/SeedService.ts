

import { BookType, PrismaClient } from '@prisma/client';

import { kdp } from '../utils/functions';


const prisma = new PrismaClient()

class SeedService {

    public constructor() {
        // this.migrationNahjAlbalaga(null,null);





      

    }
    public async createBook(): Promise<number[]> {
        let id :number[]=[];
   
      const kafeeId =   await this.createAlkafeeBookInfo();

      const adwahId =  await this.createAdwaOnhusseinBook();
      const balaghId =  await this.createNahjAlbalagaBookInfo();
      id.push(kafeeId);
      id.push(adwahId);
      id.push(balaghId);
     
      return  id;
       


    }

    public async createNahjAlbalagaBookInfo(): Promise<number> {
        try {
            const data = await await prisma.bookItems.findFirst({ where: {book_name: "نهج البلاغة" ,book_type:BookType.BOOK} })
            if (data) {
              
                return data.id;
            }
            const data1 =   await prisma.bookItems.create({ data: {  book_name: "نهج البلاغة",book_type:BookType.BOOK } });
            kdp("albalagha book added", 'g');
            return data1.id;
        } catch (e) {
            kdp("albalagha book error"+e, 'r');
            return -1;
        }
    }
    public async createSaheefaAlsajadeaBook(): Promise<number> {
        try {
          


            const data = await await prisma.bookItems.findFirst({ where: {book_name: "الصحيفة السجادية" ,book_type:BookType.BOOK} })
            if (data) {
              
                return data.id;
            }
            const data1 =   await prisma.bookItems.create({ data: {  book_name: "الصحيفة السجادية",book_type:BookType.BOOK } });
            kdp("alsahefa alsajadea book  added", 'g');
            return data1.id;
        }
        catch (e) {
            kdp("alsahefa alsajadea error"+e, 'e');
            return -1;
        }
    }
    public async createAlkafeeBookInfo(): Promise<number> {
        let bookId = -1;
        try {
        
            const data = await await prisma.bookItems.findFirst({ where: {book_name: "اصول الكافي" ,book_type:BookType.BOOK} })
            if (data) {
              
                return data.id;
            }
            const book =   await prisma.bookItems.create({ data: {  book_name:"اصول الكافي",book_type:BookType.BOOK } });
            bookId = book.id;
            kdp("alkafee book added", 'g');
            return bookId;
        }
        catch (e) {
            kdp("alkafee book error"+e, 'r');
        return bookId;
        }
    }
    public async createAdwaOnhusseinBook(): Promise<number> {
        let bookId = -1;
        try {
          
            const data = await await prisma.bookItems.findFirst({ where: {book_name: "أضواء على ثورة الحسين" ,book_type:BookType.BOOK} })
            if (data) {
              
                return data.id;
            }
            const book =   await prisma.bookItems.create({ data: {  book_name:"أضواء على ثورة الحسين",book_type:BookType.BOOK } });
            bookId = book.id;

            kdp("createAdwaOnhusseinBook book added", 'g');
           
            return bookId;
        }
        catch (e) {
            kdp("createAdwaOnhusseinBook book error"+e, 'r');
        return bookId;
        }
    }

}
export default SeedService;