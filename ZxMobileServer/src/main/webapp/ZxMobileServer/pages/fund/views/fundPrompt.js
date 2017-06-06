define(function (require, exports, module) {
	
	var fundPromptTemplate = require("text!../template/fundPrompt.html");
	
	var fundPromptView = module.exports = ItemView.extend({
		
        template : fundPromptTemplate,
        
        events:{
        	"click #backBtn" : "goBack",
        },
        
        initialize : function(){
        	var pageStep1 = {
        		title:'基金精选',
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
    	},
	});
	
});