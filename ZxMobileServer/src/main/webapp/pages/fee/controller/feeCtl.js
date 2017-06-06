define(function(require, exports, module) {
	// 定义视图
	var SchoolListView = require("../views/schoolList");
	var TuitionView = require("../views/tuition");
	var tuitionQueryView = require("../views/tuitionQuery");
	var tuitionPayView = require("../views/tuitionPay");
	var resultView = require("../views/result");
	var cityListView = require("../views/cityList");
	var orderDetailView = require("../views/orderDetail");
	var orderListView = require("../views/orderList");
	var feeMenuView = require("../views/feeMenu");
	var utilityBillView = require("../views/utilityBill");
	var utilityBillDetailView = require("../views/utilityBillDetail");
	var utilityBillOrderView = require("../views/utilityBillOrder");
	var utilityOrderDetailView = require("../views/utilityOrderDetail");
	var otherBillView = require("../views/otherBill");
	var otherBillDetailView = require("../views/otherBillDetail");
	var otherBillOrderView = require("../views/otherBillOrder");
	var otherOrderDetailView = require("../views/otherOrderDetail");
	
	var carBiddingView = require("../views/carBidding");
	var ensureView = require("../views/ensure");
	var queryEnsuerView = require("../views/queryEnsuer");
	var ensureResultView = require("../views/ensureResult");
	var dealView = require("../views/deal");
	var dealNextView = require("../views/dealNext");
	var dealSubmitView = require("../views/dealSubmit");
	var querySucView = require("../views/querySuc");
	var carListView = require("../views/carList");
	var carOrderDetailView = require("../views/carOrderDetail");
	var carTuitionPayView = require("../views/carTuitionPay");
	var dealResultView = require("../views/dealResult");
	// 视图操作
	var FinanceController = module.exports = Controller.extend({
		actions : {
			"schoolList" : "schoolList",
			"tuition" : "tuition",
			"tuitionQuery" : "tuitionQuery",
			"tuitionPay" : "tuitionPay",
			"result" : "result",
			"cityList" : "cityList",
			"orderDetail" : "orderDetail",
			"orderList":"orderList",
			"feeMenu":"feeMenu",
			"utilityBill":"utilityBill",
			"utilityBillDetail":"utilityBillDetail",
			"utilityBillOrder":"utilityBillOrder",
			"utilityOrderDetail":"utilityOrderDetail",
			"otherBill":"otherBill",
			"otherBillDetail":"otherBillDetail",
			"otherBillOrder":"otherBillOrder",
			"otherOrderDetail":"otherOrderDetail",
			
			"carBidding":"carBidding",
			"ensure":"ensure",
			"queryEnsuer":"queryEnsuer",
			"ensureResult":"ensureResult",
			"deal":"deal",
			"dealNext":"dealNext",
			"dealSubmit":"dealSubmit",
			"querySuc":"querySuc",
			"carList":"carList",
			"carOrderDetail":"carOrderDetail",
			"carTuitionPay" : "carTuitionPay",
			"dealResult" : "dealResult",
		},
		
		schoolList : function(){
			var pageStep1 = {
	        		title:'学校检索',
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
			App.container.show(new SchoolListView());
		},

		tuition : function() {
			var pageStep1 = {
	        		title:'学费代缴',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : '缴费明细',
	        			func: 'curView.order()'
	        		}
	        		
	        	};

	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new TuitionView());
		},
		
		tuitionQuery : function() {
			var pageStep1 = {
	        		title:'学费代缴',
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
			App.container.show(new tuitionQueryView());
		},
		
		tuitionPay : function() {
			var pageStep1 = {
	        		title:'费用支付',
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
			App.container.show(new tuitionPayView());
		},
		
		result : function() {
			var pageStep1 = {
	        		title:'支付结果',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : '缴费明细',
	        			func : 'curView.detail()'
	        		}
	        	};
			
			Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new resultView());
		},
		
		cityList : function() {
			var pageStep1 = {
	        		title:'选择城市',
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
			App.container.show(new cityListView());
		},
		
		orderDetail : function() {
			var pageTest = {
				  	title:'缴费明细',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			 };
			Client.initPageTitle(pageTest);
			Client.menuOpt("0");
			App.container.show(new orderDetailView());
		},
		
		orderList : function() {
			 var pageTest = {
				  	title:'缴费明细列表',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			 };
			Client.initPageTitle(pageTest);
			Client.menuOpt("0");
			App.container.show(new orderListView());
		},
		
		feeMenu : function() {
			 var pageTest = {
				  	title:'缴费',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			 };
			Client.initPageTitle(pageTest);
			Client.menuOpt("0");
			App.container.show(new feeMenuView());
		},
		
		utilityBill : function() {
			 var pageTest = {
				  	title:'物业费',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : '缴费明细',
						func :'curView.detail()'
					}
			 };
			Client.initPageTitle(pageTest);
			Client.menuOpt("0");
			App.container.show(new utilityBillView());
		},
		
		utilityBillDetail : function() {
			 var pageTest = {
				  	title:'物业费',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			 };
			Client.initPageTitle(pageTest);
			Client.menuOpt("0");
			App.container.show(new utilityBillDetailView());
		},
		
		utilityBillOrder : function() {
			 var pageTest = {
				  	title:'物业费',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			 };
			Client.initPageTitle(pageTest);
			Client.menuOpt("0");
			App.container.show(new utilityBillOrderView());
		},
		
		utilityOrderDetail : function() {
			 var pageTest = {
				  	title:'缴费明细列表',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			 };
			Client.initPageTitle(pageTest);
			Client.menuOpt("0");
			App.container.show(new utilityOrderDetailView());
		},
		
		otherBill : function() {
			 var pageTest = {
				  	title:'其它缴费',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : '缴费明细',
						func :'curView.detail()'
					}
			 };
			Client.initPageTitle(pageTest);
			Client.menuOpt("0");
			App.container.show(new otherBillView());
		},
		
		otherBillDetail : function() {
			 var pageTest = {
				  	title:'其它缴费',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			 };
			Client.initPageTitle(pageTest);
			Client.menuOpt("0");
			App.container.show(new otherBillDetailView());
		},
		
		otherBillOrder : function() {
			 var pageTest = {
				  	title:'其它缴费',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			 };
			Client.initPageTitle(pageTest);
			Client.menuOpt("0");
			App.container.show(new otherBillOrderView());
		},
		
		otherOrderDetail : function() {
			 var pageTest = {
				  	title:'缴费明细列表',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			 };
			Client.initPageTitle(pageTest);
			Client.menuOpt("0");
			App.container.show(new otherOrderDetailView());
		},
		
		carBidding:function(){
			var pageStep1 = {
	        		title:'小客车竞价',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
	        		
	        		rightButton:{
	        			name : '缴费明细',
	        			func: 'curView.car()'
	        		}
	        		
	        	};
	        Client.initPageTitle(pageStep1);
			Client.menuOpt("0");
			App.container.show(new carBiddingView());
		},
		
		ensure:function(){
			var pageStep1 = {
	        		title:'竞价保证金缴款',
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
			App.container.show(new ensureView());
		},
		
		queryEnsuer:function(){
			var pageStep1 = {
	        		title:'缴款确认',
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
			App.container.show(new queryEnsuerView());
		},
		
		ensureResult:function(){
			var pageStep1 = {
	        		title:'缴款结果',
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
			App.container.show(new ensureResultView());
		},
		
		deal:function(){
			var pageStep1 = {
	        		title:'竞价成交款缴款',
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
			App.container.show(new dealView());
		},
		
		dealNext:function(){
			var pageStep1 = {
	        		title:'竞价成交款缴款',
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
			App.container.show(new dealNextView());
		},
		
		dealSubmit:function(){
			var pageStep1 = {
	        		title:'竞价成交款缴款',
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
			App.container.show(new dealSubmitView());
		},
		
		querySuc:function(){
			var pageStep1 = {
	        		title:'竞价成交款查询',
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
			App.container.show(new querySucView());
		},
		
		carList : function() {
			 var pageTest = {
				  	title:'缴费明细',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			 };
			Client.initPageTitle(pageTest);
			Client.menuOpt("0");
			App.container.show(new carListView());
		},
		
		carOrderDetail : function() {
			var pageTest = {
				  	title:'缴费明细',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			 };
			Client.initPageTitle(pageTest);
			Client.menuOpt("0");
			App.container.show(new carOrderDetailView());
		},
		
		carTuitionPay : function() {
			var pageStep1 = {
	        		title:'小客车保证金缴款',
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
			App.container.show(new carTuitionPayView());
		},
		
		dealResult:function(){
			var pageStep1 = {
	        		title:'缴款结果',
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
			App.container.show(new dealResultView());
		},

	});

});