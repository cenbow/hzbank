define(function (require, exports, module) {

	var userRegStep2Template = require("text!../template/userRegStep2.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : userRegStep2Template,
        
        events:{
        	"keyup #phonePassInput":"checkButton",
        	"blur #phonePassInput":"checkButton",
        	"click #password1":"password1",
        	"click #password2":"password2",
        	"click #submitBtn":"doSubmit",
        	"click #btn_sendSMS":"sendMessage",

        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'请设置登录密码',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				}
    			  };
    		Client.initPageTitle(pageTest);
    		Client.hideWaitPanel(1);
    		this.validTime = 60;
    		this.vBasis='PB1101';
    		this.pwd = "";
    		this.pwd2 = "";
    		this.pwdKey = "";
//    		this.sendSMS();
        },
 	   password1 : function(){
		   Utils.focusPosition($("#password1").parent());
			var opt = {
				 elem:"#password1",//当前对像
				 type:'text',//text 字母与数字 number数字键盘
				 max:'20',
				 callback:'curView.savePassword',
				 confirm:'1'
			 };
			 Client.showPwdPicker(opt);
				 
       },
       savePassword : function(data){
    	 this.pwd = data.pwd;
    	 this.pwdKey = data.pwdKey;
		 this.checkButton();
       },
       
       password2 : function(){
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
      	 this.pwd2 = data.pwd;
  		 this.checkButton();
        },  
        doSubmit : function(){
			if($("#submitBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
        	this.phonePassInput = $('#phonePassInput').val();
        	this.recommendNum = $('#input_RecommendNum').val();
        	
			if (Utils.isEmpty(this.phonePassInput)||this.phonePassInput.length!=6){
				Utils.alertinfo("请输入6位短信验证码");	
				return;
			}
			if (!Utils.isEmpty(this.recommendNum)){
				if((this.recommendNum.length!=6 &&this.recommendNum.length!=8)||!Utils.isInteger(this.recommendNum)){
					Utils.alertinfo("请输入6位员工号或8位邀请码");	
					return;					
				}
			}
			Client.pwdConfirm("curView.confirmback");
    	},
        confirmback : function(data){
			var $this = this;
    	   if(data=="0"){//密码不相等

    		   $this.pwd2="";
    		   $("#password2").val("");
    		   this.checkButton();
    		   return;
    	   }
    	   
    	   var mobileNo = this.model.get("mobileNo");
    	   var password = this.pwd;
    	   var pwdkey = this.pwdKey;

			//发送短信验证码
			var param ={
				mobileNo:mobileNo,
				password:password,
				pwdkey:pwdkey,
				vBasis:this.vBasis,
				vCode:this.phonePassInput,
				RecommendNum:this.recommendNum
			};

			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/regServer/mobRegStep2", data:param, success:function(data){

					if(!data.errorCode){
						
						var param = {
								customerId : mobileNo,
								pwdkey : pwdkey,
								password : password,
								imageCodeKey : "UNCHECK",
								imageCode : ""
							};
							Ajax({url:"/userSign/signIn", data:param, 
								success:function(data){
									$this.clearPwd();//重载随机数
									Client.hideWaitPanel();
									if(data.errorCode){
										if(data.errorMessage.indexOf("无法获取交易代码")>=0){
											Utils.alertinfo("用户名或密码错");
											return false;
										}
										Utils.alertinfo(data.errorMessage);
									}else{
										App.storage.set("UserInfo",data);
										Client.setClientInfo(data);
										MUI.Cache.save("userId",mobileNo);						
										var paramValue = {mobileNo:mobileNo};
										App.navigate("userReg/userRegCtl/userRegResult",paramValue);
									}
								}
							});
							
					}else{
						$('#phonePassInput').val("");
						$this.clearPwd();//重载随机数
						Client.hideWaitPanel();
						Utils.alertinfo(data.errorMessage);		
					};
				},error:function(){
					$('#phonePassInput').val("");
					$this.clearPwd();//重载随机数
					Client.hideWaitPanel();
			}});  
       },
 	   clearPwd : function(){
 		  	$("#password1").val("");
 		  	$("#password2").val("");
 	 		 this.pwd = "";
 	  		 this.pwd2 = "";
 	  		 this.pwdKey = "";
  		     this.checkButton();
 			Client.loadPwdKey();
  		},
	  	goBack : function(){
				App.back();
	  	},
    	toLogin : function(){
    		App.navigate("login/loginCtl/login?type=account");
    	},
	  	sendSMS : function(){
			var count = this.validTime;//60秒不允许再次发送
			var $this = this;
			var timerID = setInterval(function(){
				$('#btn_sendSMS').html('已发送('+count+')');
				count--;
				if(count == 0){
					clearInterval(timerID);
					$this.toSendSMS();
					$('#btn_sendSMS').html('重发');
				}
			},1000);
			$('#btn_sendSMS').html('已发送('+count+')');
			count--;
	  	},
	  	sendMessage : function(){	
//			$("#btn_sendSMS").unbind();
	  		if($("#btn_sendSMS").attr('class').indexOf('disabled')>=0){
	  			return false;
	  		}
			$("#btn_sendSMS").addClass('disabled').attr('disabled',true);

			var param = {
					mobileNo: this.model.get("mobileNo"),
					vBasis: this.vBasis
			};
			var $this = this;
			Ajax({url:"/mobile/send", data:param, success:function(data){
				if(data.ec == 0){
					var count = $this.validTime;//60秒不允许再次发送
					var timerID = setInterval(function(){
						$('#btn_sendSMS').val(count + '秒后重新获取');
						count--;
						if(count == 0||$("#btn_sendSMS").length==0){
							clearInterval(timerID);
							$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
							$('#btn_sendSMS').val('获取手机验证码');
						}
					},1000);
					$('#btn_sendSMS').val(count+ '秒后重新获取');
					count--;

				}else{
					$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
				}
			},error:function(){
				$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
			}});
	  },
	  toSendSMS : function(){
			var $this = this;
			$("#btn_sendSMS").on('click', function() {
				$this.sendMessage();
    		});
	  },
	checkButton : function(){
		  //验证码开始进行匹配
		  (!Utils.isEmpty($('#phonePassInput').val())&&!Utils.isEmpty(this.pwd)&&!Utils.isEmpty(this.pwd2)) ?
				    $("#submitBtn").removeClass('disabled').removeAttr('disabled') : $("#submitBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  

	},

	});
});