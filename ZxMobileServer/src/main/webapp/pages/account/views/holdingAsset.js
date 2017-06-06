define(function (require, exports, module) {
	
	var holdingAssetTemplate = require("text!../template/holdingAsset.html");
	
	var HoldingAssetView = module.exports = ItemView.extend({
		
        template : holdingAssetTemplate,
        
        events:{
        	"click #happyAddProDiv":"toAdd",
        	"click #happySaveDiv":"toSave",
        	"click #designSumDiv":"toSum",
        	"click #p2pDiv":"top2p",
        	"click #goldDiv":"toGold",
        	"click #happyAddBuy":"happyAddBuy",
        	"click #happyAddCancel":"happyAddCancel",
        	"click #happySaveBuy":"happySaveBuy",
        	"click #happySaveCancel":"happySaveCancel",
        	"click #myDesignList":"myDesignList",
        	"click #depositHistoryQuery":"depositHistoryQuery",
        	"click #myProductBuy":"myProductBuy",
        	"click #goldBuy":"goldBuy",
        	"click #goldSale":"goldSale",	
        	"click #goFundIndex":"goFundIndex",
        	"click #goFundBuy":"goFundIndex",
        	"click #goFundSale":"goFundSale"
        },
        
        initialize : function(){
        	this.init();
        },
        
        myAccount : function(){
        	App.back();
  	  	},
  	  	
  	  	help : function(){
  	  		App.navigate("anymore/anymoreCtl/messageCenter");
  	  	},
  	  	
  	  	init : function(){
        	var param = App.storage.get("paramOwn");
        	var happyAddProAmt = parseFloat(param.happyAddProAmt);
        	var happySaveAmt = parseFloat(param.happySaveAmt);
        	var designSum = parseFloat(param.designSum);
        	var p2pSum = parseFloat(param.totalP2P);
        	var goldSum = parseFloat(param.goldSum);
        	var fundTotalMoney =parseFloat(param.fundTotalMoney);
        	
        	var ownAmt = param.ownAmt+",";
        	var ownAmtF = ownAmt.replace(/,/g,"");
        	if(ownAmtF == 0){
        		$('#haveHappyAddProAmt').html("0.00");
            	$('#haveHappySaveAmt').html("0.00");
            	$('#haveDesignSum').html("0.00");
            	$('#p2pSum').html("0.00");
		$('#goldSum').html("0.00");
            	$('#fundTotalMoney').html("0.00");
            	this.circleZ();
        	}else{
        		$('#haveHappyAddProAmt').html(Utils.toRetentionDigit(happyAddProAmt/ownAmtF*100,2));
            	$('#haveHappySaveAmt').html(Utils.toRetentionDigit(happySaveAmt/ownAmtF*100,2));
            	$('#haveDesignSum').html(Utils.toRetentionDigit(designSum/ownAmtF*100,2));
            	$('#p2pSum').html(Utils.toRetentionDigit(p2pSum/ownAmtF*100,2));
		$('#goldSum').html(Utils.toRetentionDigit(goldSum/ownAmtF*100,2));
            	$('#fundTotalMoney').html(Utils.toRetentionDigit(fundTotalMoney/ownAmtF*100,2));
            	this.circle(parseInt(happyAddProAmt*100),parseInt(happySaveAmt*100),parseInt(designSum*100),parseInt(p2pSum*100),parseInt(goldSum*100),parseInt(fundTotalMoney*100));
        	}
        	var boseRate = App.storage.get("boseRate");
			if (boseRate) {
				$("#sevenDayAmt").text(boseRate.boseSevRate);
			}
			
			var iBoseraIncome = App.storage.get("iBoseraIncome");
			if(!iBoseraIncome && Utils.checkSession()){
	    		this.queryBoseFinance();
	    	}else{
	    		Client.hideWaitPanel(1);
	    	}
			
			var icoll = App.storage.get("iFundBalinfo");
			if(icoll!=null){
				
				if(icoll.length==0){
					$("#count").text("(0支)");
				}else{
					$("#count").text("("+icoll.length+"支)");
				}		
			}
			else{
				$("#count").text("(0支)");
			}
  	  	},
  	  	
  	  circle :function(valueOne,valueTwo,valueThree,valueFour,valueFive,valueSix){
		var payment=[
			{value:valueOne, name:'幸福添利'},
			{value:valueTwo, name:'幸福乐存'},
			{value:valueThree, name:'结构性存款'},
			{value:valueFour, name:'幸福金禧'},
			{value:valueFive, name:'幸福如金'},
			{value:valueSix, name:'幸福基金'}
		];
		echarts.init(document.getElementById('chartCircle')).setOption({
			color: ['#2196f3','#fb6e52','#4caf50','#ffc107','#ca3de8','#E50012'],
			series : [
				{
					startAngle:0,
					name:'投入统计',
					type:'pie',
					radius : ['72%', '100%'],
						itemStyle : {
							normal : {
								label : {
									show : false
								},
								labelLine : {
									show : false
								}
							}
						},
						data: payment
					}
				]
			});
		  },
		circleZ : function(){
			var payment=[
			 			{value:1, name:'无'}
			 		];
			 		echarts.init(document.getElementById('chartCircle')).setOption({
			 			color: ['#aaa'],
			 			series : [
			 				{
			 					startAngle:0,
			 					name:'投入统计',
			 					type:'pie',
			 					radius : ['72%', '100%'],
			 						itemStyle : {
			 							normal : {
			 								label : {
			 									show : false
			 								},
			 								labelLine : {
			 									show : false
			 								}
			 							}
			 						},
			 						data: payment
			 					}
			 				]
			 			});
		},
		toAdd : function(){
			var param = App.storage.get("_parameters");
			param.code="happyAdd";
			App.navigate("account/mycountCtl/tradeDetail",param);
		},
	  	  	
		toSave : function(){
			var param = App.storage.get("_parameters");
			param.code="happySave";
			App.navigate("account/mycountCtl/tradeDetail",param);
		},

		toSum : function(){
			var param = App.storage.get("_parameters");
			param.code="cun";
			App.navigate("account/mycountCtl/tradeDetail",param);
		},
		
		top2p : function(){
			var iP2PProList = App.storage.get("iP2PProList");
			App.navigate("account/mycountCtl/p2pDetail",iP2PProList);
		},
		
		goFundIndex: function(){
			App.navigate("fund/fundCtl/fundIndex");
		},
		
		goFundSale:function(){
			var cardNo =Utils.trim(Utils.getCardNoByFlag("0","cardFlag1"));
			if(!Utils.checkRealUser()){
				return;
			}
			if(!Utils.checkActivate()){
				return;
			}
	    	if (MUI.isEmpty(cardNo)) {
	    		Utils.alertinfo("您还未购买基金产品,快去选购吧!","提示");
    			return;
			}
			App.navigate("fund/fundCtl/myFund");
			
		},
		
		queryBoseFinance:function(){
			var param = {
					productId:Utils.getParamDisplay("PB_BOSERA",'1'),
					cardNo : Utils.trim(Utils.getEleCard().cardNo),
		    		accountType : Utils.trim(Utils.getEleCard().accountType)
			};
			Ajax({url:"/bosera/queryBoseraFinance",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						App.storage.set("iBoseraIncome",data.iBoseraQuery);
	    			}
					Client.hideWaitPanel(1);
			}});
		},
		
		//幸福添利
		happyAddBuy : function(){
			if(!App.storage.get("boseRate")){
				Utils.alertinfo("暂无产品信息，请稍候再试");
				return;
			};
			App.navigate("bosera/boseraCtl/boseFundBuy");
		},
		
		happyAddCancel : function(){
			if(Utils.checkRealUser()){
				if(!Utils.checkActivate()){
					return;
				}
				
				if(Utils.checkBoseFinance("1")){
					App.navigate("bosera/boseraCtl/boseFinance");
				}else{
					if(Utils.checkBoseFinance("0")){
						App.navigate("bosera/boseraCtl/fundPayBack");
					}else{
						Client.alertinfo("您还未购买过本产品，马上去购买？","提示","curView.toBuy()",true);
					}
				}
			}
		},
		
		toBuy:function(){
			App.navigate("bosera/boseraCtl/boseFund");
		},
		
		//幸福乐存
		happySaveBuy : function(){
			if(Utils.checkRealUser()){
				Client.menuOpt("2");
	    		App.navigate("deposit/depositCtl/depositIn");
			}
		},
		happySaveCancel : function(){
			if(Utils.checkRealUser()){
				Client.menuOpt("2");
	    		App.navigate("deposit/depositCtl/depositOutDetail");
			}
		},
  	  	//我持有的结构性存款
  	    myDesignList : function(){
        	var myDesignList = App.storage.get("myDesignList");
			if(!MUI.isEmpty(myDesignList)){
   				App.navigate("design/designCtl/depositQuery");
				return;
        	}
			Client.openWaitPanel("拼命加载中，请稍候");
        	Ajax({url:"/design/productVolQuery",data:{},success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var icoll = data.designAbilityVolInfo;
					App.storage.set("myDesignList",icoll);
	   				App.navigate("design/designCtl/depositQuery");

    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}

        	}});  
  	  	},
  	  	//结构性存款历史查询
  	  depositHistoryQuery : function(){
        	var designHistoryList = App.storage.get("designHistoryList");
			if(!MUI.isEmpty(designHistoryList)){
   				App.navigate("design/designCtl/depositHistoryQuery");
				return;
        	}
			Client.openWaitPanel("拼命加载中，请稍候");
        	Ajax({url:"/design/productHisDealQueryAjax",data:{},success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var icoll = data.designabilityDealInfo;
					App.storage.set("designHistoryList",icoll);
	   				App.navigate("design/designCtl/depositHistoryQuery");

    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}

        	}});  
  	  	},
  	  myProductBuy : function(){
  		var transferFlag ="1";
		var param = {transferFlag:transferFlag};
  		App.navigate("product/productCtl/saleProducts",param);
  	  },
  	  
  	toGold : function(){
		if(!App.storage.get("boseGold")){
			Utils.alertinfo("暂无产品信息，请稍候再试");
			return;
		};
		if(Utils.checkBoseFinance("2")){
			App.navigate("gold/goldCtl/goldLogon");
		}else{
			App.navigate("gold/goldCtl/gold");
		}
	},
	
	goldBuy : function(){
		if(!App.storage.get("boseGold")){
			Utils.alertinfo("暂无产品信息，请稍候再试");
			return;
		};
		var state = App.storage.get("goldState");
		var $this = this;
		if(state){
			$this.gotoBuy(state);
		}else{
			Client.openWaitPanel(1);
			if(!Utils.checkBoseFinance("2")){
				$this.gotoBuy();
			}else{
				var param = {
						productId:Utils.getParamDisplay("PB_BOSERA",'3'),
						cardNo : Utils.trim(Utils.getEleCard().cardNo)
				};
				Ajax({
					url : "/bosera/riskRankCheck",
					data : param,
					success : function(data) {
						if (MUI.isEmpty(data.errorCode)) {
							App.storage.set("goldState",data.state);
							$this.gotoBuy(data.state);
						} else {
							Utils.alertinfo(data.errorMessage);
						}
					}
				});
			}
		}
	},
	
	gotoBuy : function(state){
		if(state == "0" && Utils.checkBoseFinance("2")){
			App.navigate("gold/goldCtl/goldBuy");
		}else{
			var goldSign = App.storage.get("goldSign");
			if(Utils.checkBoseFinance("2") && goldSign && goldSign.riskLevel>0){
				Client.alertinfo("当前产品超过了您的风险承受能力！您确定要买入吗？","提示","App.navigate('gold/goldCtl/goldBuy')",true);
				Client.hideWaitPanel(1);
				return;
			}
			App.navigate("gold/goldCtl/goldRisk");
		}
	},
	
	goldSale : function(){
		if(!App.storage.get("boseGold")){
			Utils.alertinfo("暂无产品信息，请稍候再试");
			return;
		};
		
		if(Utils.checkBoseFinance("2")){
			App.navigate("gold/goldCtl/goldSale");
		}else{
			Client.alertinfo("您还未购买过本产品，马上去购买？","提示","curView.goldBuy()",true);
		}
	}
	});
	
});