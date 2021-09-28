<template>
	<div id="x-table-col" class="table-column-wrap" :class="item">
	    <el-table-column
	      :class="item"
	      v-if="item.template"
	      :label="item.label"
	      :prop="item.value"
	      :sortable="item.isSortable"
	      :width="item.width"
	      header-align="center">
	      	<template slot-scope="scope">
		        <slot :name="item.value" :$index="scope.$index" :row="scope.row"></slot>
		    </template>
	    </el-table-column>
	    <el-table-column
	      v-if="item.child"
	      :label="item.label"
	      :prop="item.value"
	      :sortable="item.isSortable"
	      :width="item.width"
	      header-align="center">
	      	<template>
	      		<x-table-col :tKey="item.child" v-for="(item1, key) in item.child" :item="item1" :key="key"></x-table-col>
	      	</template>
	    </el-table-column> 
	    <el-table-column
	      v-if="!item.child && !item.template"
	      :label="item.label"
	      :prop="item.value"
	      :sortable="item.isSortable"
	      :width="item.width"
	      header-align="center">
	    </el-table-column>
	</div>
</template>
<script>
	export default {
		name: 'x-table-col',
		data () {
			return {
				isShow: false,
			}
		},
		mounted () {
			this.$nextTick(function () {
				setTimeout(function () {
					this.isShow = true
					// console.log(this.tData)
				}, 6000)
			})
		},
		props: ['tData', 'tKey', 'item'],
	}
</script>