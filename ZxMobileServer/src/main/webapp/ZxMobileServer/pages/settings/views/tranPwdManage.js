define(function(require, exports, module){
	
	var tranPwdManageTpl = require("text!../template/tranPwdManage.html");
	var tranPwdManageView = module.exports = ItemView.extend({
		
	template : tranPwdManageTpl,
	
	events:{
		"click #tranPwdChange":"tranPwdChange",
		"click #tranPwdReset":"tranPwdReset",
		"click #tranPwdQuery":"tranPwdQuery",
	},
	initialize : function(){
		var pageStep1 = {
			  	title:'交易密码管理',
				leftButton:{
					name : '返回',
					func: 'curView.goBack()'
//				},
//				rightButton:{
//					name : '帮助',
//					func : 'curView.help()'
				}
		  };
		 Client.initPageTitle(pageStep1);
		 Client.hideWaitPanel();

	},
	
	tranPwdChange:function(){
		App.navigate("settings/setCenterCtl/elecAccPwdMod",true);
	},

	tranPwdReset:function(){
		App.navigate("settings/setCenterCtl/elecAccPwdReset",true);
	},

	tranPwdQuery:function(){
		App.navigate("settings/setCenterCtl/elecAccPwdResetQuery",true);
	},

	goBack : function(){
		App.back();
	}	
	});
});
