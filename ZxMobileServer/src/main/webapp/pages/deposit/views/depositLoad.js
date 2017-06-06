define(function (require, exports, module) {
	
	var depositLoadTemplate = require("text!../template/depositLoad.html");
	
	var DepositLoadView = module.exports = ItemView.extend({
		
        template : depositLoadTemplate,
        
        events:{
        	"tap #depositIn":"goToDepositInPage",
        	"tap #depositOut":"goToDepositOutPage",
        	"click #profitQry":"goToProfitQryPage"
        },
        
        initialize : function(){
        	//初始化菜单方法
        	var pageStep1 = {
        		title:'幸福乐存',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		},
        		rightButton:{
        			name : '',
        			func: 'curView.flash()'
        		}
        	};
        	
        	Client.initPageTitle(pageStep1);
        	
        	var depositRate = App.storage.get("depositRate");
        	if(depositRate){
        		this.rate = depositRate.rate;
        		this.initChart(depositRate.rate,depositRate.label);
        	}else{
        		this.queryRate();
        	}
        	
   		    if(Utils.checkRealUser("1")){//实名用户   		
	    		var paramTreasureInfo = {};//幸福添利session传参
	    		paramTreasureInfo = App.storage.get("paramTreasureInfo");
				if(paramTreasureInfo){
					var totalBalanceAvailable = paramTreasureInfo.totalBalanceAvailable;	
					$("#balanceAvailableTotal").text(Utils.formatCurrency(totalBalanceAvailable));
	    			Client.hideWaitPanel(1);
	    			this.flash();
				}else{
					paramTreasureInfo = {};
		    		this.doQueryTreasureTotal(paramTreasureInfo);
				}
   		    }else{
   		    	this.flash();
    			Client.hideWaitPanel(1);
   		    }
        },
        
        queryRate : function(){
        	
        	var rate = this.rate =[];
        	var label = [];
        	var $this = this;
        	
        	Ajax({url:"/finance/queryRmbRate",data:{}, 
    			success:function(data){
    				if(data.errorCode){
    					Utils.alertinfo(data.errorMessage);
    				}else{
    					var iApparList = data.iApparList;
    					
    					for(index in iApparList){
    						var appar = iApparList[index];
    						rate.push(appar.aprShowMsg);
    						label.push(appar.aprName);
    					}
    					$this.initChart(rate,label);
    					App.storage.set("depositRate",{rate:rate,label:label});
    				}
    				
    			}
        	});
        },
        
        initChart : function(rate,label){
        	
        	var rate9 = Utils.getParamDisplay("PB_DEPOSIT_RATE","100");//银行活期
        	
        	$('#rate9').text(rate9);
        	$('#rate5').text(rate[4]);
			$('#rate4').text(rate[3]);
        	$('#rate8').text(rate[7]);
        	
        	var opt = {
    			
    			chartType: "line",
    			
    		    myData: {
    			  labels : label,
    			  data : rate
    		    }        		
        	};
        	var $this = this;
        	setTimeout(function(){
        		MUI.creatChart('#hs_chart_line',opt);
			},300);
        },
        
      //统计幸福乐存可用余额
        doQueryTreasureTotal : function(paramTreasureInfo){
    		var totalBalanceAvailable=0;
    		var cardNo = this.getCardNo('01',true).no;
    		var accountType = this.getCardNo('01',true).type;
    		var $this = this;
    		if(!Utils.isInteger(cardNo) ){
    			$("#balanceAvailableTotal").text("0.00");
    			return;
    		}
    		var param = {
    				accountNo:cardNo,
    				accountType2:accountType
    		};
    		Ajax({url:"/finance/queryFinanceTerm",data:param, success:function(data){
    			if(data.errorCode==undefined){
    				var icoll = data.iAccountDetail;			
    				for(var len=0;len<icoll.length;len++){
    					var kcoll = icoll[len];
    					var depositType = Utils.trim(kcoll.depositType);
    					if("29" != depositType)continue;
    					var balanceAvailable = kcoll.balanceAvailable;
    					totalBalanceAvailable +=parseFloat(balanceAvailable);
    				}
    				totalBalanceAvailable =parseFloat(totalBalanceAvailable).toFixed(2);
    				$("#balanceAvailableTotal").text(Utils.formatCurrency(totalBalanceAvailable));
					paramTreasureInfo.totalBalanceAvailable=totalBalanceAvailable;
					App.storage.set("paramTreasureInfo",paramTreasureInfo);//将参数放入session
					
    			}else{
    				$("#balanceAvailableTotal").text("0.00");
    			}
    			$this.flash();
    			Client.hideWaitPanel();
    			Client.hideLucencyPanel();
    		}});		
    	},
    	
    	getCardNo : function(type,related){	
    		var iCardInfo  = App.storage.get("UserInfo").iCardInfo;
    		var showCardNo;
    		if(undefined == related)related=true;
    		for(var len=0;len<iCardInfo.length;len++){
    			var accountType = iCardInfo[len].accountType;
    			if(accountType == type ){
    				var cardType = iCardInfo[len].cardType;
    				if(!related){
    					if("02" == cardType )continue;
    				}
    				showCardNo = iCardInfo[len].cardNo;
    			}
    		}
    		 return {no:showCardNo,type:accountType};
    	},
    	
    	goToDepositInPage : function(){
			if(Utils.checkRealUser()){
	    		App.navigate("deposit/depositCtl/depositIn");
			}
    	},
    	
    	goToDepositOutPage : function(){
			if(Utils.checkRealUser()){
	    		App.navigate("deposit/depositCtl/depositOutDetail");
			}
    	},
    	
    	goToProfitQryPage : function(){
			if(Utils.checkRealUser()){
	    		App.navigate("deposit/depositCtl/depositProfit");
			}
    	},
    	
    	
    	flash : function(){

        	this.ropt ? null : this.ropt = {
					callback:"curView.refresh()"
			};
			Client.dragRefresh(this.ropt);
    	},
    	
    	refresh : function(){
    		Client.openLucencyPanel();
    		$("#balanceAvailableTotal").text("0.00");
    		$("#rate4").text("0.000");
    		$("#rate8").text("0.000");
    		$("#rate9").text("0.000");
    		this.ropt.type = "1";
    		App.storage.remove("paramTreasureInfo");
    		App.storage.remove("depositRate");
    		this.initialize();
    	},
    	
    	goBack : function(){
    		App.back();
    	},
	});


});