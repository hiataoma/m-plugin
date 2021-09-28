<!-- 列表的table组件，所有的列表内容放置在此处 -->
<template>
	<!-- loading -->
	<div
		class="table-wrap"
		v-loading="tableData.loading"
		element-loading-text="Loading..."
		element-loading-spinner="dots-loader"
		element-loading-background="rgba(0, 0, 0, 0.8)"
	>
		<div class="toolBar">
			<slot></slot>
			<transition name="fade">
				<elButton v-if="checkedRow" type="primary" @click="clearRadioChecked">
					Clear
				</elButton>
			</transition>
			<div class="util-toolBar">
				<elTooltip effect="dark" content="Refresh" placement="top">
					<i class="el-icon-refresh icon" @click="refreshTable"></i>
				</elTooltip>
				<elTooltip effect="dark" content="Setting" placement="top">
					<elPopover
						popper-class="columns-setting"
						placement="bottom"
						trigger="click"
						width="300"
					>
						<div class="settinh-wrap">
							<div class="top">
								<elCheckbox
									:indeterminate="isIndeterminate"
									v-model="checkAll"
									@change="handleCheckAllChange"
								>
									Rows
								</elCheckbox>
								<elButton @click="resetColumns" type="text">Reset</elButton>
							</div>
							<div class="bottom">
								<elCheckboxGroup
									v-model="allShow"
									@change="handleCheckedCitiesChange"
								>
									<div class="title" v-show="hasLeft">Left</div>
									<div
										class="checkbox-item"
										v-for="item of columnsData"
										:key="`columnsData_${item + 1}`"
										v-show="columnsFixedData[item].fixed === 'left'"
										@mouseenter="
											$set(columnsFixedData[item], 'optionShow', true)
										"
										@mouseleave="
											$set(columnsFixedData[item], 'optionShow', false)
										"
									>
										<elCheckbox :label="item">{{ item }}</elCheckbox>
										<div
											v-show="columnsFixedData[item].optionShow"
											class="option-bar"
										>
											<span @click="toggleFixed(item, false)">
												Cancel
											</span>
											<span @click="toggleFixed(item, 'right')">
												Right
											</span>
										</div>
									</div>
									<div class="title" v-show="unFixed && (hasLeft || hasRight)">
										Not Fixed
									</div>
									<div
										class="checkbox-item"
										v-for="item of columnsData"
										:key="`columnsData_${item + 2}`"
										v-show="!columnsFixedData[item].fixed"
										@mouseenter="
											$set(columnsFixedData[item], 'optionShow', true)
										"
										@mouseleave="
											$set(columnsFixedData[item], 'optionShow', false)
										"
									>
										<elCheckbox :label="item">{{ item }}</elCheckbox>
										<div
											v-show="columnsFixedData[item].optionShow"
											class="option-bar"
										>
											<span @click="toggleFixed(item, 'left')">Left</span>
											<span @click="toggleFixed(item, 'right')">
												Right
											</span>
										</div>
									</div>
									<div class="title" v-show="hasRight">Right</div>
									<div
										class="checkbox-item"
										v-for="item of columnsData"
										:key="`columnsData_${item + 3}`"
										v-show="columnsFixedData[item].fixed === 'right'"
										@mouseenter="
											$set(columnsFixedData[item], 'optionShow', true)
										"
										@mouseleave="
											$set(columnsFixedData[item], 'optionShow', false)
										"
									>
										<elCheckbox :label="item">{{ item }}</elCheckbox>
										<div
											v-show="columnsFixedData[item].optionShow"
											class="option-bar"
										>
											<span @click="toggleFixed(item, 'left')">Left</span>
											<span @click="toggleFixed(item, false)">
												Cancel
											</span>
										</div>
									</div>
								</elCheckboxGroup>
							</div>
						</div>
						<i class="el-icon-setting icon" slot="reference"></i>
					</elPopover>
				</elTooltip>
			</div>
		</div>
		<div class="table">
			<elTable
				@cell-click="cellClick"
				@select="selectItem"
				@select-all="selectAll"
				@current-change="radioChange"
				:highlight-current-row="radio"
				ref="table"
				lazy
				:row-key="treeOpt.rowKey"
				:load="load"
				:tree-props="treeOpt.treeProps"
				:data="tData"
			>
				<elTableColumn
					type="selection"
					width="55"
					fixed="left"
					v-if="selection"
					:selectable="selectInit"
				></elTableColumn>
				<elTableColumn
					width="55"
					fixed="left"
					:render-header="renderHeader"
					className="el-table-column--selection"
					v-if="selectionAll"
				>
					<template slot-scope="scope">
						<elCheckbox
							:click="event => event.stopPropagation()"
							:value="scope.store.isSelected(scope.row)"
							:disabled="
								scope.column.selectable
									? !scope.column.selectable.call(null, scope.row, scope.$index)
									: false
							"
							@input="handleCheckboxInput(scope)"
						/>
					</template>
				</elTableColumn>
				<elTableColumn
					v-for="(item, index) of columnsFilter"
					:key="`${item.label}_${index}`"
					:type="item.type"
					:width="item.width"
					:min-width="item.minWidth"
					:fixed="columnsFixedData[item.label].fixed"
					:prop="item.props"
					:label="item.label"
					:align="item.align || 'left'"
				>
				<template v-if="item.header">
					<slot :name="item.props" :item="item.header">
						<template v-for="(i, ind) in item.header">
							<elTableColumn :key="ind" :prop="i.props" :label="i.label">
								<template slot-scope="scope">
									{{ scope.row[i.props] }}
								</template>
							</elTableColumn>
						</template>
					</slot>
				</template>
				<template slot-scope="scope">
						<slot :name="item.props" :item="scope.row" :scope="scope">
							{{ scope.row | tableFilter(item) }}
						</slot>
					</template>
				<!-- <slot :prop="item.props" :item="item.header">
				</slot> -->
				</elTableColumn>
				<elTableColumn
					v-if="operation"
					:width="operationWidth"
					header-align="center"
					fixed="right"
					label="Operation"
				>
					<template slot-scope="scope">
						<slot name="table-slot" :item="scope.row">
							<span class="empty">No Operation</span>
						</slot>
					</template>
				</elTableColumn>
			</elTable>
			<elPagination
				v-if="tableData.paginationData && showPaginationData"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:page-sizes="[30, 50, 80, 100]"
				:current-page.sync="tableData.paginationData.pageIndex"
				:page-size="tableData.paginationData.pageSize"
				layout="total, sizes, prev, pager, next"
				:total="tableData.paginationData.total"
			></elPagination>
		</div>
	</div>
