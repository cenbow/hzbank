define(function(require, exports, module){
	
	var submitResultTpl = require("text!../template/submitResult.html");
	
	var SubmitResultView = module.exports = ItemView.extend({
		
		events : {
			"click #bank" : "goBack"
		},
		
		template : submitResultTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    Client.hideWaitPanel(1);
		},
		
		
		goBack : function(){
			var param = {
					cityId:App.storage.get("_parameters").cityId,
					cityName:App.storage.get("_parameters").cityName,
					cityZipCode:App.storage.get("_parameters").cityZipCode
			};
			App.navigate("mortgage/mortgageCtl/mortApply",param);
		}
	
	});
});
