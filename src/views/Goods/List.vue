<template>
	<el-card class="box-card">
		<div slot="header">
			<span>商品列表</span>
		</div>
		<div class="text item">
			<el-table :data="tableData" style="width: 100%;">
				<el-table-column prop="" label="商品名称" width="500">
					<template slot-scope="scope">
						<div class="goods">
							<div class="img" prop="img_md">
								<!-- scope.row能够获取这一行的数据 -->
								<el-image style="width: 80px" :src="scope.row.img_md"></el-image>
							</div>
							<div class="name">
								<span prop="name">{{scope.row.name}}</span>
								<br>
								<span prop="articleNo">商品货号：{{scope.row.articleNo}}</span>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="price" label="价格" sortable>
				</el-table-column>
				<el-table-column prop="inventory" label="库存" sortable>
				</el-table-column>
				<el-table-column prop="create_time" label="发布时间" sortable>
				</el-table-column>
				<el-table-column prop="" label="操作" width="170">
					<template slot-scope="scope">
						<el-link :href="`#/goods/edit/${scope.row.id}`" class="am-margin-right-sm">
							<el-button type="primary" size="mini" icon="el-icon-edit" plain></el-button>
						</el-link>
						<el-button type="danger"  @click="removeGoods(scope.row.id, scope.$index)" size="mini" icon="el-icon-delete" plain></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination class="right" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
			 :current-page="pageIndex" :page-size="pageSize" :page-sizes="[4,8,16,32]" layout="prev, pager, next, sizes, total"
			 :total="total">
			</el-pagination>
		</div>


	</el-card>
</template>

<script>
	import { Goods } from "@/api/index";
	export default {
		data() {
			return {
				tableData: [],
				total: 0,
				pageSize: 4,
				pageIndex: 1,
			}
		},
		created() {
			//获取列表数据
			this.loadList();
		},
		methods: {
			//加载列表数据
			async loadList() {
				let { status, total, goods } = await Goods.list({ pageSize: this.pageSize, pageIndex: this.pageIndex });
				if (status) {
					this.tableData = goods;
					this.total = total;
				}
			},
			//删除商品
			removeGoods(id, i) {
				this.$confirm('确定要删除该商品吗?删除之后无法恢复！！！', {
						type: 'warning'
					})
					.then(async () => {
						let {status} = await Goods.remove({id:id});
						if(status){
						//更新DOM
						this.tableData.splice(i,1);
						this.$message.success('删除成功!');
						}
					})
					.catch(() => {
						this.$message.info('已取消删除');
					});
			},

			//分页器
			handleSizeChange(val) {
				this.pageSize = val;
				this.loadList();
			},
			handleCurrentChange(val) {
				this.pageIndex = val;
				this.loadList();
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
