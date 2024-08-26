

import dotenv from "dotenv";
import express from "express";


import router from './src/routers/router';
dotenv.config();

const app = express();

app.use(express.json());  // to parse application/json
app.use(express.urlencoded({ extended: true }));  // to parse application/x-www-form-urlencoded

app.get('/', (req, res) => {
  return res.send(  '<h1> Welcome to Alkafee API </h1>');
  
});
   


const port = process.env.PORT || 3000;

app.use("/api",router);
   
  
   


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});