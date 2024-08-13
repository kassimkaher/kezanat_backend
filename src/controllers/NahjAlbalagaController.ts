

import { PrismaClient } from '@prisma/client';

import NahjAlbalagaService from '../services/NahjAlbalagaService';

const nahjAlbalagaService = new NahjAlbalagaService();
const prisma = new PrismaClient()




class NahjAlbalagaController {

    public constructor() {

    }


    public async migration(req: any, response: any) {

        return await nahjAlbalagaService.migrationNahjAlbalaga(req, response);

    }
   






}
export default NahjAlbalagaController;