define(function(require, exports, module){
	
	var goldBuyResTpl = require("text!../template/goldBuyRes.html");
	
	var goldBuyResView = module.exports = ItemView.extend({
		
		events : {
			"click #rebuy" : "goBack",
			"click #view" : "view",
			"click #hongbao" : "toredPacketInviteIndex"
		},
		
		template : goldBuyResTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			var purchaseAmt = App.storage.get("_parameters").purchaseAmt;
			var amount = App.storage.get("_parameters").amount;
			var activityFlag = App.storage.get("_parameters").activityFlag;
			if(amount && !purchaseAmt){
				$("#msg").text("您已成功卖出幸福如金");
				$("#label").text("卖出数量");
				$("#much").text("克");
				$("#account").text("收款账号");
				$("#rebuy").val("继续卖出");
			}
			$("#purchaseAmt").text(Utils.formatCurrency(purchaseAmt || amount,(amount && !purchaseAmt)?4:2));
			if(activityFlag=="01"){
			      $("#hongbao").show();
		    }
			Client.hideWaitPanel(1);
		},
		
		goBack : function(){
			App.back();
		},
		
		toredPacketInviteIndex : function(){
			App.navigate("hongbao/hongbaoCtl/redPacketInviteIndex");
    	},
    	
		view : function(){
        	if(App.browseList[2] == "gold/goldCtl/gold"){
        		App.browseList[2] = "gold/goldCtl/goldLogon";
        	}
        	if(App.browseList[2].indexOf("riskRes")>=0){
        		if(App.browseList[5] == "gold/goldCtl/gold"){
            		App.browseList[5] = "gold/goldCtl/goldLogon";
            	}
        		App.back(5);
        	}else if(App.browseList[2].indexOf("goldRisk")>=0){
        		if(App.browseList[3] == "gold/goldCtl/gold"){
            		App.browseList[3] = "gold/goldCtl/goldLogon";
            	}
        		App.back(3);
        	}else{
        		App.back(2);
        	}
		}
	
	});
});
