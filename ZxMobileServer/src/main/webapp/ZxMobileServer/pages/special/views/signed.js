define(function(require, exports, module){
	
	var signedTpl = require("text!../template/signed.html");
	
	var signedView = module.exports = ItemView.extend({
		
		events : {
			"click #back" : "goBack"
		},
		
		template : signedTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    
		    Client.hideWaitPanel(1);
		},
		
		goBack : function(){
			App.back();
		},
	
	});
});
