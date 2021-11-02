/** @format */

import {
  PRODUCT_FILTERS_CATEGORY_FAIL,
  PRODUCT_FILTERS_CATEGORY_REQUEST,
  PRODUCT_FILTERS_CATEGORY_SUCCESS,
  PRODUCT_FILTERS_COLOR_FAIL,
  PRODUCT_FILTERS_COLOR_REQUEST,
  PRODUCT_FILTERS_COLOR_SUCCESS,
  PRODUCT_FILTERS_PRICE_FAIL,
  PRODUCT_FILTERS_PRICE_REQUEST,
  PRODUCT_FILTERS_PRICE_SUCCESS,
  PRODUCT_FILTERS_RATING_FAIL,
  PRODUCT_FILTERS_RATING_REQUEST,
  PRODUCT_FILTERS_RATING_SUCCESS,
  PRODUCT_PRICE_HIGHEST_FAIL,
  PRODUCT_PRICE_HIGHEST_REQUEST,
  PRODUCT_PRICE_HIGHEST_SUCCESS,
  PRODUCT_PRICE_LOWEST_FAIL,
  PRODUCT_PRICE_LOWEST_REQUEST,
  PRODUCT_PRICE_LOWEST_SUCCESS,
  PRODUCT_SORT_BEST_RATING_FAIL,
  PRODUCT_SORT_BEST_RATING_REQUEST,
  PRODUCT_SORT_BEST_RATING_SUCCESS,
  PRODUCT_SORT_NEWEST_FAIL,
  PRODUCT_SORT_NEWEST_REQUEST,
  PRODUCT_SORT_NEWEST_SUCCESS,
} from "../constants/productConstants";

import {
  CLOSE_MODAL_SEARCH,
  OPEN_MODAL_SEARCH,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_SEARCH_FAIL,
  PRODUCT_SEARCH_REQUEST,
  PRODUCT_SEARCH_SUCCESS,
} from "../constants/productConstants";

export const productListReducer = (
  state = { loading: true, products: [] },
  action
) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true };
    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
        pages: action.payload.pages,
        page: action.payload.page,
      };
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productSearchReducer = (
  state = { loading: true, products: [], filterdProducts: [] },
  action
) => {
  switch (action.type) {
    case PRODUCT_SEARCH_REQUEST:
      return { loading: true };
    case PRODUCT_SEARCH_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
        filterdProducts: action.payload.products,
        productCount: action.payload.productCount,
        resPerPage: action.payload.resPerPage,
        filteredProductsCount: action.payload.filteredProductsCount,
      };
    case PRODUCT_SEARCH_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const productFiltersReducer = (
  state = { loading: true, products: [], filterdProducts: [] },
  action
) => {
  switch (action.type) {
    case PRODUCT_FILTERS_CATEGORY_REQUEST:
      return { loading: true };
    case PRODUCT_FILTERS_CATEGORY_SUCCESS:
      return {
        loading: false,
        filterdProducts: action.payload.products,
        productCount: action.payload.productCount,
        filteredProductsCount: action.payload.filteredProductsCount,
      };
    case PRODUCT_FILTERS_CATEGORY_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_FILTERS_PRICE_REQUEST:
      return { loading: true };
    case PRODUCT_FILTERS_PRICE_SUCCESS:
      return {
        loading: false,
        filterdProducts: action.payload.products,
        productCount: action.payload.productCount,
        filteredProductsCount: action.payload.filteredProductsCount,
      };
    case PRODUCT_FILTERS_PRICE_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_FILTERS_RATING_REQUEST:
      return { loading: true };
    case PRODUCT_FILTERS_RATING_SUCCESS:
      return {
        loading: false,
        filterdProducts: action.payload.products,
        productCount: action.payload.productCount,
        filteredProductsCount: action.payload.filteredProductsCount,
      };
    case PRODUCT_FILTERS_RATING_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_PRICE_LOWEST_REQUEST:
      return { loading: true };
    case PRODUCT_PRICE_LOWEST_SUCCESS:
      return {
        loading: false,
        filterdProducts: action.payload.products.sort((a, b) => {
          return a.price - b.price;
        }),
      };
    case PRODUCT_PRICE_LOWEST_FAIL:
      return { loading: false, error: action.payload };

    // price hight to low
    case PRODUCT_PRICE_HIGHEST_REQUEST:
      return { loading: true };
    case PRODUCT_PRICE_HIGHEST_SUCCESS:
      return {
        loading: false,
        filterdProducts: action.payload.products.sort((a, b) => {
          return b.price - a.price;
        }),
      };
    case PRODUCT_PRICE_HIGHEST_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_SORT_BEST_RATING_REQUEST:
      return { loading: true };
    case PRODUCT_SORT_BEST_RATING_SUCCESS:
      return {
        loading: false,
        filterdProducts: action.payload.products.sort((a, b) => {
          return b.rating - a.rating;
        }),
      };
    case PRODUCT_SORT_BEST_RATING_FAIL:
      return { loading: false, error: action.payload };

    //Sort Newest
    case PRODUCT_SORT_NEWEST_REQUEST:
      return { loading: true };
    case PRODUCT_SORT_NEWEST_SUCCESS:
      return {
        loading: false,
        filterdProducts: action.payload.products.filter(
          (x) => x.newArrivals === true
        ),
      };
    case PRODUCT_SORT_NEWEST_FAIL:
      return { loading: false, error: action.payload };

    case PRODUCT_FILTERS_COLOR_REQUEST:
      return { loading: true };
    case PRODUCT_FILTERS_COLOR_SUCCESS:
      return {
        loading: false,
        filterdProducts: action.payload.data.products.filter((product) =>
          product.colors.find((c) => c === action.payload.color)
        ),
      };
    case PRODUCT_FILTERS_COLOR_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const productDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true };
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const openModalSearchReducer = (state = { isOpen: false }, action) => {
  switch (action.type) {
    case OPEN_MODAL_SEARCH:
      return { isOpen: true };
    case CLOSE_MODAL_SEARCH:
      return { isOpen: false };
    default:
      return state;
  }
};
