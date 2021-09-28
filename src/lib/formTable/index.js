// 全局注册 formTable
import formTable from '../formTable.vue'

export default {
	install: function(Vue) {
		Vue.component('FormTable', formTable)
	}
}