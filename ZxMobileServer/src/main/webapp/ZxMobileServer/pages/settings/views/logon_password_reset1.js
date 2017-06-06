define(function (require, exports, module){
	 
	var logonPasswordReset1Template = require("text!../template/logon_password_reset1.html");
	var validTime = 60;
	var vBasis='PB1113';
	var logonPasswordReset1View = module.exports = ItemView.extend({
		
        template : logonPasswordReset1Template,
        
        events:{
        	"keyup #input_mobileNo, #phonePassInput":"checkButton",
        	"blur  #input_mobileNo, #phonePassInput":"checkButton",
        	"click #btn_sendSMS":"sendMessage",
        	"click #nextButton1":"doReset"
        },
        
        initialize : function(params){
        	
        	var pageTest = {
    			  	title:'忘记密码',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				},
    				rightButton:{
    					name : '帮助',
    					func : 'curView.help()'
    				}
    			  };
        	
        	this.count = validTime;
        	Client.initPageTitle(pageTest);
        	Client.hideWaitPanel(1);
        	this.realFlag = false;
        },
		checkButton : function(){
			if(this.realFlag){
				(!MUI.isEmpty($('#input_mobileNo').val()) && !MUI.isEmpty($('#phonePassInput').val()))
				? $("#nextButton1").removeClass('disabled').removeAttr('disabled') : $("#nextButton1").addClass('disabled').attr('disabled',true);								
			}else{
				(!MUI.isEmpty($('#input_mobileNo').val()) && !MUI.isEmpty($('#phonePassInput').val()))
				? $("#nextButton1").removeClass('disabled').removeAttr('disabled') : $("#nextButton1").addClass('disabled').attr('disabled',true);				
			}
		},
		checkMobile : function(mobile){
			if (MUI.isEmpty(mobile) || !Utils.isNum(mobile) || mobile.length != 11 ){
		  		return false;
		  	}else{
		  		if(mobile.indexOf('13')==0||mobile.indexOf('14')==0||mobile.indexOf('15')==0||mobile.indexOf('17')==0||mobile.indexOf('18')==0){
		  			return true;
		  		}else{
		  			return false;
		  		}
		  	}
		},
		sendMessage : function(){
			if($("#btn_sendSMS").attr('disabled')){ //确定按钮可点击
				return;
			}
			
			var mobileNo = $('#input_mobileNo').val();
			if (MUI.isEmpty(mobileNo)){
		    	Utils.alertinfo("手机号码不能为空");	
				return;
			}
			
			if (!this.checkMobile(mobileNo)){
		    	Utils.alertinfo("您输入的手机号码有误，请重新输入");	
				return;
			}
			
			
			$("#btn_sendSMS").addClass('disabled').attr('disabled',true);
			
			var param = {
					mobileNo: mobileNo,
					vBasis: vBasis
			};
			var $this=this;
			Ajax({url:"/mobile/sendPwd", data: param, success: function(data){
				if(data.ec == 0){
					$this.count = validTime;//60秒不允许再次发送
					var timerID = setInterval(function(){
						$('#btn_sendSMS').attr("data-value",$this.count + '秒后重新获取');
						$this.count--;
						if($this.count <= 0||$("#btn_sendSMS").length==0){
							clearInterval(timerID);
							$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
							$('#btn_sendSMS').attr("data-value",'获取手机验证码');
						}
					}, 1000);
					$('#btn_sendSMS').attr("data-value", $this.count + '秒后重新获取');
					$this.count--;

				}else{
					$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
			},error:function(){
				$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
			}});
		},
		doReset : function(){
			var mobileNo = $('#input_mobileNo').val();
			var vCode = $('#phonePassInput').val();
			
			if($("#nextButton1").attr('disabled')){ //确定按钮可点击
				return;
			 }
			
			if (!this.checkMobile(mobileNo)){
			    Utils.alertinfo("您输入的手机号码有误，请重新输入");	
				return;
			}
			 
			if(MUI.isEmpty(vCode)){
				Utils.alertinfo("短信验证码不能为空，请重新输入");
				return false;
			}
			if(!Utils.isNum(vCode)){
				Utils.alertinfo("短信验证码为六位数字，请重新输入");
				return false;
			}
			if(vCode.length != 6){
				Utils.alertinfo("短信验证码为六位数字，请重新输入");
				return false;
			}
			 
			 
			 
			 var param = {
					 mobileNo:mobileNo,
					 vCode:vCode,
					 vBasis:vBasis
			 };
			 Client.openWaitPanel("拼命加载中，请稍候");
			 Ajax({url:"/pubServer/resetLogonPwd1", data:param, success:function(data){
				 if(MUI.isEmpty(data.errorCode)){
					 var randomInfo ={random2:data.cd.random2};
					 App.storage.set("randomInfo",randomInfo);
					 App.navigate("settings/setCenterCtl/logonPasswordReset2",param);
				 }else{
					 Utils.alertinfo(data.errorMessage);
					 Client.hideWaitPanel(1);
				 };
			}});

		},
        goBack : function(){
			App.back();
		},
        help : function(){
        	App.navigate("anymore/anymoreCtl/messageCenter");
        }
	});
});