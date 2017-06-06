define(function (require, exports, module) {
	
	var LoginTemplate = require("text!../template/wxlogin.html");
	
	var LoginView = module.exports = ItemView.extend({
	  
		template : LoginTemplate,
		
		events: {
        	"keyup #phonePassInput":"checkButton",
        	"blur #mobileNoText,#phonePassInput":"checkButton",
        	"keyup #mobileNoText":"checkMobileNoText",
        	"click #btn_sendSMS":"sendMessage",	
        	"click #login":"login"	
		},
		
		initialize : function(){
			this.isUse = true;
			this.vBasis='PB1101';
			//$("#login").attr("disabled","disabled");
			Utils.clearInput('.fm-del');
			$("#mobileNoText").on("focus",function(){
				$(this).parent().addClass("focusState");
			}).on("blur",function(){
				$(this).parent().removeClass("focusState");
			});
			$("#phonePassInput").on("focus",function(){
				$(this).parent().parent().addClass("focusState");
			}).on("blur",function(){
				$(this).parent().parent().removeClass("focusState");
			});
			Client.hideWaitPanel(1);
			document.querySelector('.content').addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			
		},
		
		checkMobileNoText:function(){
			var mobileNo = $("#mobileNoText").val();
			var btn_sendSMS = $("#btn_sendSMS").text();

			if (!Utils.isEmpty(mobileNo)&&Utils.checkMobile(mobileNo)&&!Utils.isEmpty(btn_sendSMS)&&"发送验证码"==btn_sendSMS){
				//显示输入验证码
				$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
			} else{
				$("#btn_sendSMS").addClass('disabled').attr('disabled',true);
			} 
	    	this.checkButton();
		},
		
		checkButton:function(){
/*			var mobileNo = $("#mobileNoText").val();
			var checkLen = $("#phonePassInput").val().length>=6;
			if(!Utils.isEmpty(mobileNo)&&checkLen){
				$("#login").removeAttr("disabled","disabled");
			}else{
				$("#login").attr("disabled","disabled");
			}*/
		},
	  	sendMessage : function(){
			if($("#btn_sendSMS").hasClass('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			var mobileNo = $("#mobileNoText").val();
			
			if (Utils.isEmpty(mobileNo)){
		    	Utils.alertinfo("请输入您的手机号码");	
				return;
			}
			
			if (!Utils.checkMobile(mobileNo)){
		    	Utils.alertinfo("您输入的手机号码有误，请重新输入");	
				return;
			}
			
			$("#btn_sendSMS").addClass('disabled');

			var param = {
					mobileNo: mobileNo,
					vBasis: this.vBasis
			};
			var $this = this;
			Ajax({url:"/wxUserSign/sendWeiXinUserSingInSMS", data:param, success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					$this.sendFlag=true;
					var count = 60;//60秒不允许再次发送
					var timerID = setInterval(function(){
						$('#btn_sendSMS').text(count + '秒后重发');
						count--;
						if(count == 0||$("#btn_sendSMS").length==0){
							clearInterval(timerID);
							$this.sendFlag=false;
							$("#btn_sendSMS").removeClass('disabled');
							$('#btn_sendSMS').text('发送验证码');
						}
					},1000);
					$('#btn_sendSMS').text(count+ '秒后重发');
					count--;

				}else{
    				Utils.alertinfo(data.errorMessage);
					$("#btn_sendSMS").removeClass('disabled');
				}
			},error:function(){
				$("#btn_sendSMS").removeClass('disabled');
			}});
	  	},
	 login : function(){
			
			var mobileNo = $("#mobileNoText").val();
			if (Utils.isEmpty(mobileNo)){
		    	Utils.alertinfo("请输入您的手机号码");	
				return;
			}
			if (!Utils.checkMobile(mobileNo)){
		    	Utils.alertinfo("您输入的手机号码有误，请重新输入");	
				return;
			}
			
			var  vCode = $("#phonePassInput").val();
			if(Utils.isEmpty(vCode)||vCode.length!=6){
				Utils.alertinfo("请您输入正确的验证码");	
				return;
			}
			
		  
			var param = {
				customerId :mobileNo,
				vCode : vCode
			};
			var $this = this;
			Client.openWaitPanel("正在提交中，请稍候");
			Ajax({url:"/wxUserSign/signIn", data:param, 
				success:function(data){
					Client.hideWaitPanel(1);
					if(data.errorCode){	
						Utils.alertinfo(data.errorMessage);
					}else{
						$this.cleanSession();
						App.storage.set("UserInfo",data);
						Client.setClientInfo(data);
						App.navigate("userRegister/userRegisterCtl/wxAddLoginPassword");
					}
					
				},
				error:function(){
					Utils.alertinfo("网络故障，请重试");
					Client.hideWaitPanel(1);
				}
			});
		},
		
		goBack : function(){
			$('.ui-view').removeAttr('style');
			var fragment = App.history.fragment;
			if(fragment.indexOf("type=account")>0&&Device.os=="android"){
				Client.menuOpt("1");
				App.navigate("index/index/index");
			}else{
				Client.menuOpt("5");
				App.back();
			};
        },
        
     	cleanSession : function(){
    		var ad = App.storage.get("adList");
    		var aprShowMsg = App.storage.get("aprShowMsg");
    		var boseRate = App.storage.get("boseRate");
    		App.storage.clear();
    		App.storage.set("adList",ad);
    		App.storage.set("boseRate",boseRate);
    		App.storage.set("aprShowMsg",aprShowMsg);
    	},
     	getRandom : function(n){
     		var res ="";
     	    for(var i = 0; i < n ; i ++) {
     	    	res += Math.floor(Math.random()*10);
     	    }
     	    return res;
     	}
		
	});
	
});


