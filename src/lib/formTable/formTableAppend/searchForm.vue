 <!-- 列表的查询组件，所有的查询组件内容放置在此处 -->
<template>
	<div
		v-if="showSearch"
		:class="['form-wrap', `form-wrap-${isOpen ? 'show' : 'hide'}`]"
		id="searchForm"
	>
	<input class="hidden-inp" type="text" />
	<input class="hidden-inp" type="password" />
		<elForm
			v-loading="formLoading"
			:inline="true"
			:model="formObj"
			:rules="rules"
			ref="form"
		>
			<elRow :gutter="20">
				<elCol
					:xs="4"
					:sm="12"
					:md="8"
					:lg="12"
					:xl="8"
					v-for="(item, key) of form"
					:key="`${item.label}_${key}`"
					v-show="isOpen ? true : key <= 2"
				>

					<slot
						:name="item.props ?
						`${item.props}FormItem` :
						`formItem${key}`"
						:formObj="formObj"
					>
					<elFormItem :label="item.label + ':'" :prop="item.props">
						<elInput
							size="mini"
							v-if="item.type === 'input'"
							v-model="formObj[item.props]"
							:placeholder="`Please Enter ${item.label}`"
						></elInput>

						<!-- 远程搜索下拉组件 -->
						<elSelect
							@change="unionNext(item)"
							@focus="focusRequest(item)"
							:remote="item.isRemote"
							:remote-method="
								query => {
									remoteMethod(query, item)
								}
							"
							clearable
							filterable
							:multiple="item.multiple"
							:collapse-tags="item.collapseTags !== false"
							v-else-if="item.type === 'select'"
							v-model="formObj[item.props]"
							:placeholder="`Please Select ${item.label}`"
						>
							<elOption
								v-if="item.allOption"
								label="All"
								:value="item.allOptionValue || ''"
							/>
							<elOption
								v-for="(i, index) in item.optionsData"
								:key="`${i.value}_${index}`"
								:label="i.label"
								:value="i.value"
							></elOption>
						</elSelect>
						<elAutocomplete
							v-else-if="item.type === 'autocomplete'"
							v-model="formObj[item.props]"
							:fetch-suggestions="querySearchAsync.bind(this, item)"
							:placeholder="`Please Enter ${item.label}`"
						></elAutocomplete>
						<span v-else-if="item.type === 'text'">
							{{ formObj[item.props] }}
						</span>
						<div v-else-if="item.type === 'date'" class="tc-month-range-picker">
							<elDatePicker
								v-model="formObj[item.props]"
								size="mini"
								type="daterange"
								value-format="yyyy-MM-dd"
								:placeholder="`Please Enter ${item.label}`"
								style="width:100%"
							></elDatePicker>
						</div>
						<div v-else-if="item.type === 'onlyDate'" class="tc-month-range-picker">
							<elDatePicker
								v-model="formObj[item.props]"
								size="mini"
								type="date"
								value-format="yyyy-MM-dd"
								:placeholder="`Please Enter ${item.label}`"
								style="width:100%"
							></elDatePicker>
						</div>
						<div v-else-if="item.type === 'dateRange'" class="tc-month-range-picker">
							<elDatePicker
								v-model="formObj[item.startProps]"
								size="mini"
								type="date"
								value-format="yyyy-MM-dd"
								:placeholder="`Please Enter ${item.label}`"
								style="width:100%"
							></elDatePicker>
							-
							<elDatePicker
								v-model="formObj[item.endProps]"
								size="mini"
								type="date"
								value-format="yyyy-MM-dd"
								:placeholder="`Please Enter ${item.label}`"
								style="width:100%"
							></elDatePicker>
						</div>
						<div
							v-else-if="item.type === 'datetimerange'"
							class="tc-month-range-picker"
						>
							<elDatePicker
								v-model="formObj[item.startProps]"
								size="mini"
								type="datetime"
								format="yyyy-MM-dd HH:mm:ss"
								value-format="timestamp"
								:placeholder="`Please Enter ${item.label}`"
								:picker-options="pickerBeginDateBefore"
								style="width:100%"
							></elDatePicker>
							-
							<elDatePicker
								v-model="formObj[item.endProps]"
								size="mini"
								type="datetime"
								@change="handleDate(item.endProps, formObj[item.startProps], $event)"
								format="yyyy-MM-dd HH:mm:ss"
								value-format="timestamp"
								default-time="23:59:59"
								:picker-options="pickerBeginDateBefore"
								:placeholder="`Please Enter ${item.label}`"
								style="width:100%"
							></elDatePicker>
						</div>
						<div v-else-if="item.type === 'datemerange'">
							<elDatePicker
								v-model="formObj[item.props]"
								size="mini"
								type="datetimerange"
								:default-time="[, '23:59:59']"
								format="yyyy-MM-dd HH:mm:ss"
								value-format="timestamp"
								:placeholder="`Please Enter ${item.label}`"
								style="width:100%"
							></elDatePicker>
						</div>
						<!-- 时间选择器 -->
						<div v-else-if="item.type === 'timePicker'">
							<el-time-picker
								v-model="formObj[item.props]"
								value-format="HH:mm:ss"
								placeholder="Please enter the time">
							</el-time-picker>
						</div>
						<!-- 手机输入框 -->
						<div v-else-if="item.type === 'phone'">
							<elInput v-model="formObj[item.props]" autocomplete="off">
								<elSelect
									placeholder="Please enter phone"
									style="width:100px"
									v-model="formObj[item.prefix]"
									slot="prepend"
									filterable
								>
									<elOption label="+86" value="86"></elOption>
									<elOption label="+852" value="852"></elOption>
								</elSelect>
							</elInput>
						</div>
						<!-- 多选输入框 -->
						<div v-else-if="item.type === 'mutiple-select-input'">
							<elInput v-model.trim="formObj[item.propsObj.key]">
								<elSelect
									v-model="item.propsObj.key"
									slot="prepend"
									@change="changeSelectLabel($event, item.propsObj)"
									:style="{
										width: item.prependDefaultWidth
											? item.prependDefaultWidth
											: prependDefaultWidth
									}"
								>
									<elOption
										v-for="(optionItem, optionIndex) in item.selectLabel"
										:key="`${optionItem.value}__${optionIndex}`"
										:label="optionItem.label"
										:value="optionItem.value"
									/>
								</elSelect>
							</elInput>
						</div>
						<!-- 多选日期输入框 -->
            <div v-else-if="item.type === 'mutiple-select-datemerange' || item.type === 'mutiple-select-daterange'" class="el-form_mutiple-select-datemerange_item">
              <div class="el-form-item__label__left">
                <elSelect
                  v-model="item.propsObj.key"
                  @change="changeSelectLabel($event, item.propsObj, item.propsObj[item.propsObj.key] && !!item.propsObj[item.propsObj.key].length)"
                  :style="{
                    width: item.prependDefaultWidth
                      ? item.prependDefaultWidth
                      : '120px'
                  }"
                >
                  <elOption
                    v-for="(optionItem, optionIndex) in item.selectLabel"
                    :key="`${optionItem.value}__${optionIndex}`"
                    :label="optionItem.label"
                    :value="optionItem.value"
                  />
                </elSelect>
              </div>

              <div class="el-form-item__label__right tc-month-range-picker">
                <template v-if="item.propsObj[item.propsObj.key] && item.propsObj[item.propsObj.key].length">
                  <elDatePicker
                    v-model="formObj[item.propsObj[item.propsObj.key][0]]"
                    size="mini"
                    type="datetime"
					format="yyyy-MM-dd HH:mm:ss"
					value-format="timestamp"
                    placeholder="Please Enter Start Time"
                    style="width:46%"
                  ></elDatePicker>
                  -
                  <elDatePicker
                    v-model="formObj[item.propsObj[item.propsObj.key][1]]"
                    size="mini"
                    type="datetime"
					format="yyyy-MM-dd HH:mm:ss"
					value-format="timestamp"
					@change="handleDate(item.propsObj[item.propsObj.key][1], formObj[item.propsObj[item.propsObj.key][0]], $event)"
                    placeholder="Please Enter End Time"
                    style="width:46%"
                  ></elDatePicker>
                </template>
                <template v-else>
                  <elDatePicker
                    v-model="formObj[item.propsObj.key]"
                    size="mini"
                    :type="item.type === 'mutiple-select-datemerange' ? 'datetimerange' : 'daterange'"
                    :default-time="[, '23:59:59']"
                    :format="item.type === 'mutiple-select-datemerange' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'"
                    :value-format="item.type === 'mutiple-select-datemerange' ? 'timestamp' : 'yyyy-MM-dd'"
                    :placeholder="`Please Enter ${item.label}`"
                    style="width:100%"
                  ></elDatePicker>
                </template>
              </div>
            </div>
					</elFormItem>
					</slot>
				</elCol>
				<slot name="form-item-slot" :formObj="formObj"></slot>
			</elRow>
			<elRow>
				<elCol>
					<elFormItem class="form-wrap-option">
						<elButton
							:loading="tableData.loading || tableData.extraSearchLoading"
							size="mini"
							@click="resetForm('form')"
						>
							Reset
						</elButton>
						<elButton
							:loading="tableData.loading || tableData.extraSearchLoading"
							size="mini"
							type="primary"
							@click="submitForm"
						>
							Query
						</elButton>
						<div
							v-show="form.length > 3"
							class="form-wrap-flag"
							@click="isOpen = !isOpen"
						>
							{{ isOpen ? 'Hide' : 'Show' }}
							<i class="el-icon-arrow-down" />
						</div>
					</elFormItem>
				</elCol>
			</elRow>
		</elForm>
	</div>
