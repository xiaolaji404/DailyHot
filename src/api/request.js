import axios from "axios";

// 设置 API 基础 URL
axios.defaults.baseURL = import.meta.env.VITE_GLOBAL_API;

axios.defaults.timeout = 30000;
axios.defaults.headers = { "Content-Type": "application/json" };

// 请求拦截
axios.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token) {
      request.headers.Authorization = token;
    }
    return request;
  },
  (error) => {
    $message?.error("请求失败，请稍后重试");
    return Promise.reject(error);
  }
);

// 响应拦截
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    $loadingBar?.error();
    if (error.response) {
      const data = error.response.data;
      const message = data?.message || "请求失败，请稍后重试";
      switch (error.response.status) {
        case 401:
          $message?.error("请登录后使用");
          break;
        case 301:
          $message?.error("请求路径发生跳转");
          break;
        case 403:
          $message?.error("暂无访问权限");
          break;
        case 404:
          $message?.error("请求资源不存在");
          break;
        case 500:
          $message?.error("内部服务器错误");
          break;
        default:
          $message?.error(message);
          break;
      }
    } else if (error.request) {
      $message?.error("网络错误，请检查网络连接");
    } else {
      $message?.error("请求失败，请稍后重试");
    }
    return Promise.reject(error);
  }
);

export default axios;
