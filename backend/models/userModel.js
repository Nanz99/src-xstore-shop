/** @format */

import mongoose from "mongoose";
// import crypto from "crypto";


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    isAdmin: { type: Boolean, default: false },
    birthday: { type: Date, default: null },
    numberPhone: { type: String, default: null},
    gender: { type: String, default: null},
    role:{ type: String, default: 'customer'},
    salt: { type: String},
    resetPasswordLink: { type: String, default: ''},
    isActive: { type: Boolean, default: false},
    address: { type: String, default: null},
    status : {type : Number, default: 0}
  },
  {
    timestamps: true,
  }
);

//virtual
// userSchema.virtual("hash_password").set(function (hash_password) {
//   this._password = hash_password;
//   this.salt = this.makeSalt();
//   this.password = this.encryptPassword(hash_password);
// }).get(function () {
//     return this._password;
//   }
// );

// userSchema.methods = {
//   authenticate: function (plainText) {
//     return this.encryptPassword(plainText) === this.password; // true false
//   },
//   encryptPassword: function (hash_password) {
//     if (!hash_password) return "";
//     try {
//       return crypto
//         .createHmac("sha1", this.salt)
//         .update(hash_password)
//         .digest("hex");
//     } catch (err) {
//       return "";
//     }
//   },
//   makeSalt: function () {
//     return Math.round(new Date().valueOf() * Math.random()) + '';
//   }, 
  
// }

// userSchema
//   .virtual('password')
//   .set(function (password) {
//     this._password = password;
//     this.salt = this.makeSalt();
//     this.hashed_password = this.encryptPassword(password);
//   })
//   .get(function () {
//     return this._password;
//   });

// // methods
// userSchema.methods = {
//   authenticate: function (plainText) {
//     return this.encryptPassword(plainText) === this.hashed_password; // true false
//   },

//   encryptPassword: function (password) {
//     if (!password) return '';
//     try {
//       return crypto
//         .createHmac('sha1', this.salt)
//         .update(password)
//         .digest('hex');
//     } catch (err) {
//       return '';
//     }
//   },

//   makeSalt: function () {
//     return Math.round(new Date().valueOf() * Math.random()) + '';
//   }
// };
const User = mongoose.model("User", userSchema);

export default User;
