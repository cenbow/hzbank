define(function (require, exports, module) {
	//定义视图
	var FundListInfoView = require("../views/fundListInfo");
	var FundDetailView = require("../views/fundDetail");
	var FundBuyView = require("../views/fundBuy");
	var FundRateView = require("../views/fundRate");
	var FundBalQueryView = require("../views/fundBalQuery");
	var FundRedeemView = require("../views/fundRedeem");
	var FundDealrepealQueryView = require("../views/fundDealrepealQuery");
	var FundDealrepealView = require("../views/fundDealrepeal");
	var FundRiskReqView = require("../views/fundRiskReq");
	var FundPromptView = require("../views/fundPrompt");
	var FundSignView = require("../views/fundSign");
	
	var fundIndexView = require("../views/fundIndex");
	var fundRankView = require("../views/fundRank");
	var fundDetaillView = require("../views/fundDetaill");
	var fundBuyInView = require("../views/fundBuyIn");
	var fundDetailPageView = require("../views/fundDetailPage");
	var fundOptionalView = require("../views/fundOptional");
	var myFundView = require("../views/myFund");
	var fundBuyAfterDetailView = require("../views/fundBuyAfterDetail");
	var fundSaleOutView = require("../views/fundSaleOut");
	var fundTranRecordView = require("../views/fundTranRecord");
	var hotFundView = require("../views/hotFund");
	var fundDirectView = require("../views/fundDirect");
	var fundHistoryNavListView = require("../views/fundHistoryNavList");
	var fundTimeInvestView = require("../views/fundTimeInvest");
	var fundInvestManagementView = require("../views/fundInvestManagement");
	var fundInvestDetailView = require("../views/fundInvestDetail");
	var fundShareBonusModeView = require("../views/fundShareBonusMode");
	var oldFundView = require("../views/oldFund");
	var fundHighYieldView = require("../views/fundHighYield");
	var fundCostPerformanceView = require("../views/fundCostPerformance");
	var fundRevokeView = require("../views/fundRevoke");
	var fundRankNewView = require("../views/fundRankNew");
	var fundNewsDetail = require("../views/fundNewsDetail");
	require("echarts");
	
	//视图操作
	var FundController = module.exports = Controller.extend({
		actions:{
			"fundListInfo" : "fundListInfo",
			"fundDetail" : "fundDetail",
			"fundBuy" : "fundBuy",
			"fundRate" : "fundRate",
			"fundBalQuery" : "fundBalQuery",
			"fundRedeem" : "fundRedeem",
			"fundDealrepealQuery" : "fundDealrepealQuery",
			"fundDealrepeal" : "fundDealrepeal",
			"fundRiskReq" : "fundRiskReq",
			"fundPrompt" : "fundPrompt",
			"fundSign" : "fundSign",
			
			"fundIndex" : "fundIndex",
			"fundRank" : "fundRank",
			"fundDetaill" : "fundDetaill",
			"fundBuyIn" : "fundBuyIn",
			"fundDetailPage" : "fundDetailPage",
			"fundOptional" :"fundOptional",
			"myFund" :"myFund",
			"fundBuyAfterDetail" :"fundBuyAfterDetail",
			"fundSaleOut" :"fundSaleOut",
			"fundTranRecord" :"fundTranRecord",
			"hotFund" :"hotFund",
			"fundDirect" :"fundDirect",
			"fundHistoryNavList" :"fundHistoryNavList",
			"fundTimeInvest" :"fundTimeInvest",
			"fundInvestManagement" :"fundInvestManagement",
			"fundInvestDetail" :"fundInvestDetail",
			"fundShareBonusMode" :"fundShareBonusMode",
			"oldFund" :"oldFund",
			"fundHighYield" :"fundHighYield",
			"fundCostPerformance" :"fundCostPerformance",
			"fundRevoke" :"fundRevoke",
			"fundRankNew" :"fundRankNew",
			"fundNewsDetail" :"fundNewsDetail",
			},
		fundIndex : function(){
			App.container.show(new fundIndexView({model:new Model()}));
		},	
		fundRank : function(){
			App.container.show(new fundRankView({model:new Model()}));
		},
		fundDetaill : function(){
			var param = {
					fundCode:"",
					fundName:"",
					fundType:"",
					fundlastnav:"0.00",
					fundlastnavdate:"",
					fundtotalnav:"0.00",
					risklevel:"",
					risklevel_name:"",
					minbuyamt:"0.00",
					toaddamt:"0.00",
			        dayRisePer:"0.00%",
			        avgreturnWeek:"0.00%",
			        monthRisePer:"0.00%",
			        threemonthRisePer:"0.00%",
			        halfyearRisePer:"0.00%",
			        yearRisePer:"0.00%",
			        avgreturnThreeYear:"0.00%",
			        avgreturnThisYear:"0.00%",
			        fundIncome:"0.00",
			        sevenyield:"0.00",
			        TACode : "",
			        TAName : "",
			        sfrankRecentWeek:"",
			        sfrankRecentMonth:"",
			        sfrankRecentquarter:"",
			        sfrankRecenthalfYear:"",
			        sfrankRecentYear:"",
			        sfrankRecentthreeYear:"",
			        sfrankThisYear:""
			};
			App.container.show(new fundDetaillView({model:new Model(param)}));
		},
		
		fundBuyIn : function(){
			App.container.show(new fundBuyInView({model:new Model()}));
		},
		
		fundDetailPage : function(){
			var param = {
					fundName:"",
					fundCode:"",
					fundType:"",
					issueDate:"0000-00-00",
					custodianBank:"",
					investObject:"",
					firstinvestStyle:"",
					investScope:"",
					decisionBasis:"",
					navDivaccumulated:"",
					shortName:"",
					TAName:""
			};
			
			App.container.show(new fundDetailPageView({model:new Model(param)}));
		},
		
		fundOptional : function(){
			App.container.show(new fundOptionalView({model:new Model()}));
		},
		
		myFund : function(){
			App.container.show(new myFundView({model:new Model()}));
		},
		
		fundBuyAfterDetail : function(){
			var param = {
					fundName:"",
					fundCode:"",
					fundNav:"0.00",
					fundVol:"0.00",
					totIncome:"0.00",
					profit:"0.00"
			};
			
			App.container.show(new fundBuyAfterDetailView({model:new Model(param)}));
		},
		
		fundSaleOut : function(){
			App.container.show(new fundSaleOutView({model:new Model()}));
		},
		
		fundTranRecord : function(){
			App.container.show(new fundTranRecordView({model:new Model()}));
		},
		
		hotFund : function(){
			App.container.show(new hotFundView({model:new Model()}));
		},
		
		fundDirect : function(){
			App.container.show(new fundDirectView({model:new Model()}));
		},
		
		fundHistoryNavList : function(){
			App.container.show(new fundHistoryNavListView({model:new Model()}));
		},
		
		fundTimeInvest : function(){
			App.container.show(new fundTimeInvestView({model:new Model()}));
		},
		
		fundInvestManagement : function(){
			App.container.show(new fundInvestManagementView({model:new Model()}));
		},
		
		fundInvestDetail : function(){
			App.container.show(new fundInvestDetailView({model:new Model()}));
		},
		
		fundShareBonusMode : function(){
			App.container.show(new fundShareBonusModeView({model:new Model()}));
		},
		
		oldFund : function(){
			App.container.show(new oldFundView({model:new Model()}));
		},
		
		fundHighYield : function(){
			App.container.show(new fundHighYieldView({model:new Model()}));
		},
		
		fundCostPerformance : function(){
			App.container.show(new fundCostPerformanceView({model:new Model()}));
		},
		
		fundRevoke : function(){
			App.container.show(new fundRevokeView({model:new Model()}));
		},
		
		fundRankNew : function(){
			App.container.show(new fundRankNewView({model:new Model()}));
		},
		
		fundNewsDetail : function(){
			App.container.show(new fundNewsDetail({model:new Model()}));
		},
		
		
		fundBuy : function(){
			var param = {
		    		cardNo : Utils.trim(Utils.getCardNoByFlag("0","cardFlag1")),
		    		accountType : Utils.trim(Utils.getCardTypeByFlag("0","cardFlag1")),
		    		custName : Utils.trim(App.storage.get("UserInfo").customerNameCN),
		    		TACode:Utils.trim(App.storage.get("_parameters").TACode),
	    			TAName:Utils.trim(App.storage.get("_parameters").TAName),
	    			fundCode:Utils.trim(App.storage.get("_parameters").fundCode),
	    			fundName:Utils.trim(App.storage.get("_parameters").fundName),
	    			minbuyamt:Utils.trim(App.storage.get("_parameters").minbuyamt),
			};
			App.container.show(new FundBuyView({model:new Model(param)}));
		},
		
		fundRate : function(){
			var param = {
	    			fundCode:Utils.trim(App.storage.get("_parameters").fundCode),
	    			fundName:Utils.trim(App.storage.get("_parameters").fundName),
			};
			App.container.show(new FundRateView({model:new Model(param)}));
		},
		
		fundBalQuery : function(){
			App.container.show(new FundBalQueryView({model:new Model()}));
		},
		
		fundRedeem : function(){
			var param = {
		    		cardNo : Utils.trim(Utils.getCardNoByFlag("0","cardFlag1")),
		    		accountType : Utils.trim(Utils.getCardTypeByFlag("0","cardFlag1")),
					fundName:Utils.trim(App.storage.get("_parameters").fundName),
					fundCode:Utils.trim(App.storage.get("_parameters").fundCode),
					fundVol:Utils.trim(App.storage.get("_parameters").fundVol),
					fundUseVol:Utils.trim(App.storage.get("_parameters").fundUseVol)
			};
			App.container.show(new FundRedeemView({model:new Model(param)}));
		},
		
		fundDealrepealQuery : function(){
			App.container.show(new FundDealrepealQueryView({model:new Model()}));
		},
		
		fundDealrepeal : function(){
			var param = {
		    		cardNo : Utils.trim(Utils.getCardNoByFlag("0","cardFlag1")),
		    		accountType : Utils.trim(Utils.getCardTypeByFlag("0","cardFlag1")),
					fundName:Utils.trim(App.storage.get("_parameters").fundName),
					fundCode:Utils.trim(App.storage.get("_parameters").fundCode),
					serialNo:Utils.trim(App.storage.get("_parameters").SerialNo),
					tradeStatusName:Utils.trim(App.storage.get("_parameters").tradeStatusName),
					transName:Utils.trim(App.storage.get("_parameters").transName),
					fundAmt:Utils.trim(App.storage.get("_parameters").fundAmt),
					fundVol:Utils.trim(App.storage.get("_parameters").fundVol),
					transferDate:Utils.trim(App.storage.get("_parameters").transferDate),
			};
			App.container.show(new FundDealrepealView({model:new Model(param)}));
		},
				
		fundRiskReq : function(){
			App.container.show(new FundRiskReqView({model:new Model()}));
		},
				
		fundPrompt : function(){
			App.container.show(new FundPromptView({model:new Model()}));
		},
				
		fundSign : function(){
			var param = {
		    		cardNo : Utils.getEleCard().cardNo,
		    		accountType : Utils.getEleCard().accountType,
		    		accountName:Utils.trim(App.storage.get("_parameters").accountName),
		    		certType:Utils.trim(App.storage.get("_parameters").certType),
		    		certNo:Utils.trim(App.storage.get("_parameters").certNo),
		    		customerAddress:Utils.trim(App.storage.get("_parameters").customerAddress),
		    		customerZipcode:Utils.trim(App.storage.get("_parameters").customerZipcode),
		    		riskLevel:Utils.trim(App.storage.get("_parameters").riskLevel),
		    		customerPhone:Utils.trim(App.storage.get("_parameters").customerPhone),
		    		customerFax:Utils.trim(App.storage.get("_parameters").customerFax),
		    		customerMobile:Utils.trim(App.storage.get("_parameters").customerMobile),
		    		customerEmail:Utils.trim(App.storage.get("_parameters").customerEmail)
			};
			App.container.show(new FundSignView({model:new Model(param)}));
		},
				
	});
	
});