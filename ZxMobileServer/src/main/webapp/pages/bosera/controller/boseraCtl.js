define(function (require, exports, module) {
	//定义视图
	var boseFundView = require("../views/boseFund");
	var boseFundLogonView = require("../views/boseFundLogon");
	var boseFundBuyView = require("../views/boseFundBuy");
	var buyResultView = require("../views/buyResult");
	var fundPayBackView = require("../views/fundPayBack");
	var payBackResultView = require("../views/payBackResult");
	var boseInComeView = require("../views/boseInCome");
	var boseFinanceView = require("../views/boseFinance");
	var tranDiscView = require("../views/tranDisc");
	var boseAgreementView = require("../views/boseAgreement");
	require("echarts");
	//视图操作
	var FinanceController = module.exports = Controller.extend({
		actions:{
				"boseFund" : "boseFund",
				"boseFundLogon" : "boseFundLogon",
				"boseFundBuy" : "boseFundBuy",
				"buyResult" : "buyResult",
				"fundPayBack" : "fundPayBack",
				"payBackResult" : "payBackResult",
				"boseInCome" : "boseInCome",
				"boseFinance" : "boseFinance",
				"tranDisc" : "tranDisc",
				"boseAgreement" : "boseAgreement"
			},
		
		boseFund : function(){
			var pageStep1 = {
	        		title:'幸福添利',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : '',
	        			func: ''
	        		}
	        		
	        	};
	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new boseFundView());
		},
		
		boseFundLogon : function(){
			var pageStep1 = {
	        		title:'幸福添利',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : '',
	        			func: ''
	        		}
	        		
	        	};
	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new boseFundLogonView());
		},
		
		boseFundBuy : function(){
			var pageStep1 = {
	        		title:'幸福添利申购',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : ''
	        		}
	        		
	        	};
	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			var model={
		    		cardNo : Utils.trim(Utils.getEleCard().cardNo),
		    		accountType : Utils.trim(Utils.getEleCard().accountType),
		    		boseSevRate:App.storage.get("boseRate")?App.storage.get("boseRate").boseSevRate:"0.000"
				};
			App.container.show(new boseFundBuyView({model:new Model(model)}));
		},
		
		buyResult : function(){
			var pageStep1 = {
	        		title:'申购结果',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : ''
	        		}
	        		
	        	};
	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new buyResultView());
		},
		
		fundPayBack : function(){
			var pageStep1 = {
	        		title:'幸福添利赎回',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : ''
	        		}
	        	};
	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			var model={
		    		cardNo : Utils.trim(Utils.getEleCard().cardNo),
		    		accountType : Utils.trim(Utils.getEleCard().accountType)
				};
			App.container.show(new fundPayBackView({model:new Model(model)}));
		},
		
		payBackResult : function(){
			var pageStep1 = {
	        		title:'赎回结果',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : ''
	        		}
	        	};
	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new payBackResultView());
		},
		
		boseInCome : function(){
			var pageStep1 = {
	        		title:'累计收益',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : ''
	        		}
	        	};
	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new boseInComeView());
		},
		
		boseFinance:function(){
			var pageStep1 = {
	        		title:'幸福添利',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : ''
	        		}
	        		
	        	};
	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new boseFinanceView());
		},
		
		tranDisc:function(){
			var pageStep1 = {
	        		title:'转账说明',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : ''
	        		}
	        		
	        	};
	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new tranDiscView());
		},
		
		boseAgreement:function(){
			var pageStep1 = {
	        		title:'申购协议',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : ''
	        		}
	        		
	        	};
	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new boseAgreementView());
		}
		
	});
	
});