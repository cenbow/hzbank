define(function(require, exports, module){
	
	var elecAccPwdResetTwoTpl = require("text!../template/elecAccPwdResetTwo.html");
	
	var elecAccPwdResetTwoView = module.exports = ItemView.extend({
		
	template : elecAccPwdResetTwoTpl,
	
	events:{
		"click #a" : "getPhotoA",
		"click #b" : "getPhotoB",
		"click #c" : "getPhotoC",
		"click #submitBtn":"submit"
	},
	initialize : function(){
		var pageStep1 = {
			  	title:'身份证上传',
				leftButton:{
					name : '返回',
					func: 'curView.goBack()'
				}
		  };
		 Client.initPageTitle(pageStep1);
		 Client.hideWaitPanel();
		 this.param = {};

	},

	 //验证输入信息
	 checkButton1:function(){
		  (!MUI.isEmpty(this.param.photoImage1)&&!MUI.isEmpty(this.param.photoImage2)&&!MUI.isEmpty(this.param.photoImage3)) ?
				    $("#submitBtn").removeClass('disabled').removeAttr('disabled') : $("#submitBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
	  },

	  //提交
	  submit:function(){ //为提交按钮绑定提交事件
			if($("#submitBtn").attr('disabled')){ //确定按钮可点击	
				return;
			}
    		var paramValue = App.storage.get("_parameters");//响应

			this.param.applyNo = paramValue.applyNo;
			this.param.certNo = paramValue.certNo;
			this.param.actionFlag = "2";

			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/pubServer/resetTransPwdTwo", data:this.param, success:function(data){
				Client.hideWaitPanel();
				 if(MUI.isEmpty(data.errorCode)){
					 App.navigate("settings/setCenterCtl/elecAccPwdFindResult");
//				     Client.alertinfo("交易密码重置申请成功","提醒","curView.gotoSetCenter()");
				 }else{
			    	Utils.alertinfo(data.errorMessage);	
				 }
			},error:function(){
				Client.hideWaitPanel();
    		}}); 
 
		  },
		gotoSetCenter:function(){
    		App.back(2);
		},

		goBack : function(){
			App.back();
		},
		
		getPhotoA : function() {
			Client.imageUpdate("curView.gotoPhotoA");
		},
		
		gotoPhotoA : function(obj) {
			var html = '<img src="data:image/png;base64,'+obj.fileData+'" width="100%" height="100%">';
			$("#a").html(html);
			this.param.photoImage1 = obj.fileUrl;
			this.checkButton1();
			Client.hideWaitPanel(1);

		},

		getPhotoB : function() {
			Client.imageUpdate("curView.gotoPhotoB");
		},
		
		gotoPhotoB : function(obj) {
			var html = '<img src="data:image/png;base64,'+obj.fileData+'" width="100%" height="100%">';
			$("#b").html(html);
			this.param.photoImage2 = obj.fileUrl;
			this.checkButton1();
			Client.hideWaitPanel(1);
		},
		  
		getPhotoC : function() {
			Client.imageUpdate("curView.gotoPhotoC");
		},
		
		gotoPhotoC : function(obj) {
			var html = '<img src="data:image/png;base64,'+obj.fileData+'" width="100%" height="100%">';
			$("#c").html(html);
			this.param.photoImage3 = obj.fileUrl;
			this.checkButton1();
			Client.hideWaitPanel(1);
		},
		  
	});
});
