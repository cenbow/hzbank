define(function (require, exports, module){
	 
	var transactionPwdResetOneTemplate = require("text!../template/transactionPwdResetOne.html");
	var transactionPwdResetOneView = module.exports = ItemView.extend({
		
        template : transactionPwdResetOneTemplate,
        
        events:{
        	"blur  #phonePassInput":"checkMob",
        	"blur  #input_certNo":"checkCertNo18",
        	"keyup #phonePassInput":"checkButton",
        	"blur  #phonePassInput":"checkButton",
        	"click #btn_sendSMS":"sendMessage",
        	"click #nextButton1":"doReset"
        },
        
        initialize : function(params){
        	
        	var pageTest = {
    			  	title:'交易密码重置',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				},
    				rightButton:{
    					name : '帮助',
    					func : 'curView.help()'
    				}
    			  };
        	Client.initPageTitle(pageTest);
        	this.validTime = 60;
        	this.vBasis="PB1110";
        	var userName = App.storage.get("UserInfo").customerNameCN;
        	$("#input_name").val(userName);
        	Client.hideWaitPanel(1);
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
		
		checkButton : function(){
			(!MUI.isEmpty($('#input_certNo').val()) && !MUI.isEmpty($('#phonePassInput').val()))
			? $("#nextButton1").removeClass('disabled').removeAttr('disabled') : $("#nextButton1").addClass('disabled').attr('disabled',true);								
		},
		
		checkCertNo18 : function(){
			var certNo = $('#input_certNo').val();
			var certNo1 = App.storage.get("UserInfo").certNo;
			if (MUI.isEmpty(certNo)){
				Utils.alertinfo("您的身份证号不能为空！");
		    	return false;
			}else if(Utils.containSpecial(certNo) || certNo.length!=18){
		    	Utils.alertinfo("您输入的身份证号有误，请重新输入");
		    	return false;
			}else if(certNo.trim()!= certNo1.trim()){
		    	Utils.alertinfo("您输入的身份证号不匹配，请重新输入");
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
					return false;
				}
				return true;
			}
		},
		sendMessage : function(){
			if($("#btn_sendSMS").attr('disabled')){ //确定按钮可点击
				return;
			}
			if (!this.checkCertNo18()){
	    		 return;
	    	 }
			$("#btn_sendSMS").addClass('disabled').attr('disabled',true);
			
			var param = {
					vBasis: this.vBasis
			};
			var $this=this;
			Ajax({url:"/mobile/sendByAppkey", data:param, success:function(data){
				if(data.ec == 0){
					var count = $this.validTime;//60秒不允许再次发送
					var timerID = setInterval(function(){
						$('#btn_sendSMS').attr("data-value",count + '秒后重新获取');
						count--;
						if(count == 0||$("#btn_sendSMS").length==0){
							clearInterval(timerID);
							$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
							$('#btn_sendSMS').attr("data-value",'获取手机验证码');
						}
					},1000);
					$('#btn_sendSMS').attr("data-value",count + '秒后重新获取');
					count--;
				}else{
					$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
				}
			},error:function(){
				$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
			}});
			
		},
		doReset : function(){
			var userName = App.storage.get("UserInfo").customerNameCN;
			var certNo = $('#input_certNo').val();
			var vCode = $('#phonePassInput').val();
			
			if($("#nextButton1").attr('disabled')){ //确定按钮可点击
				return;
			 }
					 
			 if (MUI.isEmpty(vCode)){
			    Utils.alertinfo("请输入短信验证码");
				return;
			 }
			 if (MUI.isEmpty(certNo)){
				Utils.alertinfo("请输入身份证号码");
				return;
			 }
			 var param = {
					 vCode:vCode,
					 vBasis:this.vBasis,
					 userName:userName,
					 certNo:certNo
			 };
			 App.storage.set("param",param);
			 Client.openWaitPanel("拼命加载中，请稍候");
			 Ajax({url:"/pubServer/resetTransactionPwd1", data:param, success:function(data){
				 if(MUI.isEmpty(data.errorCode)){
					 var random = data.cd.random;
					 var userInfo={
							 random:random
					 };
					 App.storage.set("userInfo",userInfo);
					 var param = {
							 transType : "01",
							 userName:App.storage.get("UserInfo").customerNameCN,
							 certNo:App.storage.get("UserInfo").certNo
					 };
					 Client.openWaitPanel("拼命加载中，请稍候");
					 Ajax({url:"/faceCheck/idCardInputCheckFacePlus", data:param, success:function(data){
						 if(MUI.isEmpty(data.errorCode)){
							 var param = {
									 userName:userName,
									 faceType:"3",
									 certNo:certNo
							 };
							 App.navigate("settings/setCenterCtl/faceDistinguish",param);
						 }else{
							 Utils.alertinfo(data.errorMessage);
							 Client.hideWaitPanel(1);
						 };
					}});
					 
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