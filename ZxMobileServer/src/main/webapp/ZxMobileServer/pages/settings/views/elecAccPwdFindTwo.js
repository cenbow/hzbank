define(function(require, exports, module){
	
	var elecAccPwdFindTwoTpl = require("text!../template/elecAccPwdFindTwo.html");
	var elecAccPwdFindTwoView = module.exports = ItemView.extend({
		
	template : elecAccPwdFindTwoTpl,
	
	events:{
		"click #faceCheck" : "faceCheck"
	},
	initialize : function(){
		var pageStep1 = {
			  	title:'找回交易密码',
				leftButton:{
					name : '返回',
					func: 'curView.goBack()'
				}
		  };
		Client.initPageTitle(pageStep1);
		this.param={};
		this.param.userName = App.storage.get("UserInfo").customerNameCN;
		this.param.certNo = App.storage.get("UserInfo").certNo;
		this.param.transType = "12"; //找回交易密码
		
		
	    Client.hideWaitPanel(100);
		 
	},

	goBack : function(){
		App.back();
	},
	
	
	
	
	faceCheck : function(){
		this.submit();
	},
	
	submit : function(){
		Client.openWaitPanel("");
		var param = {
				transType : "01",
				userName : App.storage.get("UserInfo").customerNameCN,
				certNo : App.storage.get("UserInfo").certNo
		};
		var $this = this;
		Ajax({url:"/faceCheck/idCardInputCheckFacePlus", data:param, success:function(data){
			if(MUI.isEmpty(data.errorCode)){
				var orderResult = data.orderResult;
				if(orderResult=="00"){
					Client.facePlusCheck($this.param,"curView.faceCheckRes");
				}else{
					Utils.alertinfo(data.errorMessage);
				}
			}else{
				Utils.alertinfo(data.errorMessage);
			}
			Client.hideWaitPanel(1);
		}});
	},
	
	
	faceCheckRes : function(msg){
		var obj = msg.split("@");
		var res = obj[0];
		Client.hideWaitPanel(1);
		if (res == '00') {
			this.param.msg = "您的身份识别成功！";
			this.param.res = "success";
			this.param.random2 = App.storage.get("_parameters").random2;
			App.navigate("settings/setCenterCtl/elecAccPwdFindThree",this.param);
		}else{
			this.param.msg = "人脸验证未通过,请返回重试";
			this.param.res = "fail";
			Utils.alertinfo(msg);
		}
	},
	
	
	});
});
