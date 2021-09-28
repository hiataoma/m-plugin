<template>
	<div id="util-form-table">
		<!-- 查询条件 -->
		<SearchForm
			v-if="showSearch"
			v-model="formObj"
			props="searchForm"
			:tableData="tableData"
			:showSearch="showSearch"
			:tableConfig="tableConfig"
			:defaultValObj="defaultValObj"
			:tabsValue="tabsValue"
			:rules="rules"
			@resetExtraData="resetExtraData"
			@changeFormFilter="
				e => {
					formFilter = e
				}
			"
		>
			<template
				v-for="(item, index) of formFilter"
				:slot="item.props ? `${item.props}FormItem` : `formItem${index}`"
				slot-scope="scope"
			>
				<slot
					:name="item.props ? `${item.props}FormItem` : `formItem${index}`"
					:formObj="scope.formObj"
					:item="item"
				></slot>
			</template>
			<template slot="form-item-slot" slot-scope="scope">
				<slot name="form-item-slot" :formObj="scope.formObj"> </slot>
			</template>
		</SearchForm>
		<slot name="middle-container"></slot>
		<!-- 列表 -->
	</div>
</template>
<script>
import { getType } from '@/utils/commonFn'

import SearchForm from './formTableAppend/searchForm'
// import ListTable from './formTableAppend/listTable'

import searchFormMixin from './formTableAppend/searchFormMixin'
// import listTableMixin from './formTableAppend/listTableMixin'

function removePropertyOfNull(obj) {
	Object.keys(obj).forEach(item => {
		if (getType(obj[item], 'string')) {
			if (!obj[item].length) delete obj[item]
		}
		if (getType(obj[item], 'null')) {
			delete obj[item]
		}
	})
	return obj
}

export default {
	name: 'formTable',

	model: {
		prop: 'formObj',
		event: 'input'
	},

	mixins: [searchFormMixin],

	components: {
		SearchForm,
		ListTable
	},

	props: {
		formObj: {
			type: Object,
			default: () => {
				return {}
			}
		},
		tableData: {
			type: Object,
			default: () => {}
		}, // 表格数据包括分页数据  不传分页属性表示不展示分页器
		firstQuery: {
			type: Boolean,
			default: true
		}, // 是否需要初始化查询
		tableConfig: {
			type: Object,
			default: () => {
				return {}
			} // 自定义的表格数据
		},
		rules: {
			type: Object,
			default: () => { return {} }
		} // 表单规则
	},

	data() {
		return {
			formFilter: [], // 表单数据
			filteData: {}, // 过滤数据为空的数据
			columnsFilter: [] // 列表展示数据
		}
	},

	created() {
		this.init()
	},

	mounted() {
		if (this.firstQuery) {
			this.emitFn()
		}
	},

	watch: {
		// tableConfig 修改时，初始化 init
		tableConfig: {
			handler () {
				this.init()
			},
			deep: true
		},
		'tableData.data'(val) {
			if (!val || !val.length) return
			this.conversionData(val, this.tableConfig)
		}
	},
	methods: {
		// get请求拼接返回数据
		queryGetData(pageSize, pageIndex) {
			let data = {}
			Object.assign(this.filteData, this.formObj)
			removePropertyOfNull(this.filteData)
			data = this.filteData
			if (this.tableData.paginationData) {
				data.pageSize = pageSize || this.tableData.paginationData.pageSize
				data.pageIndex = pageIndex || this.tableData.paginationData.pageIndex
			}
			return data
		},

		resetExtraData() {
			this.$emit('resetExtraData')
		},

		// 通知函数
		emitFn(pageSize, pageIndex) {
			// 重置勾选数据设置
			this.$refs.listTable.isAllPageSelected = false

			const data = this.queryGetData(pageSize, pageIndex)
			this.$emit('query', data)
		},

		// 修改数据生成form表单对象和表头数据
		init() {
			this.$nextTick(() => {
				this.$refs.searchForm && this.$refs.searchForm.init()
				this.$refs.listTable && this.$refs.listTable.init()
			})
		},

		// 处理列表数据，将字典数据转换的value转换成label展示
		conversionData(val, tableConfig) {
			const { columns } = tableConfig || { columns: [] }
			let resourceNameList = []
			let localResourceList = []
			// 找到需要翻译的字段
			if (columns && columns.length) {
				columns.forEach(item => {
					if (item.translateUrl) {
						resourceNameList.push({
							url: item.translateUrl,
							label: item.props,
							type: item.translateType,
							isCache: item.isCache
						})
					}

					if (item.dictionaryList) {
						localResourceList.push({
							label: item.props,
							dictionaryList: item.dictionaryList,
							type: item.translateType
						})
					}
				})
			}
			// 调用字典接口进行翻译
			if (resourceNameList && resourceNameList.length) {
				resourceNameList.forEach(item => {
					this.$store
						.dispatch('catchResource/set_resource_item', item)
						.then(res => {
							let dictionaryObj = {}
							// 将获取的字典数据组合成{value: label}的形式
							res.forEach(dictionaryItem => {
								dictionaryObj[dictionaryItem.value] = dictionaryItem.label
							})
							// 遍历列表数据
							val.forEach(dataItem => {
								if (dataItem[item.label] === undefined || !dataItem[item.label].toString()) return
								// 要转换的字段类型为数组
								if (item.type === 'Array' || Array.isArray(dataItem[item.label])) {
									let tempArry = ''
									if (item.type === 'Array') {
										tempArry = dataItem[item.label].split(',').map(
											labelDataItem => dictionaryObj[labelDataItem]
										)
									} else if (Array.isArray(dataItem[item.label])) {
										tempArry = dataItem[item.label].map(
											labelDataItem => dictionaryObj[labelDataItem]
										)
									}
									this.$set(
										dataItem,
										`${item.label}ToLabel`,
										tempArry.toString()
									)
								} else {
									// 要转换的字段为普通字符串
									this.$set(
										dataItem,
										`${item.label}ToLabel`,
										dictionaryObj[dataItem[item.label]]
									)
								}
							})
						})
				})

				// 本地自定义字典翻译
				if (localResourceList.length) {
					localResourceList.forEach(item => {
						let dictionaryObj = {}
						// 将获取的字典数据组合成{value: label}的形式
						item.dictionaryList.forEach(dictionaryItem => {
							dictionaryObj[dictionaryItem.value] = dictionaryItem.label
						})

						// 遍历列表数据
						val.forEach(dataItem => {
							if (dataItem[item.label] === undefined || !dataItem[item.label].toString()) return
							// 要转换的字段类型为数组
							if (item.type === 'Array' || Array.isArray(dataItem[item.label])) {
								let tempArry = ''
								if (item.type === 'Array') {
									tempArry = dataItem[item.label].split(',').map(
										labelDataItem => dictionaryObj[labelDataItem]
									)
								} else if (Array.isArray(dataItem[item.label])) {
									tempArry = dataItem[item.label].map(
										labelDataItem => dictionaryObj[labelDataItem]
									)
								}
								this.$set(
									dataItem,
									`${item.label}ToLabel`,
									tempArry.toString()
								)
							} else {
								// 要转换的字段为普通字符串
								this.$set(
									dataItem,
									`${item.label}ToLabel`,
									dictionaryObj[dataItem[item.label]]
								)
							}
						})
					})
				}
			}
		}
	}
}
</script>
<style lang="less">
// @import '../assets/css/formTable.less';

</style>
