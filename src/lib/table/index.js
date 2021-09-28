import xTable from './x-table.vue';
xTable.install = Vue => Vue.component(xTable.name, xTable);//.name就是开始说的vue文件暴露出来的name名，ldcPagination整个组件
export default xTable