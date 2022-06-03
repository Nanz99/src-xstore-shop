import axios from "axios";
import { AUTH_ACCOUNT_ACTIVE, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_SIGNUP_REQUEST, USER_SIGNUP_SUCCESS } from "constants/authConstants";
import { toast } from "react-toastify";
import {  setCookie, setLocalStorage } from "utils/helper";

export const login = (email, password) => async (dispatch) => {
   dispatch({ type: USER_LOGIN_REQUEST, payload: { email, password } });
   try {
      const { data } = await axios.post(
         "/api/auth/signin",
         { email, password }
      ).catch(error => {
         toast.error(error.response.data.error);
      });
      setCookie('token', data.token);
      setLocalStorage('userInfo', data.user);
      dispatch({
         type: USER_LOGIN_SUCCESS,
         payload: data,
      });
      // localStorage.setItem("userInfo", JSON.stringify(data));
   } catch (error) {
      // dispatch({
      //    type: USER_LOGIN_FAIL,
      //    payload:
      //       error.response && error.response.data.message
      //          ? error.response.data.message
      //          : error.message,
      // });
   }
};
export const googleLogin = (idToken) => async (dispatch) => {
   try {
      const { data } = await axios.post(
         "/api/auth/signin",
         { idToken }
      ).catch(error => {
         toast.error(error.response.data.error);
      });
      setCookie('token', data.token);
      setLocalStorage('userInfo', data.user);
      dispatch({
         type: USER_LOGIN_SUCCESS,
         payload: data,
      });
      // localStorage.setItem("userInfo", JSON.stringify(data));
   } catch (error) {
      // dispatch({
      //    type: USER_LOGIN_FAIL,
      //    payload:
      //       error.response && error.response.data.message
      //          ? error.response.data.message
      //          : error.message,
      // });
   }
};


export const signup = (name, email, password) => async (dispatch) => {
   dispatch({ type: USER_SIGNUP_REQUEST, payload: { name, email, password } });
   try {
      const { data } = await axios.post(
         "/api/auth/signup",
         {
            name,
            email,
            password,
         }
      ).then().catch(error => {
         toast.error(error.response.data.error);
      });
     
      dispatch({
         type: USER_SIGNUP_SUCCESS,
         payload: data,
      });
   } catch (error) {
      // dispatch({
      //    type: USER_SIGNUP_FAIL,
      //    payload: error.response && error.response.data.message
      //       ? error.response.data.message
      //       : error.message,
      // });
   }
};

export const accountActive = (token) => async (dispatch) => {
   try{
      const { data } =  await axios.post(
         "/api/auth/account-activation",
         {
            token
         }
      )
       dispatch({
         type: AUTH_ACCOUNT_ACTIVE,
         payload: data,
      });
   }catch(error){
      toast.error(error)
   }

     
     
  
};

