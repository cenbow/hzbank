define(function(require, exports, module) {
	
	var productAgree3Tpl = require("text!../template/productAgree3.html");

	var productAgree3View = module.exports = ItemView.extend({

		template : productAgree3Tpl,

		events : {
			
		},
		
		// 初始化
		initialize : function() {
			var pageStep1 = {
	        		title:'金融资产收益权投资风险揭示书',
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