import React, { useEffect, useState } from 'react'
import './_Login.css'
import imglogin from '../../assets/images/log.svg'
import imgregister from '../../assets/images/register.svg'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { login, signup } from 'actions/authActions'
import Meta from 'components/Meta/Meta'
import Google from 'pages/Auth/Google'
import Facebook from 'pages/Auth/Facebook'


function _Login(props) {
   const dispatch = useDispatch();
   const [isSignUp, setIsSignUp] = useState(false);
   const [name, setName] = useState('')
   const [passWord, setPassWord] = useState('')
   const [email, setEmail] = useState('')
   const { userInfo, error: errorLogin } = useSelector((state) => state.authLogin);
   const { message: messageSignup } = useSelector((state) => state.authSignup);



   const addSignUp = () => {
      setIsSignUp(true)
   }
   const removeSignUp = () => {
      setIsSignUp(false)
   }

   const handleLogin = (e) => {
      e.preventDefault();
      dispatch(login(email, passWord))
   }

   const handleSignup = (e) => {
      e.preventDefault();
      dispatch(signup(name, email, passWord));
   }


   const redirect = props.location.search
      ? props.location.search.split("=")[1]
      : "/";


   useEffect(() => {
      if (userInfo) {
         toast.success("🦄 Đăng Nhập Thành Công!")
         props.history.push(redirect);
      }
      if (errorLogin) {
         toast.error(errorLogin)
      }
   }, [props.history, errorLogin, messageSignup, redirect, userInfo]);
   useEffect(() => {
      if (messageSignup) {
         toast.success(messageSignup)
      }
   }, [messageSignup])
   return (
      <>
         <Meta title="Đăng Nhập" />

         <div className={`login-container ${isSignUp ? 'sign-up-mode' : null} `}>
            <div className="forms-container">
               <div className="signin-signup">
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
                         <Facebook/>

                       

                     </div>
                  </form>
                  {/* Form Dang ky */}
                  <form action="" className="sign-up-form" onSubmit={handleSignup}>
                     <h2 className="title">Đăng ký</h2>
                     <div className="input-field">
                        <i className="fas fa-user" />
                        <input type="text" placeholder="Your Name" onChange={(e) => setName(e.target.value)} />
                     </div>

                     <div className="input-field">
                        <i className="fas fa-envelope" />
                        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                     </div>
                     <div className="input-field">
                        <i className="fas fa-lock" />
                        <input type="password" placeholder="Password" onChange={(e) => setPassWord(e.target.value)} />
                     </div>

                     <button type="submit" className="btn" >Đăng kí </button>
                     {/* <input type="text" className="btn" value="Đăng kí" onClick={signUpWeb} /> */}

                     <p className="social-text">Or Sign up with social platforms</p>
                     {/* <div className="social-media">
                        <Link to="/" className="social-icon">
                           <i className="fab fa-facebook-f" />
                        </Link>
                        <Link to="/" className="social-icon">
                           <i className="fab fa-twitter" />
                        </Link>
                        <Link to="/" className="social-icon">
                           <i className="fab fa-google" />
                        </Link>
                        <Link to="/" className="social-icon">
                           <i className="fab fa-linkedin-in" />
                        </Link>
                     </div> */}
                  </form>
               </div>
            </div>
            <div className="panels-container">
               <div className="panel left-panel">
                  <div className="content">
                     <h3>New here ?</h3>
                     <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
                        ex ratione. Aliquid!
                     </p>
                     <button className="btn transparent" id="sign-up-btn" onClick={addSignUp}>
                        Đăng kí
                     </button>
                  </div>
                  <img src={imglogin} className="image" alt="" />
               </div>
               <div className="panel right-panel">
                  <div className="content">
                     <h3>One of us ?</h3>
                     <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
                        laboriosam ad deleniti.
                     </p>
                     <button className="btn transparent" id="sign-in-btn" onClick={removeSignUp}>
                        Đăng nhập
                     </button>
                  </div>
                  <img src={imgregister} className="image" alt="" />
               </div>
            </div>
         </div>
      </>

   )
}

export default _Login