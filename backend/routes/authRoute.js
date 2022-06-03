import express from "express";
import { accountActivation, facebookLogin, googleLogin, signin, signup } from "../controllers/auth";
import { runValidation } from "../validators";
import { userSigninValidator, userSignipValidator } from "../validators/auth";


const authRouter = express.Router();

authRouter.post('/signup',userSignipValidator, runValidation, signup);
authRouter.post('/signin',userSigninValidator, runValidation, signin);
authRouter.post('/account-activation', accountActivation);
authRouter.post('/google-login',googleLogin);
authRouter.post('/facebook-login',facebookLogin);




export default authRouter;