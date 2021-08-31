/*
 * @Author: Ruoyu
 * @FilePath: \next-client\request\index.js
 */
import { API } from '../config/default.json';
import Axios from '../helpers/axios';

export async function getArticleList({
  page = null,
  limit = null,
  query = null,
  getCancelToken = () => {},
} = {}) {
  try {
    const requestUrl =
      API.servicePath.getArticleList +
      `?_q=${query}&_page=${[page]}&_limit=${limit}`;
    const res = await Axios.get(requestUrl);
    return res && res.data;
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function getArticleCategories() {
  try {
    const requestUrl = API.servicePath.getArticleCategories;
    const res = await Axios.get(requestUrl);
    return res && res.data;
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function getArticleById(id) {
  try {
    const requestUrl = API.servicePath.getArticleById + id;
    const res = await Axios.get(requestUrl);
    return res && res.data;
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function getArticleByCategoryId(id) {
  try {
    const requestUrl = API.servicePath.getArticleByCategoryId + id;
    const res = await Axios.get(requestUrl);
    return res && res.data;
  } catch (e) {
    return Promise.reject(e);
  }
}
