define(function(require, exports, module){
	
	var faceRecognitionTpl = require("text!../template/faceRecognition.html");
	
	var faceRecognitionView = module.exports = ItemView.extend({
		
		events : {
			"click #faceCheck" : "faceCheck",
			"click #back1,#back2" : "goBack",
//			"click #back2" : "goBack2"
		},
		
		template : faceRecognitionTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			Client.hideWaitPanel(1);
			this.param={};
			this.param.userName = App.storage.get("UserInfo").customerNameCN;
			this.param.certNo = App.storage.get("UserInfo").certNo;
			this.param.transType = "11"; //提升等级
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
		

		goBack : function(){
			App.back();
		},
		
//		goBack2 : function(){
//			$("#success").hide();
//			$("#new2016").show();
//			$("#fail").hide();
//		},
		
		
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
//				$("#success").hide();
//				$("#new2016").hide();  
//				$("#fail").show();
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
					$("#success").show();
					$("#new2016").hide();
					$("#fail").hide();
					var UserInfo = App.storage.get("UserInfo");
    				if(UserInfo.batchNo !=null && UserInfo.batchNo.length > 0){
    					UserInfo.userType = "02";
    				}
    				UserInfo.isFace = "01";
    				App.storage.set("UserInfo",UserInfo);
    			}else{
    				$("#success").hide();
					$("#new2016").hide();
					$("#fail").show();
    			}
    			Client.hideWaitPanel(1);
    		}});
		},
	
	});
});
