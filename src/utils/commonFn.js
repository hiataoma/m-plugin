/*
* @desc 获取值类型
* @prop { any } val 传入的值
* @prop { string } type 校验的类型 比如 string number boolean。。。 需要类型值全称 大小写不限
* @return { any | boolean } 如果传入类型则进行比较返回比较结果 未传入则返回值对应类型
*/
export const getType = (val, type) => {
	let valType = toString.call(val).substring(8, toString.call(val).length - 1)
	if (type) {
		return valType.toLocaleLowerCase() === type.toLocaleLowerCase()
	} else {
		return valType
	}
}
// // 判断是否是IP地址
// export const isIP = (str) => {
// 	return /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.test(str)
// }

// export const sessionGet = (key) => {
// 	let value = ''
// 	if (!sessionStorage.getItem(key)) {
// 		return ''
// 	}
// 	try {
// 		value = JSON.parse(sessionStorage.getItem(key))
// 	} catch (err) {
// 		value = sessionStorage.getItem(key)
// 	}
// 	return value
// }
// export const sessionSet = (key, value) => {
// 	value = getType(value, 'string') ? value : JSON.stringify(value)
// 	sessionStorage.setItem(key, value)
// }
// export const localGet = (key) => {
// 	if (!localStorage.getItem(key)) {
// 		return ''
// 	}
// 	let value = ''
// 	try {
// 		value = JSON.parse(localStorage.getItem(key))
// 	} catch (err) {
// 		value = localStorage.getItem(key)
// 	}
// 	return value
// }
// export const localSet = (key, value) => {
// 	value = getType(value, 'string') ? value : JSON.stringify(value)
// 	localStorage.setItem(key, value)
// }
// export const clearLocal = () => {
// 	localStorage.removeItem('token')
// 	localStorage.removeItem('userInfo')
// 	localStorage.removeItem('routeList')
// }
// export const UUID = () => {
// 	var d = new Date().getTime()
// 	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
// 		var r = (d + Math.random() * 16) % 16 | 0
// 		d = Math.floor(d / 16)
// 		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
// 	})
// 	return uuid
// }
// // 日期转换工具
// export const DateUtil = (date, type = 'YYYY-MM-DD HH:mm:ss') => {
// 	date = global.$moment(date).format(type)
// 	return date
// }

// export const FindTreeData = (arr, code) => {
// 	arr.forEach((item) => {
// 		if (item.access === code) {
// 			return item
// 		} else if (item.children != null) {
// 			FindTreeData(item.children, code)
// 		}
// 	})
// }

// // 移除空字符串
// export const removePropertyOfNull = (obj) => {
// 	Object.keys(obj).forEach(item => {
// 		if (getType(obj[item], 'string')) {
// 			if (!obj[item].length) delete obj[item]
// 		}
// 	})
// 	return obj
// }
