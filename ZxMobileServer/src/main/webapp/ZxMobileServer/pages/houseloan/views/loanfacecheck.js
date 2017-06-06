define(function(require, exports, module){
	
	var loanfacecheckTpl = require("text!../template/loanfacecheck.html");
	
	var loanfacecheckView = module.exports = ItemView.extend({
		
		events : {
			"click #faceCheck" : "faceCheck"
		},
		
		template : loanfacecheckTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			  var pageTest = {
	    			  	title:'贷款进度查询',
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
		//	this.param.step3 = this.param.action;
			this.param.faceType = "2";
			Client.facePlusCheck(this.param,"curView.faceCheckRes");
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
			App.navigate("houseloan/houseloanCtl/queryresult",this.param);
		}
	
	});
});