</template>

<script>
import moment from 'moment'
import listTableMixin from './listTableMixin'
import { multiColumnMixin } from '@/mixins/multiColumn'
import { getCurrentPageColumns } from '@/utils/setTableConfig'

const $moment = moment

export default {
	name: 'listTable',

	mixins: [listTableMixin, multiColumnMixin],

	data() {
		let info = {
			path: this.getCurrentPage()
		}
		if (this.tabsValue) {
			info.tabsValue = this.tabsValue
		}

		return {
			checkedRow: null, // 单选选中的行
			checkAll: true, // 控制表格列是否全展示
			allShow: [], // 展示的表头列
			isIndeterminate: false, // 全选框样式控制值
			columnsData: [], // 控制表格展示列是否展示的数据
			columnsDataCopy: [], // 控制表格展示列是否展示的数据-备份-重置的时候需要
			columnsFixedData: {}, // 控制表格固定位置数据
			columnsFixedDataCopy: {}, // 控制表格固定位置数据-备份-重置的时候需要
			columns: this.$store.getters['setLang/getCurrentPageColumns'](info)
		}
	},

	props: {
		tableData: {
			type: Object,
			default: () => {}
		}, // 表格数据包括分页数据  不传分页属性表示不展示分页器
		form: {} // 表单
	},

	computed: {
		tData() {
			const data = this.tableData.data || []
			return data.map((item, index) => {
				if (item.createdAt) {
					item.createdAt = $moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
				}
				if (item.updatedAt) {
					item.updatedAt = $moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
				}
				if (item.completedAt) {
					item.completedAt = $moment(item.completedAt).format(
						'YYYY-MM-DD HH:mm:ss'
					)
				}
				item.hasChildren = !!this.treeOpt.isTree
				return { ...item }
			})
		},

		columnsFilter() {
			const columnsFilter = this.columns.filter(item =>
				this.allShow.includes(item.label)
			)
			this.$emit('changeColumnsFilter', columnsFilter)
			return columnsFilter
		},

		hasLeft() {
			return Object.keys(this.columnsFixedData).some(
				item => this.columnsFixedData[item].fixed === 'left'
			)
		},

		hasRight() {
			return Object.keys(this.columnsFixedData).some(
				item => this.columnsFixedData[item].fixed === 'right'
			)
		},

		unFixed() {
			return Object.keys(this.columnsFixedData).some(
				item => !this.columnsFixedData[item].fixed
			)
		}
	},

	created() {
		this.init()
	},

	mounted() {
		this.$nextTick(() => {
			const data = this.tableData.data || []
			if (data.length <= 0) {
				const dom = document.getElementsByClassName('el-table__empty-block')[0]
				const left =
					(dom.style.width.replace(/[a-zA-Z]/g, '') -
						this.$refs.table.bodyWrapper.offsetWidth) /
					2
				this.$refs.table.bodyWrapper.scrollLeft = left
			}
		})
	},

	methods: {
		// 获取当前页面地址
		getCurrentPage() {
			const { pathname } = window.location
			const currentPathName = pathname.substring(
				pathname.lastIndexOf('/') + 1,
				pathname.length
			)
			return currentPathName
		},
		// 返回值用来决定这一行的 CheckBox 是否可以勾选
		selectInit(row, index) {
			if (this.selectInitFn) {
				return this.selectInitFn(row, index)
			} else {
				return true
			}
		},

		// 查找子节点方法
		load(row, treeNode, resolve) {
			this.loadRequest(row.tradeNo).then(res => {
				resolve(res.data)
			})
		},

		init() {
			// 列表的方法
			if (Object.keys(this.tableConfig).length) {
				this.columns = getCurrentPageColumns(this.tableConfig)
			}
			let labelArr = []
			this.columns.forEach(item => {
				labelArr.push(item.label)
				this.$set(this.columnsFixedData, item.label, {
					optionShow: false,
					fixed: item.fixed || false
				})
				this.$set(this.columnsFixedDataCopy, item.label, {
					optionShow: false,
					fixed: item.fixed || false
				})
			})
			this.columnsData = global.$loadsh.cloneDeep(labelArr)
			this.columnsDataCopy = global.$loadsh.cloneDeep(labelArr)
			this.allShow = global.$loadsh.cloneDeep(labelArr)
		},

		// 复选组改变
		handleCheckedCitiesChange(value) {
			let checkedCount = value.length
			this.checkAll = checkedCount === this.columnsData.length
			this.isIndeterminate =
				checkedCount > 0 && checkedCount < this.columnsData.length
		},

		cellClick(val) {
			this.$emit('cellClick', val)
		},

		radioChange(val) {
			if (this.radio) {
				this.checkedRow = val
				this.$emit('radioChange', val)
			}
		},

		clearRadioChecked() {
			this.checkedRow = null
			this.$refs.table.setCurrentRow()
			this.$emit('radioChange', null)
		},

		// 选择一项
		selectItem(selection, row) {
			this.$emit('seletion', selection)
		},

		// 全选
		selectAll(selection) {
			// 判断全选当前页面数据还是全选所有数据
			let allPageSelected = this.selectAll && this.isAllPageSelected
			this.$emit('seletion', selection, allPageSelected)
		},

		// 重置columns数据
		resetColumns() {
			this.allShow = JSON.parse(JSON.stringify(this.columnsDataCopy))
			this.columnsData = JSON.parse(JSON.stringify(this.columnsDataCopy))
			this.columnsFixedData = JSON.parse(
				JSON.stringify(this.columnsFixedDataCopy)
			)
		},

		// 设置固定
		toggleFixed(item, position) {
			this.$set(this.columnsFixedData[item], 'fixed', position)
		},

		// 刷新
		refreshTable() {
			this.initSelectionData()
			this.$parent.emitFn()
		},

		// 全选按钮改变
		handleCheckAllChange(val) {
			this.allShow = val ? JSON.parse(JSON.stringify(this.columnsDataCopy)) : []
			this.isIndeterminate = false
		},

		handleSizeChange(pageSize) {
			this.initSelectionData()
			this.$parent.emitFn(pageSize)
		},

		handleCurrentChange(current) {
			this.initSelectionData()
			this.$parent.emitFn(null, current)
		},

		// 切换或刷新列表分页时，重置选择数据设置
		initSelectionData() {
			this.isAllPageSelected = false
		}
	}
}
</script>
