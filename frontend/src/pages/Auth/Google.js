import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { GOOGLE_LOGIN } from 'constants/authConstants';


const Google = () => {
   const dispatch = useDispatch();
   const responseGoogle = response => {
    
      axios({
         method: 'POST',
         url: `${process.env.API_SERVER_URL}/api/auth/google-login`,
         data: { idToken: response.tokenId }
      })
         .then(response => {
            console.log('GOOGLE SIGNIN SUCCESS', response);
            dispatch({ type: GOOGLE_LOGIN , payload: response.data});
            // inform parent component
            // informParent(response);
         })
         .catch(error => {
            console.log('GOOGLE SIGNIN ERROR', error.response);
         });
   };
   return (
      <div className="pb-2">
         {/* <GoogleLogin/> */}
         <GoogleLogin
            clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            style={{width:'200px !important'}}
            // render={renderProps => (
               // <button
               //    onClick={renderProps.onClick}
               //    disabled={renderProps.disabled}
               //    style={{ 
               //       backgroundColor: '#fff',
               //       border: '1px solid #000',
               //       height: '42px',
               //       width: '42px',
               //       borderRadius: '50%'
               //    }}
               // >
               //    <i className="fab fa-google pr-2"></i>
               // </button>
            // )}
            cookiePolicy={'single_host_origin'}
         />
      </div>
   );
};

export default Google;
