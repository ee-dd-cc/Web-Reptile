const lvList = [
	// {
	// 	url: 'https://cloud.tencent.com/developer/devdocs',
	// 	nodePath: `.doc-layout .c-tree-level1 > li`,
	// 	jsonName: 'lv1',
	// 	hasChildren: false,
	// 	htmlPath: './rjhy/html5-community/developer/doc/',
	// },
	// { // CSS
	// 	url: 'https://cloud.tencent.com/developer/doc/1052',
	// 	nodePath: `.doc-layout .c-tree-level2 > li`,
	// 	jsonName: 'lv2',
	// 	htmlPath: './rjhy/html5-community/developer/chapter/',
	// 	hasChildren: true,
	// 	childrenParems: {
	// 		url: '',
	// 		nodePath: `.doc-layout .c-tree-level3 > li`,
	// 		jsonName: 'lv3',
	// 		htmlPath: './rjhy/html5-community/developer/section/',
	// 		hasChildren: false,
	// 	}
	// },
	// { // HTML
	// 	url: 'https://cloud.tencent.com/developer/doc/1116',
	// 	nodePath: `.doc-layout .c-tree-level2 > li`,
	// 	jsonName: 'lv2',
	// 	htmlPath: './rjhy/html5-community/developer/chapter/',
	// 	hasChildren: true,
	// 	childrenParems: {
	// 		url: '',
	// 		nodePath: `.doc-layout .c-tree-level3 > li`,
	// 		jsonName: 'lv3',
	// 		htmlPath: './rjhy/html5-community/developer/section/',
	// 		hasChildren: false,
	// 	}
	// },
	{ // JS
		url: 'https://cloud.tencent.com/developer/doc/1121',
		nodePath: `.doc-layout .c-tree-level2 > li`,
		jsonName: 'lv2',
		htmlPath: './rjhy/html5-community/developer/chapter/',
		hasChildren: true,
		childrenParems: {
			url: '',
			nodePath: `.doc-layout .c-tree-level3 > li`,
			jsonName: 'lv3',
			htmlPath: './rjhy/html5-community/developer/section/',
			hasChildren: false,
		}
	},

]

module.exports = {
	lvList
}