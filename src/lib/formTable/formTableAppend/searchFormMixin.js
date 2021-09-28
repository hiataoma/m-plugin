// search 专属的 props，需要在 formTable 向外部的 props 写到这里
export default {
	props: {
		defaultValObj: {
			type: Object,
			default: () => {}
		},
		showSearch: { // 是否展示通用的 Search
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
		}
	}
}
