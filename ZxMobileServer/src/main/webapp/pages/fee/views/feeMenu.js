define(function(require, exports, module){
	
	var feeMenuTpl = require("text!../template/feeMenu.html");
	
	var feeMenuView = module.exports = ItemView.extend({
		
		events : {
			"click #tuition":"tuition",
			"click #cawa":"cawa",
			"click #payment":"payment",
			"click #other":"other",
			"click #car":"car"
		},
		
		template : feeMenuTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			Client.hideWaitPanel(1);
		},
		
		tuition:function(){
			App.storage.remove("model1");
			App.storage.remove("model2");
			App.navigate("fee/feeCtl/tuition");
		},
		
		cawa:function(){
			App.storage.remove("model1");
			App.storage.remove("model2");
			App.navigate("fee/feeCtl/tuition?type=cawa");
		},
		
		payment:function(){
			App.navigate("fee/feeCtl/utilityBill");
		},
		
		other:function(){
			App.navigate("fee/feeCtl/otherBill");
		},
		
		car:function(){
			App.navigate("fee/feeCtl/carBidding");
		},
		
		goBack : function(){
			App.navigate("index/index/index");
		}
	
	});
});
