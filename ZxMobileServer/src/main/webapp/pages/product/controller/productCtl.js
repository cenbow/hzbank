define(function (require, exports, module) {
	//定义视图
	var WantInvView        = require("../views/wantInv");
	var saleProductsView   = require("../views/saleProducts");
	var investDetailView   = require("../views/investDetail");
	var immteInvestView    = require("../views/immteInvest");
	var investRecordView   = require("../views/investRecord");
	var agreementView      = require("../views/agreement");
	var projectView        = require("../views/project");
	var productAgree1View  = require("../views/productAgree1");
	var productAgree2View  = require("../views/productAgree2");
	var productAgree3View  = require("../views/productAgree3");
	var productAgree4View  = require("../views/productAgree4");
	var productAgree5View  = require("../views/productAgree5");
	var productCancelView  = require("../views/productCancel");
	var transferBuyView  = require("../views/transferBuy");
	var saleHelpView  = require("../views/saleHelp");
	require("echarts");
	//视图操作
	var WantInvController = module.exports = Controller.extend({
		actions:{
				"wantInv" : "wantInv",
				"saleProducts" : "saleProducts",
				"investDetail" : "investDetail",
				"immteInvest" : "immteInvest",
				"investRecord" : "investRecord",
				"agreement" : "agreement",
				"project" : "project",
				"productAgree1" : "productAgree1",
				"productAgree2" : "productAgree2",
				"productAgree3" : "productAgree3",
				"productAgree4" : "productAgree4",
				"productAgree5" : "productAgree5",
				"productCancel" : "productCancel",
				"saleHelp":"saleHelp",
				"transferBuy":"transferBuy",
			},
		
		wantInv : function(){
			Client.menuOpt("2");
			//初始化菜单方法
			var pageStep1 = {
				title:'我要投资',
				leftButton:{
       				name : '',
       				func : 'curView.toIndex()'
       			}
			};
			Client.initPageTitle(pageStep1);
			App.container.show(new WantInvView({model:new Model({
				 icoll: [{
				      "adUrl" : "hzb_product_ad1.png"
				    }],
				 oneYearRate: '0.000',
				 fiveYearRate: '0.000',
				 financePreInterestRate:'0.000',
				 boseSevRate:'0.000',
				 goldSevRate:"0.000",
				 fundName:'长信量化先锋股票',
				 risePer:'0.000%',
				 rateDate:'近三年涨跌幅',
				 fundClass:"fc-orange"
			})}));
		},
		
		//产品查询
		saleProducts : function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'产品列表',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			  };
			Client.initPageTitle(pageTest);
			App.container.show(new saleProductsView());
		
		},
		
		//投资详情
		investDetail : function(){
			var financeNo=App.storage.get("_parameters").financeNo;
			Ajax({url:"/product/saleDetailById", data:{financeNo:financeNo}, 
				success:function(data){
					if (data.errorCode) {
						Utils.alertinfo(data.errorMessage);
						App.back();
					} else {
						
						var pageStep1 = {
			        		title:'投资详情',
			        		leftButton:{
			        			name : '返回',
			        			func: 'curView.goBack()'
			        		},
							rightButton:{
								name : '帮助',
								func: 'curView.help()'
							}
			        	};
			        	Client.initPageTitle(pageStep1);	     	        	
			        	Client.menuOpt("0");
			        	
			        	data.financeNo = financeNo;
						var financeName=data.financeName;
						var financeRiskLevel=data.financeRiskLevel;
						if(financeRiskLevel=="1"){
							financeRiskLevel="低风险";
						}else if(financeRiskLevel=="2"){
							financeRiskLevel="中低风险";
						}else if(financeRiskLevel=="3"){
							financeRiskLevel="中风险";
						}else if(financeRiskLevel=="4"){
							financeRiskLevel="中高风险";
						}else if(financeRiskLevel=="5"){
							financeRiskLevel="高风险";
						}
						
						var financePreInterestRate=Utils.formatCurrency($.trim(data.financePreInterestRate),2);
						var financePeriod=data.financePeriod;
						var minbuyamt=data.minbuyamt;
						var toaddamt=data.toaddamt;
						var limitamount=data.limitamount;
						var raisebegindate=data.raisebegindate;
						 	raisebegindate=raisebegindate.substring(0,4)+"-"+raisebegindate.substring(4,6)
						 					+"-"+raisebegindate.substring(6,8);
						var raiseenddate=data.raiseenddate;
							raiseenddate=raiseenddate.substring(0,4)+"-"+raiseenddate.substring(4,6)
											+"-"+raiseenddate.substring(6,8);
						var repaymentType=data.repaymentType;
						if(repaymentType=="1"){
							repaymentType="到期还本付息";
						}
						var interestBeginDate=data.interestBeginDate;
							interestBeginDate=interestBeginDate.substring(0,4)+"-"+interestBeginDate.substring(4,6)
												+"-"+interestBeginDate.substring(6,8);
						var interestEndDate=data.interestEndDate;
							interestEndDate=interestEndDate.substring(0,4)+"-"+interestEndDate.substring(4,6)
											+"-"+interestEndDate.substring(6,8);
						var financeUseVol=Utils.formatCurrency(data.financeUseVol, 2);
						var financeTotalAmt=Utils.formatCurrency(data.financeTotalAmt, 2);
						var financeDetail=data.financeDetail;
						var bidFee=Utils.formatCurrency(data.bidFee,2);
						var transferFee=Utils.formatCurrency(data.transferFee,2);
						var revokeFee=Utils.formatCurrency(data.revokeFee,2);
						var financeProtocol=data.financeProtocol;
						var state=data.state;
						var percent="";
						if(state=="1"){
							percent="待发售";
						}else{
							percent=((data.financeTotalAmt-data.financeUseVol)/data.financeTotalAmt*100).toFixed(1)+"%";
							if(percent=='100.0%'){
								if(financeUseVol=='0.00'){
									percent="100.0%";
								}else{
									percent="99.9%";			
								}
							}
						}
						
						var state=data.state;
						var model = {
								"financeNo":financeNo,                           
								"financeName":financeName,                         
								"financeRiskLevel":financeRiskLevel,                    
								"financePreInterestRate":financePreInterestRate,              
								"financePeriod":financePeriod,                       
								"minbuyamt":minbuyamt,                           
								"toaddamt":toaddamt,                            
								"limitamount":limitamount,                         
								"raisebegindate":raisebegindate,               
								"raiseenddate":raiseenddate,                 
								"repaymentType":repaymentType,                       
								"interestBeginDate":interestBeginDate,            
								"interestEndDate":interestEndDate,              
								"financeUseVol":financeUseVol,                       
								"financeTotalAmt":financeTotalAmt,                     
								"financeDetail":financeDetail,               
								"bidFee":bidFee,                              
								"transferFee":transferFee,                         
								"revokeFee":revokeFee,                           
								"financeProtocol":financeProtocol,
								"percent":percent,
								"state":state,
								"sysTime":data.sysTime,
								"raisebegintime":data.raisebegintime,
								"tranflag":data.tranflag
						};
						
						App.storage.set("model",model);
						App.container.show(new investDetailView({model:new Model(model)}));
						
						//刷新首页产品数据
						var saleProducts = App.storage.get("saleProducts");
						if(saleProducts){
							$.each(saleProducts.iSalePlatList,function(i,product){
								if(product.financeNo == data.financeNo){
									data.financePreInterestRate=$.trim(data.financePreInterestRate);
									saleProducts.iSalePlatList[i] = data;
								}
							});
							App.storage.set("saleProducts",saleProducts);
						}
					}
				}
			});
			
		},
		
		//立即投资
		immteInvest : function(){
			App.container.show(new immteInvestView());
		}, 	
		
		//投资记录
		investRecord : function(){
			App.container.show(new investRecordView());
		}, 
		
		//协议范本
		agreement : function(){
			App.container.show(new agreementView());
		},
		
		//项目信息
		project : function(){
			App.container.show(new projectView());
		},
		
		productAgree1 : function(){
			App.container.show(new productAgree1View());
		},
		
		productAgree2 : function(){
			App.container.show(new productAgree2View());
		},
		
		productAgree3 : function(){
			App.container.show(new productAgree3View());
		},
		
		productAgree4 : function(){
			App.container.show(new productAgree4View());
		},
		
		productAgree5 : function(){
			App.container.show(new productAgree5View());
		},
		
		productCancel : function(){
			var model = {
						orderFlowNo:App.storage.get("_parameters").orderFlowNo,
						projectNo:App.storage.get("_parameters").projectNo,
						projectName:App.storage.get("_parameters").projectName,
						tranAmt:App.storage.get("_parameters").tranAmt,
						orderSubmitTime:App.storage.get("_parameters").orderSubmitTime
				};
			App.container.show(new productCancelView({model:new Model(model)}));
		},
		
		saleHelp : function(){
			App.container.show(new saleHelpView());
		},
		
		transferBuy : function(){
			App.container.show(new transferBuyView());
		},
		
		
	});
	
});