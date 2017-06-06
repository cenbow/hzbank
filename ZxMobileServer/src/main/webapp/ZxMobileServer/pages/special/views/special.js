define(function(require, exports, module){
	
	var specialTpl = require("text!../template/special.html");
	
	var specialView = module.exports = ItemView.extend({
		
		events : {
			"click #pwd" : "pwd",
			"click #cardChage" : "cardChage",
			"click #cardActive" : "cardActive",
			"click #financeSign" : "financeSign",
			"click #hce" : "hce",
			"click .i" : "upgrade",
			"click .e,.f,.g" : "tips"
		},
		
		template : specialTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			
			if(Device.os!="android"){
				$("#hce").addClass("disabled");
			}
		    Client.hideWaitPanel(1);
		},
		
		goBack : function(){
    			App.back();
		},
		
		cardChage : function(){
			Utils.alertinfo("敬请期待");
			//App.navigate("special/specialCtl/prompt?type=cardChage");
		},
		
		financeSign : function(){
			Utils.alertinfo("敬请期待");
			//暂时注释
			/*if(!Utils.checkSession()){
				Client.toLogin("curView.financeSign()");
				return;
			}
			if(!Utils.checkRealUser("1")){
				Utils.alertinfo("您当前是游客身份，请先完成实名认证");
	        	return;
			}
			if(App.storage.get("UserInfo").financeCustomerId){
				App.navigate("special/specialCtl/signed");
				return;
			}
			App.navigate("special/specialCtl/prompt?type=financeSign");*/
		},
		
		cardActive : function(){
			Utils.alertinfo("敬请期待");
			//暂时注释
			//App.navigate("special/specialCtl/prompt?type=cardActive");
		},
		
		tips : function(){
			Utils.alertinfo("敬请期待");
		},
		
		pwd : function(){
			Utils.alertinfo("敬请期待");
			//暂时注释
			//App.navigate("special/specialCtl/prompt?type=changeCardPwd");
		},
		
		hce : function(){
			if(Device.os=="android"){
				if(Utils.checkSession()){
					if(App.storage.get("UserInfo").userType=="02"){
		   				var param = {};
		   				Ajax({url:"/HCEServer/getTalking", data:param, success:function(data){
		   					Client.hideWaitPanel(1);
		   					if(data.errorCode == 0){
		   						var randomKey = data.randomKey;
		   						if(pubParam.clientVersion >= '2.0.8'){
									Client.sendHCERandomKey(randomKey);
		   						}else{
		   							Client.updateVersion();
		   						}
		   					}else{
		   						Utils.alertinfo(data.errorMessage);
		   					}   
		   				}});
		   			}else{
		   				Client.alertinfo("您的安全等级为中,请尽快提升等级获取更多服务!","提醒","curView.gotoUpdate()",true);
		   			}
				}else{
					Client.toLogin("curView.hce()");
				}
			}else{
				Utils.alertinfo("敬请期待");
			}
		},
		
		gotoUpdate : function(){
			App.navigate("settings/setCenterCtl/safeGrade");
		},
		
		upgrade : function(){
			Utils.alertinfo("敬请期待");
			//暂时注释
			/*if(!Utils.checkSession()){
				Client.toLogin("curView.upgrade()");
				return;
			}
			if(!Utils.checkRealUser("1")){
				Utils.alertinfo("您当前是游客身份，请先完成实名认证");
	        	return;
			}
			var sessionInfo = App.storage.get("UserInfo");
			if(sessionInfo.userType=="02"){
				Utils.alertinfo("您已经完成账户升级");
	        	return;
			}
			App.navigate("special/specialCtl/prompt?type=upgrade");*/
		}
	
	});
});
