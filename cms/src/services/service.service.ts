import { fetch, fetchAuth } from '@/utils/request'
import { method } from 'lodash'
import { stringify } from 'querystring'
// Explain: 1: route dc goi toi ==> 2:Service gui request toi API
// ==> 3. fetch du lieu va tra ve kq tu file request trong folder utils
// ==> 4:
const routes = {
  createService: 'service',
  getListServices: 'service/list-with-auth',
  publishService: id => `service/${id}/publish`,
  unpublishService: id => `service/${id}/unpublish`,
  getDetailService: id => `service/${id}/with-auth`,
  deleteService: id => `service/${id}`,
  deleteImageService: id => `service/service-gallery/${id}`,
  editService: id => `service/${id}`,

  getListOrderServices: 'service/list-order-service',
  getDetailOrderService: id => `service/order-service/${id}`,
  deleteOrderService: id => `service/order-service/${id}`,
  updateStatusOrderService: id => `service/update-status-order-service/${id}`,
}

export const convertDataSend = rowData => {
  const array1String = JSON.stringify(rowData)
  const arrayConvert = array1String.replace(/\[|\]/g, '')
  return arrayConvert
}

//! SERVICE LIST
// TODO: Create Service
export function createService(data) {
  let form = new FormData()

  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      if (key === 'listImages') {
        data[key].forEach(item => {
          form.append(key, item.originFileObj)
        })
      } else {
        form.append(key, data[key])
      }
    }
  })

  return fetchAuth({
    url: routes.createService,
    method: 'POST',
    data: form,
  })
}

// TODO: Get List Service
export function getAllServices(params) {
  return fetchAuth({
    url: routes.getListServices,
    method: 'GET',
    params: {
      ...params,
    },
  })
}
// TODO: Publish Service
export function publishService(id) {
  return fetchAuth({
    url: routes.publishService(id),
    method: 'POST',
  })
}
// TODO: Unpublish Service
export function unpublishService(id) {
  return fetchAuth({
    url: routes.unpublishService(id),
    method: 'POST',
  })
}

// TODO: Get Detail Service
export function getDetailService(id) {
  return fetchAuth({
    url: routes.getDetailService(id),
    method: 'GET',
  })
}

// TODO: Delete Service
export function deleteService(id) {
  return fetchAuth({
    url: routes.deleteService(id),
    method: 'DELETE',
  })
}

//TODO: Delete Gallery Image
export function deleteGalleryImageService(id) {
  return fetchAuth({
    url: routes.deleteImageService(id),
    method: 'DELETE',
  })
}

export function editService(id, data) {
  let form = new FormData()

  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      if (key === 'listImages') {
        data[key].forEach(item => {
          form.append(key, item.originFileObj)
        })
      } else {
        form.append(key, data[key])
      }
    }
  })

  return fetchAuth({
    url: routes.editService(id),
    method: 'PUT',
    data: form,
  })
}

//! SERVICE BOOKING PARTY

// TODO: Get List Order Service
export function getListOrderServices(params) {
  return fetchAuth({
    url: routes.getListOrderServices,
    method: 'GET',
    params: {
      ...params,
    },
  })
}
// TODO: Get details Order Service
export function getDetailOrderService(id) {
  return fetchAuth({
    url: routes.getDetailOrderService(id),
    method: 'GET',
  })
}
// TODO: Update Status Order Service
export function UpdateStatusOrderService(id, data) {

  return fetchAuth({
    url: routes.updateStatusOrderService(id),
    method: 'POST',
    data
  })
}


// TODO: Delete Order Service
export function deleteOrderService(id) {
  return fetchAuth({
    url: routes.deleteOrderService(id),
    method: 'DELETE',
  })
}