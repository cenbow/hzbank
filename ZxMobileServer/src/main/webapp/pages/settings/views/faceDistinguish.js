define(function(require, exports, module){
	
	var faceDistinguishTpl = require("text!../template/faceDistinguish.html");
	
	var faceDistinguishView = module.exports = ItemView.extend({
		
		events : {
			"click #faceCheck" : "faceCheck"
		},
		
		template : faceDistinguishTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			Client.hideWaitPanel(1);
		},
		
		faceCheck : function(){
			this.checkRandom();
		},
		
		checkRandom : function(){
			var certNo = App.storage.get("param").certNo;
			var random =  App.storage.get("userInfo").random;
			var param = {
					 random:random,
					 certNo:certNo
			 };
			 Ajax({url:"/pubServer/resetTransactionPwd2", data:param, success:function(data){
				 if(MUI.isEmpty(data.errorCode)){
					 var random3 = data.cd.random3;
					 var userRandom={
							 random3:random3
					 };
					 App.storage.set("userRandom",userRandom);
					 this.param = App.storage.get("_parameters");
					 Client.facePlusCheck(this.param,"curView.faceCheckRes");
				 }else{
					 Utils.alertinfo(data.errorMessage);
				 };
			}});
		},

		cancel : function(){
			App.back();
		},
		
		faceCheckRes : function(msg){
			var obj = msg.split("@");
			var res = obj[0];
			if (res.indexOf("审核已通过") >= 0) {
				msg = "您的身份识别成功！";
				res = "success";
				App.navigate("settings/setCenterCtl/transactionPwdResetTwo");
			}else{
				msg = (res||"未识别成功")+ ",请重试";
				res = "fail";
				Utils.alertinfo(msg);
			}
		}
	
	});
});
