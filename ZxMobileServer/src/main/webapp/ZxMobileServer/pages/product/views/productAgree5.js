define(function(require, exports, module) {
	
	var productAgree5Tpl = require("text!../template/productAgree5.html");

	var productAgree5View = module.exports = ItemView.extend({

		template : productAgree5Tpl,

		events : {
			
		},
		
		// 初始化
		initialize : function() {
			var pageStep1 = {
	        		title:'收益权转让协议',
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
		},
		
		goBack : function(){
    		App.back();
    		Client.hideWaitPanel(1);
    	}, 
	});
});