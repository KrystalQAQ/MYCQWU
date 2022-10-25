<template>
	<view class="content">
		<u-loading-icon :show="show" text="加载中" textSize="18"></u-loading-icon>
		<u-notify ref="uNotify" message="Hi uView"></u-notify>
		<view class="text-area">
			<h1 v-show="ty">
				姓名:<text>{{name}}</text>
			</h1>
			</br>
			<h1 @click="showname()">
				学号:<text>{{nub}}</text>
			</h1>
			</br>
			<h1>
				余额:<text>{{money}} ￥</text>
			</h1>
			</br>
			<h1>
				{{month}}月:<text>{{by}} ￥</text>
			</h1>
		</view>
		<div class="qrcode" @click="tp()">
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
			<u-line-progress :percentage="jy" activeColor="#ff0000" height="15"></u-line-progress>

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
		createOrder,
		getlogin
	} from '../../utils/api.js';


	export default {
		data() {
			return {
				by: "0",
				show2: false,
				jy: "",
				total: '',
				nub: "",
				flag: '',
				message: "",
				qrShow: false,
				name: '',
				money: '',
				cookie: '',
				show: false,
				ty: false,
				czz: '',
				month: ""
			}
		},
		onReady() {

			var date = new Date();
			var month = date.getMonth() + 1; // 月
			var day = date.getDate(); // 日
			if (!uni.getStorageSync("month")) {
				uni.setStorageSync("month", month)
			}
			if (!uni.getStorageSync("q")) {
				uni.setStorageSync("q", "0")
			}
			if (!uni.getStorageSync("sc")) {
				uni.setStorageSync("sc", "0")
			}
			if (month > uni.getStorageSync("month")) {
				uni.setStorageSync("q", "0")
			}
			this.month = month
			this.by = uni.getStorageSync("q", "0")
			this.jy = parseInt((31 - day) / 31 * 100)
			getlogin().then(res => {
				// console.log("eee", res)
				if (res.indexOf('您还可以使用以下方式登录') != "-1") {
					console.log("请先登录")
					// this.show = false
					this.$refs.uNotify.primary('请先登录~')
					uni.redirectTo({
						url: 'pages/login/login'
					});

				} else {
					this.ewm()
					this.yue()
				}
				// 	// return new Promise(() => {})

			})

		},
		methods: {
			showname() {
				this.ty = !this.ty
			},
			open() {
				// console.log('open');
			},
			close() {
				this.show2 = false
				// console.log('close');
			},
			tj(a, b) {

				if (a < b) {

					var now = uni.getStorageSync("q")
		
		
					var c=this.numSub(b,a)
					var z=this.numAdd(c,now)
			
					uni.setStorageSync("q", z)
					this.by = uni.getStorageSync("q")
					uni.setStorageSync("sc", a)
				}

			},
			cz() {
				this.show2 = true
				var tty = true;
				uni.request({
					url: 'http://authserver.cqwu.edu.cn/authserver/login?service=http%3A%2F%2Fpay.cqwu.edu.cn%2FsignAuthentication%3Furl%3DopenPortal',

					method: "GET",
					// header: {
					// 	"Content-Type": "application/x-www-form-urlencoded",
					// 	"Referer": " http://pay.cqwu.edu.cn",
					// },
					// data: qs.stringify(tx),
					success: (res) => {
						console.log("yanz", res.data)
						if (res.data.indexOf('登录') != "-1") {
							// this.cz()
							tty = true
						}
					}
				});
				var cs = {
					'payAmt': this.total,
					'payProjectId': '2',
					'factorycode': 'Z007',
					'rechargeType': '1',
					'recharge_idserial': ''
				}
				// console.log(cs)
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
						// console.log("res2", res.data)
						if (res.data.returncode == "ERROR") {
							this.$refs.uNotify.error(res.data.returnmsg)
							return
						}

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
						// console.log("参数", qs.stringify(tx))

						uni.request({
							url: 'http://pay.cqwu.edu.cn/h5onlinepay',
							method: "POST",
							header: {
								"Content-Type": "application/x-www-form-urlencoded",
								"Referer": " http://pay.cqwu.edu.cn",
							},
							data: qs.stringify(tx),
							success: (res) => {
								// console.log("333",res.data)
								var box = 'deeplink : "w(.*?)"';
								this.show = false
								console.log("w" + res.data.match(box)[
									1])
								plus.runtime.openURL("w" + res.data.match(
									box)[1]);


							}
						});

					}
				})

				if (tty) {
					// this.cz()
				}



			},
			tc() {
				// console.log(this.$http.get)
				// plus.navigator.getSignature();
				plus.navigator.removeAllCookie();
				plus.navigator.removeSessionCookie();
				// uni.removeStorageSync('q');
				// uni.removeStorageSync('sc');

				// plus.device.getInfo({
				// 	success:function(e){
				// 		console.log('getDeviceInfo success: '+JSON.stringify(e));
				// 	},
				// 	fail:function(e){
				// 		console.log('getDeviceInfo failed: '+JSON.stringify(e));
				// 	}
				// });
				uni.redirectTo({
					url: 'pages/login/login'
				});
			},
			tp() {
				this.ewm()
			},
			numAdd(num1, num2) {
				var baseNum, baseNum1, baseNum2;
				try {
					baseNum1 = num1.toString().split(".")[1].length;
				} catch (e) {
					baseNum1 = 0;
				}
				try {
					baseNum2 = num2.toString().split(".")[1].length;
				} catch (e) {
					baseNum2 = 0;
				}
				baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
				return (num1 * baseNum + num2 * baseNum) / baseNum;
			},
			numSub(num1, num2) {
				var baseNum, baseNum1, baseNum2;
				var precision; // 精度
				try {
					baseNum1 = num1.toString().split(".")[1].length;
				} catch (e) {
					baseNum1 = 0;
				}
				try {
					baseNum2 = num2.toString().split(".")[1].length;
				} catch (e) {
					baseNum2 = 0;
				}
				baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
				precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
				return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
			},
			yue() {
				balance().then(res => {
					// console.log("yu", res)

					var box = '<div class="weui-cell__ft">(.*?)</div>';
					var box2 = '<div class="weui-cell__ft">(.*?)￥</div>';
					var box3 = '<div class="weui-cell__ft">2(.*?)</div>';

					// console.log("kkk", str.match(box)[1]); //4
					if (res.match(box) == null) {

						this.yue()
						// if (this.flag) {
						// 	a = uni.getStorageSync('id')
						// 	b = uni.getStorageSync('pwd')
						// 	submit(a, b)
						// } else {
						// 	this.$refs.uNotify.error('身份过期~')
						// 	console.log("sfgq", res.match(box))
						// 	uni.redirectTo({
						// 		url: 'pages/login/login'
						// 	});
						// 	return new Promise(() => {})
						// }

					} else {
						this.name = res.match(box)[1]
						this.money = res.match(box2)[1]

						this.nub = "2" + res.match(box3)[1]
						if (uni.getStorageSync("sc") == "0") {
							uni.setStorageSync("sc", this.money)
						}
						this.tj(this.money, uni.getStorageSync("sc"))
					}

				})


			},

			async ewm() {
				await qrcode().then(res => {
					// console.log(res)
					var str1 = res;
					// console.log("ewm", str1)
					var box = '<input type="hidden" id="myText" value="(.*?)" /';
					// var box2 = '<div class="weui-cell__ft">(.*?)￥</div>';
					// console.log(str.match(box)[1]); //4
					if (str1.match(box) == null) {
						this.ewm()
						// if (this.flag) {
						// 	a = uni.getStorageSync('id')
						// 	b = uni.getStorageSync('pwd')
						// 	submit(a, b)
						// } else {
						// 	this.$refs.uNotify.error('身份过期~')

						// uni.redirectTo({
						// 	url: 'pages/login/login'
						// });
						// return new Promise(() => {})
						// }

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
