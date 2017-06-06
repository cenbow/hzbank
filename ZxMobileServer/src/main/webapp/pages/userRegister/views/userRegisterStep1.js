define(function (require, exports, module) {

	var userRegisterStep1Template = require("text!../template/userRegisterStep1.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : userRegisterStep1Template,
        
        events:{
        	"keyup #mobileNoText,#phonePassInput":"checkButton",
        	"blur #mobileNoText,#phonePassInput":"checkButton",
        	"propertychange #mobileNoText,#phonePassInput":"checkButton",
//        	"blur #mobileNoText":"inviteIdQuery",
        	"keyup #mobileNoText":"sendSMS",
        	"click #btn_sendSMS":"sendMessage",      	
        	"click #nextButton1":"doNext",
        	"click #showAgreement":"showAgreement",
        	"click #agreeBtn":"agreeBtn",      	
        	"click #closeBtn":"gotoPage1",   
        	"click #checkReg":"checkButton",   
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'注册',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				}
    			  };
    		this.vBasis='PB1101';
    		this.validTime = 60;
    		this.timerID="";
    		this.sendSMS();
    		this.sendFlag=false;
    		Client.initPageTitle(pageTest);
    		
    		if(!MUI.isEmpty(Utils.search())){
				$('#input_RecommendNum').val(Utils.search().code); 
			}
    		
    		Client.hideWaitPanel(1);
        },
        
        doNext : function(){
			if($("#nextButton1").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			
    		var mobileNo = $("#mobileNoText").val();
    		var phonePassInput = $('#phonePassInput').val();
    		var recommendNum = $('#input_RecommendNum').val();    		
			if (Utils.isEmpty(mobileNo)){
		    	Utils.alertinfo("请输入的手机号码");	
				return;
			}
			
			if (!Utils.checkMobile(mobileNo)){
		    	Utils.alertinfo("您输入的手机号码有误，请重新输入");	
				return;
			}
			
			if (Utils.isEmpty(phonePassInput)||phonePassInput.length!=6){
				Utils.alertinfo("请输入6位短信验证码");	
				return;
			}
			if (!Utils.isEmpty(recommendNum)){
				if(recommendNum==mobileNo){
					Utils.alertinfo("自己不能邀请自己，请重新输入");	
					return;		
				}
				if((recommendNum.length!=6 && recommendNum.length!=8 && recommendNum.length!=11)||!Utils.isInteger(recommendNum)){
					Utils.alertinfo("请输入6位、8位或11位数字邀请码");	
					return;					
				}
			}
			
    		var param = {
    				mobileNo:mobileNo,
    				RecommendNum:recommendNum,
    				vCode:phonePassInput,
					vBasis: this.vBasis
    		};
    		Client.openWaitPanel("加载中");
    		var $this=this;
    		Ajax({url:"/regServer/registerStep1",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var totalNum = data.totalNum;
					
					var paramValue = {
							mobileNo:mobileNo,
							recommendNum:recommendNum,
							random:data.random,
							orcFlag:data.orcFlag,
							grayFlag:data.grayFlag
							};
					App.browParam[0] = paramValue;
					if(data.orcFlag == '1' || data.grayFlag=='DEBUG_CONTROL')
						App.navigate("userRegister/userRegisterCtl/ocrRegister",paramValue);
					else
						App.navigate("userRegister/userRegisterCtl/userRegisterStep2_2",paramValue);
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}
    		}});
    	},
  	    goBack : function(){
			App.back();
  	    },

		checkButton : function(){
			  //验证码开始进行匹配
			  (!Utils.isEmpty($('#mobileNoText').val())&&!Utils.isEmpty($('#phonePassInput').val())&&($('#checkReg').attr("checked"))) ?
					    $("#nextButton1").removeClass('disabled').removeAttr('disabled') : $("#nextButton1").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  

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
			Ajax({url:"/regServer/sendRegisterSMS", data:param, success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					$this.sendFlag=true;
					var count = $this.validTime;//60秒不允许再次发送
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
		showAgreement : function(){
        	var pageTest = {
    			  	title:'注册协议',
    				leftButton:{
    					name : '返回',
    					func :'curView.gotoPage1()'
    				}
    			  };
    		Client.initPageTitle(pageTest);
    		$("#userRegPage2").show();
    		$("#userRegPage1").hide();
		},
		gotoPage1 : function(){
        	var pageTest = {
    			  	title:'注册',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				}
    			  };
    		Client.initPageTitle(pageTest);
    		$("#userRegPage1").show();
    		$("#userRegPage2").hide();
		},
		agreeBtn : function(){
        	var pageTest = {
    			  	title:'注册',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				}
    			  };
    		Client.initPageTitle(pageTest);
    		$('#checkReg').remove();
    		$('#agreeReg').prepend('<input id="checkReg" type="checkbox" checked />');
    		this.checkButton();
    		$("#userRegPage1").show();
    		$("#userRegPage2").hide();
		},
		sendSMS :function(){
			var mobileNo = $("#mobileNoText").val();
			if (Utils.checkMobile(mobileNo)&&!this.sendFlag){
				$("#btn_sendSMS").removeClass('disabled');
				this.inviteIdQuery(mobileNo);
			}else{
				$("#btn_sendSMS").addClass('disabled');
			}
		},
		inviteIdQuery:function(mobileNo){	
	 		var param = {
    				mobileNo:mobileNo
    		};
    		Client.openWaitPanel("加载中");
    		var $this=this;
    		Ajax({url:"/regServer/inviteCodeQuery",data:param, success:function(data){
				Client.hideWaitPanel(1);
    			if(MUI.isEmpty(data.errorCode)){
					var inviteCode = data.inviteCode;
					if(!MUI.isEmpty(inviteCode)){
						$('#input_RecommendNum').val(inviteCode); 
						if(!MUI.isEmpty(inviteCode)&&inviteCode.length==8&&inviteCode!='99900001'&&inviteCode!='99900002'){
							$('#recommendNumDiv').hide();
						}else{
							$('#recommendNumDiv').show();
						}						
					}else{
						$('#recommendNumDiv').show();
					}
    			}
    		},error:function(){
				Client.hideWaitPanel(1);
			}});
		}
	});
});