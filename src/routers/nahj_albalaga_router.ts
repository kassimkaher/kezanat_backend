import express from 'express';
import NahjAlbalagaController from '../controllers/NahjAlbalagaController';




const nahjAlbalagaController = new NahjAlbalagaController();

const nahjRouter = express();


nahjRouter.route("/")

.post(nahjAlbalagaController.migration);





export default nahjRouter;