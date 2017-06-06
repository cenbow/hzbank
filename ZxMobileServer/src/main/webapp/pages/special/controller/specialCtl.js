define(function(require, exports, module){
	
	var specialView = require("../views/special");
	var facecheckView = require("../views/facecheck");
	var changeCardPwdView = require("../views/changeCardPwd");
	var cardActiveView = require("../views/cardActive");
	var cardCheckView = require("../views/cardCheck");
	var bankNodeView = require("../views/bankNode");
	var changeCardView = require("../views/changeCard");
	var financeRiskReqView = require("../views/financeRiskReq");
	var financeSignView = require("../views/financeSign");
	var agreementView = require("../views/agreement");
	var signedView = require("../views/signed");
	var promptView = require("../views/prompt");
	var ocrResultView = require("../views/ocrResult");
	var faceTipsView = require("../views/faceTips");
	var resultView = require("../views/result");
	var upgradeView = require("../views/upgrade");
	
	var specialController = module.exports = Controller.extend({
		
		actions:{
			"special":"special",
			"facecheck":"facecheck",
			"changeCardPwd":"changeCardPwd",
			"cardActive" : "cardActive",
			"cardCheck" : "cardCheck",
			"bankNode" : "bankNode",
			"changeCard" : "changeCard",
			"financeRiskReq":"financeRiskReq",
			"financeSign" : "financeSign",
			"agreement" : "agreement",
			"signed" : "signed",
			"prompt" : "prompt",
			"ocrResult":"ocrResult",
			"faceTips":"faceTips",
			"result":"result",
			"upgrade":"upgrade"
		},
		
		special : function(){
			Client.menuOpt("4");
			var pageTest = {
				  	title:'自助服务',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			  }
			Client.initPageTitle(pageTest);
			App.container.show(new specialView());
		},
		
		facecheck : function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'身份验证',
					leftButton:{
						name : '返回',
						func :'App.back()'
					},
					rightButton:{
						name : '取消',
						func :'curView.cancel()'
					}
			 };
			Client.initPageTitle(pageTest);
			var model = App.storage.get("_parameters");
			App.container.show(new facecheckView({model:new Model(model)}));
		},
		
		cardActive : function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'卡片激活',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : '取消',
						func :'curView.cancel()'
					}
			 };
			Client.initPageTitle(pageTest);
			var model = App.storage.get("_parameters");
			App.container.show(new cardActiveView({model:new Model(model)}));
		},
		
		changeCardPwd:function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'密码重置修改',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : '取消',
						func :'curView.cancel()'
					}
			 };
			Client.initPageTitle(pageTest);
			var model = App.storage.get("_parameters");
			App.container.show(new changeCardPwdView({model:new Model(model)}));
		},
		
		cardCheck : function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'卡密验证',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : '取消',
						func :'curView.cancel()'
					}
			 };
			Client.initPageTitle(pageTest);
			App.container.show(new cardCheckView());
		},
		
		bankNode : function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'网点选择',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : '取消',
						func :'curView.cancel()'
					}
			  }
			Client.initPageTitle(pageTest);
			App.container.show(new bankNodeView());
		},
		
		changeCard : function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'同卡号换卡申请',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : '取消',
						func :'curView.cancel()'
					}
			  };
			Client.initPageTitle(pageTest);
			var model = App.storage.get("_parameters");
			_.extend(model,App.storage.get("nodeInfo"));
			App.container.show(new changeCardView({model:new Model(model)}));
		},
		
		financeRiskReq : function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'风险测评',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : '取消',
						func :'curView.cancel()'
					}
			  };
			Client.initPageTitle(pageTest);
			App.container.show(new financeRiskReqView());
			
		},
		
		financeSign : function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'理财签约',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : '取消',
						func :'curView.cancel()'
					}
			  };
			Client.initPageTitle(pageTest);
			var model = App.storage.get("_parameters");
			App.container.show(new financeSignView({model:new Model(model)}));
		},
		
		agreement : function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'理财签约电子协议',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : '取消',
						func :'curView.cancel()'
					}
			  };
			Client.initPageTitle(pageTest);
			App.container.show(new agreementView());
		},
		
		signed :function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'理财签约',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			  };
			Client.initPageTitle(pageTest);
			App.container.show(new signedView());
		},
		
		prompt :function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'身份认证',
					leftButton:{
						name : '返回',
						func :'App.back()'
					},
					rightButton:{
						name : '取消',
						func :'curView.cancel()'
					}
			  };
			Client.initPageTitle(pageTest);
			App.container.show(new promptView());
		},
		
		ocrResult :function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'身份认证',
					leftButton:{
						name : '返回',
						func :'App.back()'
					},
					rightButton:{
						name : '取消',
						func :'curView.cancel()'
					}
			  };
			Client.initPageTitle(pageTest);
			var model = App.storage.get("_parameters");
			App.container.show(new ocrResultView({model:new Model(model)}));
		},
		
		faceTips :function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'人脸检测',
					leftButton:{
						name : '返回',
						func :'App.back()'
					},
					rightButton:{
						name : '取消',
						func :'curView.cancel()'
					}
			  };
			Client.initPageTitle(pageTest);
			var model = App.storage.get("_parameters");
			App.container.show(new faceTipsView({model:new Model(model)}));
		},
		
		result :function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'人脸检测',
					leftButton:{
						name : '返回',
						func :'App.back()'
					},
					rightButton:{
						name : '取消',
						func :'curView.cancel()'
					}
			  };
			Client.initPageTitle(pageTest);
			var model = App.storage.get("_parameters");
			App.container.show(new resultView({model:new Model(model)}));
		},
		
		upgrade :function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'账户升级',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			  };
			Client.initPageTitle(pageTest);
			App.container.show(new upgradeView());
		}
		
	});
});