define(function(require, exports, module){
	
	var boseAgreementTpl = require("text!../template/boseAgreement.html");
	
	var boseAgreementView = module.exports = ItemView.extend({
		
		events : {
		},
		
		template : boseAgreementTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    Client.hideWaitPanel(1);
		},
		
		goBack : function(){
			App.back();
		}		
	
	});
});
