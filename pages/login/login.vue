<template>
	<view>
		<h1>登录</h1>
		<u-loading-icon :show="show" text="加载中" textSize="18"></u-loading-icon>
		<u-notify ref="uNotify" message="Hi uView"></u-notify>
		账号：
		<u--input placeholder="请输入内容" border="surround" v-model="id" :value='id'></u--input>
		密码：
		<u--input placeholder="请输入内容" border="surround" v-model="pwd" password></u--input>
		<span>自动登录</span><u-switch v-model="name" @change="change"></u-switch>
		<u-button @click="submit()" type="primary" text="登录"></u-button>
		<!-- <button @click="submit()">登录</button> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: "",
				pwd: "",
				name: false,
				show:false

			}
		},
		methods: {
			change(e) {
				// this.name = !this.name
				console.log('change', e);
			},
			async submit() {
				this.show = true
				uni.setStorageSync("id", this.id)
				uni.setStorageSync("pwd", this.pwd)
				if(this.name){
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
</style>
