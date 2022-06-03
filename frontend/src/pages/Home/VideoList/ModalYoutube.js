import React from 'react';
import { Backdrop, Fade, Modal } from '@mui/material';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles(theme => ({
   modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   paper: {
      backgroundColor: 'transparent',
      zIndex: 1000,
   },
}));

export default function ModalYoutubeConfig({ open, videoId, handleClose }) {
   const classes = useStyles();
   // const linkLength = link.length;



   return (
      <div>
         {/* <button type="button" onClick={handleOpen}>
        react-transition-group
      </button> */}
         <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
               timeout: 500,
            }}
         >
            <Fade in={open}>
               <div className={classes.paper}>
                  <iframe
                     autoplay
                     width="900"
                     height="550"
                     src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                     // src={`https://www.youtube.com/embed/vwRlKqDltlI`}

                     title="YouTube video player"
                     frameborder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowfullscreen
                  ></iframe>
               </div>
            </Fade>
         </Modal>
      </div>
   );
}
