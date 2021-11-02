/** @format */

import axios from "axios";
import {
  CLOSE_MODAL_SEARCH,
  OPEN_MODAL_SEARCH,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
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
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_PRICE_HIGHEST_FAIL,
  PRODUCT_PRICE_HIGHEST_REQUEST,
  PRODUCT_PRICE_HIGHEST_SUCCESS,
  PRODUCT_PRICE_LOWEST_FAIL,
  PRODUCT_PRICE_LOWEST_REQUEST,
  PRODUCT_PRICE_LOWEST_SUCCESS,
  PRODUCT_SEARCH_FAIL,
  PRODUCT_SEARCH_REQUEST,
  PRODUCT_SEARCH_SUCCESS,
  PRODUCT_SORT_BEST_RATING_FAIL,
  PRODUCT_SORT_BEST_RATING_REQUEST,
  PRODUCT_SORT_BEST_RATING_SUCCESS,
  PRODUCT_SORT_NEWEST_FAIL,
  PRODUCT_SORT_NEWEST_REQUEST,
  PRODUCT_SORT_NEWEST_SUCCESS,
} from "../constants/productConstants";

export const listProducts = () => async (dispatch) => {
  dispatch({
    type: PRODUCT_LIST_REQUEST,
  });
  try {
    const { data } = await axios.get("/api/products");
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
  }
};

export const getProductsBySearch =
  (keyword = "") =>
  async (dispatch) => {
    dispatch({ type: PRODUCT_SEARCH_REQUEST });
    try {
      let { data } = await axios.get(`/api/products?keyword=${keyword}`);

      dispatch({ type: PRODUCT_SEARCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: PRODUCT_SEARCH_FAIL,
        payload: error.message,
      });
    }
  };

export const getProductsByCategory =
  (category = "") =>
  async (dispatch) => {
    dispatch({ type: PRODUCT_FILTERS_CATEGORY_REQUEST });
    try {
      let { data } = await axios.get(`/api/products?category=${category}`);

      dispatch({ type: PRODUCT_FILTERS_CATEGORY_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: PRODUCT_FILTERS_CATEGORY_FAIL,
        payload: error.message,
      });
    }
  };
export const getProductsByPrice = (price) => async (dispatch) => {
  dispatch({ type: PRODUCT_FILTERS_PRICE_REQUEST });
  try {
    let { data } = await axios.get(
      `/api/products?price[lte]=${price[1]}&price[gte]=${price[0]}`
    );

    dispatch({ type: PRODUCT_FILTERS_PRICE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_FILTERS_PRICE_FAIL,
      payload: error.message,
    });
  }
};
export const getProductsByRating = (rating) => async (dispatch) => {
  dispatch({ type: PRODUCT_FILTERS_RATING_REQUEST });
  try {
    let { data } = await axios.get(`/api/products?rating[gte]=${rating}`);

    dispatch({ type: PRODUCT_FILTERS_RATING_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_FILTERS_RATING_FAIL,
      payload: error.message,
    });
  }
};


export const productDetails = (productId) => async (dispatch) => {
  dispatch({
    type: PRODUCT_DETAILS_REQUEST,
  });
  try {
    const { data } = await axios.get(`/api/products/${productId}`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data.product });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const openModalSearch = () => async (dispatch) => {
  dispatch({ type: OPEN_MODAL_SEARCH });
};

export const closeModalSearch = () => async (dispatch) => {
  dispatch({ type: CLOSE_MODAL_SEARCH });
};

export const sortPriceLowest = () => async (dispatch) => {
  dispatch({
    type: PRODUCT_PRICE_LOWEST_REQUEST,
  });
  try {
    const { data } = await axios.get(`/api/products`);
    
    dispatch({ type: PRODUCT_PRICE_LOWEST_SUCCESS, payload: data});
    console.log(data)
  } catch (error) {
    dispatch({
      type: PRODUCT_PRICE_LOWEST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


export const sortPriceHighest = () => async (dispatch) => {
  dispatch({
    type: PRODUCT_PRICE_HIGHEST_REQUEST,
  });
  try {
    const { data } = await axios.get(`/api/products`);
    
    dispatch({ type: PRODUCT_PRICE_HIGHEST_SUCCESS, payload: data});
   
  } catch (error) {
    dispatch({
      type: PRODUCT_PRICE_HIGHEST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const productFilterByColor = (color) => async (dispatch) => {
  dispatch({
    type: PRODUCT_FILTERS_COLOR_REQUEST, payload: color
  });
  try {
    const { data } = await axios.get(`/api/products`);
    
    dispatch({ type: PRODUCT_FILTERS_COLOR_SUCCESS, payload: {data, color }});
  } catch (error) {
    dispatch({
      type: PRODUCT_FILTERS_COLOR_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


export const sortBestRating = () => async (dispatch) => {
  dispatch({
    type: PRODUCT_SORT_BEST_RATING_REQUEST,
  });
  try {
    const { data } = await axios.get(`/api/products`);
    
    dispatch({ type: PRODUCT_SORT_BEST_RATING_SUCCESS, payload: data});
   
  } catch (error) {
    dispatch({
      type: PRODUCT_SORT_BEST_RATING_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const sortNewest = () => async (dispatch) => {
  dispatch({
    type: PRODUCT_SORT_NEWEST_REQUEST,
  });
  try {
    const { data } = await axios.get(`/api/products`);
    
    dispatch({ type: PRODUCT_SORT_NEWEST_SUCCESS, payload: data});
   
  } catch (error) {
    dispatch({
      type: PRODUCT_SORT_NEWEST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};