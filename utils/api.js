import instance from './ajax.js'
import qs from 'qs';
export function toLogin(data) {
	return instance({
		url: 'https://service-79bppka6-1301431081.gz.apigw.tencentcs.com/release/cqwu',
		method: 'get',
		params : data
	})
}
