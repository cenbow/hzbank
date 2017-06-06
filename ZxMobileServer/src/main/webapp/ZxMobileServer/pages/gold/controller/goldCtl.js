define(function (require, exports, module) {
	//定义视图
	var goldView = require("../views/gold");
	var goldLogonView = require("../views/goldLogon");
	var goldBuyView = require("../views/goldBuy");
	var goldBuyResView = require("../views/goldBuyRes");
	var goldGuideView = require("../views/goldGuide");
	var goldSaleView = require("../views/goldSale");
	var goldRecodsView = require("../views/goldRecods");
	var riskExamView = require("../views/riskExam");
	var goldRiskView = require("../views/goldRisk");
	var riskResView = require("../views/riskRes");
	var goldListView = require("../views/goldList");
	var goldDetailView = require("../views/goldDetail");
	var goldAgreementView = require("../views/goldAgreement");
	var goldHistoryView = require("../views/goldHistory");
	var goldRevokeView = require("../views/goldRevoke");
	require("echarts");
	//视图操作
	var FinanceController = module.exports = Controller.extend({
		actions:{
				"gold" : "gold",
				"goldLogon" : "goldLogon",
				"goldBuy" : "goldBuy",
				"goldBuyRes" : "goldBuyRes",
				"goldSale" : "goldSale",
				"goldRecods" : "goldRecods",
				"goldGuide" : "goldGuide",
				"riskExam" : "riskExam",
				"goldRisk" : "goldRisk",
				"riskRes" : "riskRes",
				"goldList" : "goldList",
				"goldDetail":"goldDetail",
				"goldAgreement":"goldAgreement",
				"goldHistory":"goldHistory",
				"goldRevoke":"goldRevoke"
			},
		
		gold : function(){
			var pageStep1 = {
	        		title:'幸福如金',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : (Utils.checkSession()&&Utils.checkBoseFinance("2")&&App.browseList[0].indexOf("goldLogon")<0)?'持有':"",
	        			func: 'curView.toDetail()'
	        		}
	        		
	        	};
	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new goldView());
		},
		
		goldLogon : function(){
			var pageStep1 = {
	        		title:'幸福如金',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : App.browseList[0].indexOf("gold/goldCtl/gold")<0?'详情':'',
	        			func: 'curView.toDetail()'
	        		}
	        		
	        	};
	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new goldLogonView());
		},
		
		goldBuy : function(){
			var pageStep1 = {
	        		title:'幸福如金买入',
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
			App.container.show(new goldBuyView({model:new Model(model)}));
		},
		
		goldBuyRes : function(){
			var pageStep1 = {
	        		title:'交易结果',
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
			App.container.show(new goldBuyResView());
		},
		
		goldSale : function(){
			var pageStep1 = {
	        		title:'幸福如金卖出',
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
			App.container.show(new goldSaleView());
		},
		
		goldRecods : function(){
			var pageStep1 = {
	        		title:'交易明细',
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
			App.container.show(new goldRecodsView());
		},
		
		goldGuide : function(){
			var pageStep1 = {
	        		title:'新手指南',
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
			App.container.show(new goldGuideView());
		},
		
		riskExam:function(){
			var pageStep1 = {
	        		title:'风险评测',
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
			App.container.show(new riskExamView());
		},
		
		goldRisk:function(){
			var pageStep1 = {
	        		title:'风险评测',
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
			App.container.show(new goldRiskView());
		},
		
		riskRes:function(){
			var pageStep1 = {
	        		title:'评测结果',
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
			App.container.show(new riskResView());
		},
		
		goldList:function(){
			var pageStep1 = {
	        		title:'评测结果',
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
			App.container.show(new goldListView());
		},
		
		goldDetail:function(){
			var pageStep1 = {
	        		title:'基金详情',
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
			App.container.show(new goldDetailView());
		},
		
		goldAgreement:function(){
			var pageStep1 = {
	        		title:'签约告知书',
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
			App.container.show(new goldAgreementView());
		},
		
		goldHistory:function(){
			var pageStep1 = {
	        		title:'历史净值',
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
			App.container.show(new goldHistoryView());
		},
		
		goldRevoke:function(){
			var pageStep1 = {
	        		title:'如金撤单',
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
			App.container.show(new goldRevokeView());
		}
		
	});
	
});