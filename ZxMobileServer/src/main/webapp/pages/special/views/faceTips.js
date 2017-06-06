define(function(require, exports, module){
	
	var faceTipsTpl = require("text!../template/faceTips.html");
	
	var faceTipsView = module.exports = ItemView.extend({
		
		events : {
			"click #faceCheck" : "faceCheck"
		},
		
		template : faceTipsTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			Client.hideWaitPanel(1);
		},
		
		faceCheck : function(){
			this.param = App.storage.get("_parameters");
			this.param.step3 = this.param.action;
			Client.facePlusCheck(this.param,"curView.faceCheckRes");
		},

		cancel : function(){
			Client.menuOpt("5");
			var index = App.browseList.indexOf("special/specialCtl/special");
    	  	App.browseList.splice(1,index-1);
			App.back();
		},
		
		faceCheckRes : function(msg){
			var obj = msg.split("@");
			var res = obj[0];
			Client.hideWaitPanel(1);
			if (res.indexOf("审核已通过") >= 0) {
				this.param.msg = "您的身份识别成功！";
				this.param.res = "success";
			}else{
				this.param.msg = (res||"未识别成功")+ ",请返回重试";
				this.param.res = "fail";
			}
			App.navigate("special/specialCtl/result",this.param);
		}
	
	});
});
