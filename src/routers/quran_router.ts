import express from 'express';


import QuranController from '../../src/controllers/QuranController';


const quranController = new QuranController();

const quranRouter = express();


quranRouter.route("/")
.get(quranController.getQuran)
.post(quranController.createQuran);



export default quranRouter;