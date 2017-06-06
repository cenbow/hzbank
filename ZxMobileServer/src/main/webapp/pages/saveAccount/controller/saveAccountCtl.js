define(function (require, exports, module) {
	//定义视图
	var saveAccountView = require("../views/mySaveAccount");
	var saveDetailView = require("../views/saveDetail");
	require("echarts"); 
	//视图操作
	var SaveAccountController = module.exports = Controller.extend({
		actions:{
				"mySaveAccount" : "mySaveAccount",
				"saveDetail" : "saveDetail"
			},
		
		mySaveAccount : function(){
//			alert("weqw");
//			var pageStep1 = {
//	        		title:'存管账户',
//	        		leftButton:{
//	        			name : '返回',
//	        			func: 'curView.goBack()'
//	        		},
//	        		
//	        		rightButton:{
//	        			name : '',
//	        			func: ''
//	        		}
//	        		
//	        	};
//	        Client.initPageTitle(pageStep1);
//			Client.menuOpt("0");
			App.container.show(new saveAccountView({model:new Model()}));
		},
		
		saveDetail : function(){
//			var pageStep1 = {
//	        		title:'交易明细',
//	        		leftButton:{
//	        			name : '返回',
//	        			func: 'curView.goBack()'
//	        		},
//	        		
//	        		rightButton:{
//	        			name : '',
//	        			func: ''
//	        		}
//	        		
//	        	};
//	        Client.initPageTitle(pageStep1);
//			Client.menuOpt("0");
			App.container.show(new saveDetailView());
		},
	});
	
});