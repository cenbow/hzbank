define(function(require, exports, module){
	
	var helpTpl = require("text!../template/help.html");
	
	var HelpView = module.exports = ItemView.extend({
		
		events : {
			
		},
		
		template : helpTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    
		    Client.hideWaitPanel(1);
		},
		
		
		goBack : function(){
			App.back();
		}
	
	});
});
