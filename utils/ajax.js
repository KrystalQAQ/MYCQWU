import ajax from 'uni-ajax'

// 创建请求实例
const instance = ajax.create({
  // 初始配置
  // baseURL: "http://authserver.cqwu.edu.cn/authserver/login?service=http%3A%2F%2Fehall.cqwu.edu.cn%2Flogin%3Fservice%3Dhttp%3A%2F%2Fehall.cqwu.edu.cn%2Fnew%2Findex.html",
})

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求前做些什么

	// config.header.post['Content-Type'] = 'application/x-www-form-urlencoded';
    // console.log(config)
	return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    // 对响应数据做些什么
	// console.log(response)
    return response
  },
  error => {
    // 对响应错误做些什么
    return Promise.reject(error)
  }
)

// 导出 create 创建后的实例
export default instance