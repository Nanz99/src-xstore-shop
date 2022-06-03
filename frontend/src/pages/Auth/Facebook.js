import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const Facebook = () => {
   const responseFacebook = response => {
      console.log(response);
      axios({
         method: 'POST',
      
         url: `${process.env.API_SERVER_URL}/api/auth/facebook-login`,
         data: { userID: response.userID, accessToken: response.accessToken }
      })
         .then(response => {
            console.log('FACEBOOK SIGNIN SUCCESS', response);
            // inform parent component
            // informParent(response);
         })
         .catch(error => {
            console.log('FACEBOOK SIGNIN ERROR', error.response);
         });
   };
   return (
      <div className="pb-3">
         <FacebookLogin
            appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
            autoLoad={true}
            callback={responseFacebook}
            render={renderProps => (
               <button onClick={renderProps.onClick} type="button" style={{with:'200px', padding: '0px', backgroundColor: 'rgb(255, 255, 255)', display: 'inline-flex', alignItems: 'center', color: 'rgba(0, 0, 0, 0.54)', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 2px 2px 0px, rgba(0, 0, 0, 0.24) 0px 0px 1px 0px', 'borderRadius': '2px', border: '1px solid transparent', fontSize: '14px', fontWeight: '500', fontFamily: 'Roboto, sans-serif'}}>
                  <i className="fab fa-facebook pr-2" style={{padding:'10px', color:'blue', fontSize: '18px', fontWeight: '500'}}></i> 
                  <span style={{fontSize: '14px', fontWeight: '500', padding: '10px'}}> Sign in with Facebook</span>
               </button>
            )}
           
            icon="fa-facebook"
         />
         {/* <FacebookLogin
            appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
            autoLoad={false}
            callback={responseFacebook}
            render={renderProps => (
               <button onClick={renderProps.onClick} className="btn btn-primary btn-lg btn-block">
                  <i className="fab fa-facebook pr-2"></i> Login with Facebook
               </button>
            )}

         /> */}
      </div>
   );
};

export default Facebook;
