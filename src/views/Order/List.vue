<template>
	<el-card class="box-card">
		<div slot="header">
			<span>订单列表</span>
		</div>
		<el-table :data="tableData" style="width: 100%;">
			<el-table-column prop="id" label="#" width="50">
			</el-table-column>
			<el-table-column label="" width="600">
				<template slot-scope="scope">
					<el-table :data="scope.row.goodsList" style="width: 100%;">
						<el-table-column label="商品" width="400">
							<template slot-scope="scope">
								<div class="goods">
									<div class="img" prop="img_md">
										<!-- scope.row能够获取这一行的数据 -->
										<el-image style="width: 80px" :src="scope.row.img_md"></el-image>
									</div>
									<div class="name">
										<span prop="name">{{scope.row.name}}</span>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="goods_price" label="单价">
						</el-table-column>
						<el-table-column prop="goods_num" label="数量" >
						</el-table-column>
					</el-table>
				</template>
			</el-table-column>
			<el-table-column prop="payment" label="付款总额">
			</el-table-column>
			<el-table-column prop="create_time" label="下单时间" width="180" sortable>
			</el-table-column>
			<el-table-column prop="status" label="状态" sortable>
			</el-table-column>
			<el-table-column prop="" label="操作">
				<template slot-scope="scope">
					<el-link :href="`#`" class="am-margin-right-sm">
						<el-button type="primary" size="mini" icon="el-icon-edit" plain></el-button>
					</el-link>
				</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>

<script>
	import { Order } from '@/api/index';
	export default{
		data(){
			return {
				tableData: [],
			}
		},
		created() {
			//获取列表数据
			this.loadList();
		},
		methods: {
			//加载列表数据
			async loadList() {
				let { status, total, data} = await Order.allList({ pagesize: 4, pageindex: 1 });
				if (status) {
					this.tableData = data;
				}
			}
		}
	}
</script>

<style scoped>
	.goods {
		display: flex;
		align-items: center;
	}
	
	.goods .img {
		margin-right: 6px;
		border: 1px solid #eee;
	}
	
	.am-margin-right-sm {
		margin-right: 10px;
	}
	
	.right {
		margin-top: 10px;
		display: flex;
		justify-content: flex-end;
	}
</style>
