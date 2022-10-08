import axios from 'axios'
import Vue from 'vue'
import Qs from 'qs'
import JsCookie from 'js-cookie'//需要安装js-cookie插件
axios.defaults.timeout = 5000
axios.defaults.withCredentials= true//允许跨越时携带cookie并不是加上就能跨域
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const AUTH_TOKEN = JsCookie.get('cookie');
if (JsCookie.get('cookie')) {//需要导入js-cookie插件
  console.log(3)
  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
}
//判断环境
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = "http://authserver.cqwu.edu.cn/authserver/login?service=http%3A%2F%2Fehall.cqwu.edu.cn%2Flogin%3Fservice%3Dhttp%3A%2F%2Fehall.cqwu.edu.cn%2Fnew%2Findex.html";
} else {
  axios.defaults.baseURL = '';
}
//请求之前的配置
axios.interceptors.request.use(function (config) {
  // console.log(config.method)
  if (config.method.toLowerCase() === 'post') {
    config.data = Qs.stringify(config.data)
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});
//响应之后的配置
axios.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  console.log(error);
  return Promise.reject(error);
});
export default axios;
//挂载到vue原型上
Vue.prototype.$http = axios