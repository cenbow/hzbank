define(function (require, exports, module) {

	var batchAccResultTemplate = require("text!../template/batchAccResult.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : batchAccResultTemplate,
        
        events:{
        	"click #gotoIndex" : "gotoIndex",
        	"click #active" : "active"
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'信息完善结果',
    			  };
    		Client.initPageTitle(pageTest);  
    		Client.hideWaitPanel(1);
        },
  	    gotoIndex : function(){
			Client.menuOpt("3");
			App.navigate("account/mycountCtl/mycount");
  	    },
  	    active : function(){
  	    	App.storage.set("activate",true);
			App.navigate("transfer/transferCtl/recharge");
  	    },
	});
});