define(function(require, exports, module){
	
	var noticeTpl = require("text!../template/notice.html");
	
	var NoticeView = module.exports = ItemView.extend({
		
		events : {
			"click #makesure":"makesure"
		},
		
		template : noticeTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    Client.hideWaitPanel(1);
		},
		
		
		goBack : function(){
			App.back();
		},
		
		makesure: function(){
			App.navigate("mortgage/mortgageCtl/mortApply");
		}
	
	});
});
