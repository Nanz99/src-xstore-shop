import { login } from 'actions/authActions';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import Facebook from './Facebook'
import Google from './Google'
import { useHistory } from 'react-router-dom';

function Signin(props) {
   const dispatch = useDispatch();
   const history = useHistory()
   const [passWord, setPassWord] = useState('')
   const [email, setEmail] = useState('')
   const { userInfo, error: errorLogin } = useSelector((state) => state.authLogin);
   const handleLogin = (e) => {
      e.preventDefault();
      dispatch(login(email, passWord))
   }
   // const redirect = props.location.search
   //    ? props.location.search.split("=")[1]
   //    : "/";


   useEffect(() => {
      if (userInfo) {
         toast.success("🦄 Đăng Nhập Thành Công!")
         history.push("/");
      }
      if (errorLogin) {
         toast.error(errorLogin)
      }
   }, [history,errorLogin, userInfo]);

  return (
    <div>
        <form action="" className="sign-in-form" onSubmit={handleLogin}>
           <h2 className="title">Đăng Nhập</h2>
           <div className="input-field">
              <i className="fas fa-envelope" />
              <input
                 type="text"
                 placeholder="Email"
                 onChange={(e) => setEmail(e.target.value)}
              />
           </div>
           <div className="input-field">
              <i className="fas fa-lock" />
              <input type="password" placeholder="Password"
                 onChange={(e) => setPassWord(e.target.value)
                 } />
           </div>
           <button type="submit" className="btn solid"> Đăng nhập</button>
           <h5>hoặc</h5>
           <p className="social-text">Or Sign in with social platforms</p>
           <div className="social-media">
              {/* <Link to="/" className="social-icon"> */}
              <Google />
              {/* </Link> */}
              <Facebook />



           </div>
        </form>
    </div>
  )
}

export default Signin