import { fetch, fetchAuth } from '@/utils/request'

const routes = {
   getListContact: 'contact/list',
   getDetailContact: id => `contact/${id}`,
   deleteContact: id => `contact/${id}`,
}



//! CONTACT LIST

// TODO: Get List Contact
export function getListContact(params) {
   return fetchAuth({
      url: routes.getListContact,
      method: 'GET',
      params: {
         ...params,
      },
   })
}
// TODO: Get Detail Contact
export function getDetailContact(id) {
   return fetchAuth({
      url: routes.getDetailContact(id),
      method: 'GET',
   })
}
// TODO: Delete Contact

export function deleteContact(id) {
   return fetchAuth({
      url: routes.deleteContact(id),
      method: 'DELETE',
   })
}