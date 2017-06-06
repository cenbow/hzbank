define(function(require, exports, module){
	
	var safeGradeTpl = require("text!../template/safeGrade.html");
	
	var safeGradeView = module.exports = ItemView.extend({
		
		template : safeGradeTpl,
		
		events : {
			"click #finger" : "openFinger",
			"click #safeUp" : "goSafeUp"
		},
		
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    var pageTest = {
				  	title:'安全等级',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			  };
			Client.initPageTitle(pageTest);
			var UserInfo = App.storage.get("UserInfo");
			var userType = UserInfo.userType;
			if(userType=="01"){
				$("#low").show();
				$("#high").hide();
			}else{
				$("#low").hide();
				$("#high").show();
			}
			 
		    Client.hideWaitPanel(100);
		},
		
		goSafeUp : function(){//判断是否需要做实名认证和人脸认证
			/**
			 * 1.实名认证没有做,人脸认证没有做,直接跳到safeGradeUpOne页面往下做
			 * 2.实名认证和人脸认证都做了,则直接显示安全等级为高.无需再操作
			 * 3.实名认证做了,人脸认证没有做.直接跳到safeGradeUpTwo页面做人脸认证.
			 * 4.实名认证没有做,人脸认证做了.只需要跳到safeGradeUpOne页面做实名认证.
			 */
			var batchNo = App.storage.get("UserInfo").batchNo;
			if(batchNo=="" || batchNo==null){
				App.navigate("settings/setCenterCtl/safeGradeUpOne");
			}else{
				App.navigate("settings/setCenterCtl/safeGradeUpTwo");
			}
		},
		
		 
		goBack : function(){
			App.back();
		}
	
	});
});
