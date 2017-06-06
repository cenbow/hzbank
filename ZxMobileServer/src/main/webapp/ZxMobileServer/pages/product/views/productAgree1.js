define(function(require, exports, module) {
	
	var productAgree1Tpl = require("text!../template/productAgree1.html");

	var productAgree1View = module.exports = ItemView.extend({

		template : productAgree1Tpl,

		events : {
			
		},
		
		// 初始化
		initialize : function() {
			var pageStep1 = {
	        		title:'产品说明书',
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
	        	
	        	var param = App.storage.get("_parameters");
	        	if(param){
	        		$("#projectName").text(param.projectName || "暂无");
	        		$("#financePeriod").text(param.financePeriod || "暂无");
	        		$("#minbuyamt").text(param.minbuyamt || "暂无");
	        		$("#toaddamt").text(param.toaddamt || "暂无");
	        		$("#raisebegindate").text(param.raisebegindate?Utils.formatDate(param.raisebegindate,'yyyyMMdd','【yyyy】年【MM】月【dd】日'):"暂无");
	        		$("#raiseenddate").text(param.raiseenddate?Utils.formatDate(param.raiseenddate,'yyyyMMdd','【yyyy】年【MM】月【dd】日'):"暂无");
	        		$("#financeTotalAmt").text(param.financeTotalAmt || "暂无");
	        		$("#interestBeginDate").text(param.interestBeginDate?Utils.formatDate(param.interestBeginDate,'yyyyMMdd','【yyyy】年【MM】月【dd】日'):"暂无");
	        		$("#interestEndDate").text(param.interestEndDate?Utils.formatDate(param.interestEndDate,'yyyyMMdd','【yyyy】年【MM】月【dd】日'):"暂无");
	        		$("#projectNumber").text(param.projectNumber || "暂无");
	        		/*$("#targetCustomer").text(param.targetCustomer || "暂无");*/
	        		$("#investment").text(param.investment || "暂无");
	        		$("#honourDate").text(param.honourDate?Utils.formatDate(param.honourDate,'yyyyMMdd','【yyyy】年【MM】月【dd】日'):"暂无");
	        		$("#financePreInterestRate").text(param.financePreInterestRate || "暂无");
	        	}
		},
		
		goBack : function(){
    		App.back();
    		Client.hideWaitPanel(1);
    	}, 
	});
});