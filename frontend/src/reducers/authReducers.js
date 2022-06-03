
import { AUTH_ACCOUNT_ACTIVE, GOOGLE_LOGIN, USER_LOGIN_REQUEST } from 'constants/authConstants';
import { USER_LOGIN_SUCCESS } from 'constants/authConstants';
import { USER_LOGIN_FAIL } from 'constants/authConstants';
import { USER_SIGNOUT } from 'constants/userConstants';
import { USER_SIGNUP_REQUEST } from 'constants/authConstants';
import { USER_SIGNUP_SUCCESS } from './../constants/authConstants';
import { USER_SIGNUP_FAIL } from 'constants/authConstants';

export const authLoginReducer = (state = {}, action) => {
   switch (action.type) {
      case USER_LOGIN_REQUEST:
         return { loading: true };
      case USER_LOGIN_SUCCESS:
         return { loading: false, userInfo: action.payload.user , error: action.payload.error };
      case GOOGLE_LOGIN:
         return { loading: false, userInfo: action.payload.user , error: action.payload.error };
      case USER_LOGIN_FAIL:
         return { loading: false, error: action.payload };
      case USER_SIGNOUT:
         return {};
      default:
         return state;
   }
};
export const authSignupReducer = (state = {}, action) => {
   switch (action.type) {
      case USER_SIGNUP_REQUEST:
         return { loading: true };
      case USER_SIGNUP_SUCCESS:
         return { loading: false, message: action.payload.message};
      case USER_SIGNUP_FAIL:
         return { loading: false, error: action.payload };
      case AUTH_ACCOUNT_ACTIVE: 
         return { loading: false, verify : false, message: action.payload.message || '', error: action.payload.error || ''};
      default:
         return state;
   }
};