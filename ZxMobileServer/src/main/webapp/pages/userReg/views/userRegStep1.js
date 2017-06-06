define(function (require, exports, module) {

	var currentTemplate = require("text!../template/userRegStep1.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : currentTemplate,
        
        events:{
        	"keyup #mobileNoText":"checkButton",
        	"blur #mobileNoText":"checkButton",
        	"click #checkReg":"checkButton",      	
        	"click #nextButton1":"doNext",      	
        	"click #showAgreement":"showAgreement",      	
        	"click #agreeBtn":"agreeBtn",      	
        	"click #closeBtn":"gotoPage1",      	
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'请输入手机号码',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
//    				},
//    				rightButton:{
//    					name : '帮助',
//    					func : 'curView.help()'
    				}
    			  };
    		this.vBasis='PB1101';
    		Client.initPageTitle(pageTest);
    		Client.hideWaitPanel(1);
        },
        
        doNext : function(){
			if($("#nextButton1").attr('disabled')){ //确定按钮可点击
				return;
			}
    		var mobileNo = $("#mobileNoText").val();
    		
			if (Utils.isEmpty(mobileNo)){
		    	Utils.alertinfo("请输入的手机号码");	
				return;
			}
			
			if (!this.checkMobile(mobileNo)){
		    	Utils.alertinfo("您输入的手机号码有误，请重新输入");	
				return;
			}
			
    		var param = {
    				mobileNo:mobileNo,
					vBasis: this.vBasis
    		};
    		Client.openWaitPanel("加载中");
    		Ajax({url:"/regServer/mobRegStep1",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var totalNum = data.totalNum;
					var recommendNum ="";
					if(!MUI.isEmpty(Utils.search())){
						recommendNum = Utils.search().code;
					}
					var paramValue = {
								mobileNo:mobileNo,
								recommendNum:recommendNum,
								totalNum:totalNum
								};

					App.navigate("userReg/userRegCtl/userRegStep2",paramValue);
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
//				$('#mobileNoText').val("");
		  		return false;
		  	}else{
		  		if(mobile.indexOf('13')==0||mobile.indexOf('14')==0||mobile.indexOf('15')==0||mobile.indexOf('17')==0||mobile.indexOf('18')==0){
		  			return true;
		  		}else{
//					$('#mobileNoText').val("");
		  			return false;
		  		}
		  	}
	  	},
		checkButton : function(){
			  //验证码开始进行匹配
			  (!Utils.isEmpty($('#mobileNoText').val())&&($('#checkReg').attr("checked"))) ?
					    $("#nextButton1").removeClass('disabled').removeAttr('disabled') : $("#nextButton1").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  

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
    			  	title:'请输入手机号码',
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
    			  	title:'请输入手机号码',
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
	});
});