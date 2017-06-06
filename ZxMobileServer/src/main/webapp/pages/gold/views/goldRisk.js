define(function(require, exports, module){
	
	var goldRiskTpl = require("text!../template/goldRisk.html");
	
	var goldRiskView = module.exports = ItemView.extend({
		
		events : {
			"click #back" : "goBack",
			"click #buy" : "buy",
			"click #exam" : "exam",
			"click #agree" : "agree"
		},
		
		template : goldRiskTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			if(!Utils.checkBoseFinance("2"))
				$(".zen-ckbox").removeClass("hidden");
			
			var goldSign = App.storage.get("goldSign");
			if(goldSign){
				$("#riskLevel").text(this.transType(goldSign.riskLevel));
			}
			Client.hideWaitPanel(1);
		},
		
		buy : function(){
			if(!Utils.checkBoseFinance("2")){
				if($("#sign input:checked").length<=0){
					Utils.alertinfo("请先同意黄金签约协议");
					return;
				}
				var param = {
					customManagerId:"100000000",
					signProduct:Utils.getParamDisplay("PB_BOSERA",'3')
				};
				Client.openWaitPanel("加载中");
				Ajax({url:"/bosera/boseraAsset",data:param, success:function(data){
	    			if(!data.errorCode){
	    				var goldSign = App.storage.get("goldSign");
	    				goldSign = goldSign || {};
	    				goldSign.signState = '2';
	    				App.storage.set("goldSign",goldSign);
	    				App.navigate("gold/goldCtl/goldBuy");
	    			}else{
	    				Utils.alertinfo(data.errorMessage);
	    				Client.hideWaitPanel(1);
	    			}
				}});
			}else{
				App.navigate("gold/goldCtl/goldBuy");
			}
		},
		
		exam : function(){
			if(!Utils.checkBoseFinance("2")){
				if($("#sign input:checked").length<=0){
					Utils.alertinfo("请先同意黄金签约协议");
					return;
				}
				var param = {
					customManagerId:"100000000",
					signProduct:Utils.getParamDisplay("PB_BOSERA",'3')
				};
				Client.openWaitPanel("加载中");
				Ajax({url:"/bosera/boseraAsset",data:param, success:function(data){
	    			if(!data.errorCode){
	    				var goldSign = App.storage.get("goldSign");
	    				goldSign = goldSign || {};
	    				goldSign.signState = '2';
	    				App.storage.set("goldSign",goldSign);
	    				App.navigate("gold/goldCtl/riskExam");
	    			}else{
	    				Utils.alertinfo(data.errorMessage);
	    				Client.hideWaitPanel(1);
	    			}
				}});
			}else{
				App.navigate("gold/goldCtl/riskExam");
			}
		},
		
		transType : function(type){
			switch(type){
				case '-1':
					return "您的风险等级信息已过期";
					break;
				case '1':
					return "知道自己的承受风险能力为保守型";
					break;
				case '2':
					return "知道自己的承受风险能力为稳健型";
					break;
				case '3':
					return "知道自己的承受风险能力为平衡型";
					break;
				case '4':
					return "知道自己的承受风险能力为成长型";
					break;
				case '5':
					return "知道自己的承受风险能力为进取型";
					break;
				default:
					return "知道自己的承受风险能力为保守型";
					break;
			}
		},
		
		agree : function(){
			App.navigate("gold/goldCtl/goldAgreement");
		},
		
		goBack : function(){
    		App.back();
		}
	});
});
