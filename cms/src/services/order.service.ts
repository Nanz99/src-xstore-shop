import { values } from 'lodash'
import { fetchAuth } from '@/utils/request'

const routes = {
  getListOrder: 'order',
  getDetailOrder: id => `order/${id}/detail/admin`,
  putOrderStatusService: id => `order/${id}/order-status`,
  putStockoutStatusService: id => `order/${id}/stockout-status`,

  //Sync product to Odoo system
  checkSyncAllOrders: 'order/check-sync-all-order',
  // syncAllOrders: 'category/sync-all-category-odoo',
  syncOrders: `order/sync-order`,
}

//Get listOrder

export function getListOrderService(params) {
  return fetchAuth({
    url: routes.getListOrder,
    method: 'GET',
    params: {
      ...params,
    },
  })
}

export async function getListOrderByIdService(data) {
  const res = await getListOrderService(data)
  if (data) {
  }
  return res
}

// Get Detail Order
export function getDetailOrderService(id) {
  return fetchAuth({
    url: routes.getDetailOrder(id),
    method: 'GET',
  })
}

//
export function putOrderStatusService(id, values) {
  return fetchAuth({
    url: routes.putOrderStatusService(id),
    method: 'PUT',
    data: {
      ...values,
    },
  })
}

export function putStockoutStatusService(id, values) {
  return fetchAuth({
    url: routes.putStockoutStatusService(id),
    method: 'PUT',
    data: {
      stockoutStatus: values,
    },
  })
}

//Get order buy ID (nhu ben Stockin) (file Propduct.service)


// SYNC CATEGORIES FLOW

export function checkSyncAllOrders() {
  return fetchAuth({
    url: routes.checkSyncAllOrders,
    method: 'POST',
  })
}

// export function syncAllCategory() {
//   return fetchAuth({
//     url: routes.syncAllCategory,
//     method: 'POST',
//   })
// }


export function syncOrders(params) {
  return fetchAuth({
    url: routes.syncOrders,
    method: 'POST',
    params: {
      ...params,
    },
  })
}
