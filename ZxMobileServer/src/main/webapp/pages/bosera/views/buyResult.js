define(function(require, exports, module){
	
	var buyResultTpl = require("text!../template/buyResult.html");
	
	var buyResultView = module.exports = ItemView.extend({
		
		events : {
			"click #rebuy" : "goBack",
			"click #view" : "view"
		},
		
		template : buyResultTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			var param = App.storage.get("_parameters");
		    $("#amt").text(param.purchaseAmt);
		    $("#cardNo").text(Utils.formatAcc(param.cardNo)+'(电子账户)');
		    Client.hideWaitPanel(1);
		},
		
		goBack : function(){
			App.back();
		},
		
		view : function(){
			if(App.browseList[2].indexOf("holdingAsset")>=0){
				App.back(3);
				return;
        	}
        	if(App.browseList[2] == "bosera/boseraCtl/boseFund"){
        		App.browseList[2] = "bosera/boseraCtl/boseFundLogon";
        	}
    		App.back(2);
		}
	
	});
});
