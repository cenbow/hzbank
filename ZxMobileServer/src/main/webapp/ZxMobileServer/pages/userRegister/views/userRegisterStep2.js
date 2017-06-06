define(function (require, exports, module) {

	var userRegisterStep2Template = require("text!../template/userRegisterStep2.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : userRegisterStep2Template,
        
        events:{
        	"keyup #input_userName,#input_certNo,#input_bindCardNo":"checkButton",
        	"blur #input_userName,#input_certNo,#input_bindCardNo":"checkButton",
        	"blur #input_bindCardNo":"getBank",
        	"keyup #input_bindCardNo":"getFmtAcc",
        	"click #password":"showPwd",      	
        	"click #nextButton2":"secondStep",      
        	"click .i-card":"ocrBankCard",
        	"click .i-name":"itCheck",       	
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'注册',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				}
    			  };
        	this.pwd ="";
        	this.pwdKey ="";
    		Client.initPageTitle(pageTest);
    		
    		var paramValue = App.storage.get("_parameters");
    		if(paramValue.orcFlag == "1" || paramValue.grayFlag=="DEBUG_CONTROL"){
    			$("#input_certNo").attr("disabled","disabled");
    		}
    		
    		Client.hideWaitPanel(1);
    		this.cardType = this.model.get("cardType");

    		if(this.cardType =='01'){
					$("#tr_safeInput").show();
    		}else{
					$("#tr_safeInput").hide();
    		}
			this.checkButton();
        },
  		showPwd : function(){
			Utils.focusPosition($("#password").parent());
			 var opt = {
					 elem:"#password",//当前对像
					 type:'number',//text 字母与数字 number数字键盘
					 max:'6',
					 callback:'curView.savePassword'
				 };
				 Client.showPwdPicker(opt);
		},

		savePassword : function(data){
			 this.pwd = data.pwd;
			 this.pwdKey = data.pwdKey;
			 this.checkButton();	
		},
        
  	  	goToBack2 : function(){
  			//初始化菜单方法
  	 	 var pageStep2 = {
 			  	title:'银行卡绑定',
				leftButton:{
					name : '返回',
					func :'curView.goBack()'
				}
  	 	  };
  	  		Client.initPageTitle(pageStep2);
  	  		$("#page1").show();
  	  		$("#page2").hide();
  	  	},
        //第二步
		secondStep : function(){ //为提交按钮绑定提交事件
			if($("#nextButton2").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			var userName = $('#input_userName').val();
			var certNo = $('#input_certNo').val();
			var bankType = $('#input_bank').attr("data-value");
			var bindCardNo = $('#input_bindCardNo').val();

			if(Utils.isEmpty(userName)){
		    	Utils.alertinfo("请输入您的姓名");	
				return;
			}
			if(!Utils.checkCertNo18(certNo)){
				return;
			}
			if(Utils.isEmpty(bankType)){
		    	Utils.alertinfo("请选择绑定卡银行");	
				return;
			}
			if(Utils.isEmpty(bindCardNo)){
		    	Utils.alertinfo("请输入绑定卡卡号");	
				return;
			}
			Client.openWaitPanel("拼命加载中，请稍候");
			this.toNextStep();
		},
  	  	
		toNextStep : function(){
			var $this = this;
    		var paramValue = App.storage.get("_parameters");
    		var mobileNo = paramValue.mobileNo;
    		var random = paramValue.random;
    		
			var userName = $('#input_userName').val();
			var certNo = $('#input_certNo').val();
			var bankType = $('#input_bank').attr("data-value");
			var bindCardNo = $('#input_bindCardNo').val(); 
			bindCardNo = bindCardNo.replace(/\s/g,"");
			var bankName = $('#input_bank').val();

    		var param = {
    				mobileNo:mobileNo,
					cardType:this.cardType,
    				userName:userName,
    				certNo:certNo,
    				bankName:bankName,
    				bankType:bankType,
    				bindCardNo:bindCardNo,
					payPwd:this.pwd,
					pwdkey:this.pwdKey,
					random:random,
					photoBackBase64:paramValue.photoBackBase64,
					photoBase64:paramValue.photoBase64,
					customerSex:paramValue.gender=='男'?'M':'F',
					customerBirthday:paramValue.birth,
					customerAddress:paramValue.address,
					customerRace:paramValue.people,
					orcFlag:paramValue.orcFlag,
					organ:paramValue.authority,
    				validity:paramValue.validDate
    		};
    		Ajax({url:"/regServer/registerStep2",data:param, success:function(data){
    			$this.clearPwd();
    			if(Utils.isEmpty(data.errorCode)){
					var paramValue = {
							mobileNo:mobileNo,
							userName:userName,
							certNo:certNo,
		    				bankName:bankName,
		    				bankType:bankType,
		    				bindCardNo:bindCardNo,
							cardType:$this.cardType,
							bankUrlClass:$this.bankUrlClass,
							customerAlias:data.customerAlias,
							random:data.random
							};
					App.browParam[0] = paramValue;
					App.navigate("userRegister/userRegisterCtl/userRegisterStep3",paramValue);
    			}else{
    				if(data.errorCode=='66'){
    					Utils.alertinfo("您的身份证信息与银行预留信息不符，请到银行柜面修改");
    				}else{
    					Utils.alertinfo(data.errorMessage);
    				}
    				Client.hideWaitPanel(1);
    			}
    		},error:function(){
    			$this.clearPwd();
    		}});
    	},
   	   	clearPwd : function(){
		  	 $("#password").val("");
			 this.pwd = "";
	  		 this.pwdKey = "";
			 Client.loadPwdKey();
			 this.checkButton();
	   	},
  	    goBack : function(){
			App.back();
  	    },
		checkButton : function(){
			  if(this.cardType == "00"||this.cardType == "01"){
				  (!Utils.isEmpty($('#input_userName').val())&&!Utils.isEmpty($('#input_certNo').val())&&!Utils.isEmpty($('#input_bindCardNo').val())&&!Utils.isEmpty($('#input_bank').attr("data-value"))&&!Utils.isEmpty(this.pwd)) ?
						  $("#nextButton2").removeClass('disabled').removeAttr('disabled') : $("#nextButton2").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		    
			  }else{				  
				  (!Utils.isEmpty($('#input_userName').val())&&!Utils.isEmpty($('#input_certNo').val())&&!Utils.isEmpty($('#input_bindCardNo').val())&&!Utils.isEmpty($('#input_bank').attr("data-value"))) ?
						  $("#nextButton2").removeClass('disabled').removeAttr('disabled') : $("#nextButton2").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
			  }
		},
		
		toBankList : function(){
  			//初始化菜单方法
	  	 	 var pageStep3 = {
	 			  	title:'银行选择',
					leftButton:{
						name : '返回',
						func :'curView.goToBack2()'
					}
	  	 	  };
			Client.initPageTitle(pageStep3);
			$("#page1").hide();
			$("#page2").show();
		},
		
		getBank : function(){
			var bindCardNo = $('#input_bindCardNo').val();
			bindCardNo = bindCardNo.replace(/\s/g,"");
			if(Utils.isEmpty(bindCardNo)){
				return;
			}
			var params = {
					cardNo:bindCardNo,
					queryType:'1',
					mobileNo:App.storage.get("_parameters").mobileNo
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			var $this = this;
			Ajax({ url: "/bank/checkCardBin", data:params, success: function(data){
				if(Utils.isEmpty(data.errorCode)){
					var icoll = data.iCardBinInfo;
		    		if(icoll!=null&&icoll.length>0){
						var kColl = icoll[0];
						var cardType2 = kColl.cardType;
						if(cardType2=='0'){
							var orgCode = kColl.orgCode;
							if(orgCode==Utils.getParamDisplay("ORG_CODE","hzbank")){
					    		$this.cardType='01';//本行借记卡	
					    		$("#tr_safeInput").show();
					    	}else{
					    		$this.cardType = "04";//他行借记卡
					    		$("#tr_safeInput").hide();
					    	}
							$("#input_bankUrl").removeClass().addClass("ico-bnk bnk-"+kColl.bankIconUrl.split("_")[1]);
							$("#input_bank").val(kColl.orgName).attr("data-value",kColl.orgCode);
							$this.checkButton();
						}else{
							Utils.alertinfo("您输入的卡类型为非借记卡");
						}
				    }else{
				    	Utils.alertinfo("暂不支持该银行");
				    }
				}else{
					Utils.alertinfo(data.errorMessage);		
				}
				Client.hideWaitPanel(1);
			}});
		},
		
		ocrBankCard : function(){
			Client.ocrBankCard("curView.cardRes");
		},
		
		cardRes : function(num){
			$("#input_bindCardNo").val(Utils.getFmtAcc(num));
			this.getBank();
		},
		getFmtAcc : function(){
			var bindCardNo = $("#input_bindCardNo").val();
			$("#input_bindCardNo").val(Utils.getFmtAcc(bindCardNo));
		},
		itCheck : function(){
			Client.ocrCheck("curView.getPhotoResFront");
		},
		getPhotoResFront : function(obj){
			if(obj.certNo == null || obj.certNo.length == 0){
				Utils.alertinfo("请扫描身份证正面");
				return;
			}
			$("#input_userName").val(obj.userName);
			$("#input_certNo").val(obj.certNo);
			Client.hideWaitPanel(1);
		}
	});
});