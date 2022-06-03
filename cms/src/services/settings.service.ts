import { fetch, fetch_no_autoPrefix } from '@/utils/request'
import { convertDataSend } from './product.service'

const routes = {
  getSettings: 'system/common',
  createSettings: 'system/common',
  updateSetting: `system/common`,
  deleteBanner: idBanner => `system/banner/${idBanner}`,
  deleteFooterImages: idFooterImages => `system/footer/${idFooterImages}`,
  deleteSocial: idSocial => `system/social/${idSocial}`,
  getInfoClient: 'system/svcenter',
  updateInfoClient: `system/svCenter`,
}

export function getSettingClient() {
  return fetch({
    url: routes.getSettings,
    method: 'GET',
  })
}

export function createSettingClient(data: any) {
  const form = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      form.append(key, data[key])
    }
  })
  return fetch({
    url: routes.createSettings,
    method: 'POST',
    data: form,
  })
}

export function updateSetting(data) {
  delete data.youtubeConfigs

  const form = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      if (
        key === 'banner_top' ||
        key === 'footerImages' ||
        key === 'banner_center'
      ) {
        data[key].forEach(item => {
          form.append(key, item.originFileObj)
        })
      } else if (key === 'social') {
          form.append(key, convertDataSend(data[key]))
      } else if (key === 'youtubeConfig') {
        form.append(key, convertDataSend(data[key]))
      } else {
        form.append(key, data[key])
      }
    }
  })
  // form.append('referral', 'OFF')
  // form.append('odoo', 'OFF')
  // form.forEach(element => {
  //   console.log("=>>>", element)
  // });
  return fetch({
    url: routes.updateSetting,
    method: 'POST',
    data: form,
  })
}
// backup update
// export function updateSetting({ idSetting, data }) {
//   const form = new FormData()
//   Object.keys(data).forEach(key => {
//     if (data[key] !== undefined && data[key] !== null) {
//       if (key === 'banner_top' || key === 'footerImages') {
//         data[key].forEach(item => {
//           form.append(key, item.originFileObj)
//         })
//       } else if (key === 'social') {
//         data[key].forEach(item => {
//           let newSocial = JSON.stringify(item)
//           form.append(key, newSocial)
//         })
//       } else {
//         form.append(key, data[key])
//       }
//     }
//   })
//   // form.append('referral', 'OFF')
//   // form.append('odoo', 'OFF')
//   // form.forEach(element => {
//   //   console.log("=>>>", element)
//   // });
//   return fetch({
//     url: routes.updateSetting(idSetting),
//     method: 'PUT',
//     data: form,
//   })
// }

export function deleteBanner(idBanner: number) {
  return fetch({
    url: routes.deleteBanner(idBanner),
    method: 'DELETE',
  })
}
export function deleteFooterImage(idFooterImages: number) {
  return fetch({
    url: routes.deleteFooterImages(idFooterImages),
    method: 'DELETE',
  })
}
export function deleteSocial(idSocial: number) {
  return fetch({
    url: routes.deleteSocial(idSocial),
    method: 'DELETE',
  })
}

export function getInforClient() {
  return fetch({
    url: routes.getInfoClient,
    method: 'GET',
  })
}

export function updateInfoClient(data) {
  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', data);
  return fetch({
    url: routes.updateInfoClient,
    method: 'POST',
    data,
  })
}
// export function updateInfoClient({ idClient, data }) {
//   return fetch({
//     url: routes.updateInfoClient(idClient),
//     method: 'PUT',
//     data,
//   })
// }
