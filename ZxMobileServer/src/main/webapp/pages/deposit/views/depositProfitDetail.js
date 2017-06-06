define(function (require, exports, module) {
	
	var depositProfitDetailTemplate = require("text!../template/depositProfitDetail.html");
	
	var DepositProfitDetailView = module.exports = ItemView.extend({
		
        template : depositProfitDetailTemplate,
        
        events:{
        	"click #backBtn":"goBack"
        },
        
        initialize : function(){
        	//初始化菜单方法
        	var pageStep1 = {
        		title:'收益查询',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		},
        		rightButton:{
        			name : '帮助',
        			func : 'curView.help()'
        		}
        	};

        	Client.initPageTitle(pageStep1);
        	
    		this.treasureRateQuery();
        },
        
        treasureRateQuery : function(){
        	var currentDate = Utils.formatDate(this.model.get("currentDate"),'yyyy-MM-dd','yyyyMMdd');
    		var param = {
    				cardNo:this.model.get("cardNo"),
    				accountNo:this.model.get("accountNo"),
    				endDate:currentDate,
    				tranAmt:this.model.get("balance").replace(/,/g,""),
    				accountType:this.model.get("accountType")
    		};
    		var $this = this;
    		Ajax({url:"/finance/queryFinanceTreasureRate",data:param, success:function(data){
    			if(data.errorCode==undefined){
    				$this.model.set({
    					interestRate : data.interestRate,
    					fundIncome : data.fundIncome
    				});
    				
    				Client.hideWaitPanel();
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel();
    			}
    		}});		
    	},
        
        goBack : function(){
        	App.back();
    	},
    	
    	help : function(){
    		App.navigate("anymore/anymoreCtl/messageCenter");
    	}
	});
	
});