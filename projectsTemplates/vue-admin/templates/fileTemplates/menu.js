module.exports = ({ logMenu, operationMenu }) => `const menus = [
	{
		title: '页面示例',
		icon: 'gear',
		submenu: [
			{
				title: '列表页',
				url: '/demo'
			}
		]
	},${logMenu}${operationMenu}
]

export default menus
`;
