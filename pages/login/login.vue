<template>
	<view>
		<h1>登录</h1>
		<u-loading-icon :show="show" text="加载中" textSize="18"></u-loading-icon>
		<u-notify ref="uNotify" message="Hi uView"></u-notify>
		账号：
		<u--input placeholder="请输入账号" border="surround" v-model="id" :value='id'></u--input>
		密码：
		<u--input @change="change2" placeholder="请输入密码" border="surround" v-model="pwd" password></u--input>
		<view v-show="yz" id="tp">
			验证码:		<u--input  placeholder="请输入验证码" border="surround" v-model="captchaResponse" ></u--input><image  :src="yztp"></image>
		</view>
		<span>自动登录</span>
		<u-switch v-model="name" @change="change"></u-switch>
		<u-button @click="ty1()" type="primary" text="登录"></u-button>
		<!-- <button @click="submit()">登录</button> -->
	</view>
</template>

<script>
	import {
		encryptAES
	} from '../../utils/encrypt.js';
	import {
		gethtml,
		getlogin,
		zfc,
		yzm,
		getyzm
	} from '../../utils/api.js';

	export default {
		data() {
			return {
				captchaResponse:'',
				yz: false,
				id: "201958304084",
				pwd: "Krystal1024",
				name: false,
				show: false,
				lt: '',
				dllt: '',
				execution: '',
				_eventId: '',
				rmShown: '',
				pd: '',
				yztp: ''

			}
		},
		onReady() {

		},
		watch: {
			// 被侦听的变量count
			yz() {
				// console.log('count 发生了变化');
				if (this.yz == true) {
					this.yztp = "http://authserver.cqwu.edu.cn/authserver/captcha.html?ts=" + new Date().getMilliseconds()
				}
			}
		},
		methods: {
			change2() {
				yzm({
					'username': this.id,
					'pwdEncrypt2': "pwdEncrypt2",
					'-': Date.now()
				}).then(res => {
					this.yz = res.data

				})
			},
			async ty1() {
				this.show = true
				await gethtml().then(res => {
					console.log("已经登录",res)
					if (res.indexOf('个人中心') != "-1") {
						console.log("已经登录")
						this.show = false
						this.$refs.uNotify.primary('登录成功')

						uni.redirectTo({
							url: 'pages/index/index'
						});
						return new Promise(() => {})
					}
					var box = '<input type="hidden" name="lt" value="(.*?)"/>';
					var box2 = '<input type="hidden" name="dllt" value="(.*?)"/>';
					var box3 = '<input type="hidden" name="execution" value="(.*?)"/>';
					var box4 = '<input type="hidden" name="_eventId" value="(.*?)"/>';
					var box5 = '<input type="hidden" name="rmShown" value="(.*?)">';
					var box6 = 'var pwdDefaultEncryptSalt = "(.*?)";';
					// console.log("ty",res.header)
					this.lt = res.data.match(box)[1]
					this.dllt = res.data.match(box2)[1]
					this.execution = res.data.match(box3)[1]
					this._eventId = res.data.match(box4)[1]
					this.rmShown = res.data.match(box5)[1]
					var pwdDefaultEncryptSalt = res.data.match(box6)[1]
					this.pd = encryptAES(this.pwd, pwdDefaultEncryptSalt)
					// var cs = {
					// 	'username': this.id,
					// 	'password': pd,
					// 	'lt': lt,
					// 	"dllt": dllt,
					// 	"execution": execution,
					// 	"_eventId": _eventId,
					// 	"rmShown": rmShown
					// }
					// console.log(cs)

				})
				var cs = {
					'username': this.id,
					'password': this.pd,
					'lt': this.lt,
					"dllt": this.dllt,
					"execution": this.execution,
					"_eventId": this._eventId,
					"rmShown": this.rmShown,
					"captchaResponse":this.captchaResponse
				}
				console.log("", cs)
				await getlogin(cs).then(res => {
					// console.log("eee", res.data)
					if (res.data.indexOf('您提供的用户名或者密码有误') != "-1") {
						console.log("您提供的用户名或者密码有误")
						this.show = false
						this.$refs.uNotify.error('您提供的用户名或者密码有误')
						return new Promise(() => {})
					}

				})
				await zfc().then(res => {
					// console.log("eeeee", res.data)
					this.show = false
					if (res.data.indexOf('请输入密码') != "-1") {

						this.show = false
						this.$refs.uNotify.error('登录失败')
						return new Promise(() => {})
					} else {
						this.$refs.uNotify.primary('登录成功')
						console.log("已经登录")
						// uni.setStorageSync("cookie", res.data.body[0][1])
						 // this.sleep(2000)
						uni.redirectTo({
							url: 'pages/index/index'
						});
					}

				})
				// console.log(res)
			},
			sleep(n) {
			        var start = new Date().getTime();
			        //  console.log('休眠前：' + start);
			        while (true) {
			            if (new Date().getTime() - start > n) {
			                break;
			            }
			        }
			        // console.log('休眠后：' + new Date().getTime());
			    },
			ty() {
				this.show = true
				uni.request({
					url: "http://authserver.cqwu.edu.cn/authserver/login?service=http%3A%2F%2Fehall.cqwu.edu.cn%2Flogin%3Fservice%3Dhttp%3A%2F%2Fehall.cqwu.edu.cn%2Fnew%2Findex.html",
					// data: {
					// 	id: this.id,
					// 	pwd: this.pwd

					// },
					success: (res) => {

						if (res.data.indexOf('个人中心') != "-1") {
							this.show = false
							this.$refs.uNotify.primary('登录成功')
							uni.redirectTo({
								url: 'pages/index/index'
							});
						} else {
							var box = '<input type="hidden" name="lt" value="(.*?)"/>';
							var box2 = '<input type="hidden" name="dllt" value="(.*?)"/>';
							var box3 = '<input type="hidden" name="execution" value="(.*?)"/>';
							var box4 = '<input type="hidden" name="_eventId" value="(.*?)"/>';
							var box5 = '<input type="hidden" name="rmShown" value="(.*?)">';
							var box6 = 'var pwdDefaultEncryptSalt = "(.*?)";';
							// console.log("ty",res.header)
							var lt = res.data.match(box)[1]
							var dllt = res.data.match(box2)[1]
							var execution = res.data.match(box3)[1]
							var _eventId = res.data.match(box4)[1]
							var rmShown = res.data.match(box5)[1]
							var pwdDefaultEncryptSalt = res.data.match(box6)[1]
							var pd = encryptAES(this.pwd, pwdDefaultEncryptSalt)
							var cs = {
								'username': this.id,
								'password': pd,
								'lt': lt,
								"dllt": dllt,
								"execution": execution,
								"_eventId": _eventId,
								"rmShown": rmShown
							}
							console.log(cs)
							// 
							uni.request({
								url: "http://authserver.cqwu.edu.cn/authserver/login?service=http%3A%2F%2Fehall.cqwu.edu.cn%2Flogin%3Fservice%3Dhttp%3A%2F%2Fehall.cqwu.edu.cn%2Fnew%2Findex.html",
								data: cs,
								success: (res) => {

									this.show = false
									this.$refs.uNotify.primary('登录成功')
									// uni.setStorageSync("cookie", res.data.body[0][1])
									uni.redirectTo({
										url: 'pages/index/index'
									});
									// 


								}
							});


						}
					}

				});
			},
			change(e) {
				// this.name = !this.name
				console.log('change', e);
			},
			async submit() {
				this.show = true
				uni.setStorageSync("id", this.id)
				uni.setStorageSync("pwd", this.pwd)
				if (this.name) {
					uni.setStorageSync("flag", this.name)

				}
				uni.request({
					url: 'https://service-79bppka6-1301431081.gz.apigw.tencentcs.com/release/cqwu',
					data: {
						id: this.id,
						pwd: this.pwd

					},
					success: (res) => {
						if (res.statusCode == 200) {
							// console.log(res.data.body)
							this.show = false
							this.$refs.uNotify.primary('登录成功')
							uni.setStorageSync("cookie", res.data.body[0][1])
							uni.redirectTo({
								url: 'pages/index/index'
							});
						}
						// console.log(res)
						// 


					}
				});


			}
		}
	}
</script>

<style scoped>
	h1 {
		text-align: center;
	}

	#tp {
		/* height: 100px; */
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	#tp image{
		    width: 87px;
		    height: 34px;
	}
</style>
