define(function (require, exports, module) {
	
	var fundDirectTemplate = require("text!../template/fundDirect.html");
	var fundDirectView = module.exports = ItemView.extend({
		 
		template : fundDirectTemplate,
        events:{
        	
        },
        initialize : function(){
        	var pageStep1 = {
        		title:'新手指南',
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