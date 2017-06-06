define(function (require, exports, module) {
	
	var fundListInfoTemplate = require("text!../template/fundListInfo.html");
	
	var FundListInfoView = module.exports = ItemView.extend({
		
        template : fundListInfoTemplate,
        
        events:{
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

        	this.init();
        },
        
        
        init : function(){
        	var iFundListInfo = App.storage.get("iFundListInfo");
        	if(!iFundListInfo){
        		this.queryFundInfo();
        	}else{
				$("#fundList").empty();
				$('#noData').hide();
				if(iFundListInfo.length == 0){
					$('#noData').show();
	    			Client.hideWaitPanel(1);
				}else{	
					for(var len=0;len<iFundListInfo.length;len++){
						var kcoll = iFundListInfo[len];
						this.addRow("fundList",kcoll);
					}
		        	var isLogin = App.storage.get("_parameters2");
		        	if(!MUI.isEmpty(isLogin)&&isLogin == '1'){
		        		App.storage.remove("_parameters2");
		        		this.gotoBuyFundSession();
		        	}else{
		    			Client.hideWaitPanel(1);
		        	}
				}
        	}
        },
    	
    	goToBuy : function(){
    		this.queryUserMobBalInfo();
    	},
    	
    	queryFundInfo : function(){
    		var param = {
    				turnPageBeginPos:1,
    				turnPageShowNum:10
    		};
    		var $this = this;
    		Ajax({url:"/fund/queryFundListInfo",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var icoll = data.iFundInfo;
					$("#fundList").empty();
					for(var len=0;len<icoll.length;len++){
						var kcoll = icoll[len];
						$this.addRow("fundList",kcoll);
					}
					 App.storage.set("iFundListInfo",icoll);
    			}else{
    				Client.alertinfo(data.errorMessage,"提醒");
    			}
    			Client.hideWaitPanel(1);
    		}});
    	},
    	addRow : function(id,kcoll){
    		$("#"+id).append('<li id="li_'+kcoll.fundCode+'">'+
    			       '<h1>'+kcoll.fundName+'</h1>'+
    			       '<div class="buyPanel">'+
    			         '<div class="net">'+
    			           '<h2 class="ft12 fc-9">最新净值</h2>'+
    			           '<h3 class="ft18 fc-orange"><span class="">'+kcoll.fundlastnav+'</span></h3>'+
    			         '</div>'+
    			         '<div class="start">'+
    			           '<h2 class="ft12 fc-9">起购金额</h2>'+
    			           '<h3 class="ft16 fc-9">'+kcoll.minbuyamt+'元</h3>'+
    			         '</div>'+
    			         '<div class="query-btn">'+
    			           '<a href="javascript:;" class="btn" id="a_'+kcoll.fundCode+'">购买</a>'+
    			         '</div>'+
    			       '</div>'+
    			    '</li>');

    		var $this = this;
    		$("#li_"+kcoll.fundCode).on('click', function() {
    			$this.gotoDetail(kcoll);
    		});
    		$("#a_"+kcoll.fundCode).on('click', function(e) {
    			$this.gotoBuyFund(kcoll);
    			e.stopPropagation();
    		});
    	}, 
    	gotoBuyFund : function(kcoll){
			var isLogon = Utils.checkSession();
			if(!isLogon){ 
				App.storage.set("_parameters",kcoll);
				App.storage.set("_parameters2","1");
	        	Client.menuOpt("0");
	        	Client.toLogin("curView.gotoBuyFundSession()");
			 }else{	
	   			if(Utils.checkRealUser()){
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
    	gotoDetail : function(kcoll){
    		App.navigate("fund/fundCtl/fundDetail",kcoll);
    	},
        goBack : function(){
        	App.back();
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

//    		var param = {
//    				 cardType:"FD"
//    		};
//    		Ajax({url:"/fund/signCardNoQuery",data:param, success:function(data){
//    			if(MUI.isEmpty(data.errorCode)){
//					var signCardNo =  Utils.nvl(data.signCardNo,"");
//					if(MUI.isEmpty(signCardNo)){
//					 	kcoll.isFundSign="0";//签约
//	    		    	App.navigate("fund/fundCtl/fundRiskReq",kcoll);//基金评测
//					}else if(signCardNo != cardNo){	
//			    		App.navigate("fund/fundCtl/fundPrompt");						
//					}else{
			    		var param = {
			    				 cardNo:cardNo,
								 accountType:accountType
			    		};
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
					}
	
//    			}else{
//    				Client.alertinfo(data.errorMessage,"提醒");
//    				Client.hideWaitPanel(1);
//    			}
//    		}});
//    	}
	});
	
});