
import nodemailer from "nodemailer";
import { IResponse, errorResponse, sucessResponse } from "../interfaces/ResponseInterFace";
class MailService {



    public async sendCode(code:string,email:string):Promise<IResponse>{
       try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: 'kezanat.alsama@gmail.com', // generated ethereal user
              pass: 'uiya ijdk vbcz prnb', // generated ethereal password
            },
          });
           // send mail with defined transport object
  let info = transporter.sendMail({
      from: '"bahar', // sender address
      to: email, // list of receivers
      subject: "verfication Code", // Subject line
      text: "your code is ", // plain text body
      html: "<b>" + code + "</b>", // html body
  });

  return sucessResponse("info.messageId",email);
  

       } catch (error) {
       return errorResponse("error",error);
       }
    }
}


export default MailService;