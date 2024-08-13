import express from 'express';
import AuthController from '../controllers/auth/AuthController';



import { checkAuth, isVerify } from '../middleware/auth/AuthMiddleware';

const auth = new AuthController();

const userRouter = express();

userRouter.route("/user")
.get(checkAuth,isVerify,auth.profile)
.post(auth.createUser);
userRouter.route("/login")

.post(auth.login);


export default userRouter;