import React, { useEffect, useState } from "react"

function ScrollToTop({showBelow}) {
   const [show, setShow] = useState(showBelow ? false : true)
   const handleScroll = () => {
      if (window.pageYOffset > showBelow) {
         if (!show) setShow(true)
      } else {
         if (show) setShow(false)
      }
   }
   useEffect(() => {
      if (showBelow) {
         window.addEventListener("scroll", handleScroll)
         return () => window.removeEventListener("scroll", handleScroll)
      }
   })
   const handleClick = () => {
      window["scrollTo"]({ top: 0, behavior: "smooth" })
   }
   return (
      <div>
         {show && (
            <button className="bg-red-1 text-base fixed right-0 bottom-1/2 w-10 h-10 z-50" onClick={handleClick}>
              <i className="fa fa-angle-up"></i>
            </button>
         )}
      </div>
   )
}
export default React.memo(ScrollToTop)