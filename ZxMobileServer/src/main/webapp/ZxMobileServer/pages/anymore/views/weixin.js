define(function(require, exports, module){
	
	var weixinTpl = require("text!../template/weixin.html");
	
	var weixinView = module.exports = ItemView.extend({
		
	template : weixinTpl,
		//定义日志TAG便于错误信息查找
	initialize : function(){
	    var pageTest = {
			  	title:'关注微信',
				leftButton:{
					name : '返回',
					func :'curView.goBack()'
				},
				rightButton:{
					name : ''
				}
		  }
		Client.initPageTitle(pageTest);
	    Client.hideWaitPanel(100);
	},
	
	goBack : function(){
		App.back();
	}
	});
});
