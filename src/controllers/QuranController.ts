

import { PrismaClient } from '@prisma/client';

import QuranService from '../services/QuranService';

const quranService = new QuranService();
const prisma = new PrismaClient()




class QuranController {

    public constructor() {
       
    }


    public async createQuran(req: any, response: any) {

return await quranService.createQuran(req, response);

    }
    public async getQuran(req: any, response: any) {

        return await quranService.getQuran(req, response);
        
            }
           
}
export default QuranController;