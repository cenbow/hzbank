define(function (require, exports, module) {

	var userRegisterStep1Template = require("text!../template/userRegisterStep1.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : userRegisterStep1Template,
        
        events:{
        	//"keyup #input_name,#input_certNo,#phonePassInput":"checkButton",
        	//"blur #input_name,#input_certNo,#phonePassInput":"checkButton",
        	"click #btn_sendSMS":"sendMessage",      	
        	"click #nextButton1":"doNext",
        	"click #cancel" : "goBack"
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'实名认证',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				}
    			  };
    		this.vBasis='PB1101';
    		this.validTime = 60;
    		this.timerID="";
    		this.mobileNo = App.storage.get("UserInfo").regMobile;
    		this.param =  App.storage.get("_parameters");
    		Client.initPageTitle(pageTest);
    		
    		$('#userReg').topIfoTips({
		           text : '温馨提示：开通实名认证,享有更多交易权限',
			       align : 'left',
			       delay : '90000',
			       scrollText : false
			 });
    		
    		setTimeout(function(){
    			Client.hideWaitPanel(1);
    		},2000);
        },
        
        doNext : function(){
			if($("#nextButton1").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			
			this.param.userName = $("#userName").val();
			this.param.people = $("#people").val();
			this.param.gender = $("#gender").val();
			this.param.birth = $("#birth").val();
			this.param.address = $("#address").val();
			
			var userName = this.param.userName;
			var certNo = this.param.certNo;
			var vCode = "";
			if(!MUI.isEmpty(userName)&&userName.length>12){
    			Utils.alertinfo("姓名输入过大");
				return;
			}
			if (!this.checkCertNo18(certNo)){
				return;
			}
			
			//delete this.param.photoBase64;
    		var param = this.param;
    		param.mobileNo=this.mobileNo;
    		Client.openWaitPanel("加载中");
    		var $this=this;
    		Ajax({url:"/regServer/mobRegisterStep1",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var random = data.random;
					var customerAlias = data.customerAlias;
					var paramValue = {
							mobileNo:$this.mobileNo,
							customerAlias:customerAlias,
							userName:userName,
							certNo:certNo,
							random:random,
							vCode:vCode,
							url:"userReg/userRegCtl/userRegisterStep2",
							action:"填写实名信息"
					};
					paramValue = $.extend(paramValue,param);
					App.storage.set("customerName",userName);
					App.navigate("userReg/userRegCtl/userRegisterStep2",paramValue);
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}
    		}});
    	},
  	    goBack : function(){
			App.back();
  	    },
	  	checkMobile : function(mobile){
		  	if (Utils.isEmpty(mobile) || !Utils.isNum(mobile)||mobile.length!=11 ){
		  		return false;
		  	}else{
		  		if(mobile.indexOf('13')==0||mobile.indexOf('14')==0||mobile.indexOf('15')==0||mobile.indexOf('17')==0||mobile.indexOf('18')==0){
		  			return true;
		  		}else{
		  			return false;
		  		}
		  	}
	  	},
		checkButton : function(){
			  //验证码开始进行匹配
			  (!Utils.isEmpty($('#input_name').val())&&!Utils.isEmpty($('#input_certNo').val())) ?
					    $("#nextButton1").removeClass('disabled').removeAttr('disabled') : $("#nextButton1").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  

		},
	  	sendMessage : function(){
			if($("#btn_sendSMS").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			if (!this.checkMobile(this.mobileNo)){
		    	Utils.alertinfo("您输入的手机号码有误，请重新输入");	
				return;
			}
			
			$("#btn_sendSMS").addClass('disabled').attr('disabled',true);

			var param = {
					mobileNo: this.mobileNo,
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
	  	checkCertNo18 : function(certNo){
			if (Utils.isEmpty(certNo) || Utils.containSpecial(certNo) || certNo.length!=18){
		    	Utils.alertinfo("您输入的身份证号有误，请重新输入");
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
			}
	  	}
	  	
	});
});