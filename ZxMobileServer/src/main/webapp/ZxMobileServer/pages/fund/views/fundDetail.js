define(function (require, exports, module) {
	
	var fundDetailTemplate = require("text!../template/fundDetail.html");
	
	var FundListInfoView = module.exports = ItemView.extend({
		
        template : fundDetailTemplate,
        
        events:{
        	"click #buyBtn" : "gotoBuy",
        },
        
        initialize : function(){

        	var pageStep1 = {
        		title:"基金详情",
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        		
        	};

        	Client.initPageTitle(pageStep1);

        	var param = App.storage.get("_parameters");
        	this.init(param);
        },
        
        
        init : function(param){       	
    		 var paramT = this.JsonNvl(param,"--");
			 this.model.set(paramT);
        	 var isLogin = App.storage.get("_parameters2");
        	 if(!MUI.isEmpty(isLogin)&&isLogin == '1'){
        		App.storage.remove("_parameters2");
        		this.gotoBuyFundSession();
        	 }else{
    			Client.hideWaitPanel(1);
        	 }
        },

        goBack : function(){
        	App.back();
    	},
    	
       JsonNvl : function(param,val){
    	   var paramT = {};
 	       for(var key in param){
	    	   if(MUI.isEmpty(param[key])){
	    		   paramT[key] = val;
	    	   }else{
	    		   paramT[key] = param[key];
	    	   }
	       }
 	       return paramT;
       },
       gotoBuy : function(){	
    			var isLogon = Utils.checkSession();
    			if(!isLogon){ 
    				Client.menuOpt("0");
    				App.storage.set("_parameters2","1");
    				Client.toLogin("curView.gotoBuyFundSession()");
    			}else{
    				if(Utils.checkRealUser()){
	    				var kcoll = App.storage.get("_parameters");    	   
	    				this.signFundQuery(kcoll);
    				}    				
    			}
       },
   	gotoBuyFundSession : function(){
		var isLogon = Utils.checkSession();
		if(isLogon){ 
			if(Utils.checkRealUser()){
				Client.menuOpt("5");
				App.storage.remove("_parameters2");
				var kcoll = App.storage.get("_parameters");  
				this.signFundQuery(kcoll);
			} 
		}else{
			Client.hideWaitPanel(1);
		}
	},
   	signFundQuery : function(kcoll){
		if(!Utils.checkActivate()){
			return;
		}
  		var cardNo = Utils.trim(Utils.getCardNoByFlag("0","cardFlag1"));
		var accountType = Utils.trim(Utils.getCardTypeByFlag("0","cardFlag1"));
		
		if(MUI.isEmpty(cardNo)){
		 	kcoll.isFundSign="0";//签约
	    	App.navigate("fund/fundCtl/fundRiskReq",kcoll);//基金评测
			return;
		}
		var $this = this;
		
//		var param = {
//				 cardType:"FD"
//		};
//		Ajax({url:"/fund/signCardNoQuery",data:param, success:function(data){
//			if(MUI.isEmpty(data.errorCode)){
//				var signCardNo =  Utils.nvl(data.signCardNo,"");
//				if(MUI.isEmpty(signCardNo)){
//					kcoll.isFundSign="0";//签约
//    		    	App.navigate("fund/fundCtl/fundRiskReq",kcoll);//基金评测
//				}else if(signCardNo != cardNo){	
//		    		App.navigate("fund/fundCtl/fundPrompt");						
//				}else{
//		    		var param = {
//		    				 cardNo:cardNo,
//							 accountType:accountType
//		    		};
		    		Client.openWaitPanel("加载中");
		    		Ajax({url:"/fund/custRiskLevelQuery",data:param, success:function(data){
		    			if(MUI.isEmpty(data.errorCode)){
		    	    		var param = {
		    	    				TACode:kcoll.TACode,
									cardNo:cardNo,
									fundCode:kcoll.fundCode
		    	    		};
		    	    		Ajax({url:"/fund/fundQueryRisk",data:param, success:function(data){
		    	    			if(MUI.isEmpty(data.errorCode)){
		    	    		    	App.navigate("fund/fundCtl/fundBuy",kcoll);
		    	    			}else{
									 if(data.errorCode =='2005'){
				    	    		    	App.navigate("fund/fundCtl/fundBuy",kcoll);

									 }else if(data.errorCode =='2006' || data.errorCode =='2035'){
										 	kcoll.isFundSign="1";//评测
				    	    		    	App.navigate("fund/fundCtl/fundRiskReq",kcoll);//基金评测
									 }else{
				    	    				Client.alertinfo(data.errorMessage,"提醒");
				    	    				Client.hideWaitPanel(1);
									 }
		    	    			}
		    	    		}});
		    			}else if(data.errorCode == '-89008'){
		    				kcoll.isFundSign="1";//评测
    	    		    	App.navigate("fund/fundCtl/fundRiskReq",kcoll);//基金评测
		    			}else{
		    				Client.alertinfo(data.errorMessage,"提醒");
		    				Client.hideWaitPanel(1);
		    			}
		    		}});
//				}
//
//			}else{
//				Client.alertinfo(data.errorMessage,"提醒");
//				Client.hideWaitPanel(1);
//			}
//		}});
	}       
	});
	
});