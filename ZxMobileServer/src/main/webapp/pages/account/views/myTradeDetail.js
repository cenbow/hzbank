
define(function (require, exports, module) {
	
	var MyTradeDetailTemplate = require("text!../template/myTradeDetail.html");
	var MyTradeDetailItem = require("text!../template/myTradeDetailTpl.html");
	
	var MyTradeDetailView = module.exports = ItemView.extend({
		
        template : MyTradeDetailTemplate,
        
        events:{
        },
        
        initialize : function(){
        	var pageTest = {
    			  	title:'交易明细',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				},
    				rightButton:{
    					name : ''
    				}
    			  };
    		Client.initPageTitle(pageTest);
    		
    		
    		this.showP2PTradeDetail();
        	Client.hideWaitPanel();
    		
        },

        
        goBack : function(){
    		App.back();
    	},
    	
      
    	showP2PTradeDetail : function(){
    		var ul = $("#myP2PTransDetail");
    		var iP2PProTradeList = App.storage.get("iP2PProTradeList");
			var html = _.template(MyTradeDetailItem, {iP2PProTradeList:iP2PProTradeList});
			ul.html(html);
    		if(iP2PProTradeList.length == 0){
				$("#wrapper").hide();
				$('#noData').show();
    		}else{
				$('#noData').hide();
				$("#wrapper").show();
    		}
    		
    	}
		
	});
});