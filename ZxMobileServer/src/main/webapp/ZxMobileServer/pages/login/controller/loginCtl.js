define(function (require, exports, module) {
	//定义视图
	var LoginView = require("../views/login");
	//视图操作
	var WantInvController = module.exports = Controller.extend({
		actions:{
				"login" : "login"
			},
		
		login : function(){
			var isHidden = "";
			if(!MUI.isEmpty(App.storage.get("_parameters"))){
				isHidden =App.storage.get("_parameters").isHidden;
			};
			var pageStep1 = {
					title:'登录',
					leftButton:{
	       				name : isHidden==1?'':'返回',
	       				func: 'curView.goBack()'
//	       			},
//	       			rightButton:{
//	       				name : '注册',
//	       				func : 'curView.toReg()'
	       			}
				};
			Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new LoginView({model:new Model()}));
		}
		
	});
	
});