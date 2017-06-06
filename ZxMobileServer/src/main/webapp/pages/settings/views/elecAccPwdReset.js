define(function(require, exports, module){
	
	var elecAccPwdResetTpl = require("text!../template/elecAccPwdReset.html");
	var elecAccPwdResetView = module.exports = ItemView.extend({
		
	template : elecAccPwdResetTpl,
	
	events:{
		"keyup #certNoText,#vcode":"checkButton1",
		"blur #certNoText,#vcode":"checkButton1",
		"blur #certNoText":"checkCertNo18",
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
		 Client.hideWaitPanel();
		 
		 var userInfo = App.storage.get("UserInfo");
		 this.cardNo = userInfo.iAccountInfo[0].cardNo;
		 this.customerNameCN = Utils.trim(userInfo.customerNameCN);
		 this.mobileNo = Utils.trim(userInfo.regMobile);
		 
		 $('#customerNameCN').text(this.customerNameCN);
		 $('#cardNo').text(this.cardNo);
		 this.validTime = 60; 
		 this.vBasis='PB1110';
	},

	 //验证输入信息
	 checkButton1:function(){
		  (!MUI.isEmpty($('#vcode').val())&&!MUI.isEmpty($('#certNoText').val())) ?
				    $("#submitBtn").removeClass('disabled').removeAttr('disabled') : $("#submitBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
	  },
	  
	  checkCertNo18 : function(){
			var certNo = $('#certNoText').val();
			if (MUI.isEmpty(certNo)){
				Utils.alertinfo("您的身份证号不能为空！");
		    	return false;
			}else if(Utils.containSpecial(certNo) || certNo.length!=18){
		    	Utils.alertinfo("您输入的身份证号有误，请重新输入");
		    	return false;
			}else{
				if(certNo.substring(17,18) == 'x'){
					certNo= certNo.substring(0,17)+'X';
					$('#certNoText').val(certNo);
				}
				if(Utils.IdentityCodeValid(certNo)){
					return true;
				}else{
					Utils.alertinfo("您输入的身份证号有误，请重新输入");		
					return false;
				}
				return true;
			}
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
		 			cardNo:this.cardNo,
					certNo:certNo,
					vCode:$('#vcode').val(),
					vBasis:this.vBasis,
					actionFlag:'1'
			};
		 	var $this=this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/pubServer/resetTransPwd", data:param, success:function(data){
				Client.hideWaitPanel();
				 if(MUI.isEmpty(data.errorCode)){
					 var applyNo=data.applyNo;
					 var paramValue ={applyNo:applyNo,certNo:certNo};
					 App.navigate("settings/setCenterCtl/elecAccPwdResetTwo",paramValue);
				 }else{
					$('#vcode').val("");
					$this.checkButton1();
			    	Utils.alertinfo(data.errorMessage);	
				 }
			},error:function(){
				$('#vcode').val("");
				$this.checkButton1();
				Client.hideWaitPanel();
    		}}); 
 
		  },


		goBack : function(){
			App.back();
		}	
	});
});
