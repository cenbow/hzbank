define(function(require, exports, module){
	
	var agreementTpl = require("text!../template/agreement.html");
	
	var agreementView = module.exports = ItemView.extend({
		
		events : {
		},
		
		template : agreementTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    
		    Client.hideWaitPanel(1);
		},

		cancel : function(){
			Client.menuOpt("5");
			var index = App.browseList.indexOf("special/specialCtl/special");
    	  	App.browseList.splice(1,index-1);
			App.back();
		},
		
		goBack : function(){
			App.back();
		},
	
	});
});
