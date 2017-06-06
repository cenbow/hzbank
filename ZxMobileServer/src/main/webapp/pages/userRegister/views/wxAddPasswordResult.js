define(function (require, exports, module) {

	var wxAddPasswordResultTemplate = require("text!../template/wxAddPasswordResult.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : wxAddPasswordResultTemplate,
        
        events:{
        	"click #gotoIndex" : "gotoIndex",
        	"click #active" : "active"
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'密码设置结果',
    			  };
    		Client.initPageTitle(pageTest);  
    		Client.hideWaitPanel(1);
        },
  	    gotoIndex : function(){
			Client.menuOpt("3");
			App.navigate("account/mycountCtl/mycount");
  	    },
  	    active : function(){
  	    	//Utils.recharge();
  	    	App.storage.set("activate",true);
  	    	App.navigate("transfer/transferCtl/recharge");
  	    },
	});
});