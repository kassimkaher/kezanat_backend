import express from 'express';
const router = express();
router.get("/test",(req: any, response: any)=>
    response.status(200).send({ "status": true, "message": "test done" })
);  
export default router;