</template>

<script>
// import _ from 'loadsh'

// import searchFormMixin from './searchFormMixin'
// import { getOptionsList, getOptionsListGet } from '@/apiList'
// import { getCurrentPageFormLabel } from '@/utils/setTableConfig'

import { getType } from '@/utils/commonFn'

const $loadsh = _

let _this = null

export default {
	name: 'searchForm',

	mixins: [searchFormMixin],

	model: {
		prop: 'formObj',
		event: 'input'
	},

	data() {
		let info = {
			path: this.getCurrentPage()
		}
		if (this.tabsValue) {
			info.tabsValue = this.tabsValue
		}
		return {
			formLoading: false,
			form: this.$store.getters['setLang/getCurrentPageFormLabel'](info) || [],
			prependDefaultWidth: '100px', // 下拉框slot='prepend'插槽默认宽度
			isOpen: false, // 是否折叠form框
			pickerBeginDateBefore: {
				disabledDate(time) {
					return time.getTime() > Date.now()
				}
			}
		}
	},

	props: {
		tableData: {
			type: Object,
			default: () => {}
		}, // 表格数据包括分页数据  不传分页属性表示不展示分页器
		rules: {
			type: Object,
			default: () => { return {} }
		}, // 表单规则
		formObj: {} // 表单对象
	},

	created() {
		this.init()
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

		init() {
			// 查询搜索的方法
			this.formLoading = true
			if (Object.keys(this.tableConfig).length) {
				this.form = getCurrentPageFormLabel(this.tableConfig)
			}
			const form = this.form.map(async item => {
				if (item.props && this.formObj[item.props] === undefined) {
					// 修改默认获取
					this.$set(
						this.formObj,
						item.props,
						getType(item.defaultValue, 'undefined') ? '' : item.defaultValue
					)
					for (let i in this.defaultValObj) {
						this.$set(this.formObj, i, this.defaultValObj[i])
					}
				}
				if (item.startProps) {
					this.$set(
						this.formObj,
						item.startProps,
						getType(item.defaultValue, 'undefined')
							? ''
							: item.defaultValue
							? this.defaultValObj[item.defaultValue]
								? this.defaultValObj[item.defaultValue]
								: item.defaultValue
							: item.defaultValue
					)
					for (let i in this.defaultValObj) {
						this.$set(this.formObj, i, this.defaultValObj[i])
					}
				}

				if (item.endProps) {
					this.$set(
						this.formObj,
						item.endProps,
						getType(item.defaultValue, 'undefined')
							? ''
							: item.defaultValue
							? this.defaultValObj[item.defaultValue]
								? this.defaultValObj[item.defaultValue]
								: item.defaultValue
							: item.defaultValue
					)
				}

				// 设置默认的手机号
				if (item.prefix) {
					this.$set(
						this.formObj,
						item.prefix,
						'86'
					)
				}

				if (item.defaultDate) {
					// 设置初使默认时间当日一天
					const todayYear = new Date().getFullYear()
					const todayMonth = new Date().getMonth()
					const todayDay = new Date().getDate()
					let todayLastTime = new Date(
						todayYear,
						todayMonth,
						todayDay,
						'23',
						'59',
						'59'
					).getTime()
					let day = 1
					if (item.defaultTime) {
						day = item.defaultTime
					}
					let todayFirstTime = todayLastTime - (24 * 60 * 60 * 1000 * day) + 1000
					if (item.startProps || item.endProps) {
						this.formObj[item.startProps] = todayFirstTime
						this.formObj[item.endProps] = todayLastTime
					} else {
						this.formObj[item.props] = [todayFirstTime, todayLastTime]
					}
				}

				if (item.url && item.type === 'select') {
					const { requestData } = item
					let data = {}
					for (let i in requestData) {
						if (getType(requestData[i], 'function')) {
							data[i] = requestData[i].call(this)
						} else {
							data[i] = requestData[i]
						}
					}
					item.optionsData = await this.handleOptionsList(
						{
							method: item.method || 'get',
							url: item.url,
							data: data
						},
						item.props,
						null,
						item.optionsDataLabel,
						item.optionsData,
						item.filterFun
					)
				} else if (item.getResourceParams) {
					const list = await this.$store.dispatch(
						'getResource/set_value_item',
						item.getResourceParams
					)
					list.forEach(i => {
						item.optionsData.push({
							value: i.value,
							label: i.label
						})
					})
				}
				return { ...item }
			})

			Promise.all(form).then(res => {
				this.form = res
				this.$emit('changeFormFilter', this.form)
			}).finally(() => {
				this.formLoading = false
			})
		},

		// 对搜索下拉框数据需要请求返回做公共请求处理
		handleOptionsList({ method, url, data }, props, pageIndex, type, optionsData, filterFun) {
			let requestMethod = getOptionsList // 请求方法
			let postData = {method, url, data} // 请求传递参数

			if (method === 'get') {
				requestMethod = getOptionsListGet
				postData = {method, url, params: data}
			}

			return requestMethod(postData)
				.then(res => {
					let list = []
					if (method === 'get') {
						optionsData && optionsData.length && list.push(...optionsData)
					} else {
						list.push({
							label: 'All',
							value: ''
						})
					}
					res.data = res.data || []
					if (!type) {
						res.data.forEach(item => {
							list.push({
								label: item.label,
								value: item.value
							})
						})
					}
					if (type === 'code-value') {
						res.data.forEach(item => {
							list.push({
								label: item.label + ' -- ' + item.value,
								value: item.value
							})
						})
					}
					if (filterFun) {
						list = filterFun(list)
					}
					return list
				})
				.catch(err => {
					console.log(err)
					return []
				})
		},

		// 提交查询
		submitForm() {
			this.$refs.form.validate((valid) => {
        if (valid) {
					this.$parent.emitFn(null, 1)
				}
			})
		},

		// 设置最小时间
		handleDate(endName, startVal, val) {
			if (!val) {
				return
			}
			if (val < startVal) {
				this.formObj[endName] = startVal
			}
		},

		// 重置搜索项
		resetForm() {
			// 不需要清除的key
			const noClear = [
				'timeKey',
				'prefix'
			]
			// 默认值不清除
			for (let key in this.defaultValObj) {
				noClear.push(key)
			}
			for (let key in this.formObj) {
				if (!noClear.includes(key)) {
					this.formObj[key] = ''
				}
     }
		this.$emit('resetExtraData')
		},

		// 多选框值改变 获取集联内容
		unionNext(item) {
			if (item.union) {
				let { unionValue, unionRequestData, unionUrl, unionMethod } = item
				let flag = true
				let index = 0
				for (let j = 0; j < this.form.length; j++) {
					if (this.form[j].props === item.union) {
						index = j
					} else {
						continue
					}
				}
				const params = {}
				for (let i in unionRequestData) {
					if (getType(unionRequestData[i], 'function')) {
						params[i] = unionRequestData[i].call(this)
					} else {
						params[i] = unionRequestData[i]
					}
					if (!params[i]) {
						flag = false
					}
				}
				if (getType(unionValue, 'function')) {
					const temp = unionValue.call(this)
					if (!temp.length) {
						this.$set(this.form[index], 'optionsData', [])
						this.formObj[item.union] = ''
						return
					}
					unionUrl = unionUrl + '/' + temp
				}
				if (flag) {
					if (unionMethod === 'get') {
						getOptionsListGet({ method: unionMethod, url: unionUrl, params }).then((res) => {
							res.data.forEach(s => {
								this.form[index].optionsData.push({
									value: s.value,
									label: s.label
								})
							})
						}).catch(err => {
							console.log(err)
						})
						return
					}
					getOptionsList({ method: unionMethod, url: unionUrl, data: params })
						.then(res => {
							this.$set(this.form[index], 'optionsData', [
								{
									label: 'All',
									value: ''
								}
							])
							res.data.forEach(s => {
								this.form[index].optionsData.push({
									value: s.value,
									label: s.label
								})
							})
						})
						.catch(err => {
							console.log(err)
						})
				}
			}
		},

		// 模糊搜索输入框
		querySearchAsync: $loadsh.debounce(async (item, queryString, cb) => {
			const { url, data, method } = item
			const params = {}
			let arr = []
			for (let i in data) {
				if (getType(data[i], 'function')) {
					params[i] = data[i].call(_this)
				} else {
					params[i] = data[i]
				}
			}
			try {
				let res = await getOptionsListGet({ url, params, method })
				if (res.data && res.data.length > 0) {
					res.data.forEach(item => {
						arr.push({
							value: item.value,
							label: item.label
						})
					})
				}
			} catch (err) {
				console.log(err)
			}
			cb(arr)
		}, 1000),

		// 多选框聚焦查询
		focusRequest(item) {
			if (item.focusUrl) {
				const { focusRequestData, focusUrl, focusMethod } = item
				let index = 0
				for (let j = 0; j < this.form.length; j++) {
					if (this.form[j].props === item.union) {
						index = j
					}
				}
				const params = {}
				for (let i in focusRequestData) {
					if (getType(focusRequestData[i], 'function')) {
						params[i] = focusRequestData[i].call(this)
					} else {
						params[i] = focusRequestData[i]
					}
				}
				getOptionsListGet({ method: focusMethod, url: focusUrl, params })
					.then(res => {
						this.$set(this.form[index], 'optionsData', [
							{
								label: 'All',
								value: ''
							}
						])
						res.data.forEach(s => {
							this.form[index].optionsData.push({
								value: s.value,
								label: s.label
							})
						})
					})
			}
		},

		/**
     * @desc mutiple-select-input类型下拉框，选择项改变时触发该方法
     * @param {String} val 下拉框当前切换对应的值
     * @param {Object} labelObj formTable组件mutiple-select-input类型配置的字段
     * @param {Boolean} isMultiple 日期塞选字段是否被拆成两个字段
     */
    changeSelectLabel(val, labelObj, isMultiple = false) {
      let cacheValue = []

      for (let i in labelObj) {
				if (i === 'key') continue

				// 获取切换前输入框的值
				if (!isMultiple) {
					if (this.formObj[i]) {
						cacheValue[0] = global.$loadsh.cloneDeep(this.formObj[i])
						this.formObj[i] = ''
					}
				} else {
					labelObj[i].forEach((item, index) => {
						if (!this.formObj[item]) return

						cacheValue[index] = this.formObj[item]
						this.formObj[item] = ''
					})
				}
			}

			// 切换label时，将值赋给切换后的字段
			if (!isMultiple) {
				this.$set(this.formObj, val, cacheValue[0] || '')
			} else {
				labelObj[val].forEach((item, index) => {
					this.$set(this.formObj, item, cacheValue[index] || '')
				})
			}
    },

		// 远程搜索
		remoteMethod(query, item) {
			if (item.remoteUrl) {
				const { remoteRequestData, remoteUrl, remoteMethod } = item
				let index = 0
				for (let j = 0; j < this.form.length; j++) {
					if (this.form[j].props === item.remote) {
						index = j
					} else {
						continue
					}
				}
				const params = {}
				params[remoteRequestData] = query

				getOptionsListGet({ method: remoteMethod, url: remoteUrl, params })
					.then(res => {
						this.$nextTick(() => {
							this.$set(this.form[index], 'optionsData', [
								{
									label: 'All',
									value: ''
								}
							])
							res.data.forEach(s => {
								this.form[index].optionsData.push({
									value: s.value,
									label: s.label
								})
							})
						})
					})
					.catch(err => {
						console.log(err)
					})
			}
		}
	}
}
</script>

