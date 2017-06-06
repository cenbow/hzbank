define(function (require, exports, module) {
	
	var financeBalancePrompt2Template = require("text!../template/financeBalancePrompt2.html");
	
	var financeBalancePrompt2View = module.exports = ItemView.extend({
		
        template : financeBalancePrompt2Template,
        
        events:{
        	"click #backBtn" : "goBack",
        	"click #cancelBtn" : "cancelBtn",
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
    	cancelBtn : function(){
    		var financeNo ="";
    		var financeName ="";
    		if(this.model.get("financeNo") == Utils.getParamDisplay("PB_FINANCE_BALANCE","1")){
    			financeNo = Utils.getParamDisplay("PB_FINANCE_BALANCE","3");
    			financeName = Utils.getParamDisplay("PB_FINANCE_BALANCE","4");
    		}else{
       			financeNo = Utils.getParamDisplay("PB_FINANCE_BALANCE","1");
    			financeName = Utils.getParamDisplay("PB_FINANCE_BALANCE","2");   			
    		}
			var param = {
					financeName : financeName,
					financeNo : financeNo,
					actionFlag : "1"
				};
			App.navigate("finance/financeCtl/financeBalanceUnSign",param);
    	},
	});
	
});