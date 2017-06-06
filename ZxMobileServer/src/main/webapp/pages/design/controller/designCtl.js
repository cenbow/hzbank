define(function (require, exports, module) {
	//定义视图
	var DepositHomeView = require("../views/depositHome");
	var DepositSignView = require("../views/depositSign");
	var DepositBuyView = require("../views/depositBuy");
	var DepositQueryView = require("../views/depositQuery");
	var DepositCancelQueryView = require("../views/depositCancelQuery");
	var DepositCancelView = require("../views/depositCancel");
	var DepositHistoryQueryView = require("../views/depositHistoryQuery");
	
	//视图操作
	var DepositController = module.exports = Controller.extend({
		actions:{
				"depositHome" : "depositHome",
				"depositSign" : "depositSign",
				"depositBuy" : "depositBuy",
				"depositQuery" : "depositQuery",
				"depositCancelQuery" : "depositCancelQuery",
				"depositCancel" : "depositCancel",
				"depositHistoryQuery" : "depositHistoryQuery",
			},
		
		depositHome : function(){		
				App.container.show(new DepositHomeView({model:new Model()}));
		},
		
		depositSign : function(){		
			App.container.show(new DepositSignView({model:new Model()}));
		},
	
		depositBuy : function(){
    		var model ={
				financeNo:Utils.trim(App.storage.get("_parameters").financeNo),
    			financeName:Utils.trim(App.storage.get("_parameters").financeName),
    			firstAmt:Utils.trim(App.storage.get("_parameters").firstAmt)
    		};
			App.container.show(new DepositBuyView({model:new Model(model)}));
		},
	
		depositQuery : function(){
			App.container.show(new DepositQueryView({model:new Model()}));
		},
	
		depositCancelQuery : function(){

			App.container.show(new DepositCancelQueryView({model:new Model()}));
		},
		
		depositCancel : function(){
    		var model ={
    				serialNo:Utils.trim(App.storage.get("_parameters").serialNo),
    				cardNo:Utils.trim(App.storage.get("_parameters").cardNo),
    				financeNo:Utils.trim(App.storage.get("_parameters").financeNo),
        			financeName:Utils.trim(App.storage.get("_parameters").financeName),
        			transDate:Utils.trim(App.storage.get("_parameters").transDate),
        			financeAmt:Utils.trim(App.storage.get("_parameters").financeAmt)
        		};
			App.container.show(new DepositCancelView({model:new Model(model)}));
		},
		depositHistoryQuery : function(){

			App.container.show(new DepositHistoryQueryView({model:new Model()}));
		},
	
	});
	
});