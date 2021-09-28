// list 专属的 props，需要在 formTable 向外部的 props 写到这里
export default {
	props: {
		loadRequest: {
			type: Function
		},
		selectInitFn: {
			type: Function,
			default: null
		},
		operation: {
			type: Boolean,
			default: false
		}, // 表格是否有操作  如果有内容插槽进来
		operationWidth: {
			type: [String, Number],
			default: 200
		}, // 表格操作宽度，默认是200
		radio: {
			type: Boolean,
			default: false
		}, // 是否进行单选
		selection: {
			type: Boolean,
			default: false
		}, // 表格是否可以多选
		selectionAll: {
			type: Boolean,
			default: false
		}, // 表格可以勾选全部数据
		showPaginationData: { // 是否展示分页
			type: Boolean,
			default: true
		},
		tabsValue: {
			type: String,
			default: ''
		},
		tableConfig: {
			type: Object,
			default: () => {
				return {}
			}
		}, // 自行传入的表单配置
		// 树形数据表格数据
		treeOpt: {
			type: Object,
			default: () => {
				return {
					rowKey: 'id',
					treeProps: { children: 'children', hasChildren: 'hasChildren' },
					getChildrenRequest: null
				}
			}
		}
	}
}
