define(function (require, exports, module){
	 
	// var userNameText = $('#input_name');
	var logonPasswordResetTemplate = require("text!../template/logon_password_reset.html");
	var validTime = 60;
	var vBasis='PB1113';
	var fPassword = "";
	var fPassword2 = "";
	var pwdkey = "";
	var logonPasswordResetView = module.exports = ItemView.extend({
		
        template : logonPasswordResetTemplate,
        
        events:{
        	"click #password":"getPassword",
        	"click #password2":"getPassword2",
        	"blur #input_name":"checkName",
        	"blur #phonePassInput":"checkMob",
        	"blur #input_certNo":"checkCertNo18",
        	"keyup #input_name, #input_certNo, #input_mobileNo, #phonePassInput":"checkButton",
        	"blur #input_name, #input_certNo, #input_mobileNo, #phonePassInput":"checkButton",
        	"click #btn_sendSMS":"sendMessage",
        	"click #nextButton1":"doReset"
        },
        
        initialize : function(params){
        	
        	//this.data = params.model.cd;
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
        	MUI.log(MUI.logLevel.DEBUG,"----init---");
        },
        checkName : function(){
        	var simCN = $('#input_name').val();
    		if(MUI.isEmpty(simCN)){
    			Utils.alertinfo("请输入中文姓名");
    			return false;
    		}else if(Utils.containSpecial(simCN)){
    			Utils.alertinfo("您输入的中文姓名有误，请重新输入");
    			return false;
    		}
		},
		checkMob : function(){
			var checkNum = $('#phonePassInput').val();
			  if(MUI.isEmpty(checkNum)){
				  Utils.alertinfo("短信验证码不能为空，请重新输入");
				  return false;
			  }
			  if(!Utils.isNum(checkNum)){
				  Utils.alertinfo("短信验证码为六位数字，请重新输入");
				  return false;
			  }
			  if(checkNum.length != 6){
				  Utils.alertinfo("短信验证码为六位数字，请重新输入");
				  return false;
			  }
		},
		getPassword : function(){
			Utils.focusPosition($("#password").parent());
			var opt = {
					elem:"#password",//当前对像
					type:'text',//text 字母与数字 number数字键盘
					max:'20',
					callback:'curView.savePassword',
					confirm:'1'
			};
			Client.showPwdPicker(opt);
		},
		savePassword : function(data){
			 fPassword = data.pwd;
			 pwdKey = data.pwdKey;
			 this.checkButton();
		},
		getPassword2 : function(){
			Utils.focusPosition($("#password2").parent());
			var opt = {
					elem:"#password2",//当前对像
					type:'text',//text 字母与数字 number数字键盘
					max:'20',
					callback:'curView.savePassword2',
					confirm:'2'
			};
			Client.showPwdPicker(opt);
		},
		savePassword2 : function(data){
			fPassword2 = data.pwd;
			this.checkButton();
		},
		checkButton : function(){
			if(this.realFlag){
				(!MUI.isEmpty($('#input_name').val()) && !MUI.isEmpty($('#input_certNo').val()) && !MUI.isEmpty($('#input_mobileNo').val()) && !MUI.isEmpty($('#phonePassInput').val()) && !MUI.isEmpty(fPassword)&& !MUI.isEmpty(fPassword2))
				? $("#nextButton1").removeClass('disabled').removeAttr('disabled') : $("#nextButton1").addClass('disabled').attr('disabled',true);								
			}else{
				(!MUI.isEmpty($('#input_mobileNo').val()) && !MUI.isEmpty($('#phonePassInput').val()) && !MUI.isEmpty(fPassword)&& !MUI.isEmpty(fPassword2))
				? $("#nextButton1").removeClass('disabled').removeAttr('disabled') : $("#nextButton1").addClass('disabled').attr('disabled',true);				
			}
		},
		checkMobile : function(mobile){
			if (MUI.isEmpty(mobile) || !Utils.isNum(mobile) || mobile.length != 11 ){
//				$('#input_mobileNo').val();
		  		return false;
		  	}else{
		  		if(mobile.indexOf('13')==0||mobile.indexOf('14')==0||mobile.indexOf('15')==0||mobile.indexOf('17')==0||mobile.indexOf('18')==0){
		  			return true;
		  		}else{
//		  			$('#input_mobileNo').val();
		  			return false;
		  		}
		  	}
		},
		checkCertNo18 : function(){
			var certNo = $('#input_certNo').val();
			if (MUI.isEmpty(certNo)){
		    	return false;
			}else if(Utils.containSpecial(certNo) || certNo.length!=18){
		    	Utils.alertinfo("您输入的身份证号有误，请重新输入");
//				$('#input_certNo').val("");
		    	return false;
			}else{
				if(certNo.substring(17,18) == 'x'){
					certNo= certNo.substring(0,17)+'X';
					$('#input_certNo').val(certNo);
				}
				if(Utils.IdentityCodeValid(certNo)){
					return true;
				}else{
					Utils.alertinfo("您输入的身份证号有误，请重新输入");		
//					$('#input_certNo').val("");
					return false;
				}
				return true;
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
			Ajax({url:"/mobile/send", data: param, success: function(data){
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
				}
			},error:function(){
				$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
			}});
		},
		doReset : function(){
			if($("#nextButton1").attr('disabled')){ //确定按钮可点击
				return;
			 }
			 
		     MUI.log(MUI.logLevel.DEBUG,"----step1---");
		     
		     if(this.realFlag){		    	 
		    	 if (!this.checkCertNo18()){
		    		 return;
		    	 }
		     }
				
			 if (!this.checkMobile($('#input_mobileNo').val())){
			    	Utils.alertinfo("您输入的手机号码有误，请重新输入");	
					return;
			 }
					 
			 if (MUI.isEmpty($('#phonePassInput').val())){
			    	Utils.alertinfo("请输入短信验证码");
					return;
			 }
			Client.pwdConfirm("curView.confirmback");


		},
		confirmback : function(data){
      		var $this = this;
	    	   if(data=="0"){//密码不相等
	    		   fPassword2="";
	    		   $("#password2").val("");
	    		   this.checkButton();
	    		   return;
	    	   }
	    	   
			 //发送短信验证码
		 	var param ={
		 			userName:$('#input_name').val(),
		 			certNo:$('#input_certNo').val(),
		 			password: fPassword,
					mobileNo:$('#input_mobileNo').val(),
					vCode:$('#phonePassInput').val(),
					pwdkey:pwdKey,
					vBasis:vBasis
			};
 
		 	Client.openWaitPanel("拼命加载中，请稍候");
			 Ajax({url:"/pubServer/resetLogonPwd", data:param, success:function(data){
				 $this.clearPwd();//重载随机数
				 Client.hideWaitPanel();
				 if(MUI.isEmpty(data.errorCode)){
						Client.alertinfo("密码重置成功！", "提醒","curView.goBack()");
				 }else{
					 if(data.errorCode == '-1001'){ 
						   $("#nameDiv").show();
						   $("#certNoDiv").show();
						   $this.realFlag = true;
				    		$('#page1').topIfoTips({
						           text : '温馨提示：实名认证用户，还需输入姓名和身份证哦~',
							       align : 'left',
							       delay : '90000',
							       scrollText : false
							 });
							$("#phonePassInput").val("");
				    		
				    		$this.count=0;
					 }else{
						 Utils.alertinfo(data.errorMessage);
					 }
					 //Utils.alertinfo("密码重置失败！");
				 };
			},error:function(){
				$this.clearPwd();//重载随机数
			}});
		},
        goBack : function(){
			App.back();
		},
		clearPwd : function(){
    		$("#password").val("");
    		$("#password2").val("");
    		pwdKey = null;
    		fPassword = null;
    		fPassword2 = null;
			Client.loadPwdKey();
    	},
        help : function(){
        	App.navigate("anymore/anymoreCtl/messageCenter");
        }
	});
});