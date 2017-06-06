define(function(require, exports, module){
	
	var facecheckTpl = require("text!../template/facecheck.html");
	
	var FacecheckView = module.exports = ItemView.extend({
		
		events : {
			"click #faceCheck" : "faceCheck"
		},
		
		template : facecheckTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			  var pageTest = {
	    			  	title:'贷款申请',
	    				leftButton:{
	    					name : '返回',
	    					func :'App.back()'
	    				},
	    				rightButton : {
	    					name : '取消',
	    					func : 'curView.cancel()'
	    				}
	    		  }
	    		Client.initPageTitle(pageTest);
	    	    Client.hideWaitPanel(10);
		
		    this.param = App.storage.get("_parameters");	

		},
		cancel : function(){
			
			var index = App.browseList.indexOf("houseloan/houseloanCtl/loanCenter");
    	  	App.browseList.splice(1,index-1);
			App.back();
			
		},
		
		
		faceCheck : function(){
			this.param = App.storage.get("_parameters");
			this.param.faceType = "1";   //(1:申请；2：进度查询);
		//	this.param.step3 = this.param.action;
			Client.facePlusCheck(this.param,"curView.faceCheckRes");
		},

		
		faceCheckRes : function(msg){
			var obj = msg.split("@");
			var res = obj[0];
			Client.hideWaitPanel(1);
			if (res == '00') {
				this.param.msg = "您的身份识别成功！";
				this.param.res = "success";
			}else{
				this.param.msg = "人脸验证未通过,请返回重试";
				this.param.res = "fail";
			}
			App.navigate("houseloan/houseloanCtl/result",this.param);
		}
	
	});
});
