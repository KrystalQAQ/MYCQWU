<template>
	<view class="content">
		<u-loading-icon :show="show" text="加载中" textSize="18"></u-loading-icon>
		<u-notify ref="uNotify" message="Hi uView"></u-notify>
		<view class="text-area">
			<h1 v-show="ty">
				姓名:<text>{{name}}</text>
			</h1>
			</br>
			<h1 v-show="ty">
				学号:<text>{{nub}}</text>
			</h1>
			</br>
			<h1 @click="showname()">
				余额:<text>{{money}} ￥</text>
			</h1>
			</br>
			<h1>
				{{month}}月:<text>{{by}} ￥</text>
			</h1>
			<h3 v-show="ty">
				上次消费:<text>{{sc}} ￥</text>
			</h3>
		</view>
		<div class="qrcode" @click="tp()">
			<canvas canvas-id="qrcode" />
		</div>
		<view class="but">
			<button @click="tc()">退出登录</button>
			<button @click="sx()">点击刷新</button>
			<!-- 			<button @click="insertTableData(12)">增加</button>
			<button @click="selectTableData(12)">查看</button>
			<button @click="closeSQL">关闭</button>
			<button @click="openSQL">打开</button>
			<button @click="createTable">创建表</button>
 -->

		</view>
		<view class="but2">
			<!-- <h3>金额：</h3> -->
			<u--input placeholder="请输入充值的金额" border="surround" v-model="total" :value='total'></u--input>
			<view class="but">
				<button @click="cz()">充值</button>
				<button @click="ck()">流水</button>
			</view>
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
				sc: "",
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
				month: "",
				dbName: 'cqwu',
				dbPath: '_doc/cqwu.db',
				dbTable: 'cqwu',
				listData: []
			}
		},
		onReady() {
			// this.openSQL()
			// this.createTable()
			var date = new Date();
			var month = date.getMonth() + 1; // 月
			var day = date.getDate(); // 日
			if (!uni.getStorageSync("month")) {
				uni.setStorageSync("month", month)
			}
			if (!uni.getStorageSync("q")) {
				uni.setStorageSync("q", "0")
			}
			if (!uni.getStorageSync("scye")) {
				uni.setStorageSync("scye", "0")
			}
			if (!uni.getStorageSync("sc")) {
				uni.setStorageSync("sc", "0")
			}
			if (month > uni.getStorageSync("month")) {
				uni.setStorageSync("q", "0")
				uni.setStorageSync("month", month)
			}
			this.sc = uni.getStorageSync("sc")
			this.month = month
			this.by = uni.getStorageSync("q")
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
			ck() {
				// this.selectTableData()
				// let data=this.listData
				uni.navigateTo({
					url: 'pages/ls/ls',

				})
			},
			closeSQL() {
				let open = this.isOpen();
				if (open) {
					plus.sqlite.closeDatabase({ //完成数据库操作后，必须关闭数据库，否则可能会导致系统资源无法释放。
						name: this.dbName,
						success: (e) => {
							// this.showToast("数据库已关闭");
						},
						fail: (e) => {
							this.showToast("数据库关闭失败");
						}
					})
				}
			},
			// 打开数据库
			isOpen() {
				// 数据库打开了就返回 true,否则返回 false
				let open = plus.sqlite.isOpenDatabase({
					name: this.dbName, // 数据库名称
					path: this.dbPath // 数据库地址
				})
				console.log("22", open)
				return open;
			},

			createTable() {
				let open = this.isOpen();
				if (open) {
					let sql =
						'"id" INTEGER PRIMARY KEY AUTOINCREMENT,"content" text,"time" text';
					plus.sqlite.executeSql({ //executeSql 执行增删改等操作的SQL语句
						name: this.dbName,
						sql: `CREATE TABLE IF NOT EXISTS ${this.dbTable}(${sql})`,
						success: (e) => {
							// console.log(e)
							// this.showToast("创建表成功");
						},
						fail: (e) => {
							console.log(e)
							this.showToast("创建表失败");
						}
					})
				} else {
					// this.showToast("数据库未打开");
				}
			},

			// 新增表数据
			insertTableData(value3) {

				let open = this.isOpen();
				if (open) {




					let time = this.formatDate(new Date().getTime());
					let data = `'${value3}','${time}'`;
					let condition = "'content','time'";
					let sql = `INSERT INTO ${this.dbTable} (${condition}) VALUES(${data})`;
					plus.sqlite.executeSql({
						name: this.dbName,
						sql: sql,
						success: (e) => {
							this.showToast("新增数据成功");
							// this.selectTableData();
							this.closeSQL();
						},
						fail: (e) => {
							console.log(e)
							this.showToast("新增数据失败");
						}
					})


				} else {
					this.showToast("数据库未打开");
				}
			},
			// 查询表数据

			// 修改表数据

			// 删除表数据

			// 提示框
			showToast: function(str) {
				uni.showToast({
					icon: "none",
					title: str,
					mask: true,
					position: 'bottom'
				});
			},
			// 时间戳转年月日
			formatDate(data) {
				let now = new Date(data);
				var year = now.getFullYear(); //取得4位数的年份
				var month =
					now.getMonth() + 1 < 10 ?
					"0" + (now.getMonth() + 1) :
					now.getMonth() + 1;
				var date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
				var hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
				var minute =
					now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
				var second =
					now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
				return (
					year +
					"-" +
					month +
					"-" +
					date +
					" " +
					hour +
					":" +
					minute +
					":" +
					second
				);
			},

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



				var now = uni.getStorageSync("q")


				var c = this.numSub(b, a)
				var z = this.numAdd(c, now)

				uni.setStorageSync("q", z)
				this.by = uni.getStorageSync("q")
				this.sc = c

				uni.setStorageSync("sc", c)
				uni.setStorageSync("scye", a)
				this.openSQL()
				this.createTable()
				this.insertTableData(c)

			},
			openSQL() {
				let open = this.isOpen(); // 查询是否打开数据库
				if (!open) {
					plus.sqlite.openDatabase({ //如果数据库存在则打开，不存在则创建。
						name: this.dbName,
						path: this.dbPath,
						success: (e) => {
							// this.showToast("数据库已打开");
						},
						fail: (e) => {
							this.showToast("数据库开启失败");
						}
					})
				} else {
					// this.showToast("数据库已打开");
				}
			},
			cz() {
				this.show2 = true
				var tty = true;
				uni.request({
					url: 'http://d.cqwu.edu.cn/authserver/login?service=http%3A%2F%2Fpay.cqwu.edu.cn%2FsignAuthentication%3Furl%3DopenPortal',

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
						if (uni.getStorageSync("scye") == "0") {
							uni.setStorageSync("scye", this.money)
						}

						if (this.money > uni.getStorageSync("scye")) {
							uni.setStorageSync("scye", this.money)
						} else if (this.money < uni.getStorageSync("scye")) {
							this.tj(this.money, uni.getStorageSync("scye"))
						} else {
							return
						}

					}

				})


			},

			ewm() {
				qrcode().then(res => {
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
