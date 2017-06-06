define(function(require, exports, module){
	
	var mortLoopTpl = require("text!../template/mortLoop.html");
	
	var MortLoopView = module.exports = ItemView.extend({
		
		events : {
			
		},
		
		template : mortLoopTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    Client.hideWaitPanel(1);
		},
		
		goBack : function(){
			App.back();
		}
	
	});
});
