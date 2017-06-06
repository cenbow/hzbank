define(function (require, exports, module) {
	
	var myBankCardView = require("../views/myBankCard");
	var changeCardView = require("../views/changeCard");
	var addCardView = require("../views/addCard");
	
	var myBankCardController = module.exports = Controller.extend({
		actions:{
				"myBankCard" : "myBankCard",
				"changeCard" : "changeCard",
				"addCard" : "addCard",
			},
		
		myBankCard : function(){
			var iCardList = App.storage.get("userCardList");
			if(!MUI.isEmpty(iCardList)){
				App.container.show(new myBankCardView());
			}else{
				var params={
						cardNo:Utils.getEleCard().cardNo
				};
				Ajax({url:"/cardManage/cardListQuery", data:params, 
					success:function(data){
						
						if(MUI.isEmpty(data.errorCode)){
							var iCardList=data.iCardList;
							App.storage.set("userCardList",iCardList);
							App.container.show(new myBankCardView());
						}else{
							Utils.alertinfo(data.errorMessage);
							Client.hideWaitPanel(1);
						}
						
					},
					error : function() {
						Client.hideWaitPanel();
						Utils.alertinfo("服务器异常！");
					}
				});
				
			}
			Client.menuOpt("0");
		},
		
		changeCard : function(){
			//表单初始化
			var session = App.storage.get("UserInfo");
			var param = {
					no : App.storage.get("_parameters").bindCardNo,
					userName : session.customerNameCN,
					cardNo : Utils.getEleCard().cardNo,
					balance : "0.00",
					bankList : NS.PB_BANKLIST,
			};
			
			 var balanceTem=App.storage.get("paramAccount");
			 
			 if(!MUI.isEmpty(balanceTem)&&!MUI.isEmpty(balanceTem.balance)){
				 param.balance = balanceTem.balance.replace(/,/g, "");
				 App.container.show(new changeCardView({model:new Model(param)}));
			 }else{
				 var sendStr={
						 "accountNo":Utils.getEleCard().cardNo,
						 "accountType":Utils.getEleCard().accountType
				 };
				 
				 Ajax({url:"/account/life_accountBalanceQueryAjax", data:sendStr, success:function(data){
					 if(MUI.isEmpty(data.errorCode)){
//							var balanceT = data.cd.balance;
							var balanceT = data.cd.balanceAvailable;
						 balanceT = balanceT.replace(/,/g, "");
						 param.balance = balanceT;
					 }else{
						 param.balance = "0.00";
					 }
					 App.container.show(new changeCardView({model:new Model(param)}));

				 }});
			 }
		}, 
		
		addCard : function(){
			App.container.show(new addCardView());
		},
		
	});
	
});