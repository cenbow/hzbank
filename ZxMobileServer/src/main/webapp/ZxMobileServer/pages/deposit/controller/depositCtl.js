define(function (require, exports, module) {
	//定义视图
	var DepositView = require("../views/deposit");
	var DepositInView = require("../views/depositIn");
	var DepositLoadView = require("../views/depositLoad"); 
	var DepositOutDetailView = require("../views/depositOutDetail");
	var DepositOutView = require("../views/depositOut");
	var DepositProfitView = require("../views/depositProfit");
	var DepositProfitDetailView = require("../views/depositProfitDetail");
	//视图操作
	var DepositController = module.exports = Controller.extend({
		actions:{
				"deposit" : "deposit",
				"depositIn" : "depositIn",
				"depositLoad" : "depositLoad",
				"depositOutDetail":"depositOutDetail",
				"depositOut":"depositOut",
				"depositProfit":"depositProfit",
				"depositProfitDetail":"depositProfitDetail"
			},
		
		deposit : function(){
			Client.menuOpt("0");
			if(Utils.checkSession()){
	   			if(Utils.checkRealUser()){
					if(!Utils.checkActivate()){
						App.back();
						return;
					}
					App.navigate("deposit/depositCtl/depositIn");  //跳转幸福乐存购买页面
					return false;
			   		
				}
			}else{				
				App.container.show(new DepositView({model:new Model()}));
			}
		},
			
		depositIn : function(){
			App.container.show(new DepositInView({model:new Model()}));
		},
		
		depositLoad : function(){
			App.container.show(new DepositLoadView({model:new Model()}));
		},
		
		depositOutDetail : function(){
			App.container.show(new DepositOutDetailView({model:new Model()}));
		},
		
		depositOut : function(){
			var search = App.storage.get("_parameters");
			var model = {
				pbNoticLmt : Utils.getParamDisplay("PB_DEPOSIT_LMT","1"),
	        	cardNo : search.cardNo,
	        	accountNo : search.accountNo,
	        	interestBeginDate : search.interestBeginDate,
	        	balance : search.balance,
	        	accountType : search.accountType
			};
        	
			App.container.show(new DepositOutView({model:new Model(model)}));
		},
		
		depositProfit : function(){
			App.container.show(new DepositProfitView({model:new Model()}));
		},
		
		depositProfitDetail:function(){
			
        	//初始化页面
			var search = App.storage.get("_parameters");
			var model = {
					cardNo:search.cardNo,
		    		accountNo:search.accountNo,
		    		interestEndDate:search.interestEndDate,
		    		interestBeginDate:search.interestBeginDate,
		    		balance:search.balance,
		    		accountType:search.accountType,
		    		interestRate:"0",
					fundIncome:"0",
					currentDate:Utils.formatDate(App.storage.get("UserInfo").sysDate,'yyyyMMddhhmmss','yyyy-MM-dd')
			};
			App.container.show(new DepositProfitDetailView({model:new Model(model)}));
		}
		
	});
	
});