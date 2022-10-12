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
			<canvas canvas-id="qrcode" />
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
	import {
		balance,
		qrcode,
		createOrder
	} from '../../utils/api.js';


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
			this.ewm()
			this.yue()
		},
		methods: {
			 cz() {

						uni.request({
							url: 'http://authserver.cqwu.edu.cn/authserver/login?service=http%3A%2F%2Fpay.cqwu.edu.cn%2FsignAuthentication%3Furl%3DopenPortal',

							method: "GET",
							// header: {
							// 	"Content-Type": "application/x-www-form-urlencoded",
							// 	"Referer": " http://pay.cqwu.edu.cn",
							// },
							// data: qs.stringify(tx),
							success: (res) => {
								// console.log("yanz", res.data)
							}
						});
						var cs = {
							'payAmt': this.total,
							'payProjectId': '2',
							'factorycode': 'Z007',
							'rechargeType': '1',
							'recharge_idserial': ''
						}
						console.log(cs)
						//  createOrder(cs).then(res=>{
						// 	console.log("22222",res)
						// })
						uni.request({
							url: 'http://pay.cqwu.edu.cn/scardRechargeCreateOrder',
							method: "POST",
							header: {
								"Referer": " http://pay.cqwu.edu.cn",
								"Content-Type": "application/x-www-form-urlencoded"
						
							},
							data: qs.stringify(cs),
							success: (res) => {
								// console.log("res", res.data)
						
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
							},
							data: qs.stringify(tx),
							success: (res) => {
								console.log(res.data)
								var box = 'deeplink : "w(.*?)"';
								this.show = false
								console.log("w" + res.data.match(box)[
									1])
								plus.runtime.openURL("w" + res.data.match(
									box)[1]);


							}
						});
					
			}})





			},
			tc() {
				
						// console.log("dyl")
						uni.redirectTo({
							url: 'pages/login/login'
						});
					},


					yue() {
						balance().then(res => {
							console.log("yu", res)

							var box = '<div class="weui-cell__ft">(.*?)</div>';
							var box2 = '<div class="weui-cell__ft">(.*?)￥</div>';
							var box3 = '<div class="weui-cell__ft">2(.*?)</div>';

							// console.log("kkk", str.match(box)[1]); //4
							if (res.match(box) == null) {

								if (this.flag) {
									a = uni.getStorageSync('id')
									b = uni.getStorageSync('pwd')
									submit(a, b)
								} else {
									this.$refs.uNotify.error('身份过期~')
									console.log("sfgq", res.match(box))
									uni.redirectTo({
										url: 'pages/login/login'
									});
									return new Promise(() => {})
								}

							} else {
								this.name = res.match(box)[1]
								this.money = res.match(box2)[1]
								this.nub = "2" + res.match(box3)[1]
							}

						})


					},
					async ewm() {
							await qrcode().then(res => {
								console.log(res)
								var str1 = res;
								console.log("ewm", str1)
								var box = '<input type="hidden" id="myText" value="(.*?)" /';
								// var box2 = '<div class="weui-cell__ft">(.*?)￥</div>';
								// console.log(str.match(box)[1]); //4
								if (str1.match(box) == null) {

									if (this.flag) {
										a = uni.getStorageSync('id')
										b = uni.getStorageSync('pwd')
										submit(a, b)
									} else {
										this.$refs.uNotify.error('身份过~')

										uni.redirectTo({
											url: 'pages/login/login'
										});
										return new Promise(() => {})
									}

								} else {
									var qcode = str1.match(box)[1]
									this.qrFun(qcode)
								}



							})

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
