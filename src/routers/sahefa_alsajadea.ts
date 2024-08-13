import express from 'express';
import SahefaAlsajadeaController from '../controllers/SahefaAlsajadeaController';




const sahefaAlsajadeaController = new SahefaAlsajadeaController();

const sahefaAlsajadeaRout = express();


sahefaAlsajadeaRout.route("/")
.post(sahefaAlsajadeaController.migration);





export default sahefaAlsajadeaRout;