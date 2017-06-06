define(function (require, exports, module) {
	
	var BuyhousestepTemplate = require("text!../template/buyhousestep.html");
	
	var BuyhousestepView = module.exports = ItemView.extend({
		
        template : BuyhousestepTemplate,
        
        initialize : function(){
    	    var pageTest = {
    			  	title:'买房流程',
    				leftButton:{
    					name : '返回',
    					func :'curView.goToBack()'
    				},
    				
    		  }
    		Client.initPageTitle(pageTest);
    	    Client.hideWaitPanel(10);
    	},
      
    	goToBack : function(){
    		App.back();
    	},
    	
     
    	
    	
    	
    	
    	
	});
	  
});