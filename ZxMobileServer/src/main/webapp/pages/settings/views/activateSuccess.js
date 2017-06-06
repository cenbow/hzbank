define(function(require, exports, module){
	
	var activateSuccessTpl = require("text!../template/activateSuccess.html");
	
	var activateSuccessView = module.exports = ItemView.extend({
		
	template : activateSuccessTpl,
	events:{
		"click #successBtn":"goBack"
	},
	initialize : function(){
		//初始化菜单方法
		 var pageStep1 = {
			  	title:'激活成功',
				leftButton:{
					name : '返回',
					func: 'curView.goBack()'
				}
		  };
		 Client.initPageTitle(pageStep1);
		Client.hideWaitPanel(1);
	},
	goBack : function(){
		App.back();
	}
	});
});



