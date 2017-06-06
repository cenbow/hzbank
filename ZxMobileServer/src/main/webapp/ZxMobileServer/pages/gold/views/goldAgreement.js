define(function(require, exports, module){
	
	var goldAgreementTpl = require("text!../template/goldAgreement.html");
	
	var goldAgreementView = module.exports = ItemView.extend({
		
		events : {
		},
		
		template : goldAgreementTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    Client.hideWaitPanel(1);
		},
		
		goBack : function(){
			App.back();
		}		
	
	});
});
