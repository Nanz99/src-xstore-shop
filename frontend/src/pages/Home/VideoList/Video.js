import React from 'react'
import ModalYoutubeConfig from './ModalYoutube'

function Video({ link, title, }) {
   const [open, setOpen] = React.useState(false);

   const handleOpen = () => {
      setOpen(true);
   };
   const handleClose = () => {
      setOpen(false);
   };
   const videoId = link
      ?.split('')
      .reverse()
      .slice(0, 11)
      .reverse()
      .join('');
   return (
      <>
         <ModalYoutubeConfig open={open} videoId={videoId} handleClose={handleClose} />
         <div className="video__item" >
            <div className="video__image">
               <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} alt="thumbnal" style={{ borderRadius: '8px', overflow: 'hidden' }} />
               <span className="playvideo" onClick={handleOpen} >
                  <i className="material-icons">play_arrow</i>
               </span>
            </div>
            <h3>{title}</h3>
         </div>
      </>
   )
}

export default Video