define(function(require, exports, module){
	
	var tranDiscTpl = require("text!../template/tranDisc.html");
	
	var tranDiscView = module.exports = ItemView.extend({
		
		events : {
		},
		
		template : tranDiscTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    Client.hideWaitPanel(1);
		},
		
		goBack : function(){
			App.back();
		}		
	
	});
});
