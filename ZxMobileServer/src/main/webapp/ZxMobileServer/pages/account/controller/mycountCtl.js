define(function (require, exports, module) {
	
	var MycountView = require("../views/mycount");
	var TradeDetailView = require("../views/tradeDetail");
	var HoldingAssetView = require("../views/holdingAsset");
	var MyScoreView = require("../views/myScore");
	var ScoreDetailView = require("../views/scoreDetail");
	var AccountBalanceView = require("../views/accountBalance");
	var P2PDetailView = require("../views/p2pDetail");
	var MyTradeDetailView = require("../views/myTradeDetail");
	
	var MyAddView = require("../views/myAdd");
	var MySaveView = require("../views/mySave");
	var MyCunView = require("../views/myCun");
	var MyCunCancelView = require("../views/myCunCancel");
	var MyCunHistoryView = require("../views/myCunHistory");
	var GoToTransferView = require("../views/goToTransfer");
	var P2pTransferView = require("../views/p2pTransfer");
	var ResultTransferView = require("../views/resultTransfer");
	var TransferHelpView = require("../views/transferHelp");
	require("echarts");
	
	var MycountController = module.exports = Controller.extend({
		actions:{
				"mycount" : "mycount",
				"tradeDetail" : "tradeDetail",
				"holdingAsset" : "holdingAsset",
				"myScore" : "myScore",
				"scoreDetail":"scoreDetail",
				"accountBalance":"accountBalance",
				"p2pDetail":"p2pDetail",
				"myTradeDetail":"myTradeDetail",
				"myAdd":"myAdd",
				"mySave":"mySave",
				"myCun":"myCun",
				"myCunCancel":"myCunCancel",
				"myCunHistory":"myCunHistory",
				"goToTransfer":"goToTransfer",
				"p2pTransfer":"p2pTransfer",
				"resultTransfer":"resultTransfer",
				"transferHelp" :"transferHelp"
			},
		
		mycount : function(){
			Client.openWaitPanel("加载中...");
			var param = {
					balance:"0.00",
					yesterTranAmt:"0.00",
					accTranAmt:"0.00",
					totalScore:"0.00",
					totalProperty:"0.00",
					ownAmt:"0.00",
					financeAmt:"0.00",
					totalBalanceAvailable:"0.00",
					designCount:"0",
					designSum:"0.00",
					p2pCount:"0",
					p2pSum:"0.00",
					goldSum:"0.00",
					fundTotalMoney:"0.00"
						
			};
			Client.menuOpt("3");
			App.container.show(new MycountView({model:new Model(param)}));
		},
		
		tradeDetail : function(){
			App.container.show(new TradeDetailView({model : new Model({})}));
		},
		
		holdingAsset : function(){
			//初始化菜单方法
	       	var pageStep1 = {
	       		  	title:'持有资产',
	       			leftButton:{
	       				name : '返回',
	       				func: 'curView.myAccount()'
	       			},
	       			rightButton:{
	       				name : '帮助',
	       				func : 'curView.help()'
	       			}
	       	 };
	       	Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			var param = App.storage.get("paramOwn");
			App.container.show(new HoldingAssetView({model : new Model(param)}));
		},
		
		myScore : function(){
			var param = App.storage.get("_parameters");
			App.container.show(new MyScoreView({model:new Model(param)}));
			Client.hideWaitPanel(1); 
		},
		
		scoreDetail : function(){
			App.container.show(new ScoreDetailView({model:new Model()}));
		},
		
		accountBalance:function(){
			var param = App.storage.get("paramAccount");
			App.container.show(new AccountBalanceView({model:new Model(param)}));
		},
		
		p2pDetail : function(){
			Client.menuOpt("0");
			var param={
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({
				url : "/product/saleProductRaisingQuery",
				data : param,
				success : function(data) {
					if (MUI.isEmpty(data.errorCode)) {						
						var iP2PRaisingList=data.iP2PRaisingList;
						App.storage.set("iP2PRaisingList",iP2PRaisingList);
						App.container.show(new P2PDetailView({model:new Model()}));
					} else {
						Utils.alertinfo(data.errorMessage);
					}
				},
				error : function() {
					Utils.alertinfo("服务器异常！");
				}
			});
		},
		
		myTradeDetail : function(){
			App.container.show(new MyTradeDetailView({model:new Model()}));
		},
		myAdd : function(){
			Client.menuOpt("0");
			var financeNo = Utils.getParamDisplay("PB_FINANCE_BALANCE","1");
			var financeName = Utils.getParamDisplay("PB_FINANCE_BALANCE","2");
			var financeClass = "yfd";
    		var model ={
				financeNo:financeNo,
    			financeName:financeName,
    			financeClass:financeClass
    		};
			App.container.show(new MyAddView({model:new Model(model)}));
		},
		mySave : function(){
			Client.menuOpt("0");
			var param = App.storage.get("paramOwn");
			App.container.show(new MySaveView({model:new Model(param)}));
		},
		myCun : function(){
			Client.menuOpt("0");
			var param = App.storage.get("paramOwn");
			App.container.show(new MyCunView({model:new Model(param)}));
		},
		myCunCancel : function(){
			Client.menuOpt("0");
			var param = App.storage.get("paramOwn");
			App.container.show(new MyCunCancelView({model:new Model(param)}));
			
		},
		myCunHistory : function(){
			Client.menuOpt("0");
			var param = App.storage.get("paramOwn");
			App.container.show(new MyCunHistoryView({model:new Model(param)}));
			
		},
		goToTransfer : function(){
			Client.menuOpt("0");
			var param = App.storage.get("paramOwn");
			App.container.show(new GoToTransferView({model:new Model(param)}));
			
		},
		p2pTransfer : function(){
			Client.menuOpt("0");
			var param = App.storage.get("paramOwn");
			App.container.show(new P2pTransferView({model:new Model(param)}));
			
		},
		resultTransfer : function(){
			Client.menuOpt("0");
			var param = App.storage.get("paramOwn");
			App.container.show(new ResultTransferView({model:new Model(param)}));
			
		},
		transferHelp : function(){
			Client.menuOpt("0");
			var param = App.storage.get("paramOwn");
			App.container.show(new TransferHelpView({model:new Model(param)}));
			
		},
		
	});
	
});