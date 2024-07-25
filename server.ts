


import dotenv from "dotenv";
import express, { Express } from "express";
import router from './src/router';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
 app.use("/api",router);


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});