define(function (require, exports, module) {
	//定义视图
	var FinanceBalanceView = require("../views/financeBalance");
	var FinanceBalanceInView = require("../views/financeBalanceIn");
	var FinanceBalanceSignView = require("../views/financeBalanceSign");
	var FinanceBalanceLoadView = require("../views/financeBalanceLoad");
	var FinanceBalanceOutView = require("../views/financeBalanceOut");
	var FinanceBalanceUnSignView = require("../views/financeBalanceUnSign");
	var FinanceBalancePromptView = require("../views/financeBalancePrompt");
	var FinanceBalancePrompt2View = require("../views/financeBalancePrompt2");
	var FinanceBalanceInComeView = require("../views/financeBalanceInCome");
	//视图操作
	var FinanceController = module.exports = Controller.extend({
		actions:{
				"financeBalance" : "financeBalance",
				"financeBalanceIn" : "financeBalanceIn",
				"financeBalanceSign" : "financeBalanceSign",
				"financeBalanceLoad" : "financeBalanceLoad",
				"financeBalanceOut" : "financeBalanceOut",
				"financeBalanceUnSign" : "financeBalanceUnSign",
				"financeBalancePrompt" : "financeBalancePrompt",
				"financeBalancePrompt2" : "financeBalancePrompt2",
				"financeBalanceInCome" : "financeBalanceInCome"
			},
		
		financeBalance : function(){
			Client.menuOpt("0");
			var financeNo = Utils.trim(App.storage.get("_parameters").financeNo);
			var financeName="";
			var financeClass="";
			var paramFinanceBalance={};
			var paramFinanceSevenRate={};
			if(financeNo == Utils.getParamDisplay("PB_FINANCE_BALANCE","1")){
				financeName = Utils.getParamDisplay("PB_FINANCE_BALANCE","2");
				financeClass = "yfd";
				paramFinanceBalance = App.storage.get("paramFinanceBalance");
				paramFinanceSevenRate = App.storage.get("paramFinanceSevenRate");
			}else if(financeNo == Utils.getParamDisplay("PB_FINANCE_BALANCE","3")){
				financeName = Utils.getParamDisplay("PB_FINANCE_BALANCE","4");
				financeClass = "th";
				paramFinanceBalance = App.storage.get("paramFinanceBalance2");
				paramFinanceSevenRate = App.storage.get("paramFinanceSevenRate2");
			}
    		var model ={
				financeNo:financeNo,
    			financeName:financeName,
    			financeClass:financeClass,
    			paramFinanceBalance:paramFinanceBalance,
    			paramFinanceSevenRate:paramFinanceSevenRate
    		};
			App.container.show(new FinanceBalanceView({model:new Model(model)}));
		},
		
		financeBalanceIn : function(){
			var model={
				financeNo : Utils.trim(App.storage.get("_parameters").financeNo),
				financeName : Utils.trim(App.storage.get("_parameters").financeName),
	    		cardNo : Utils.trim(Utils.getCardNoByFlag("0","cardFlag1")),
	    		accountType : Utils.trim(Utils.getCardTypeByFlag("0","cardFlag1")),
	    		custName : Utils.trim(App.storage.get("UserInfo").customerNameCN)
			};
			App.container.show(new FinanceBalanceInView({model:new Model(model)}));
		},
		
		financeBalanceSign : function(){
			var model = {
				financeName :  Utils.trim(App.storage.get("_parameters").financeName),
				financeNo :  Utils.trim(App.storage.get("_parameters").financeNo),
				mgrNo : App.storage.get("UserInfo").mgrNo,
				mgrNoClass : (App.storage.get("UserInfo").mgrNo && App.storage.get("UserInfo").mgrNo.length == 8)?"hidden":""
			};
			App.container.show(new FinanceBalanceSignView({model:new Model(model)}));
		},
		
		financeBalanceLoad : function(){
			Client.menuOpt("2");
			var financeNo = Utils.trim(App.storage.get("_parameters").financeNo);
			var financeName="";
			var financeClass="";
			if(financeNo == Utils.getParamDisplay("PB_FINANCE_BALANCE","1")){
				financeName = Utils.getParamDisplay("PB_FINANCE_BALANCE","2");
				financeClass = "yfd";
			}else if(financeNo == Utils.getParamDisplay("PB_FINANCE_BALANCE","3")){
				financeName = Utils.getParamDisplay("PB_FINANCE_BALANCE","4");
				financeClass = "th";
			}
    		var model ={
				financeNo:financeNo,
    			financeName:financeName,
    			financeClass:financeClass
    		};
			App.container.show(new FinanceBalanceLoadView({model:new Model(model)}));
		},
		
		financeBalanceOut : function(){
			
        	var financeNo = Utils.trim(App.storage.get("_parameters").financeNo);
			var financeName = Utils.trim(App.storage.get("_parameters").financeName);
        	var cardNo = Utils.trim(Utils.getCardNoByFlag("0","cardFlag1"));
        	var accountType = Utils.trim(Utils.getCardTypeByFlag("0","cardFlag1"));
    		var financeTotalVol=App.storage.get("_parameters").financeTotalVol;
    		var custName = Utils.trim(App.storage.get("UserInfo").customerNameCN);
    		
    		var model ={
    			financeNo:financeNo,
    			financeName:financeName,
    			cardNo:cardNo,
    			accountType:accountType,
    			financeTotalVol:financeTotalVol,
    			custName:custName
    		};
    		
			App.container.show(new FinanceBalanceOutView({model:new Model(model)}));
		},
		
		financeBalanceUnSign : function(){
        	var financeNo = Utils.trim(App.storage.get("_parameters").financeNo);
			var financeName="";
			if(financeNo == Utils.getParamDisplay("PB_FINANCE_BALANCE","1")){
				financeName = Utils.getParamDisplay("PB_FINANCE_BALANCE","2");
			}else if(financeNo == Utils.getParamDisplay("PB_FINANCE_BALANCE","3")){
				financeName = Utils.getParamDisplay("PB_FINANCE_BALANCE","4");
			}
			var model = {
				financeName : financeName,
				financeNo : financeNo
			};
			App.container.show(new FinanceBalanceUnSignView({model:new Model(model)}));
		},
		
		financeBalancePrompt : function(){
			App.container.show(new FinanceBalancePromptView({model:new Model()}));
		},
		financeBalancePrompt2 : function(){
			var model = {
					financeNo : Utils.trim(App.storage.get("_parameters").financeNo)
				};
			App.container.show(new FinanceBalancePrompt2View({model:new Model(model)}));
		},
		
		financeBalanceInCome : function(){
			var financeNo = Utils.trim(App.storage.get("_parameters").financeNo);
			var financeName="";
			if(financeNo == Utils.getParamDisplay("PB_FINANCE_BALANCE","1")){
				financeName = Utils.getParamDisplay("PB_FINANCE_BALANCE","2");
			}else if(financeNo == Utils.getParamDisplay("PB_FINANCE_BALANCE","3")){
				financeName = Utils.getParamDisplay("PB_FINANCE_BALANCE","4");
			}
			var model = {
					financeName : financeName,
					financeNo : financeNo
				};
			App.container.show(new FinanceBalanceInComeView({model:new Model(model)}));
		},
		
	});
	
});