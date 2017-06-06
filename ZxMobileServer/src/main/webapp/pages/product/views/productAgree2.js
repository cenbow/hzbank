define(function(require, exports, module) {
	
	var productAgree2Tpl = require("text!../template/productAgree2.html");

	var productAgree2View = module.exports = ItemView.extend({

		template : productAgree2Tpl,

		events : {
			
		},
		
		// 初始化
		initialize : function() {
			var pageStep1 = {
	        		title:'金融资产收益权转让协议',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
					rightButton:{
						name : '',
					}
	        	};
	        	Client.initPageTitle(pageStep1);
	        	var param = App.storage.get("_parameters");
	        	if(param){
	        		$("#financePreInterestRate").text(param.financePreInterestRate || "暂无");
	        		$("#transferSubject").text(param.transferSubject || "暂无");
	        		$("#usufructName").text(param.usufructName || "暂无");
	        		$("#interestBeginDate").text(param.interestBeginDate?Utils.formatDate(param.interestBeginDate,'yyyyMMdd','yyyy-MM-dd'):"暂无");
	        	}
	        	Client.hideWaitPanel(1);
		},
		
		goBack : function(){
    		App.back();
    		Client.hideWaitPanel(1);
    	}, 
	});
});