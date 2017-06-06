define(function(require, exports, module){
	
	var aboutUsTpl = require("text!../template/about_us.html");
	
	var aboutUsView = module.exports = ItemView.extend({
		
	template : aboutUsTpl,
		//定义日志TAG便于错误信息查找
	initialize : function(){
	    var pageTest = {
			  	title:'关于我们',
				leftButton:{
					name : '返回',
					func :'curView.goToBack()'
				},
				rightButton:{
					name : ''
				}
		  }
		Client.initPageTitle(pageTest);
	    Client.hideWaitPanel(100);
	},
	goToBack : function(){
		App.back();
	}
	});
});
