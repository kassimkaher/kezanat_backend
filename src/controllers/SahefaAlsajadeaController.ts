

import { PrismaClient } from '@prisma/client';

import SahefaAlsajadeaService from '../services/SahefaAlsajadeaService';

const sahefaAlsajadeaService = new SahefaAlsajadeaService();
const prisma = new PrismaClient()




class SahefaAlsajadeaController {

    public constructor() {

    }


    public async migration(req: any, response: any) {

        return await sahefaAlsajadeaService.migration(req, response);

    }
   




}
export default SahefaAlsajadeaController;