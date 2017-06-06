define(function(require, exports, module){
	
	var setCenterView = require("../views/setCenter");
//	var logonPasswordResetView = require("../views/logon_password_reset");
	var logonPasswordReset1View = require("../views/logon_password_reset1");
	var logonPasswordReset2View = require("../views/logon_password_reset2");
	var transactionPwdResetOneView = require("../views/transactionPwdResetOne");
	var transactionPwdResetTwoView = require("../views/transactionPwdResetTwo");
	var elecAccPwdModView = require("../views/elecAccPwdMod");
	var loginPwdModView = require("../views/loginPwdMod");
	var activateView = require("../views/activate");
	var fingerView = require("../views/finger");
	var activateSuccessView = require("../views/activateSuccess");
	var securityView = require("../views/security");
	var faceDistinguishView = require("../views/faceDistinguish");
	var elecAccPwdResetView = require("../views/elecAccPwdReset");
	var elecAccPwdResetTwoView = require("../views/elecAccPwdResetTwo");
	var elecAccPwdResetThreeView = require("../views/elecAccPwdResetThree");	
	var elecAccPwdResetQueryView = require("../views/elecAccPwdResetQuery");
	var tranPwdManageView = require("../views/tranPwdManage");
	var handView = require("../views/hand");
	var safeGradeView = require("../views/safeGrade");
	var safeGradeResultView = require("../views/safeGradeResult");
	var safeGradeUpOneView = require("../views/safeGradeUpOne");
	var safeGradeUpTwoView = require("../views/safeGradeUpTwo");
	var elecAccPwdFindView = require("../views/elecAccPwdFind");
	var elecAccPwdFindResultView = require("../views/elecAccPwdFindResult");
	var elecAccPwdFindOneView = require("../views/elecAccPwdFindOne");
	var elecAccPwdFindTwoView = require("../views/elecAccPwdFindTwo");
	var elecAccPwdFindThreeView = require("../views/elecAccPwdFindThree");
	var faceRecognitionView = require("../views/faceRecognition");
	var realNameView = require("../views/realName");
	var setCenterController = module.exports = Controller.extend({
		
		actions:{
			"setCenter":"setCenter",
//			"logonPasswordReset":"logonPasswordReset",
			"logonPasswordReset1":"logonPasswordReset1",
			"logonPasswordReset2":"logonPasswordReset2",
			"transactionPwdResetOne":"transactionPwdResetOne",
			"transactionPwdResetTwo":"transactionPwdResetTwo",
			"elecAccPwdMod":"elecAccPwdMod",
			"loginPwdMod":"loginPwdMod",
			"activate" : "activate",
			"finger" : "finger",
			"activateSuccess" : "activateSuccess",
			"security" : "security",
			"faceDistinguish" : "faceDistinguish",
			"elecAccPwdReset":"elecAccPwdReset",
			"elecAccPwdResetTwo":"elecAccPwdResetTwo",
			"elecAccPwdResetThree":"elecAccPwdResetThree",
			"elecAccPwdResetQuery":"elecAccPwdResetQuery",
			"tranPwdManage":"tranPwdManage",
			"hand":"hand",
			"safeGrade":"safeGrade",
			"safeGradeResult":"safeGradeResult",
			"safeGradeUpOne":"safeGradeUpOne",
			"safeGradeUpTwo":"safeGradeUpTwo",
			"elecAccPwdFind":"elecAccPwdFind",
			"elecAccPwdFindResult":"elecAccPwdFindResult",
			"elecAccPwdFindOne":"elecAccPwdFindOne",
			"elecAccPwdFindTwo":"elecAccPwdFindTwo",
			"elecAccPwdFindThree":"elecAccPwdFindThree",
			"faceRecognition" : "faceRecognition",
			"realName":"realName"
		},
		
		setCenter : function(){
			Client.menuOpt("3");
			App.container.show(new setCenterView());
		},
//		logonPasswordReset : function(){
//			App.container.show(new logonPasswordResetView());
//		},
		logonPasswordReset1 : function(){
			App.container.show(new logonPasswordReset1View());
		},
		logonPasswordReset2 : function(){
			App.container.show(new logonPasswordReset2View());
		},
		transactionPwdResetOne : function(){
			App.container.show(new transactionPwdResetOneView());
		},
		transactionPwdResetTwo : function(){
			App.container.show(new transactionPwdResetTwoView());
		},
		elecAccPwdMod : function(){
			App.container.show(new elecAccPwdModView());
		},
		loginPwdMod : function(){
			App.container.show(new loginPwdModView());
		},
		activate : function(){
			App.container.show(new activateView({model:new Model()}));
		},
		finger : function(){
			App.container.show(new fingerView({model:new Model()}));
		},
		activateSuccess : function(){
			App.container.show(new activateSuccessView({model:new Model()}));
		},
		security : function(){
			var pageStep1 = {
				  	title:'安全中心',
					leftButton:{
						name : '返回',
						func: 'curView.goBack()'
					},
					rightButton:{
						name : '帮助',
						func : 'curView.help()'
					}
			  };
			 Client.initPageTitle(pageStep1);

			Client.menuOpt("3");
			App.container.show(new securityView());
		},
		
		faceDistinguish :function(){
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
//			var model = App.storage.get("_parameters");
			App.container.show(new faceDistinguishView());
		},
		elecAccPwdReset : function(){
			App.container.show(new elecAccPwdResetView());
		},
		elecAccPwdResetTwo : function(){
			App.container.show(new elecAccPwdResetTwoView());
		},
		elecAccPwdResetThree : function(){
			App.container.show(new elecAccPwdResetThreeView());
		},
		elecAccPwdResetQuery : function(){
			App.container.show(new elecAccPwdResetQueryView());
		},
		tranPwdManage : function(){
			App.container.show(new tranPwdManageView());
		},
		
		hand : function(){
			App.container.show(new handView());
		},
		
		safeGrade : function(){
			App.container.show(new safeGradeView());
		},
		
		safeGradeResult : function(){
			App.container.show(new safeGradeResultView());
		},
		
		safeGradeUpOne : function(){
			Client.menuOpt("0");
			var UserInfo = App.storage.get("UserInfo");
			var param = {
					customerNameCN : UserInfo.customerNameCN,
					certNo : UserInfo.certNo
			};
			App.container.show(new safeGradeUpOneView({model : new Model(param)}));
		},
		
		safeGradeUpTwo : function(){
			App.container.show(new safeGradeUpTwoView());
		},
		
		elecAccPwdFind : function(){
			App.container.show(new elecAccPwdFindView());
		},
		
		elecAccPwdFindOne : function(){
			App.container.show(new elecAccPwdFindOneView());
		},
		
		elecAccPwdFindTwo : function(){
			App.container.show(new elecAccPwdFindTwoView());
		},
		
		elecAccPwdFindThree : function(){
			App.container.show(new elecAccPwdFindThreeView());
		},
		
		elecAccPwdFindResult : function(){
			App.container.show(new elecAccPwdFindResultView());
		},
		
		faceRecognition : function(){
			Client.menuOpt("0");
			var pageTest = {
				  	title:'人脸检测',
					leftButton:{
						name : '返回',
						func :'App.back()'
					}
			  };
			Client.initPageTitle(pageTest);
			App.container.show(new faceRecognitionView());
		},
		
		realName : function(){
			Client.menuOpt("0");
			var UserInfo = App.storage.get("UserInfo");
			var param = {
					customerNameCN : UserInfo.customerNameCN,
					certNo : UserInfo.certNo
			};
			App.container.show(new realNameView({model : new Model(param)}));
		},
	});
});