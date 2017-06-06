define(function(require, exports, module) {
	
	var productAgree4Tpl = require("text!../template/productAgree4.html");

	var productAgree4View = module.exports = ItemView.extend({

		template : productAgree4Tpl,

		events : {
			
		},
		
		// 初始化
		initialize : function() {
			var pageStep1 = {
	        		title:'个人会员服务协议',
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