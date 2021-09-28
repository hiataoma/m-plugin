
<template>
	<x-table :tableData="table.data" :tableKey="table.key" :isExpand="isExpand" :isExpandOnly="isExpandOnly" :sortObj="sortObj" :isCheckbox="isCheckbox" :maxHeight="maxHei" ref="p_table">
		<template slot="column">
			<x-table-col :tKey="table.key" v-for="(item, key) in table.key" :item="item" :key="key">
                <!-- 通过slot插槽添加的模版内容 -->
				<template slot="date" slot-scope="scope">
					<i class="el-icon-time"></i>
				  	<span style="margin-left: 10px">{{ scope.row.date }}</span>
				</template>
				<template slot="name" slot-scope="scope">
			        <el-popover trigger="hover" placement="top">
			          	<p>姓名: {{ scope.row.name }}</p>
			          	<p>住址: {{ scope.row.address }}</p>
			          	<div slot="reference" class="name-wrapper">
			            	<el-tag size="medium">{{ scope.row.name }}</el-tag>
			          	</div>
			        </el-popover>
				</template>
				<template slot="operate" slot-scope="scope">
					<el-button
			            size="mini"
			            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button
			            size="mini"
			            type="danger"
			            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</x-table-col>
		</template>
		<template slot="expand" slot-scope="props">
			<el-form label-position="left" inline class="demo-table-expand">
	          <el-form-item label="姓名">
	            <span>{{ props.row.name }}</span>
	          </el-form-item>
	          <el-form-item label="住址">
	            <span>{{ props.row.address }}</span>
	          </el-form-item>
	        </el-form>
		</template>
	</x-table>	
</template>

<script>
	import xTable from '../lib/table/x-table'
	import xTableCol from '../lib/table-column/x-table-col'

	export default {
		data () {
			return {
				table: {
		          key: [{
		          	label: '日期', 
		          	value: 'date', 
		          	template: true, 
		          	isSortable: true, 
		          	width: 180
		          }, {
		          	label: '姓名', 
		          	value: 'name', 
		          	template: true, 
		          	width: 180
		          }, {
		          	label: '地址',
		          	value: 'address', 
		          	template: false,
		          	child: [{
		          		label: '省份', 
		          		value: 'province', 
		          		template: false, 
		          		isSortable: true, 
		          		width: 120
		          	}, {
		          		label: '市区', 
		          		value: 'city', 
		          		template: false, 
		          		width: 120
		          	}, {
		          		label: '详细地址', 
		          		value: 'detail', 
		          		template: false, 
		          		width: 220
		          	}]
		          }, {
		          	label: '操作', 
		          	value: 'operate', 
		          	template: true,
		          	width: 300
		          }],
		          data: [{
		            date: '2016-05-02',
		            name: '王小虎',
	            	province: '上海',
			        city: '普陀区',
			        detail: '金沙江路 1518 弄',
		            address: '上海市普陀区金沙江路 1518 弄'
		          }, {
		            date: '2016-05-04',
		            name: '王小虎',
		            province: '上海',
			        city: '普陀区',
			        detail: '金沙江路 1517 弄',
		            address: '上海市普陀区金沙江路 1517 弄'
		          }, {
		            date: '2016-05-01',
		            name: '王小虎',
		            province: '上海',
			        city: '普陀区',
			        detail: '金沙江路 1519 弄',
		            address: '上海市普陀区金沙江路 1519 弄'
		          }, {
		            date: '2016-05-03',
		            name: '王小虎',
		            province: '上海',
			        city: '普陀区',
			        detail: '金沙江路 15186 弄',
		            address: '上海市普陀区金沙江路 1516 弄'
		          }, {
		            date: '2016-05-08',
		            name: '王小虎',
		            province: '上海',
			        city: '普陀区',
			        detail: '金沙江路 15180 弄',
		            address: '上海市普陀区金沙江路 1516 弄'
		          }]
		        },
		        sortObj: {prop: 'date', order: 'descending'},
		        isExpand: true,
		        isExpandOnly: true,
		        isCheckbox: true,
		        maxHei: 350
			}
		},
		mounted () {},
		components: { xTable, xTableCol },
		methods: {
	      	handleEdit(index, row) {
	      		// 解决 点击编辑打开展开行的问题
	        	// if(this.isExpand && this.isExpandOnly){
		        //   	this.$refs.p_table.$refs.x_table.store.states.expandRows = !this.$refs.p_table.$refs.x_table.store.states.expandRows.length ? [row] : []
		        // }
	      	},
	      	handleDelete(index, row) {
	        	console.log(index, row);
	      	}
    	}
	}
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
