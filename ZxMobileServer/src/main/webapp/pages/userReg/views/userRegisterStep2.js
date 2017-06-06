define(function (require, exports, module) {

	var userRegisterStep2Template = require("text!../template/userRegisterStep2.html");
	 
	var currentView = module.exports = ItemView.extend({
		
        template : userRegisterStep2Template,
        
        events:{
        	"keyup #input_bindCardNo":"checkButton",
        	"blur #input_bindCardNo":"getBank",
        	"click #password":"showPwd",      	
        	"click #nextButton2":"secondStep",      
        	"click .camera" : "ocrBankCard"
        },
        
        initialize : function(params){
        	var pageTest = {
    			  	title:'银行卡绑定',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				}
    			  };
        	this.pwd ="";
        	this.pwdKey ="";
    		Client.initPageTitle(pageTest);
    		Client.hideWaitPanel(1);
    		this.cardType = this.model.get("cardType");

    		if(this.cardType =='00'){
					$("#tr_safeInput").show();
    		}else{
					$("#tr_safeInput").hide();
    		}
			this.checkButton();
			
      		var $this = this;
      		this.bankUrlClass ="";
      		$("#all_bankst li").on("click",function(){
      			
      			var bankVal = $(this).attr("data-value");
  				var bankInfo = bankVal.split('|');
  				
  				$("#input_bank").val(bankInfo[0]);  
  				$("#input_bank").attr("data-value",bankInfo[1]);
  				$this.bankUrlClass="ico-bnk "+bankInfo[2];
  				$("#input_bankUrl").removeClass().addClass($this.bankUrlClass);  
  				if(bankInfo[1]==Utils.getParamDisplay("ORG_CODE","hzbank")){
  					$this.cardType = "00";
  					$("#tr_safeInput").show();
  				}else{
  					$this.cardType = "04";
  					$("#tr_safeInput").hide();
  				}
  				
  				$this.goToBack2();
  				$this.checkButton();
      		});
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
			var bankType = $('#input_bank').attr("data-value");
			var bindCardNo = $('#input_bindCardNo').val();

			if(MUI.isEmpty(bankType)){
		    	Utils.alertinfo("请选择绑定卡银行");	
				return;
			}
			if(MUI.isEmpty(bindCardNo)){
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
    		var certNo = paramValue.certNo;
    		var userName = paramValue.userName;
    		var random = paramValue.random;
    		var customerAlias = paramValue.customerAlias;
       	
			var bankName = $('#input_bank').val();
			var bankType = $('#input_bank').attr("data-value");
			var bindCardNo = $('#input_bindCardNo').val();
			
    		var param = {
    				customerAlias:customerAlias,
    				mobileNo:mobileNo,
					cardType:this.cardType,
    				userName:userName,
    				certNo:certNo,
    				random:random,
    				bankName:bankName,
    				bankType:bankType,
    				bindCardNo:bindCardNo,
					payPwd:this.pwd,
					pwdkey:this.pwdKey   				
    		};
    		Ajax({url:"/regServer/mobRegisterStep2",data:param, success:function(data){
				Client.loadPwdKey();//重载随机数
    			if(MUI.isEmpty(data.errorCode)){
					var random2 = data.random;
					var paramValue = {
							mobileNo:mobileNo,
							userName:userName,
							certNo:certNo,
		    				bankName:bankName,
		    				bankType:bankType,
		    				bindCardNo:bindCardNo,
							cardType:$this.cardType,
							bankUrlClass:$this.bankUrlClass,
							random:random,
							random2:random2};
					paramValue = _.extend(paramValue,App.storage.get("_parameters"));
					App.navigate("userReg/userRegCtl/userRegisterStep3",paramValue);
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}
    		},error:function(){
    			Client.loadPwdKey();//重载随机数
    		}});
    	},
  	    goBack : function(){
			App.back();
  	    },
		checkButton : function(){
			  if(this.cardType == "00"||this.cardType == "01"){
				  (!MUI.isEmpty($('#input_bindCardNo').val())&&!MUI.isEmpty($('#input_bank').attr("data-value"))&&!MUI.isEmpty(this.pwd)) ?
						  $("#nextButton2").removeClass('disabled').removeAttr('disabled') : $("#nextButton2").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		    
			  }else{				  
				  (!MUI.isEmpty($('#input_bindCardNo').val())&&!MUI.isEmpty($('#input_bank').attr("data-value"))) ?
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
			if(!bindCardNo){
				return;
			}
			var params = {
					cardNo:bindCardNo,
					queryType:'1'
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			var $this = this;
			Ajax({ url: "/bank/checkCardBin", data:params, success: function(data){
				if(MUI.isEmpty(data.errorCode)){
					var icoll = data.iCardBinInfo;
		    		if(icoll!=null&&icoll.length>0){
						var kColl = icoll[0];
						var cardType2 = kColl.cardType;
						if(cardType2=='0'){
							var orgCode = kColl.orgCode;
							if(orgCode==Utils.getParamDisplay("ORG_CODE","hzbank")){
					    		$this.cardType='00';	
					    		$("#tr_safeInput").show();
					    	}else{
					    		$this.cardType = "04";
					    		$("#tr_safeInput").hide();
					    	}
							$("#input_bankUrl").removeClass().addClass("ico-bnk bnk-"+kColl.bankIconUrl.split("_")[1]);
							$("#input_bank").val(kColl.orgName).attr("data-value",kColl.orgCode);
							$this.checkButton();
						}else{
							Utils.alertinfo("您输入的卡类型为非借记卡");
						}
				    }else{
				    	Utils.alertinfo("请输入正确卡号");
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
			$("#input_bindCardNo").val(num);
			this.getBank();
		}
	});
});