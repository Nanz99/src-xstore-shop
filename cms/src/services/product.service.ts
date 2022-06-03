import { fetch, fetchAuth } from '@/utils/request'
import { method } from 'lodash'
import { stringify } from 'querystring'
// Explain: 1: route dc goi toi ==> 2:Service gui request toi API
// ==> 3. fetch du lieu va tra ve kq tu file request trong folder utils
// ==> 4:
const routes = {
  getAllProducts: 'product/with-auth',
  createProduct: 'product',
  //screenshot
  createProductScreenShot: id => `product/${id}/screenshot`,
  deleteScreenShot: screenshotID => `product/screenshot/${screenshotID}`,

  //gallery
  createProductGallery: id => `product/${id}/gallery`,
  deleteGallery: galleryId => `product/gallery/${galleryId}`,

  getDetailProduct: id => `product/${id}/admin`,
  editProduct: id => `product/${id}`,
  deleteProduct: id => `product/delete/${id}`,
  publishProduct: id => `product/${id}/publish`,
  unpublishProduct: id => `product/${id}/unpublish`,
  editCondition: id => `product/${id}/editCondition`,
  putIsHot: id => `product/${id}/isHot`,
  putIsSale: id => `product/${id}/isSale`,
  postSale: 'sale',

  //Stock IN
  getListStockin: 'stockin',
  createStockin: 'stockin',
  getDetailStockin: id => `stockin/${id}/detail/admin`,
  editStockinStatus: id => `stockin/${id}/stockin-status`,
  putStockin: id => `stockin/${id}`,
  getTotalStockin: id => `stockin/${id}/total`,

  //Stock OUT
  getStockout: 'stockout',
  postStockout: 'stockout',
  postStockoutInternal: 'stockout/internal',
  getDetailStockout: id => `stockout/${id}`,

  //Sync product to Odoo system
  checkSyncAllProduct: 'product/checkSyncAllProduct',
  syncAllProduct: 'product/syncAllProductWithOdoo',
  syncProduct: 'product/syncProductWithOdoo',
  productPriceSize: id => 'product/productPriceSize',

  //Size
  getSize: 'product-size/list',
  createSize: 'product-size/create',
  getSizeById: id =>  `product-size/detail/${id}`,
  editSizeById : id =>  `product-size/edit/${id}`,
  removeSizeById : id =>  `product-size/remove/${id}`,

  // Color
  getColor: 'product-color/list',
  createColor: 'product-color/create',
  getColorById: id =>  `product-color/detail/${id}`,
  editColorById : id =>  `product-color/edit/${id}`,
  removeColorById : id =>  `product-color/remove/${id}`,
}

export const convertDataSend = rowData => {
  const array1String = JSON.stringify(rowData)
  const arrayConvert = array1String.replace(/\[|\]/g, '')
  return arrayConvert
}
//PRODUCT
export function getAllProductsService(params) {
  return fetchAuth({
    url: routes.getAllProducts,
    method: 'GET',
    params: {
      ...params,
    },
  })
}

export function getProductsService(res, params) {
  let newArray = [...res.data]
  if (typeof params.status === 'number') {
    const tempArray = newArray.filter(item => item.status === params.status)
    let limitArray: any = []
    for (var i = (params.page - 1) * 10; i < params.page * 10; i++) {
      if (typeof tempArray[i] !== 'undefined') {
        limitArray.push(tempArray[i])
      }
    }
    return limitArray
  }
  return res.data
}

export function editProductService(id, data) {

   console.log(
     '🚀 ~ file: product.service.ts ~ line 111 ~ EditProductService id ~ data',
     id,
     data,
   )
  const form = new FormData()
 
  delete data.categories

  Object.keys(data).forEach(key => {
    if (data[key] === undefined) {
      form.append(key, '')
    } else if (key === 'propertiesProduct') {
      form.append(key, convertDataSend(data[key]))
    } else {
      form.append(key, data[key])
    }
  })

  return fetchAuth({
    url: routes.editProduct(id),
    method: 'PUT',
    data: form,
  })
}

export function deleteProductService(id) {
  return fetchAuth({
    url: routes.deleteProduct(id),
    method: 'DELETE',
  })
}

export function getDetailProductService(id) {
  return fetchAuth({
    url: routes.getDetailProduct(id),
    method: 'GET',
  })
}

// CREATE PRODUCT
export function createProductService(data) {
  console.log(
    '🚀 ~ file: product.service.ts ~ line 111 ~ createProductService ~ data',
    data,
  )

  // delete data.saleTag
  // delete data.descriptionPrice
  delete data.categories

  let form = new FormData()

  Object.keys(data).forEach(key => {
    if (data[key] === undefined) {
      form.append(key, '')
    } else if (key == 'propertiesProduct') {
      form.append(key, convertDataSend(data[key]))
    } else {
      form.append(key, data[key])
    }
  })
 

  return fetchAuth({
    url: routes.createProduct,
    method: 'POST',
    data: form,
  })
}

export function publishProductService(id) {
  return fetchAuth({
    url: routes.publishProduct(id),
    method: 'POST',
  })
}

export function unpublishProductService(id) {
  return fetchAuth({
    url: routes.unpublishProduct(id),
    method: 'POST',
  })
}

export function editCondition(id, data) {
  return fetchAuth({
    url: routes.editCondition(id),
    method: 'PUT',
    data,
  })
}

//SCREENSHOT
export function createProductScreenShotService(id, data) {
  const form = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] === undefined) {
      form.append(key, '')
    }
    form.append(key, data[key])
  })
  return fetchAuth({
    url: routes.createProductScreenShot(id),
    method: 'POST',
    params: id,
    data: form,
  })
}
export function deleteScreenShotService(id) {
  return fetchAuth({
    url: routes.deleteScreenShot(id),
    method: 'DELETE',
  })
}

