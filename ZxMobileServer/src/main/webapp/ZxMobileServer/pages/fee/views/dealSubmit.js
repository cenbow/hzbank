define(function(require, exports, module){
	
	var dealSubmitTpl = require("text!../template/dealSubmit.html");
	
	var dealSubmitView = module.exports = ItemView.extend({
		
		events : {
		},
		
		template : dealSubmitTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			Client.hideWaitPanel(1);
		},
		
//		queryEnsuer:function(){
//			App.navigate("fee/feeCtl/ensureResultTpl");
//		},
		
		goBack : function(){
			App.back();
		}
	
	});
});
