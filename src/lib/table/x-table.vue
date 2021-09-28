<template>
  <el-table
    :data="tableData"
    style="width: 100%"
    border
    @expand-change="handleExpand"
    @selection-change="handleSelectionChange"
    :default-sort="sortObj"
    :max-height="maxHeight"
    ref="x_table">
    <el-table-column
      v-if="isCheckbox" 
      type="selection">
    </el-table-column>
    <el-table-column
      v-if="isExpand&&isExpandOnly" 
      type="expand">
      <template slot-scope="scope">
        <slot name="expand" :$index="scope.$index" :row="scope.row"></slot>
      </template>
    </el-table-column>

    <template>
      <slot name="column"></slot>
    </template>
    
  </el-table>
</template>

<script>
  export default {
    name: 'x-table',
    data() {
      return {
        multipleSelection: []
      }
    },
    mounted () {},
    props: ['tableData', 'tableKey', 'isExpand', 'isExpandOnly', 'isSortable', 'sortObj', 'isCheckbox', 'maxHeight'],
    methods: {
      handleExpand(row, expandRows){
        if(this.isExpand && this.isExpandOnly){
          this.$refs.x_table.store.states.expandRows = expandRows.length ? [row] : []
        }
      },
      handleSelectionChange(val){
        // console.log(val)
        this.multipleSelection = val
      } 
    }
  }
</script>