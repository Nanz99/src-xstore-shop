import React from "react"

function Stars({ stars, reviews }) {
   const tempStars = Array.from({ length: 5 }, (_, index) => {
      const number = index + 0.5
      return (
         <span key={index} className="text-yellow-400">
            {stars > number ? (
              <i className="material-icons">star</i>
            ) : stars > index ? (
					<i className="material-icons">star_half</i>
            ) : (
					<i className="material-icons">star_border</i>
            )}
         </span>
      )
   })
   return (
      <div className="flex items-center mb-3">
         <div className="stars">{tempStars}</div>
         <p className="reviews ml-2">({reviews} customer reviews)</p>
      </div>
   )
}

export default React.memo(Stars)
