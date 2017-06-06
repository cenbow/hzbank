define(function(require, exports, module){
	
	var safeGradeUpTwoTpl = require("text!../template/safeGradeUpTwo.html");
	
	var safeGradeUpTwoView = module.exports = ItemView.extend({
		
		template : safeGradeUpTwoTpl,
		
		events : {
			"click #faceCheck" : "faceCheck",
			"click #back1,#back2" : "goBack"
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
			this.param={};
			this.param.userName = App.storage.get("UserInfo").customerNameCN;
			this.param.certNo = App.storage.get("UserInfo").certNo;
			this.param.transType = "11"; //提升等级
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
				this.makeSure();
			}else{
				this.param.msg = "人脸验证未通过,请重试";
				this.param.res = "fail";
				Utils.alertinfo(this.param.msg);
			}
		},
		
		
		makeSure : function(){
			var UserInfo = App.storage.get("UserInfo");
			var iCardInfo = UserInfo.iCardInfo;
    		var param = {
    				certNo:UserInfo.certNo,
    				faceFlag:"0",
    				cardNo:iCardInfo[0].cardNo,
    				accountType : iCardInfo[0].accountType
    		};
    		Client.openWaitPanel("加载中");
    		Ajax({url:"/pubServer/FaceVerificationCheck",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var UserInfo = App.storage.get("UserInfo");
    				UserInfo.userType = "02";
    				UserInfo.isFace = "01";
    				App.storage.set("UserInfo",UserInfo);
    				App.navigate("settings/setCenterCtl/safeGradeResult");
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
    			Client.hideWaitPanel(1);
    		}});
		},
	
	});
});
