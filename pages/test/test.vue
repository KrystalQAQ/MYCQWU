<template>
	<view class="charts-box">
		<h3 style="text-align: center;">{{hh}}</h3>
		<qiun-data-charts type="line" :opts="opts" :chartData="chartData" :canvas2d="true"
			canvasId="DXSDRZpdpFcQtfpkuvcXmSRNPPvDzzrk" />
			<h3 style="text-align: center;">总计:{{sum}}元</h3>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dbName: 'cqwu',
				dbPath: '_doc/cqwu.db',
				dbTable: 'cqwu',
				chartData: {},
				categories: [],
				sj: [],
				tt: [],
				hh:'',
				sum:"",
				//您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 10, 0, 15],
					legend: {},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						gridType: "dash",
						dashLength: 2
					},
					extra: {
						line: {
							type: "curve",
							width: 2
						}
					}
				}
			};
		},
		onReady() {
			// this.openSQL()
			this.closeSQL() 
			this.hh=this.formatDate(new Date())
			let open = this.isOpen();
			this.openSQL()


			console.log("Hello", open)
		},
		methods: {

			openSQL() {
				let open = this.isOpen(); // 查询是否打开数据库

				// this.createTable()
				if (!open) {
					console.log("打开数据库")
					plus.sqlite.openDatabase({ //如果数据库存在则打开，不存在则创建。
						name: this.dbName,
						path: this.dbPath,
						success: (e) => {
							this.selectTableData()
							// this.showToast("数据库已打开");
							console.log("数据库打开成功")
						},
						fail: (e) => {
							this.showToast("数据库开启失败");
							console.log("数据库打开失败")
						}
					})
				} else {
					// this.showToast("数据库已打开");
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
				return open;
			},
			selectTableData() {
				let open = this.isOpen();
				console.log("open", open)
				if (open) {

					// let sql =
					// 	`SELECT time, SUM(content) FROM ${this.dbTable} WHERE time > date('now','-7 days') GROUP BY time;`;
					let sql =
						`SELECT time, SUM(content)  FROM ${this.dbTable} WHERE time > date('now','-7 days') GROUP BY DATE(time)`;
					plus.sqlite.selectSql({
						name: this.dbName,
						sql: sql,
						success: (e) => {
							this.showToast("查询成功");
							// this.tt = e;
							// console.log("查询成功", this.tt)
							this.getServerData(e)
							this.closeSQL()

						},
						fail: (e) => {
							console.log("查询失败")
							// this.showToast(e);

						}
					})
				} else {
					this.showToast("数据库未打开");
				}
			},formatDate(data) {
				let now = new Date(data);
				var year = now.getFullYear(); //取得4位数的年份
				var month =
					now.getMonth() + 1 < 10 ?
					"0" + (now.getMonth() + 1) :
					now.getMonth() + 1;
				var date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
				var data2=date-7;
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
					(date-7) +
					"~" +
					year +
					"-" +
					month +
					"-" +
					date 

				);
			},
			showToast: function(str) {
				uni.showToast({
					icon: "none",
					title: str,
					mask: true,
					position: 'bottom'
				});
			},
			getServerData(e) {
				//模拟从服务器获取数据时的延时
				console.log("我的数据", e)
				var a = [];
				var b = [];
				var c=0;
				for (var i = 0; i < e.length; i++) {
					a.push(e[i].time.substring(5,10))
					b.push(e[i]['SUM(content)'])
						
				}
				for (var i = 0; i < b.length; i++) {
					
						c=c+b[i]
				}
				this.sum=c
				this.categories=a	
				this.sj=b
				// this.tt = e;
				//  setTimeout(() => {
				//    //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
				   let res = {
				       categories: this.categories,
				       series: [
				         {
				           name: "日花费",
				
				           data: this.sj
				         }
				       ]
				     };
				   this.chartData = JSON.parse(JSON.stringify(res));
		
				//  }, 500);
			},
		}
	};
</script>

<style scoped>
	/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
	.charts-box {
		width: 100%;
		height: 300px;
	}
</style>
