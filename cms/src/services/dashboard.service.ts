import { request } from 'umi'
import { fetchAuth } from './../utils/request'

const routes = {
  // getChartDataService: '/api/fake_chart_data',
  getTotalData: 'dashboard/total-data',
  caculateRevene: 'dashboard/caculate-revenue',
  bestSelling: 'dashboard/best-selling',
  caculateDiscount: 'dashboard/caculate-discount',
  caculateUserNew: 'dashboard/caculate-user-new',
}

export function getTotalData() {
  return fetchAuth({
    url: routes.getTotalData,
    method: 'GET',
  })
}

export function caculateRevene(data) {
  return fetchAuth({
    url: routes.caculateRevene,
    method: 'POST',
    data,
  })
}

export function caculateDiscount(data) {
  return fetchAuth({
    url: routes.caculateDiscount,
    method: 'POST',
    data,
  })
}
export function caculateUserNew(data) {
  return fetchAuth({
    url: routes.caculateUserNew,
    method: 'POST',
    data,
  })
}

export function getDataBbestSelling(params) {
  return fetchAuth({
    url: routes.bestSelling,
    method: 'GET',
    params: {
      ...params,
    },
  })
}



// export async function getChartDataService() {
//   return request('/api/fake_chart_data')
// }
