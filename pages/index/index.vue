<template>
	<view class="content">
		<u-loading-icon :show="show" text="加载中" textSize="18"></u-loading-icon>
		<u-notify ref="uNotify" message="Hi uView"></u-notify>
		<view class="text-area">
			<h1>
				姓名:<text>{{name}}</text>
			</h1>
			</br>
			<h1>
				学号:<text>{{nub}}</text>
			</h1>
			</br>
			<h1>
				余额:<text>{{money}}</text>
			</h1>
		</view>
		<div class="qrcode">
			<canvas canvas-id="qrcode" v-show="qrShow" />
		</div>
		<view class="but">
			<button @click="tc()">退出登录</button>
			<button @click="sx()">点击刷新</button>


		</view>
		<view class="but2">
			<!-- <h3>金额：</h3> -->
			<u--input placeholder="请输入充值的金额" border="surround" v-model="total" :value='total'></u--input>
			<button @click="cz()">充值</button>


		</view>
	</view>
</template>

<script>
	import qs from 'qs';
	import {
		data
	} from 'uview-ui/libs/mixin/mixin';
	import uQRCode from '../../utils/weapp-qrcode.js';

	export default {
		data() {
			return {
				total: '',
				nub: "",
				flag: '',
				message: "",
				qrShow: false,
				name: '',
				money: '',
				cookie: '',
				show: false,

				czz: ''
			}
		},
		onLoad() {
			this.cookie = "JSESSIONID=" + uni.getStorageSync('cookie');
			this.flag = uni.getStorageSync('flag')
			console.log("cookie", this.cookie)
			if (this.cookie == "") {
				this.$refs.uNotify.error('请先登录~')

				uni.redirectTo({
					url: 'pages/login/login'
				});
			}

			this.ewm()
			this.yue()



		},
		methods: {
			async cz() {
				this.show = true
				var a = uni.getStorageSync('id')
				var b = uni.getStorageSync('pwd')
				await uni.request({
					url: 'https://service-79bppka6-1301431081.gz.apigw.tencentcs.com/release/cqwu',
					data: {
						id: a,
						pwd: b

					},
					success: (res) => {
						if (res.statusCode == 200) {
							// console.log(res.data.body)
							var x = res.data.body
							this.czz = "JSESSIONID=" + x[x.length - 1][1]
							console.log(this.czz)
							var cs = {
								'payAmt': this.total,
								'payProjectId': '2',
								'factorycode': 'Z007',
								'rechargeType': '1',
								'recharge_idserial': ''
							}
							console.log(cs)
							uni.request({
								url: 'http://pay.cqwu.edu.cn/scardRechargeCreateOrder',
								method: "POST",
								header: {
									"Referer": " http://pay.cqwu.edu.cn",
									"Content-Type": "application/x-www-form-urlencoded",
									"Cookie": this.czz
								},
								data: qs.stringify(cs),
								success: (res) => {


									var tx = {
										'paytype': '03',
										'tradetype': 'WAP',
										// 'payways': '0203',
										// 'userip': '123.147.249.205',
										// 'contextPath': '',
										'orderno': res.data['payOrderTrade']['orderno'],
										// 'orderamt': "2.00",
										// 'mess': ''
									}
									console.log("参数", qs.stringify(tx))
									uni.request({
										url: 'http://pay.cqwu.edu.cn/h5onlinepay',
										method: "POST",
										header: {
											"Content-Type": "application/x-www-form-urlencoded",
											"Referer": " http://pay.cqwu.edu.cn",
											"Cookie": this.czz
										},
										data: qs.stringify(tx),
										success: (res) => {
											console.log(res.data)
											var box = 'deeplink : "w(.*?)"';
											this.show = false
											console.log("w" + res.data.match(box)[
												1])
											plus.runtime.openURL("w" + res.data.match(box)[1]);


										}
									});
								}
							});


						}



					}
				});


			},
			tc() {
				uni.removeStorageSync('id');
				uni.removeStorageSync('pwd');
				uni.removeStorageSync('flag');
				uni.removeStorageSync('cookie');
				this.$refs.uNotify.error('重新登录~')
				uni.redirectTo({
					url: 'pages/login/login'
				});
			},
			async submit(a, b) {
				this.show = true

				uni.request({
					url: 'https://service-79bppka6-1301431081.gz.apigw.tencentcs.com/release/cqwu',
					data: {
						id: a,
						pwd: b

					},
					success: (res) => {
						if (res.statusCode == 200) {
							// console.log(res.data.body)
							this.show = false
							this.$refs.uNotify.primary('登录成功')
							uni.setStorageSync("cookie", res.data.body)
							uni.redirectTo({
								url: 'pages/index/index'
							});
						}



					}
				});


			},
			async yue() {

				await uni.request({
					url: 'http://218.194.176.214:8382/epay/thirdapp/balance',
					header: {
						"Cookie": this.cookie
					},
					success: (res) => {

						var str = res.data;
						// console.log("ty", str)
						var box = '<div class="weui-cell__ft">(.*?)</div>';
						var box2 = '<div class="weui-cell__ft">(.*?)￥</div>';
						var box3 = '<div class="weui-cell__ft">2(.*?)</div>';

						// console.log("kkk", str.match(box)[1]); //4
						if (str.match(box) == null) {

							if (this.flag) {
								a = uni.getStorageSync('id')
								b = uni.getStorageSync('pwd')
								submit(a, b)
							} else {
								this.$refs.uNotify.error('身份过期~')
								uni.redirectTo({
									url: 'pages/login/login'
								});
							}

						} else {
							this.name = str.match(box)[1]
							this.money = str.match(box2)[1]
							this.nub = "2" + str.match(box3)[1]
						}
					}
				});
			},
			async ewm() {

				await uni.request({
					url: 'http://218.194.176.214:8382/epay/thirdconsume/qrcode',
					header: {
						"Cookie": this.cookie
					},
					success: (res) => {

						var str = res.data;

						var box = '<input type="hidden" id="myText" value="(.*?)" /';
						// var box2 = '<div class="weui-cell__ft">(.*?)￥</div>';
						// console.log(str.match(box)[1]); //4
						if (str.match(box) == null) {

							if (this.flag) {
								a = uni.getStorageSync('id')
								b = uni.getStorageSync('pwd')
								submit(a, b)
							} else {
								this.$refs.uNotify.error('身份过期~')
								uni.redirectTo({
									url: 'pages/login/login'
								});
							}

						} else {
							var qcode = str.match(box)[1]
							this.qrFun(qcode)
						}


					}
				});
			},
			sx() {

				this.ewm()
				this.yue()
			},
			qrFun: function(text) {
				this.qrShow = true
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: text,
					size: 300,
					margin: 0,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					errorCorrectLevel: uQRCode.errorCorrectLevel.H,
					success: res => {}
				})
			}
		}
	}
</script>

<style scoped>
	button {
		margin: 10px;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.but {
		display: flex;
	}

	.qrcode {
		margin-top: 50px;
		margin-bottom: 20px;
		height: 300px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h3 {
		text-align: center;
	}

	canvas {
		height: 300px;

	}
</style>
