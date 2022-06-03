import { fetch, fetchAuth } from '@/utils/request'
import { stringify } from 'querystring'

const routes = {
  createOdooSSO: `odoo/createSSO`,
}

/**
 *
 * @param no
 * @returns fetchAuth
 */
export function createOdooSSO() {
  return fetchAuth({
    url: routes.createOdooSSO,
    method: 'POST',
  })
}
