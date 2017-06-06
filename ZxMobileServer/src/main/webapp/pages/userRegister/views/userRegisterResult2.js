define(function (require, exports, module) {

	var userRegisterResult2Template = require("text!../template/userRegisterResult2.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : userRegisterResult2Template,
        
        events:{
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'温馨提示',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				}
    			  };
    		Client.initPageTitle(pageTest);  
    		Client.hideWaitPanel(1);
        },
  	    goBack : function(){
//			App.back();
			App.navigate("index/index/index");
  	    },
	});
});