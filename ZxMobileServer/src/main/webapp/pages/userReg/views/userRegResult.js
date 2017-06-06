define(function (require, exports, module) {

	var userRegResultTemplate = require("text!../template/userRegResult.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : userRegResultTemplate,
        
        events:{
        	"click #gotoLogin":"toLogin",

        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'注册成功',
    				leftButton:{
    					name : '返回',
    					func :'curView.toLogin()'
    				}
    			  };
    		Client.initPageTitle(pageTest);
			Client.hideWaitPanel(1);

        },
	  	goBack : function(){
				App.back();
	  	},
    	toLogin : function(){
//    		App.navigate("login/loginCtl/login?type=account");
			Client.menuOpt("2");
    		App.navigate("product/productCtl/wantInv");
    	},

	});
});