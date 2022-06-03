import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import crypto from "crypto";
import { OAuth2Client } from 'google-auth-library';
// import { mailgun } from '../utils.js';
import mailgun from 'mailgun-js'
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
// export const signup = (req, res, next) =>{
//    console.log('REQ.BODY', req.body);
//    const {name, email, password} = req.body;
//    User.findOne({email: email}).exec((err, user) => {
//       if(err){
//          return res.status(500).json({
//             error: err
//          });
//       }
//       if(user){
//          return res.status(400).json({
//             error: 'Email already exists'
//          });
//       }
//       const newUser = new User({
//          name: name,
//          email: email,
//          password: password
//       });
//       newUser.save((err, user) => {
//          if(err){
//             return res.status(500).json({
//                error: err
//             });
//          }
//          return res.status(201).json({
//             message: 'User created successfully. Please login.' ,
//             user: user
//          });
//       });
//    })
// }


export const signup = (req, res) => {
   const { name, email, password } = req.body;

   User.findOne({ email }).exec((err, user) => {
      if (user) {
         return res.status(400).json({
            error: 'Email already exists'
         });
      }
      const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10d' });
      try {

         const data = {

            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Account activation link`,
            html: `
                <h1>Please use the following link to activate your account</h1>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `

         };
         mg.messages().send(data, function (error, body) {
            if(error) {
               return res.json({
                  message: error
               });
            }
            return res.json({
               message: `Email has been sent to ${email}. Follow the instruction to activate your account`
            });
         });
      } catch (error) {
         console.log(error);
      }
   });
};

export const accountActivation = (req, res) => {
   const { token } = req.body;

   if (token) {
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decoded) {
         if (err) {
            console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
            return res.status(401).json({
               error: 'Expired link. Signup again'
            });
         }

         const { name, email, password } = jwt.decode(token);

         const _salt = Math.round(new Date().valueOf() * Math.random()) + '';
         // const _password = crypto.createHmac("sha1", _salt).update(password).digest("hex");
         const _password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
         const user = new User({ name, email, password: _password });
         user.salt = _salt;
         user.isActive = true;
         user.save((err, user) => {
            if (err) {
               console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
               return res.status(401).json({
                  error: 'Error saving user in database. Try signup again'
               });
            }
     
            return res.json({
               message: 'Signup success. Please signin.'
            });
         });
      });
   } else {
      return res.json({
         message: 'Something went wrong. Try again.'
      });
   }
};

export const signin = (req, res) => {
   const { email, password } = req.body;
   // check if user exist
   User.findOne({ email }).exec((err, user) => {
      if (err || !user) {
         return res.status(400).json({
            error: 'User with that email does not exist. Please signup'
         });
      }
      // authenticate
      if (!bcrypt.compareSync(password, user.password)) {
         return res.status(400).json({
            error: 'Email and password do not match'
         });
      }
      // generate a token and send to client
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      const { _id, name, email, role, address, status, birthday, gender, numberPhone } = user;

      return res.json({
         token,
         user: 
            { _id, name, email, role, address, status, birthday, gender, numberPhone }
      });
   });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = (req, res) => {
   const { idToken } = req.body;

   client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }).then(response => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
         User.findOne({ email }).exec((err, user) => {
            if (user) {
               const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
               const { _id, email, name, role } = user;
               return res.json({
                  token,
                  user: { _id, email, name, role }
               });
            } else {
               let password = email + process.env.JWT_SECRET;
               user = new User({ name, email, password });
               user.save((err, data) => {
                  if (err) {
                     console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                     return res.status(400).json({
                        error: 'User signup failed with google'
                     });
                  }
                  const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                  const { _id, email, name, role } = data;
                  return res.json({
                     token,
                     user: { _id, email, name, role }
                  });
               });
            }
         });
      } else {
         return res.status(400).json({
            error: 'Google login failed. Try again'
         });
      }
   });
};

export const facebookLogin = (req, res) => {
   console.log('FACEBOOK LOGIN REQ BODY', req.body);
   const { userID, accessToken } = req.body;

   const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

   return (
      fetch(url, {
         method: 'GET'
      })
         .then(response => response.json())
         // .then(response => console.log(response))
         .then(response => {
            const { email, name } = response;
            User.findOne({ email }).exec((err, user) => {
               if (user) {
                  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                  const { _id, email, name, role } = user;
                  return res.json({
                     token,
                     user: { _id, email, name, role }
                  });
               } else {
                  let password = email + process.env.JWT_SECRET;
                  user = new User({ name, email, password });
                  user.save((err, data) => {
                     if (err) {
                        console.log('ERROR FACEBOOK LOGIN ON USER SAVE', err);
                        return res.status(400).json({
                           error: 'User signup failed with facebook'
                        });
                     }
                     const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                     const { _id, email, name, role } = data;
                     return res.json({
                        token,
                        user: { _id, email, name, role }
                     });
                  });
               }
            });
         })
         .catch(error => {
            res.json({
               error: 'Facebook login failed. Try later'
            });
         })
   );
};