<style lang="less" scoped>
.hidden-inp {
  position: absolute;
  top: -3000px;
}
/deep/.el-form_mutiple-select-datemerange_item {
  display: flex;
  justify-content: space-between;
  height: 28px;

  .el-form-item__label__left {
    margin-right: 12px;
  }

  .el-form-item__label__right {
    width: 100%;
  }
}
.el-form-item {
	height: 28px;
}
/deep/.el-form--inline {
	.el-form-item {
		margin-right: 0;
		display: flex;
	}
}
.form-wrap {
	transition: all 0.3s;
	background: #fff;
	border-radius: 4px;
	padding: 24px 24px 0;
	.tc-month-range-picker {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.form-item {
		display: flex;
		.form-label {
			width: 40%;
		}
	}
	.form-wrap-option {
		text-align: end;
		/deep/.el-form-item__content {
			display: flex;
			justify-content: flex-end;
			.form-wrap-flag {
				display: flex;
				cursor: pointer;
				margin-left: 10px;
				align-items: center;
				color: #1890ff;
				i {
					transition: all 0.3s;
					margin-left: 5px;
				}
			}
		}
	}
}
.form-wrap-hide {
	// height: 125px;
	overflow: hidden;
	.form-wrap-option {
		.form-wrap-flag {
			i {
				transform: rotate(0deg);
			}
		}
	}
}
.form-wrap-show {
	height: auto;
	overflow: visible;
	.form-wrap-option {
		.form-wrap-flag {
			i {
				transform: rotate(180deg);
			}
		}
	}
}
</style>
