import axios from '@/uni_modules/gt-axios-request/js_sdk/config.js'
import qs from 'qs';
export function createOrder(data) {
	return axios.post(
		'pay.cqwu.edu.cn/scardRechargeCreateOrder',{ showLoading: true },data

	)
}

export function gethtml() {
	return axios.get(

		'authserver.cqwu.edu.cn/authserver/login?service=http%3A%2F%2Fehall.cqwu.edu.cn%2Flogin%3Fservice%3Dhttp%3A%2F%2Fehall.cqwu.edu.cn%2Fnew%2Findex.html',
		{ showLoading: true }
		// method: 'get',
		// params : data
	)
}
export function getlogin(data) {
	return axios.post(
		'authserver.cqwu.edu.cn/authserver/login?service=http%3A%2F%2Fehall.cqwu.edu.cn%2Flogin%3Fservice%3Dhttp%3A%2F%2Fehall.cqwu.edu.cn%2Fnew%2Findex.html',
	
		qs.stringify(data)
			// { showLoading: true }

	)
}
export function zfc() {
	return axios.get(

		'authserver.cqwu.edu.cn/authserver/login?service=http%3A%2F%2Fpay.cqwu.edu.cn%2FsignAuthentication%3Furl%3DopenPortal',
		{ showLoading: true }


	)
}
export function yzm(data) {
	return axios.post(

		'authserver.cqwu.edu.cn/authserver/needCaptcha.html',
		qs.stringify(data)
		
	)
}
export function balance() {
	return axios.get(


		'218.194.176.214:8382/epay/thirdapp/balance',
		{ showLoading: true }
	)
}
export function qrcode() {
	return axios(
		'218.194.176.214:8382/epay/thirdconsume/qrcode',
		{ showLoading: true }

	)
}