//GALLERY
export function createProductGalleryService(id, data) {
  const form = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] === undefined) {
      form.append(key, '')
    }
    form.append(key, data[key])
  })
  return fetchAuth({
    url: routes.createProductGallery(id),
    method: 'POST',
    params: id,
    data: form,
  })
}
export function deleteGalleryService(id) {
  return fetchAuth({
    url: routes.deleteGallery(id),
    method: 'DELETE',
  })
}
//PRICE SIZE

export function createProductPriceSizeService(id, data) {
  const form = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] === undefined) {
      form.append(key, '')
    }
    form.append(key, data[key])
  })
  return fetchAuth({
    url: routes.createProductGallery(id),
    method: 'POST',
    params: id,
    data: form,
  })
}

//STOCK IN
export function getListStockinService(params) {
  return fetchAuth({
    url: routes.getListStockin,
    method: 'GET',
    params: {
      ...params,
    },
  })
}

export function createStockinService(data) {
  // const form = new FormData();
  // Object.keys(data).forEach(key => {
  //   if (data[key] === undefined) {
  //     form.append(key, '');
  //   }
  // });
  return fetchAuth({
    url: routes.createStockin,
    method: 'POST',
    data,
  })
}

export function getDetailStockinService(id) {
  return fetchAuth({
    url: routes.getDetailStockin(id),
    method: 'GET',
  })
}

export function editStockinStatusService(id, data) {
  let newData = { ...data }
  return fetchAuth({
    url: routes.editStockinStatus(id),
    method: 'PUT',
    data: newData,
  })
}

export function putStockinService(id, data) {
  
  console.log('data send', id, data);

  return fetchAuth({
    url: routes.putStockin(id),
    method: 'PUT',
    data,
  })
}

//STOCK OUT
export function getStockoutService(params) {
  return fetchAuth({
    url: routes.getStockout,
    method: 'GET',
    params,
  })
}

export function postStockoutOrder(data){
  return fetchAuth({
    url: routes.postStockout,
    method: 'POST',
    data,
  })
}

export function postStockoutService(data) {
  return fetchAuth({
    url: routes.postStockoutInternal,
    method: 'POST',
    data,
  })
}


export function getDetailStockoutService(id) {
  return fetchAuth({
    url: routes.getDetailStockout(id),
    method: 'GET',
  })
}

// SIZE
export function getAllSize(){
  return fetchAuth({
    url: routes.getSize,
    method: 'GET',
  })
}

export function postSize(data){
  return fetchAuth({
    url: routes.createSize,
    method: 'POST',
    data,
  })
}

export function getDetailSize(id){
  return fetchAuth({
    url: routes.getSizeById(id),
    method: 'GET',
  })
}

export function putSize(id, data){
  return fetchAuth({
    url: routes.editSizeById(id),
    method: 'PUT',
    data
  })
}

export function removeSize(id){
  return fetchAuth({
    url: routes.removeSizeById(id),
    method: 'DELETE',
  })
}

// COLOR
export function getAllColor(){
  return fetchAuth({
    url: routes.getColor,
    method: 'GET',
  })
}

export function postColor(data){
  return fetchAuth({
    url: routes.createColor,
    method: 'POST',
    data,
  })
}

export function getDetailColor(id){
  return fetchAuth({
    url: routes.getColorById(id),
    method: 'GET',
  })
}

export function putColor(id, data){
  return fetchAuth({
    url: routes.editColorById(id),
    method: 'PUT',
    data
  })
}

export function removeColor(id){
  return fetchAuth({
    url: routes.removeColorById(id),
    method: 'DELETE',
  })
}


// SALE
export function createSale(data) {
  return fetchAuth({
    url: routes.postSale,
    method: 'POST',
    data,
  })
}

export function editIsSale(id, data) {
  return fetchAuth({
    url: routes.putIsSale(id),
    method: 'PUT',
    data,
  })
}

export function editIsHot(id, data) {
  return fetchAuth({
    url: routes.putIsHot(id),
    method: 'PUT',
    data,
  })
}

// SYNC PRODUCT FLOW
export function checkSyncAllProduct() {
  return fetchAuth({
    url: routes.checkSyncAllProduct,
    method: 'POST',
  })
}

export function syncAllProduct() {
  return fetchAuth({
    url: routes.syncAllProduct,
    method: 'POST',
  })
}

export function syncProduct(data) {
  return fetchAuth({
    url: routes.syncProduct,
    method: 'POST',
    data,
  })
}


export function setStorage(skey, svalue) {
  try {
    if (typeof localStorage != undefined) {
      localStorage.setItem(skey, JSON.stringify(svalue))
    }
    return true
  } catch (error) {
    return false
  }
}

export function getStorage(skey) {
  try {
    if (typeof localStorage != undefined) {
      if (JSON.parse(window.localStorage.getItem(skey)) === null) {
        return false
      } else {
        return JSON.parse(window.localStorage.getItem(skey))
      }
    }
    return true
  } catch (error) {
    return false
  }
}

export function removeStorage(skey) {
  try {
    if (typeof localStorage != undefined) {
      return JSON.parse(window.localStorage.getItem(skey))
    }
    return true
  } catch (error) {
    return false
  }
}

export function clearStorage() {
  try {
    if (typeof localStorage != undefined) {
      localStorage.clear()
    }
    return true
  } catch (error) {
    return false
  }
}

export function getLengthStorage() {
  try {
    if (typeof localStorage != undefined) {
      return localStorage.length()
    }
    return true
  } catch (error) {
    return false
  }
}