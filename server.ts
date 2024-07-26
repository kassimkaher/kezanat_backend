


import dotenv from "dotenv";
import express, { Express } from "express";
import DB from './src/db';
import router from './src/router';
dotenv.config();
const db = new DB();


const app: Express = express();

app.use(express.json());  // to parse application/json
app.use(express.urlencoded({ extended: true }));  // to parse application/x-www-form-urlencoded




const port = process.env.PORT || 3000;

db.connect().then((res) => {
    app.use("/api",router);
    
   
}).catch((err) => { 
     app.get("/connection",(req: any, response: any)=>{
  
    response.status(500).send({ "status": true, "message": "db not connect" });})

});

   
  
   


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});