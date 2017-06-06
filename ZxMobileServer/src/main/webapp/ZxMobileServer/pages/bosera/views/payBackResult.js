define(function(require, exports, module){
	
	var fundPayBackResultTpl = require("text!../template/payBackResult.html");
	
	var fundPayBackResultView = module.exports = ItemView.extend({
		
		events : {
			"click #back" : "goBack"
		},
		
		template : fundPayBackResultTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			var param = App.storage.get("_parameters");
		    $("#amt").text(param.purchaseAmt);
		    $("#cardNo").text(Utils.formatAcc(param.cardNo)+'(电子账户)');
		    Client.hideWaitPanel(1);
		},
		
		goBack : function(){
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
