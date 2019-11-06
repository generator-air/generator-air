const questions = [
	{
		type: 'list',
		name: 'type',
		message: '请选择期望创建的项目类型',
		choices: [{
			name: 'pc管理端',
			value: 'pc'
		}, {
			name: 'h5移动端',
			value: 'h5'

		}, {
			name: '小程序',
			value: 'miniprogram'
		}]
	},
	{
		type: 'list',
		name: 'frameworkH5',
		message: '请选择期望使用的框架',
		choices: [{
			name: 'react',
			value: 'react'
		}, {
			name: 'vue',
			value: 'vue'
		}],
		when(answers) {
			return answers.type !== 'miniprogram';
		}
	},
	{
		type: 'list',
		name: 'frameworkMini',
		message: '请选择期望使用的框架',
		choices: [{
			name: '不使用框架',
			value: 'none'
		}, {
			name: 'taro',
			value: 'taro'
		}, {
			name: 'wepy',
			value: 'wepy'
		}],
		when(answers) {
			return answers.type === 'miniprogram';
		}
	},
	{
		type: 'confirm',
		name: 'isUseUiFramework',
		message: '是否使用ui框架？'
	},
	{
		type: 'list',
		name: 'uiFramework',
		message: '请选择期望使用的ui框架',
		choices: [{
			name: 'element-ui',
			value: 'element-ui'
		}],
		when(answers) {
			return answers.isUseUiFramework && answers.frameworkH5 === 'vue';
		}
	},
	{
		type: 'list',
		name: 'uiFramework',
		message: '请选择期望使用的ui框架',
		choices: [{
			name: 'ant-design',
			value: 'ant-design'
		}],
		when(answers) {
			return answers.isUseUiFramework && answers.frameworkH5 === 'react';
		}
	},
	{
		type: 'list',
		name: 'uiFramework',
		message: '请选择期望使用的ui框架',
		choices: [{
			name: 'taroUI',
			value: 'taroUI'
		}],
		when(answers) {
			return answers.isUseUiFramework && answers.frameworkMini === 'taro';
		}
	},
	{
		type: 'list',
		name: 'uiFramework',
		message: '请选择期望使用的ui框架',
		choices: [{
			name: 'minUI',
			value: 'minUI'
		}],
		when(answers) {
			return answers.isUseUiFramework && answers.frameworkMini === 'wepy';
		}
	},
	{
		type: 'confirm',
		name: 'isUseLog',
		message: '是否使用日志监控？'
	},
	{
		type: 'input',
		name: 'projectName',
		message: '请输入项目名称'
	},
	{
		type: 'list',
		name: 'loginType',
		message: '请选择当前项目使用的登录方式',
		choices: [{
			name: '企业微信',
			value: 'wxc'
		}, {
			name: '微信',
			value: 'wx'
		}, {
			name: 'QQ',
			value: 'qq'
		}, {
			name: '手机号+验证码',
			value: 'phone'
		}]
	}
];

module.exports = questions;
