define(function(require, exports, module) {
	
	var projectTpl = require("text!../template/project.html");

	var projectView = module.exports = ItemView.extend({

		template : projectTpl,

		events : {
			
		},
		
		// 初始化
		initialize : function() {
			var pageStep1 = {
	        		title:'产品信息',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
					rightButton:{
						name : '',
					}
	        	};
	        	Client.initPageTitle(pageStep1);
	        	Client.hideWaitPanel(1);
	        	var financeDetail=App.storage.get("model").financeDetail;
	        	$("#financeDetail").html(financeDetail);
		},
		
		goBack : function(){
    		App.back();
    		Client.hideWaitPanel(1);
    	}, 
	});
});