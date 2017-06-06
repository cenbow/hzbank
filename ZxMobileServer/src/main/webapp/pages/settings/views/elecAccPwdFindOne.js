define(function(require, exports, module){
	
	var elecAccPwdFindOneTpl = require("text!../template/elecAccPwdFindOne.html");
	var elecAccPwdFindOneView = module.exports = ItemView.extend({
		
	template : elecAccPwdFindOneTpl,
	
	events:{
		"keyup #certNoText,#vcode":"checkButton1",
		"blur #certNoText,#vcode":"checkButton1",
		"click #btn_sendSMS":"sendMessage",
		"click #submitBtn":"submit"
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
		 
		 var userInfo = App.storage.get("UserInfo");
		 this.mobileNo = Utils.trim(userInfo.regMobile);
		 this.validTime = 60; 
		 this.vBasis='PB1110';
		 
		 
		 
		 Client.hideWaitPanel();
	},

	 //验证输入信息
	 checkButton1:function(){
		  (!MUI.isEmpty($('#vcode').val())&&!MUI.isEmpty($('#certNoText').val())) ?
				    $("#submitBtn").removeClass('disabled').removeAttr('disabled') : $("#submitBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
	  },
	//获取手机验证码
	  sendMessage:function(){
		  if($("#btn_sendSMS").attr('disabled')){ //确定按钮可点击
				return;
			}
			$("#btn_sendSMS").addClass('disabled').attr('disabled',true);
			var param = {
					mobileNo:this.mobileNo,
					vBasis: this.vBasis
			};
			var $this=this;
			Ajax({url:"/mobile/send", data:param, success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var count = $this.validTime;//60秒不允许再次发送
					var timerID = setInterval(function(){
						$('#btn_sendSMS').val(count + '秒后重新获取');
						count--;
						if(count == 0 || $('#btn_sendSMS').length==0){
							clearInterval(timerID);
							$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
							$('#btn_sendSMS').val('重新获取验证码');
						}
					},1000);
					$('#btn_sendSMS').val(count + '秒后重新获取');
					count--;
				}else{
					$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
				}
			},error:function(){
				$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
			}});
	  },
	  //提交
	  submit:function(){ //为提交按钮绑定提交事件
			if($("#submitBtn").attr('disabled')){ //确定按钮可点击	
				return;
			}
			var certNo = $('#certNoText').val();
			if (MUI.isEmpty(certNo)){
		    	Utils.alertinfo("请输入身份证号码");	
				return;
			}
			
			if(!Utils.checkCertNo18(certNo)){
				return;
			}
			
			if (MUI.isEmpty($('#vcode').val())){
		    	Utils.alertinfo("请输入短信验证码");	
				return;
			}
		 	var param ={
					certNo:certNo,
					vCode:$('#vcode').val(),
					vBasis:this.vBasis
			};
		 	var $this=this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/pubServer/findTransPasswordOne", data:param, success:function(data){
				 if(MUI.isEmpty(data.errorCode)){
					 var random2=data.random2;
					 var paramValue ={
							 random2:random2
							 };
					 App.navigate("settings/setCenterCtl/elecAccPwdFindTwo",paramValue);
				 }else{
					$('#vcode').val("");
					$this.checkButton1();
			    	Utils.alertinfo(data.errorMessage);	
				 }
				 Client.hideWaitPanel();
			},error:function(){
				$('#vcode').val("");
				$this.checkButton1();
				Utils.alertinfo(data.errorMessage);	
				Client.hideWaitPanel();
    		}}); 
		  },


		goBack : function(){
			App.back();
		}	
	});
});
