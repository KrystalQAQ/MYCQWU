<template>
	<view>
		<h3 style="text-align: center;">流水</h3>
		<table>
			<tr>
				<th class="ww1">时间</th>
				<th class="ww">金额</th>
			</tr>
			<tr v-for="item in tt" :key="item.index">
				<td class="ww1">{{item.time}}</td>
				<td class="ww">{{item.content}}元</td>
			</tr>
		</table>
		<button @click="kk">一周图表</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tt: [],
				dbName: 'cqwu',
				dbPath: '_doc/cqwu.db',
				dbTable: 'cqwu'
			}
		},
		onLoad() {
			this.closeSQL()
			
			this.openSQL()
			
			
			// this.createTable()
			// this.selectTableData()
		},
		methods: {
			kk() {
				uni.navigateTo({
					url: 'pages/test/test',

				})
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
							console.log("创建表成功",e)
							// this.showToast("创建表成功");
						},
						fail: (e) => {
							console.log("创建表失败",e)
							this.showToast("创建表失败");
						}
					})
				} else {
					// this.showToast("数据库未打开");
				}
			},
			openSQL() {

				let open = this.isOpen(); // 查询是否打开数据库
				
				if (!open) {
					plus.sqlite.openDatabase({ //如果数据库存在则打开，不存在则创建。
						name: this.dbName,
						path: this.dbPath,
						success: (e) => {
							this.createTable()
							this.selectTableData()
							// this.showToast("数据库已打开");
						},
						fail: (e) => {
							this.showToast("数据库开启失败");
						}
					})
				} else {
					this.showToast("数据库已打开");
				}
			},
			closeSQL() {
				let open = this.isOpen();
				if (open) {
					plus.sqlite.closeDatabase({ //完成数据库操作后，必须关闭数据库，否则可能会导致系统资源无法释放。
						name: this.dbName,
						success: (e) => {
							console.log("关闭")
							// this.showToast("数据库已关闭");
						},
						fail: (e) => {
							this.showToast("数据库关闭失败");
						}
					})
				}
			},
			isOpen() {
				// 数据库打开了就返回 true,否则返回 false
				let open = plus.sqlite.isOpenDatabase({
					name: this.dbName, // 数据库名称
					path: this.dbPath // 数据库地址
				})
				console.log("数据库状态",open)
				return open;
			},
			selectTableData() {
				let open = this.isOpen();
				// console.log("open", open)
				if (open) {
					let sql = `SELECT * FROM ${this.dbTable}`;
					plus.sqlite.selectSql({
						name: this.dbName,
						sql: sql,
						success: (e) => {
							this.showToast("查询成功");
							console.log("查询成功",e)
							this.tt = e;
							this.closeSQL()

						},
						fail: (e) => {
							console.log("查询失败",e)
							this.closeSQL()
							// this.showToast(e);

						}
					})
				} else {
					this.showToast("数据库未打开");
				}
			},
			showToast: function(str) {
				uni.showToast({
					icon: "none",
					title: str,
					mask: true,
					position: 'bottom'
				});
			},
		}
	}
</script>

<style scoped>
	.ww1 {
		width: 300px;
		text-align: center;
	}

	.ww {
		width: 300px;
		text-align: center;
	}
</style>
