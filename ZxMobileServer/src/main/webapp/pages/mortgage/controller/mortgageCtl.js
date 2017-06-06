define(function(require, exports, module){
	
	var HelpView = require("../views/help");
	var ImageUploadView = require("../views/imageUpload");
	var MortApplyView = require("../views/mortApply");
	var MortLoopView = require("../views/mortLoop");
	var MortMoneyView = require("../views/mortMoney");
	var MortMoreView = require("../views/mortMore");
	var MortResultView = require("../views/mortResult");
	var MortTest1View = require("../views/mortTest1");
	var MortTest2View = require("../views/mortTest2");
	var MortTest3View = require("../views/mortTest3");
	var MyLoanView = require("../views/myLoan");
	var RepayMethodView = require("../views/repayMethod");
	var MortQueryAreaView = require("../views/mortQueryArea");
	var MortQueryCityView = require("../views/mortQueryCity");
	var MortQueryProvinceView = require("../views/mortQueryProvince");
	var MortQueryBuildingView = require("../views/mortQueryBuilding");
	var MortQueryFloorView = require("../views/mortQueryFloor");
	var MortQueryHouseView = require("../views/mortQueryHouse");
	var SubmitResultView = require("../views/submitResult");
	var AgreementView = require("../views/agreement");
	var ChangeCityView = require("../views/changeCity");
	var NoticeView = require("../views/notice");
	
	var IndexController = module.exports = Controller.extend({
		
		actions:{
			"help":"help",
			"imageUpload":"imageUpload",
			"mortApply":"mortApply",
			"mortLoop":"mortLoop",
			"mortMoney":"mortMoney",
			"mortMore":"mortMore",
			"mortResult":"mortResult",
			"mortTest1":"mortTest1",
			"mortTest2":"mortTest2",
			"mortTest3":"mortTest3",
			"myLoan":"myLoan",
			"repayMethod":"repayMethod",
			"mortQueryArea":"mortQueryArea",
			"mortQueryCity":"mortQueryCity",
			"mortQueryProvince":"mortQueryProvince",
			"mortQueryBuilding":"mortQueryBuilding",
			"mortQueryFloor":"mortQueryFloor",
			"mortQueryHouse":"mortQueryHouse",
			"submitResult":"submitResult",
			"agreement":"agreement",
			"changeCity":"changeCity",
			"notice":"notice"
		},
		
		help : function(){
			var pageStep1 = {
	        		title:'帮助',
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
			App.container.show(new HelpView());
		},
		
		imageUpload : function(){
			var pageStep1 = {
	        		title:'影像上传',
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
			App.container.show(new ImageUploadView());
		},
		
		mortApply : function(){
			var pageStep1 = {
	        		title:'房产评估',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		rightButton:{
	        			name : '帮助',
	        			func: 'curView.goHelp()'
	        		}
	        	};
	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new MortApplyView());
		},
		
		mortLoop : function(){
			var pageStep1 = {
	        		title:'云抵贷简介',
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
			App.container.show(new MortLoopView());
		},
		
		mortMoney : function(){
			var pageStep1 = {
	        		title:'最高可贷额度',
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
			App.container.show(new MortMoneyView());
		},
		
		mortMore : function(){
			var pageStep1 = {
	        		title:'贷款申请',
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
			App.container.show(new MortMoreView());
		},
		
		mortResult : function(){
			var pageStep1 = {
	        		title:'受理成功',
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
			App.container.show(new MortResultView());
		},
		
		mortTest1 : function(){
			var pageStep1 = {
	        		title:'额度测算',
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
			App.container.show(new MortTest1View());
		},
		
		mortTest2 : function(){
			var pageStep1 = {
	        		title:'额度测算',
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
			App.container.show(new MortTest2View());
		},
		
		mortTest3 : function(){
			var pageStep1 = {
	        		title:'额度测算',
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
			App.container.show(new MortTest3View());
		},
		
		myLoan : function(){
			var pageStep1 = {
	        		title:'我的借款',
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
			App.container.show(new MyLoanView());
		},
		
		repayMethod : function(){
			var pageStep1 = {
	        		title:'还款方式',
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
			App.container.show(new RepayMethodView());
		},
		
		mortQueryProvince : function(){
			var pageStep1 = {
	        		title:'省份列表',
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
			App.container.show(new MortQueryProvinceView());
		},
		
		mortQueryCity : function(){
			var pageStep1 = {
	        		title:'城市列表',
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
			App.container.show(new MortQueryCityView());
		},
		
		mortQueryArea : function(){
			var pageStep1 = {
	        		title:'区域列表',
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
			App.container.show(new MortQueryAreaView());
		},
		
		mortQueryBuilding : function(){
			var pageStep1 = {
	        		title:'楼栋列表',
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
			App.container.show(new MortQueryBuildingView());
		},
		
		mortQueryFloor : function(){
			var pageStep1 = {
	        		title:'楼层列表',
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
			App.container.show(new MortQueryFloorView());
		},
		
		mortQueryHouse : function(){
			var pageStep1 = {
	        		title:'房号列表',
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
			App.container.show(new MortQueryHouseView());
		},
		
		submitResult : function(){
			var pageStep1 = {
	        		title:'已提交',
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
			App.container.show(new SubmitResultView());
		},
		
		agreement : function(){
			var pageStep1 = {
	        		title:'征信授权',
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
			App.container.show(new AgreementView());
		},
		
		changeCity : function(){
			var pageStep1 = {
	        		title:'城市切换',
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
			App.container.show(new ChangeCityView());
		},
		
		notice : function(){
			var pageStep1 = {
	        		title:'公告',
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
			App.container.show(new NoticeView());
		},
	});
});