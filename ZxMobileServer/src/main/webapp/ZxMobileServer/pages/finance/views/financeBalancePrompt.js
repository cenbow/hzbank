define(function (require, exports, module) {
	
	var financeBalancePromptTemplate = require("text!../template/financeBalancePrompt.html");
	
	var financeBalancePromptView = module.exports = ItemView.extend({
		
        template : financeBalancePromptTemplate,
        
        events:{
        	"click #backBtn" : "goBack",
        },
        
        initialize : function(){
        	var pageStep1 = {
        		title:'幸福添利',
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