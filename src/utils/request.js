import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production" ? "/" : "http://127.0.0.1:7001/";

const instance = setInterceptor(
  axios.create({
    baseURL,
    timeout: 3000,
    headers: {}
    // withCredentials: true
  })
);

/**
 * 为axios设置拦截器
 * @param {Object} instance axios实例
 */
function setInterceptor(instance) {
  instance.interceptors.request.use(config => {
    config.headers["Authorization"] = "Login Token";
    return config;
  });
  instance.interceptors.response.use(
    res => {
      return res.data;
    },
    err => {
      return Promise.reject(err);
    }
  );
  return instance;
}

/**
 * 封装ajax请求
 */
function request(options = {}) {
  // setInterceptor(instance);
  return instance.request(options);
}

export { request };
