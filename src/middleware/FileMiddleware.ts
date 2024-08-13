import util from "util";
import multer from "multer";





import formidable  from 'formidable';





export async function isFile(req: any, response: any, next: any) {
  var form =  formidable({multiples:false});


try {
  form.parse(req, function (err:any, fields:any, files:any) {
    if (files != null) {
      req.file =files.file
      return next()
    }
    return response.status(401).json({ "status": false, "message": "file not found" });
     });
} catch (error) {
  return response.status(401).json({ "status": false, "message": error}); 
}



}



const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,process.env.PUBLICPATH!);
  },
  filename: (req, file, cb) => {
   
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
  export default uploadFileMiddleware


