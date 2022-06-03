import { Box, Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { accountActive } from 'actions/authActions';
import React, {  useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import iconSuceed from "../../assets/images/boxSuccess.png";
// import iconFailed from "../../assets/images/iconFailed.png";


const useStyles = makeStyles((theme) => ({
   successContainer: {
      backgroundImage: `url("img/backgroundRegister.png")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '80px 0',
      fontSize: 12,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
   },
   successContent: {
      position: 'relative',
      width: '55%',
      backgroundColor: 'white',
      borderRadius: 4,
      paddingTop: 48,
      paddingBottom: 34,
      '& h3': {
         fontSize: 24,
         margin: '0 0 14px 0',
         textDecoration: 'unset'
      },
      '& p': {
         fontSize: 14,
         margin: 0,
      },
   },
   imgSuccess: {
      width: 150,
      margin: '0 auto',
      '& img': {
         width: '100%',
      },
   },
   boxSuccess: {
      position: 'absolute',
      bottom: -28,
      left: -34,
   },

   button: {
      width: 280,
      marginTop: 32,
      '&:hover': {
         backgroundColor: 'white',
         border: '1px solid #4762ad'
      }
   },

 
}))

function Activate({match}){

   // const userInfo = useSelector(state => state.auth.userInfo);
   const classes = useStyles();
   const history = useHistory();
   const dispatch = useDispatch();
   // const [verified,setVerified] = useState(true);
   const { message, error } = useSelector((state) => state.authSignup);



   useEffect(() => {
      let token = match.params.token;
      if(token) {
         dispatch(accountActive(token))
      }
   }, [dispatch, match])
   useEffect(() => {
      if(message && message !== ''){
         toast.success(message)
      }
      if(error && error !== ''){
         toast.error(error)
      }
   }, [message, error])

   return (
      <div>
         {/* {verify ? ( */}
            <Box textAlign="center" component="div" className={classes.successContainer}>
               <Box className={classes.successContent} component="div">
                  <Box component="div" className={classes.imgSuccess}>
                  <img src={iconSuceed} alt="successicon" /> 
                    
                  </Box>
                  <Typography variant='h3' style={{ marginTop: 20 }}> Xác thực thành công </Typography>
                  <Button
                     simple
                     round
                     onClick={() => history.push('/auth')}
                     className={classes.button}
                     variant="outlined"
                     color="primary"
                     type="submit"
                  >
                        Đăng nhập ngay
                  </Button>
              
               </Box>
            </Box>
         {/* ) : (
            <Box textAlign="center" component="div" className={classes.successContainer}>
               <Box className={classes.successContent} component="div">
                  <Box component="div" className={classes.imgSuccess}>
                     <img src={iconFailed} atl="Email verified failed" />
                  </Box>
                  <Typography variant='h3' style={{ marginTop: 20 }}>Xác thực thất bại</Typography>
                  <Button
                     simple
                     round
                     onClick={handleOnClick}
                     className={classes.button}
                     variant="outlined"
                     color="primary"
                     type="submit"
                     
                  >
                     Gửi lại xác thực
                  </Button>
                  {/* <img className={classes.boxSuccess} src={iconFailed} atl="success icon" /> */}
               {/* </Box>
            </Box> */}
         {/* )} */} 
      </div>
   );
}


export default Activate