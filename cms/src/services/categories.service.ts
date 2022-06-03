import { fetch, fetchAuth } from '@/utils/request'
import { stringify } from 'querystring'

const routes = {
  createCategory: 'category',
  getAllCategory: 'category',
  editCategory: id => `category/${id}`,
  deleteCategory: id => `category/${id}`,

  //Sync product to Odoo system
  checkSyncAllCategory: 'category/checkAllSyncCategory',
  syncAllCategory: 'category/sync-all-category-odoo',
  syncCategory: 'category/sync-one-category-odoo',
}
//Get List Category
export function getAllCategory(params) {
  return fetch({
    url: routes.getAllCategory,
    method: 'GET',
    params: {
      ...params,
    },
  })
}

// Edit Category
export function editCategory(id, data) {
  // let newData = { ...data }
  let form = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] === undefined) {
      form.append(key, '')
    }
    form.append(key, data[key])
  })
  // if (data && data.description === null) {
  //   newData.description = ''
  // }
  return fetchAuth({
    url: routes.editCategory(id),
    method: 'PUT',
    data: form,
  })
}

//Create Category
export function createCategoryService(data) {

  const form = new FormData()
  Object.keys(data).forEach(key => {
    if (data[key] === undefined) {
      form.append(key, '')
    }
  })
  return fetchAuth({
    url: routes.createCategory,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: stringify(data),
  })
}

//Delete Category
export function deleteCategoryService(id) {
  return fetchAuth({
    url: routes.deleteCategory(id),
    method: 'DELETE',
  })
}

// SYNC CATEGORIES FLOW
export function checkSyncAllCategory() {
  return fetchAuth({
    url: routes.checkSyncAllCategory,
    method: 'POST',
  })
}

export function syncAllCategory() {
  return fetchAuth({
    url: routes.syncAllCategory,
    method: 'POST',
  })
}

export function syncCategory(data) {
  return fetchAuth({
    url: routes.syncCategory,
    method: 'POST',
    data,
  })
}
