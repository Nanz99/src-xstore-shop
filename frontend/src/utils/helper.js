export const formatPrice = (price) =>{
	return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export const getUniqueValues = (data, type) => {
   let unique = data.map((item) => item[type])
   if (type === 'colors') {
     unique = unique.flat()
   }
 
   return [ ...new Set(unique)]
 }
 

 export const baseUrl = '/images'