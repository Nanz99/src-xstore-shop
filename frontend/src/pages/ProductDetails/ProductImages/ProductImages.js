import React, { useState } from 'react'

function ProductImages({images}) {
	const [mainImg,setMainImg] = useState(images[0])
	return (
		<div className="grid grid-cols-2-10-90 pr-4 ">
			<div>
				<ul>
					{images.map((image,index)=>{
						return (
							<li key={index} className="my-2 cursor-pointer" onClick={() => setMainImg(images[index])}>
								<img src={image.url} alt={image.id} className="block w-full"  />
							</li>
						)
					})}
				</ul>
			</div>
			<div className="pl-5">
				<img src={mainImg.url || images[0].url} alt={mainImg.id} className="w-full block" />
			</div>
		</div>
	)
}

export default ProductImages
