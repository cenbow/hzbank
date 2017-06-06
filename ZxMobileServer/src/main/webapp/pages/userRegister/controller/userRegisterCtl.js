define(function (require, exports, module) {

	var UserRegisterStep1View = require("../views/userRegisterStep1");
	var UserRegisterStep2View = require("../views/userRegisterStep2");
	var UserRegisterStep2_1View = require("../views/userRegisterStep2_1");
	var UserRegisterStep2_2View = require("../views/userRegisterStep2_2");
	var UserRegisterStep3View = require("../views/userRegisterStep3");
	var UserRegisterStep4View = require("../views/userRegisterStep4");
	var UserRegisterResultView = require("../views/userRegisterResult");
	var UserRegisterResult2View = require("../views/userRegisterResult2");
	var BatchPassWordSettingView = require("../views/batchPassWordSetting");
	var BatchPassWordSetting2View = require("../views/batchPassWordSetting2");
	var BatchPassWordSetting3View = require("../views/batchPassWordSetting3");
	
	var BatchAccResultView = require("../views/batchAccResult");
	var rechargeView = require("../views/recharge");
	
	var WxAddLoginPasswordView = require("../views/wxAddLoginPassword");
	var WxAddTransPasswordView = require("../views/wxAddTransPassword");
	var WxAddPasswordResultView = require("../views/wxAddPasswordResult");
	var ocrRegisterView = require("../views/ocrRegister");
	var ocrCreditView = require("../views/ocrCredit");
	
	var moreBankListView = require("../views/moreBankList");
	
	
	var UserRegController = module.exports = Controller.extend({
		actions:{
				"userRegisterStep1" : "userRegisterStep1",
				"userRegisterStep2" : "userRegisterStep2",
				"userRegisterStep2_1" : "userRegisterStep2_1",
				"userRegisterStep2_2" : "userRegisterStep2_2",
				"userRegisterStep3" : "userRegisterStep3",
				"userRegisterStep4" : "userRegisterStep4",
				"userRegisterResult" : "userRegisterResult",
				"userRegisterResult2" : "userRegisterResult2",
				"batchPassWordSetting" : "batchPassWordSetting",
				"batchPassWordSetting2" : "batchPassWordSetting2",
				"batchPassWordSetting3" : "batchPassWordSetting3",
				"batchAccResult" : "batchAccResult",
				"recharge" : "recharge",
				"wxAddLoginPassword" : "wxAddLoginPassword",
				"wxAddTransPassword" : "wxAddTransPassword",
				"wxAddPasswordResult" : "wxAddPasswordResult",
				"ocrRegister" : "ocrRegister",
				"ocrCredit" : "ocrCredit",
				"moreBankList" : "moreBankList"

			},
        userRegisterStep1 : function(){
        	Client.menuOpt("0");
        	if(!MUI.isEmpty(App.storage.get("_parameters"))){
        		param = {
        				mobileNo:Utils.nvl(App.storage.get("_parameters").mobileNo,""),
        				recommendNum:Utils.nvl(App.storage.get("_parameters").recommendNum,""),        				
        				};        		
        	}else{
        		param = {
        				mobileNo:"",
        				recommendNum:"",
        				};     		
        	}
        	App.container.show(new UserRegisterStep1View({model : new Model(param)}));
        },

        userRegisterStep2 : function(){
        	var param = App.storage.get("_parameters");
        	param.userName = Utils.nvl(App.storage.get("_parameters").userName,"");
        	param.certNo = Utils.nvl(App.storage.get("_parameters").certNo,"");
        	param.bankName = Utils.nvl(App.storage.get("_parameters").bankName,"");
        	param.bankType = Utils.nvl(App.storage.get("_parameters").bankType,"");
        	param.bindCardNo = Utils.nvl(App.storage.get("_parameters").bindCardNo,"");
        	param.cardType = Utils.nvl(App.storage.get("_parameters").cardType,"");
        	param.bankUrlClass = Utils.nvl(App.storage.get("_parameters").bankUrlClass,"");
        	param.bankList = NS.PB_BANKLIST;
        	
        	var iBankInfo = App.storage.get("iBankInfo");
        	var params = {
        			actionFlag:"01"
        	};
        	if(!iBankInfo){
        		Ajax({ url: "/bank/queryBankInfo", data:params, success: function(data){
						if(Utils.isEmpty(data.errorCode)){
							iBankInfo = data.iBankInfo;
							App.storage.set("iBankInfo",iBankInfo);
							param.iBankInfo = iBankInfo;
						}else{
							param.iBankInfo = [];
						}
						App.container.show(new UserRegisterStep2View({model : new Model(param)}));
					},
					error:function(){
						param.iBankInfo = [];
						App.container.show(new UserRegisterStep2View({model : new Model(param)}));
					}
	        	});
        	}else{
        		param.iBankInfo = iBankInfo;
        		App.container.show(new UserRegisterStep2View({model : new Model(param)}));
        	}
        },
        
        userRegisterStep2_1 : function(){
        	var param = App.storage.get("_parameters");
        	param.userName = Utils.nvl(App.storage.get("_parameters").userName,"");
        	param.certNo = Utils.nvl(App.storage.get("_parameters").certNo,"");
        	
        	App.container.show(new UserRegisterStep2_1View({model : new Model(param)}));
        },
        
        userRegisterStep2_2 : function(){
        	var param = App.storage.get("_parameters");
        	param.userName = Utils.nvl(param.userName,"");
        	param.certNo = Utils.nvl(param.certNo,"");
        	param.bankName = Utils.nvl(param.bankName,"");
        	param.bankType = Utils.nvl(param.bankType,"");
        	param.bindCardNo = Utils.nvl(param.bindCardNo,"");
        	param.cardType = Utils.nvl(param.cardType,"");
        	param.bankUrlClass = Utils.nvl(param.bankUrlClass,"");
        	
        	param.profession_g = Utils.nvl(param.profession_g,"");
        	param.jobInfo_g = Utils.nvl(param.jobInfo_g,"");
        	param.bankList = NS.PB_BANKLIST;
        	
        	var iBankInfo2 = App.storage.get("iBankInfo2");
        	var params = {
        			actionFlag:"01"
        	};
        	if(!iBankInfo2){
        		Ajax({ url: "/bank/queryBankInfo", data:params, success: function(data){
						if(Utils.isEmpty(data.errorCode)){
							iBankInfo = data.iBankInfo;
							param.iBankInfo = iBankInfo;
							var len = iBankInfo.length;
							for(var i=0;i<len;i++){
								iBankInfo[i].bankIconUrl = iBankInfo[i].bankIconUrl.split("_")[1];
							}
							param.iBankInfo2 = iBankInfo;
						}else{
							param.iBankInfo = [];
							param.iBankInfo2 = [];
						}
						App.storage.set("iBankInfo2",param.iBankInfo2);
						App.container.show(new UserRegisterStep2_2View({model : new Model(param)}));
					},
					error:function(){
						param.iBankInfo = [];
						param.iBankInfo2 = [];
						App.container.show(new UserRegisterStep2_2View({model : new Model(param)}));
					}
	        	});
        	}else{
        		param.iBankInfo2 = iBankInfo2;
        		App.container.show(new UserRegisterStep2_2View({model : new Model(param)}));
        	}
        	    
        },
        
        userRegisterStep3 : function(){
        	App.container.show(new UserRegisterStep3View({model : new Model()}));
        },

        userRegisterStep4 : function(){
        	App.container.show(new UserRegisterStep4View({model : new Model()}));
        },

        userRegisterResult : function(){
        	var param = App.storage.get("_parameters");
        	App.container.show(new UserRegisterResultView({model : new Model(param)}));
        },

        userRegisterResult2 : function(){
        	App.container.show(new UserRegisterResult2View({model : new Model()}));
        },
        
        batchPassWordSetting : function(){
			var param = App.storage.get("_parameters");
        	App.container.show(new BatchPassWordSettingView({model:new Model(param)}));
        },
        
        batchPassWordSetting2 : function(){
        	App.container.show(new BatchPassWordSetting2View());
        },
        
        batchPassWordSetting3 : function(){
        	App.container.show(new BatchPassWordSetting3View());
        },
        
        batchAccResult : function(){
        	App.container.show(new BatchAccResultView());
        },
        
        
    	wxAddLoginPassword:function(){
        	App.container.show(new WxAddLoginPasswordView());
        },
        wxAddTransPassword:function(){
        	App.container.show(new WxAddTransPasswordView());
        },
        wxAddPasswordResult:function(){
        	App.container.show(new WxAddPasswordResultView());
        },
        
        
        recharge : function(){
			var iCardList = App.storage.get("userCardList");
			if(MUI.isEmpty(iCardList)){
				  var params={
						  cardNo:Utils.getEleCard().cardNo
				  };
				  Ajax({url:"/cardManage/cardListQuery", data:params, 
					  success:function(data){
						  
						  if(MUI.isEmpty(data.errorCode)){
								  var iCardList=data.iCardList;			
							  		App.storage.set("userCardList",iCardList);
									App.container.show(new rechargeView());
						  }else{
						  		Utils.alertinfo(data.errorMessage);
						  }
					  }
				  });
			}else{
				App.container.show(new rechargeView());
			}
        },
        
        ocrCredit : function(){
        	Client.menuOpt("0");
			//初始化菜单方法
			var pageStep1 = {
				title:'身份信息补录',
				leftButton:{
       				name : '返回',
       				func : 'curView.goBack()'
       			}
			};
			Client.initPageTitle(pageStep1);
			App.container.show(new ocrCreditView());
        },
        
        ocrRegister : function(){
        	Client.menuOpt("0");
			//初始化菜单方法
			var pageStep1 = {
				title:'注册',
				leftButton:{
       				name : '返回',
       				func : 'curView.goBack()'
       			}
			};
			Client.initPageTitle(pageStep1);
			App.container.show(new ocrRegisterView());
        },
        
        moreBankList : function(){
        	App.container.show(new moreBankListView());
        }
        
	});
	
});