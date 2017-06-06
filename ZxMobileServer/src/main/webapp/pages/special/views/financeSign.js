define(function(require, exports, module){
	
	var financeSignTpl = require("text!../template/financeSign.html");
	
	var financeSignView = module.exports = ItemView.extend({
		
		events : {
			"click #submit" : "submit",
			"click #agreement" : "agreement",
			"click #back" : "back"
		},
		
		template : financeSignTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    
		    Client.hideWaitPanel(1);
		},
		
		
		submit : function(){
			
			var flag = $("#deel").prop("checked");
			if(!flag){
				Utils.alertinfo("请先阅读账单协议");
				return;
			}
			Client.openWaitPanel("请稍候");
			var sendStr = App.storage.get("_parameters");
			// 理财签约
			Ajax({url : "/specialFinance/financeSign",data : sendStr,
				success : function(data) {
					if(data.errorCode){
						Utils.alertinfo(data.errorMessage);
					}else{
						$(".idc-result").show().siblings("div").hide();
						$(".specBuz").show();
					}
					Client.hideWaitPanel(1);
				},error : function(msg) {
					Client.hideWaitPanel(1);
				}
			});
		},
		
		agreement : function(){
			App.navigate("special/specialCtl/agreement");
		},
		
		goBack : function(){
			if($(".idc-result").is(":hidden"))
				App.back();
			else
				App.navigate("special/specialCtl/special");
		},

		cancel : function(){
			Client.menuOpt("5");
			var index = App.browseList.indexOf("special/specialCtl/special");
    	  	App.browseList.splice(1,index-1);
			App.back();
		},
		
		back : function(){
			App.navigate("special/specialCtl/special");
		}
		
	});
});
