


import { PrismaClient, UserRoles } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { errorResponse } from "../../interfaces/ResponseInterFace";
const prisma = new PrismaClient()
export async function checkAuth(req: any, response: any, next: any) {


  const token = req.headers.authorization;

  if (token == null) {
    return response.status(401).json({ "status": false, "message": "token is required" });
  }

  try {
    const user = jwt.verify(token, process.env.TOKEN_KEY!) as JwtPayload
    req.user_id = user.id;
    req.role_id = user.role_id;
    const code = user.code;

    const isFound = await prisma.token.findMany({
      where: {
        user_id: user.id,
        code: code
      },
      orderBy: {
        id: 'desc',
      },
      take: 1,
    })




    if (!isFound) {
      return response.status(401).json({ "status": false, "message": "token is blacklist" });
    }

    return next();
  } catch (error) {
    return response.status(401).json({ "status": false, "message": error, });
  }


}

export async function isVerify(req: any, response: any, next: any) {


  const id = req.user_id;
  if (id == null) {
    return response.status(401).json({ "status": false, "message": "user not found" });
  }
  const user1 = await prisma.user.findFirst({
    where: {
      id

    },

  });

  if (user1!.verified) {
    req.id = user1!.id
    return next()
  }



  return response.status(401).json({ "status": false, "message": "user not verfied", });



}


export async function isAdmin(req: any, response: any, next: any) {


  const id = req.user_id;
  if (id == null) {
    return response.status(401).json({ "status": false, "message": "user not found" });
  }
  const user1 = await prisma.user.findFirst({
    where: {
      id

    },

  });

  if (user1!.role_id == UserRoles.ADMIN) {

    return next()
  }



  return response.status(401).json({ "status": false, "message": "user not permition", });




}


export async function isUser(req: any, response: any, next: any) {



  const id = req.user_id;
  const role_id = req.role_id;
  if (id == null) {
    return response.status(401).json({ "status": false, "message": "user not found" });
  }


  if (role_id == UserRoles.USER) {

    return next()
  }



  return response.status(401).json({ "status": false, "message": "user not permition", });



}

export async function logout(req: any, response: any, next: any) {



  const token = req.headers.authorization;



  try {
    const user = jwt.verify(token, process.env.TOKEN_KEY!) as JwtPayload


    const code = user.code;

    await prisma.token.delete({
      where: {
        code
      }
    });
    return response.status(200).json({ "status": true, "message": "user is logout" });
  } catch (error) {
    return response.status(402).json({ "status": false, "message": "error logout", });
  }


}

export async function validate(req: any, response: any, next: any) {
  const { name, phone, email, password, gander, barthday } = req.body;
 // Validate user input
 if (!(name && phone && email && password && gander)) {
  return response.status(400).send(errorResponse("All Input required", "All Input required"));

}
if (isNaN(Date.parse(barthday))) {
  return response.status(400).send(errorResponse("date is not valid", "date is not valid"));

}
return next()

}