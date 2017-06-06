define(function (require, exports, module) {

	var batchPassWordSettingTemplate = require("text!../template/batchPassWordSetting.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : batchPassWordSettingTemplate,
        
        events:{
        	"keyup #phonePassInput":"checkButton",
        	"blur #phonePassInput":"checkButton",
        	"click #btn_sendSMS":"sendMessage",      	
        	"click #nextButton1":"doNext"
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'密码设置',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				}
    			  };
    		this.vBasis='PB1107';
    		this.validTime = 60;
    		this.timerID="";
    		this.sendFlag=false;
    		this.mobileNo=$("#mobileNoText").val();
    		Client.initPageTitle(pageTest);
    		this.sendMessage();
    		Client.hideWaitPanel(1);
        },
        
        doNext : function(){
/*			var paramValue = App.storage.get("_parameters");
			App.browParam[0] = paramValue;
        	App.navigate("userRegister/userRegisterCtl/batchPassWordSetting2",paramValue);
        	*/
        	if($("#nextButton1").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
    		
    		var phonePassInput = $('#phonePassInput').val();
			
			if (Utils.isEmpty(phonePassInput)||phonePassInput.length!=6){
				Utils.alertinfo("请输入6位短信验证码");	
				return;
			}

    		var param = {
    				regMobile:this.mobileNo,
    				vCode:phonePassInput,
					vBasis: this.vBasis
    		};
    		Client.openWaitPanel("加载中");
    		var $this=this;
    		Ajax({url:"/batchacc/checkInputCode",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var paramValue = {
							mobileNo:$this.mobileNo,
							random:data.cd.random
						};
					App.browParam[0] = paramValue;
					App.navigate("userRegister/userRegisterCtl/batchPassWordSetting2",paramValue);
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}
    		}});
    		
    	},
  	    goBack : function(){
  			Client.openWaitPanel("正在退出...");
  			Client.logOut("curView.cleanSession");
  	    },

		checkButton : function(){
			  //验证码开始进行匹配
			  (!Utils.isEmpty($('#phonePassInput').val())) ?
					    $("#nextButton1").removeClass('disabled').removeAttr('disabled') : $("#nextButton1").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  

		},
	  	sendMessage : function(){
			if($("#btn_sendSMS").hasClass('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			
			$("#btn_sendSMS").addClass('disabled');

			var param = {
					vBasis: this.vBasis
			};
			var $this = this;
			Ajax({url:"/mobile/sendByAppkey", data:param, success:function(data){
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
		cleanSession : function(data){
			Client.hideWaitPanel(1);
			var ad = App.storage.get("adList");
			var aprShowMsg = App.storage.get("aprShowMsg");
			App.storage.clear();
			App.storage.set("adList",ad);
			App.storage.set("aprShowMsg",aprShowMsg);
			App.container.show(this);
			App.back();
		}

	});
});