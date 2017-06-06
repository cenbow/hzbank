define(function (require, exports, module) {
	
	var incomeTransfer2Template = require("text!../template/incomeTransfer2.html");
	
	var incomeTransfer2View = module.exports = ItemView.extend({
		
        template : incomeTransfer2Template,
        
        events:{
        	"keyup #input_tranAmt":"checkButton",
        	"blur #input_tranAmt":"checkButton",
       	    "click #pwd" : "showPassword",
        	"click #submitBtn":"gotoSubmit",
        	"click #succBackButton" : "gotoAccount",
        	"click #sendSMSBtn":"ePaySendSMS",
          	"keyup #ta_confim_code":"checkButton2",
        	"blur #ta_confim_code":"checkButton2",
        	"click #submitBtn2":"doTaPaySubmit",
//        	"click #cardClass":"selectCardList",
        	"click #addCard":"addCard",
        	"click #errorBackButton":"gotoAccount",
        	"click #hongbao" : "gotoHongBao"
        	
        },

        initialize : function(){
 			 this.activate = App.storage.get("activate");
 			 var userInfo = App.storage.get("UserInfo");
			 this.hasResetPwd = userInfo.hasResetPwd||""; //微信组册用户且已经设置交易密码和登录密码
	       	 this.pageStep1 = {
	       		  	title:'充值',
	       			leftButton:{
	       				name : '返回',
	       				func: 'curView.goBack()'
	       			},
	       			rightButton:{
	        			name : this.activate?'':'转账说明',
	        			func: this.activate?'':'curView.tranDisc()'
	        		}
	       	  };	       	 
	       	  Client.initPageTitle(this.pageStep1);
	       	  
	    	  this.password = "";
	    	  this.pwdkey = "";
	       	  this.cardType="";
	       	  this.bankIconUrl="";
	       	  this.orderNo="",
	       	  this.bandFlag="",
	  		  this.orgName = "";
			  this.orgCode = "";
			  this.cardNo = "";
			  this.bindCardNo = "";
	       	  this.eleCardNo=Utils.getEleCard().cardNo;
	      	  this.accountType =Utils.trim(Utils.getEleCard().accountType);//电子账户类型
	      	  this.openNode = Utils.trim(Utils.getEleCard().cardOpenNode);//
	      	  
	          var session = App.storage.get("UserInfo");
	          this.payName = Utils.trim(session.customerNameCN);
	      	  this.certNo = Utils.trim(session.certNo);
	      	  this.mobileNo = Utils.trim(session.regMobile);
	      	  
   			  this.cardSelect="";
   			  
//   			  var hongbaoStart = App.storage.get("hongbaoStart");
//   			  if(!hongbaoStart){
//   				  this.hongbaoStartTemp = "0";
//	     	  }else{
//	     		  this.hongbaoStartTemp = hongbaoStart.hongbaoStartTemp;
//	     	  }
   			  this.hongbaoStartTemp = "0";
			  var adList=App.storage.get("adList");
				for(index in adList){
					if(adList[index].adPointTo == "hongbao/hongbaoCtl/hongbao"){
						this.hongbaoStartTemp = "1";
					}
				}
	       	  this.init();
			  Client.hideWaitPanel(1);
        },
    	showPassword : function(){
    		Utils.focusPosition($("#pwd").parent());
    		var opt = {
    			elem:"#pwd",//当前对像
    			type:'number',//text 字母与数字 number数字键盘
    			max:'6',
    			callback:'curView.savePassword'
    		};
    		Client.showPwdPicker(opt);
    	},
    	
    	savePassword : function(obj){
    		this.password = obj.pwd;
    		this.pwdkey = obj.pwdKey;
    		this.checkButton();
    	},
        init:function(){
        	var $this=this;
        	var data=App.storage.get("_parameters");
        	if(!MUI.isEmpty(data)&&!MUI.isEmpty(data.cardSelect)){
        		this.cardSelect=data.cardSelect;
        	}
        	
    		var iCardList = App.storage.get("userCardList");
    		for(var i=0;i<iCardList.length;i++){
    			var kcoll=iCardList[i];
    			if(!MUI.isEmpty(this.cardSelect)&&this.cardSelect==kcoll.cardNo){
    				this.cardNo = kcoll.cardNo;
    				this.bandFlag = kcoll.bandFlag;
    				this.cardType = kcoll.cardType;
    				this.bankIconUrl = kcoll.bankIconUrl;
    				this.mobileNo = kcoll.mobileNo;
    				this.orgName = kcoll.bankName;
    				this.orgCode = kcoll.orgCode;
    				$("#bankName").html(kcoll.bankName).attr("data-val",kcoll.orgCode);
    				$("#cardNo").html(Utils.getFmtAcc(kcoll.cardNo));
    				var bankClass = 'ar-'+(kcoll.bankIconUrl).split('_')[1];		  						
    				$("#cardClass").removeClass().addClass("add-card area "+bankClass);
      				if($this.cardType!="04"&&kcoll.bandFlag=="0"){
      					$("#inputPasswd").show();
      				}else{
      					$("#inputPasswd").hide();
      				}
    			}
    			if(kcoll.bandFlag=="1"){
    				this.bindCardNo = kcoll.cardNo;
    				if(MUI.isEmpty(this.cardSelect)){
    					this.cardNo = kcoll.cardNo;
    					this.bandFlag = kcoll.bandFlag;
    					this.cardType = kcoll.cardType;
    					this.bankIconUrl = kcoll.bankIconUrl;
    					this.mobileNo = kcoll.mobileNo;
    					this.orgName = kcoll.bankName;
    					this.orgCode = kcoll.orgCode;
    					$("#bankName").html(kcoll.bankName).attr("data-val",kcoll.orgCode);
    					$("#cardNo").html(Utils.getFmtAcc(kcoll.cardNo));
    					var bankClass = 'ar-'+(kcoll.bankIconUrl).split('_')[1];		  						
    					$("#cardClass").removeClass().addClass("add-card area "+bankClass);
    					if(((this.hasResetPwd=='21')||(this.hasResetPwd=='11'))&&(this.cardType!='04')&&this.activate){//微信开户或批量开户
          					$("#inputPasswd").show();
    					}else{
          					$("#inputPasswd").hide();
    					}
    				}
    			}
    		}
			if(this.activate){
				$("#warnNotice1").hide();
				$("#warnNotice2").show();
				$("#card-ifo").removeClass("arr");
				$("#cardClass").off();
				$("#input_tranAmt").val("1.00");
				this.checkButton();
			}else{
				$("#warnNotice1").show();
				$("#warnNotice2").hide();
				$("#card-ifo").addClass("arr");
				$("#cardClass").on('click', function() {
					$this.selectCardList();
	    		});
			}
			

        },
        goBack : function(){
          	App.back();
        },
		checkButton : function(){
			  //验证码开始进行匹配
			//this.hasResetPwd=='21' 微信开户 ;this.bandFlag=="0" 非绑卡用；this.activate需要激活用户；this.cardType!="04"本行用户
			//本行非绑定用户或者微信需要激活本行用户---需要输入密码
			if((this.cardType!="04"&&this.bandFlag=="0")||(this.cardType!="04"&&this.activate&&(this.hasResetPwd=="21"||this.hasResetPwd=="11"))){
				  (!Utils.isEmpty($('#input_tranAmt').val())&&!Utils.isEmpty(this.password)) ?
						    $("#submitBtn").removeClass('disabled').removeAttr('disabled') : $("#submitBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
				
			}else{
				  (!Utils.isEmpty($('#input_tranAmt').val()) && Utils.isMoney($('#input_tranAmt').val()) && $('#input_tranAmt').val()!=0) ?
						    $("#submitBtn").removeClass('disabled').removeAttr('disabled') : $("#submitBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
				
			}

		},
		
		checkButton2 : function(){
			  //验证码开始进行匹配
				  (!Utils.isEmpty($('#ta_confim_code').val())) ?
						    $("#submitBtn2").removeClass('disabled').removeAttr('disabled') : $("#submitBtn2").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  

		},
		
		//提交
		//this.hasResetPwd=='21' 微信开户 ;this.bandFlag=="0" 非绑卡用；this.activate需要激活用户；this.cardType!="04"本行用户
		//本行非绑定用户或者微信需要激活本行用户---需要输入密码
		gotoSubmit:function(){
			if(this.bandFlag=="0"){
			////非绑定卡需要先验证限额//////
				Client.openWaitPanel("正在提交中，请稍候");
				Ajax({url:"/bank/queryDayAvailableLimit", 
					data:{
						cardNo : Utils.trim(Utils.getEleCard().cardNo),
			    		accountType : Utils.trim(Utils.getEleCard().accountType)
		    		}, 
					success:function(data){
						if (data.errorCode) {
							Utils.alertinfo(data.errorMessage);
							Client.hideWaitPanel(1);
						} else {
							var dayAvailableLimit = parseFloat(data.cd.dayAvailableLimit,2);
							var tranAmt = parseFloat(Utils.trim($('#input_tranAmt').val()),2);
							if(tranAmt > dayAvailableLimit){
								Client.hideWaitPanel(1);
								Utils.alertinfo("超出非绑定卡当日充值限额，非绑定卡当日充值限额还剩"+Utils.formatCurrency(dayAvailableLimit,2)+"元！请使用绑定卡充值！");
								return;
							}
							////////限额验证完毕////////////
							if($this.cardType!="04"){
								if(($this.bandFlag=="0")||(($this.hasResetPwd=='21'||$this.hasResetPwd=='11')&&$this.activate)){
									$this.doKamiSubmit();	
								}else{
									$this.doSubmit();
								}
							}else{
								$this.doTaPayApply();
							}
						}
						
					},
					error:function(){
						Client.hideWaitPanel(1);
					}
				});
				
			}else{
				////绑定卡不需要验证限额//////
				if(this.cardType!="04"){
					if((this.bandFlag=="0")||((this.hasResetPwd=='21'||this.hasResetPwd=='11')&&this.activate)){
						this.doKamiSubmit();	
					}else{
						this.doSubmit();
					}
				}else{
					this.doTaPayApply();
				}
			}

		},

	  	//本行转入提交
  	   doSubmit :	function (){
  		    var $this = this;
  			var inputPayAccount = Utils.trim($('#cardNo').html());
  			inputPayAccount = inputPayAccount.replace(/\s/g,"");
  			var tranAmt = Utils.trim($('#input_tranAmt').val());
  
  			if(!Utils.checkAmount(tranAmt)){
  				return false;
  			}

  			Client.openWaitPanel("正在提交中，请稍候");
  			
  			var params = {
  		   			payAccount:inputPayAccount,
  					accountType:this.cardType,
  					recAccount:this.eleCardNo,
  					accountType2:this.accountType,
  					payAmount:tranAmt,
  					openNode:this.openNode,					
  		 	};
  			$("#submitBtn").addClass('disabled').attr('disabled',true);
  		 	Ajax({url:"/transfer/life_transferSameUserSub", data:params, success:function(data){
  				 
  				 $("#submitBtn").removeClass('disabled').removeAttr('disabled');
				 if(Utils.isEmpty(data.errorCode)){		//zxServer报错
  					 var orderFlowNo = data.orderFlowNo;
  					 var orderState = data.orderState;
  					 var scoreTotal = data.scoreTotal;//总积分
  					 var scoreCurr = data.scoreCurr;//当前交易所得积分
  					 var orderSubmitTime = data.orderSubmitTime;
  					 var hostReturnCode = data.hostReturnCode;
  					 var hostReturnCode = data.hostReturnCode;
  					 var hostErrorMessage = data.hostErrorMessage;
  					 var chargeFee = data.chargeFee;
 
    				 if(!MUI.isEmpty(App.storage.get("paramAccount"))){
	    					App.storage.remove("paramAccount");	
    				 }  
    				 if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
    					App.storage.remove("balanceInfo");	
    				 } 
		    		 $("#payAcc_suc").text( Utils.formatAcc(inputPayAccount) );
		    		 $("#recAccName_suc").text( Utils.formatAcc($this.eleCardNo) );
		    		 $("#recAmt_suc").text( Utils.formatCurrency(tranAmt)); 
		    		 if($this.hongbaoStartTemp == "1"){
		    			 $("#hongbao").hide();
		    		 }
		    		 $this.initPage3();
  					Client.hideWaitPanel(1);
  		    	  }else{
  		    		if(data.errorCode == 'ZXEB9006'){
		    			  Client.alertinfo("请先完善身份信息","提示","curView.goOcr()",true);
		    		  }else{
		    			  Utils.alertinfo(data.errorMessage);
		    		  }
  		    		Client.hideWaitPanel(1);
  		    	  }
  				 
  			},error:function(){
  				$("#submitBtn").removeClass('disabled').removeAttr('disabled');
  				Client.hideWaitPanel(1);
  			}});
  			
  		},
 	  	//本行卡密转入提交
  		doKamiSubmit : function(){
  			var kamiPayAccount = Utils.trim($('#cardNo').html());
  			kamiPayAccount = kamiPayAccount.replace(/\s/g,"");
  			var tranAmt = Utils.trim($('#input_tranAmt').val());

  			if(!Utils.checkAmount(tranAmt)){
  				return false;
  			}
  	
  			if(Utils.isEmpty(this.password)){
  				Utils.alertinfo("密码不能为空！");
  				return false;
  			}
  			$("#submitBtn").addClass('disabled').attr('disabled',true);

  			var params = {
  					payAccount:kamiPayAccount,
  					recAccount:this.eleCardNo,
  					recAccountName:this.payName,
  					accountType2:this.accountType,
  					payAmount:tranAmt,
  					openNode:this.openNode,
  					password:this.password,
  					pwdkey:this.pwdkey,
  			};
  			Client.openWaitPanel("正在提交中，请稍候");
  		   	var $this = this;
  		   	Ajax({url:"/transfer/life_KamiInnerTransfer", data:params, success:function(data){
  		   		$("#submitBtn").removeClass('disabled').removeAttr('disabled');
   				 if(Utils.isEmpty(data.errorCode)){		//zxServer报错
  					 var orderFlowNo = data.orderFlowNo;
  					 var orderState = data.orderState;
  					 var scoreTotal = data.scoreTotal;//总积分
  					 var scoreCurr = data.scoreCurr;//当前交易所得积分
  					 var orderSubmitTime = data.orderSubmitTime;
  					 var hostReturnCode = data.hostReturnCode;
  					 var hostErrorMessage = data.hostErrorMessage;
  					 var chargeFee = data.chargeFee;

    				 if(!MUI.isEmpty(App.storage.get("paramAccount"))){
    					App.storage.remove("paramAccount");	
    				 }  
    				 if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
    					App.storage.remove("balanceInfo");	
    				 } 
		    		 $("#payAcc_suc").text( "转出账户："+Utils.formatAcc(kamiPayAccount) );
		    		 $("#recAccName_suc").text( Utils.formatAcc($this.eleCardNo) );
		    		 $("#recAmt_suc").text( Utils.formatCurrency(tranAmt));	
		    		 if($this.hongbaoStartTemp == "1"){
		    			 $("#hongbao").hide();
		    		 }
		    		 
		    		 //微信开户，且需要激活用户
		    		 if($this.activate&&($this.hasResetPwd=='21'||$this.hasResetPwd=='11')){
		    			 $this.elecAccActivate(kamiPayAccount,tranAmt);
		    		  }
		    		 
		    		 $this.initPage3();
  			    	Client.hideWaitPanel(1);
  		    	  }else{
  		    		if(data.errorCode == 'ZXEB9006'){
		    			  Client.alertinfo("请先完善身份信息","提示","curView.goOcr()",true);
		    		  }else{
		    			  Utils.alertinfo(data.errorMessage);
		    		  }
  	  		   		 Client.hideWaitPanel(1);
  		    	  }
    			 $this.clearPwd();
  			},error:function(){
	  		   	 Client.hideWaitPanel(1);
  		   		 $("#submitBtn").removeClass('disabled').removeAttr('disabled');
    			 $this.clearPwd();
  			}});
  		   	
  		},
  		
 	   clearPwd : function(){
 		  	 $("#pwd").val("");
 			 this.password = "";
 	  		 this.pwdkey = "";
 			 Client.loadPwdKey();
 	   	},
 	   	
    	   //他行转入下一步--订单申请
	   doTaPayApply : function (){
  			if($("#submitBtn").attr('disabled')){ //确定按钮可点击
  				return;
  			}
//    		var mobileNo = Utils.trim($('#cardNo').attr("data-value"));
    		
  			var cardNo = Utils.trim($('#cardNo').html());
  			cardNo = cardNo.replace(/\s/g,"");
  			var tranAmt = Utils.trim($('#input_tranAmt').val());	

			if(!Utils.checkAmount(tranAmt)){
				return false;
			}
 			if (Utils.isEmpty(this.mobileNo)){
 		    	Utils.alertinfo("请输入的手机号码");	
 				return;
 			}
  			tranAmt=Utils.removeComma(Utils.formatCurrency(tranAmt,2));

			$("#submitBtn").addClass('disabled').attr('disabled',true);
			var parampay = {
					payAccount:cardNo,
					payAccountName:this.payName,
					certNo:this.certNo,
					certType:'01',   //01身份证
					mobileNo:this.mobileNo,
					amount:tranAmt,
					recAccount:this.eleCardNo,
					accountType2:this.accountType,
			};
			var $this = this;
			Client.openWaitPanel("正在提交中，请稍候");
		   	Ajax({url:"/transfer/life_in_ePayPayApply", data:parampay, success:function(data){
    		   		 $("#submitBtn").removeClass('disabled').removeAttr('disabled');
    				 if(Utils.isEmpty(data.errorCode)){		//zxServer报错
    					var retCode = data.retCode;
    					var retMsg = data.retMsg;
    		    		if(retCode=="000000"){		//hzpaylife报错
    		    			$this.orderNo = data.orderFlowNo;
    			    		var tranState = data.tranState;
    			    		var returnErrCode = Utils.nvl(data.returnErrCode,'0');
    			    		var returnErrMessage = data.returnErrMessage;
    			    		if(returnErrCode=='00' || returnErrCode=='0' || returnErrCode.length=='0'){
    			  				var bankClass = 'ico-bnk bnk-'+($this.bankIconUrl).split('_')[1];
    			    			$("#confim_payAcc_class").removeClass().addClass(bankClass);
    			    			$('#confim_payAcc').text(Utils.formatAcc(cardNo));
    							$('#confim_tranAmt').text(Utils.formatCurrency(tranAmt));
    							$('#confim_recAcc').text(Utils.formatAcc($this.eleCardNo));
    							$('#confim_recAccName').text($this.payName);
    							$this.initPage2();
    							Client.hideWaitPanel(1);
    			    		}else{
    			    			Utils.alertinfo(returnErrMessage);
    			    			Client.hideWaitPanel(1);
    			    		}
    		    		}else{
    		    			Utils.alertinfo(retMsg);
    		    			Client.hideWaitPanel(1);
    		    		}
    		    	 }else{
    		    		 if(data.errorCode == 'ZXEB9006'){
     		    			  Client.alertinfo("请先完善身份信息","提示","curView.goOcr()",true);
     		    		  }else{
     		    			  Utils.alertinfo(data.errorMessage);
     		    		  }
    		    		 Client.hideWaitPanel(1);
    		    	 }
    				 
    			},error:function(){
    			 $("#submitBtn").removeClass('disabled').removeAttr('disabled');
   		   		 Client.hideWaitPanel(1);
    			}});
    		},
    		
    		goOcr : function(){
      			App.navigate("userRegister/userRegisterCtl/ocrCredit");
      		},
      		
    		ePaySendSMS : function(){
    			if($("#sendSMSBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
    				return;
    			}

    			$("#sendSMSBtn").addClass('disabled').attr('disabled',true);

    			var param = {
    					orderNo:this.orderNo,
   						mobileNo:this.mobileNo,
    			};
    			var $this = this;
    			
    			Ajax({url:"/transfer/life_in_ePaySendSMS", data:param, success:function(data){
  			    	 if(Utils.isEmpty(data.errorCode)){		//directServer报错
    					var retCode = data.retCode;
    					var retMsg = data.retMsg;
    					var count = 60;//60秒不允许再次发送
   			    		if(retCode=="000000"){		//hzpaylife报错
   			    			$this.timerID = setInterval(function(){
	    						$('#sendSMSBtn').val(count + '秒后重发');
	    						count--;
	    						if(count == 0||$("#sendSMSBtn").length==0){
	    							clearInterval($this.timerID);
	    							$("#sendSMSBtn").removeClass('disabled').removeAttr('disabled');
	    							$('#sendSMSBtn').val('发送验证码');
	    						}
	    					},1000);
	    					$('#sendSMSBtn').val(count+ '秒后重发');
	    					count--;
   			    		}else{
			    			$("#sendSMSBtn").removeClass('disabled').removeAttr('disabled');
			    			Utils.alertinfo(retMsg);
			    		}
    		
  			    	 }else{
						$("#sendSMSBtn").removeClass('disabled').removeAttr('disabled');
						Utils.alertinfo(data.errorMessage);
			    	}
    			},error:function(){
    				$("#sendSMSBtn").removeClass('disabled').removeAttr('disabled');
    			}});
    	  	},

 		//订单确认提交
 		doTaPaySubmit : function(){
  			    if($("#submitBtn2").attr('disabled')){ //确定按钮可点击
  			    	return;
  			    }
 				var checkCode = Utils.trim($("#ta_confim_code").val());	 			
 	  			var cardNo = Utils.trim($('#cardNo').html());
 	  			cardNo = cardNo.replace(/\s/g,"");
 	  			var tranAmt = Utils.trim($('#input_tranAmt').val());
 	  			tranAmt=Utils.removeComma(Utils.formatCurrency(tranAmt,2));

 				var checkNoResult = this.checkCheckNo(checkCode);
 				if ( !checkNoResult )return;
 				
 				var parampay = {
 						orderNo:this.orderNo,
 						payAccount:cardNo,
 						payAccountName:this.payName,
 						recAccount:this.eleCardNo,
 						tranAmt:tranAmt,
 						openNode:this.openNode,
 						certNo:this.certNo,
 						certType:'01',   //01身份证
 						mobileNo:this.mobileNo,
 						vCode:checkCode,
 						payBankName:this.orgName,
 						payBankNo:this.orgCode
 				};

 				Client.openWaitPanel("正在提交中，请稍候");
 				var $this = this;
 				$("#submitBtn2").addClass('disabled').attr('disabled',true);
 			   	Ajax({url:"/transfer/life_in_ePayPayVerify", data:parampay, success:function(data){
 			   		
 			    	if(Utils.isEmpty(data.errorCode)||data.errorCode=='00'){		//directServer报错
 			    		var retCode = data.retCode;
 			    		var retMsg = data.retMsg;
 			    		var cardNo = parampay.payAccount;
 			    		var recAccountNo = parampay.recAccount;
 			    		var tranAmt = parampay.tranAmt;
 			    		if(retCode=="000000"){		//hzpaylife报错
 				    		var orderNo = data.orderNo;
 				    		var orderState = data.orderState;
 				    		var tranState = data.tranState;
 				    		var errorCode= data.errorCode;
 				    		var errorMessage = data.errorMessage;
 				    		if(tranState=="10"){//指令处理中
 				    			Client.hideWaitPanel(1);
 				    			Client.openLucencyPanel();
 				    			$this.initPage7();
 				    		}else if(orderState == "20" && tranState=="20"){//成功
 			    				if(!MUI.isEmpty(App.storage.get("paramAccount"))){
 			    					App.storage.remove("paramAccount");	
 			    				}  
 			    				if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
 			    					App.storage.remove("balanceInfo");	
 			    				}  
 				    			if($this.activate){
 				    				$this.elecAccActivate(cardNo,tranAmt);
 				    			}else{
 				    				if($this.hongbaoStartTemp == "1"){
 				    					$("#hongbao").hide();
 				    				}
 									$("#submitBtn2").removeClass('disabled').removeAttr('disabled');
 			  			    		$("#payAcc_suc").text( Utils.formatAcc(cardNo) );
 			  			    		$("#recAccName_suc").text( Utils.formatAcc($this.eleCardNo) );
 			  			    		$("#recAmt_suc").text( Utils.formatCurrency(tranAmt)); 			
 			  			    		$this.initPage3();
 			  			    		Client.hideWaitPanel(1);
 				    			}
 					    	}else if((tranState=="20" && orderState!="20") || tranState=="40" ){//可疑
					    		$("#errorMessageText").text( "您的交易本行已经受理，稍后请查询交易结果！");
 	 				    		$this.initPage4();
 	 				    		Client.hideWaitPanel(1);
 					    	}else{
 					    		$("#errorMessageText").text( "失败原因："+errorMessage);
 	 				    		$this.initPage4();
 	 				    		Client.hideWaitPanel(1);
 					    	}
 			    		}else if((retCode == "HPPC1022") || (retCode == "HPPC1026") || (retCode == "HPPC1023") || (retCode == "HPPC1024") || (retCode == "HPPC1025")){
 							//'HPPC1022';--验证码输入格式不正确,请重新输入
 							//'HPPC1026';--验证码无效,请重新获取
 							//'HPPC1023';--验证码已过期，请重新生成之后再试
 							//'HPPC1024';--验证码错误次数超限，请重新生成
 							//'HPPC1025';--验证码输入错误,请重新输入
 							$("#submitBtn2").removeClass('disabled').removeAttr('disabled');
 			    			$("#ta_confim_code").val("");
 			    			Utils.alertinfo(retMsg);
 			    			Client.hideWaitPanel(1);
 			    		}else{
 				    		$("#errorMessageText").text( "失败原因："+retMsg);
 				    		$this.initPage4();
 				    		Client.hideWaitPanel(1);
 			    		}
 			    	}else{ 							
 			    		$("#submitBtn2").removeClass('disabled').removeAttr('disabled');
		    			$("#ta_confim_code").val("");
 			    		Utils.alertinfo(data.errorMessage);
				    	Client.hideWaitPanel(1);
 			    	}
 					 
 				},error:function(){
 					$("#submitBtn2").removeClass('disabled').removeAttr('disabled');
 					Client.hideWaitPanel(1);
 				}});
 			},
		 //激活
		 elecAccActivate:function(cardNo,tranAmt){
			 	$this =this;
				var param = {
						cardNo:this.eleCardNo
				};
				Ajax({url:"/pubServer/elecAccActivate",data:param, success:function(data){
					$("#submitBtn2").removeClass('disabled').removeAttr('disabled');
					var activityFlag = data.activityFlag;
					if(MUI.isEmpty(data.errorCode)){
						var userInfo = App.storage.get("UserInfo");					
						userInfo.iCardInfo[Utils.getEleCard().elecAccIndex].cardStatus = '01';
						App.storage.set("UserInfo",userInfo);//将参数放入session
						App.storage.set("activate",false);
						
						$("#resultTitle").text("恭喜您，激活成功！");
						if(activityFlag == "01"&&($this.hasResetPwd!='11')){
							$("#hongbao").show();
						}
  			    		$("#payAcc_suc").text( Utils.cardNoFomart(cardNo) );
  			    		$("#recAccName_suc").text( Utils.cardNoFomart($this.eleCardNo) );
  			    		$("#recAmt_suc").text( Utils.formatCurrency(tranAmt)); 			
  			    		$this.initPage3();
  			    		
					}else{							
						Utils.alertinfo(data.errorMessage);
					}
					Client.hideWaitPanel(1);
				}});
		 },
     	goPage1 : function(){
	   		$("#sendSMSBtn").removeClass('disabled').removeAttr('disabled');
			$('#sendSMSBtn').attr("data-value", "发送验证码");
	   		 this.showPage(1);
	   		 Client.initPageTitle(this.pageStep1);
    	},
        initPage1 : function(){
     	 	//初始化第二步菜单
	       	 var pageStep = {
	       		  	title:'充值',
	       			leftButton:{
	       				name : '返回',
	       				func: 'curView.goBack()'
	       			}
	       	 };	
	   		 Client.initPageTitle(pageStep);
	   		 this.showPage(1);
	   	},
  		
       initPage2 : function(){
     	 	//初始化第二步菜单
	       	 var pageStep2 = {
	       		  	title:'充值',
	       			leftButton:{
	       				name : '返回',
	       				func: 'curView.goPage1()'
	       			}
	       	 };	
       	 	$('#ta_confim_code').val('');
	   		 Client.initPageTitle(pageStep2);
	   		 this.showPage(2);
	   	},
	  		
	   	initPage3 : function(){//成功结果页面
			var pageStep = {
				title:'充值结果',
	  			leftButton:{
	  				name : '返回',
	  				func: 'curView.gotoAccount()'
	  			}
			};
			Client.initPageTitle(pageStep);
			this.showPage(3);
		},
	   	initPage4 : function(){//成功结果页面
			var pageStep = {
				title:'充值结果',
	  			leftButton:{
	  				name : '返回',
	  				func: 'curView.gotoAccount()'
	  			}
			};
			Client.initPageTitle(pageStep);
			this.showPage(4);
		},
	   	initPage6 : function(){//成功结果页面
			var pageStep = {
				title:'选择付款账号',
	  			leftButton:{
	  				name : '返回',
	  				func: 'curView.goPage1()'
	  			}
			};
			Client.initPageTitle(pageStep);
			this.showPage(6);
		},
	   	initPage7 : function(){//成功结果页面
			var pageStep = {
				title:'等待确认',
	  			leftButton:{
	  				name : '返回',
	  				func: 'curView.goPage1()'
	  			}
			};
			Client.initPageTitle(pageStep);
			this.showPage(7);
			var num=5;
			var $this=this;
			var timerID2 = setInterval(function(){
				$('#waitTime').text(num);
				if(num == 0||$("#waitTime").length==0){
					clearInterval(timerID2);
					$this.ePayAsynchronzation();
				}
				num--;
			},1000);
		},
  	  	//控制页面显示
  	  	showPage : function(num){
  	  	   $(".new2016").hide();
  	  	   if('1' == num){
	  	  		$('#sendSMSBtn').val('发送验证码');
	        	clearInterval(this.timerID);
  	  	   }
		   $("#incomePage"+num).show();   
        },
        checkCheckNo : function(checkNo){
    		var isInteger = RegExp(/^\d{6}$/);
    		var flag = isInteger.test(checkNo);
    		if(checkNo.length!=6||!flag){
    			Utils.alertinfo("请输入6位短信验证码！");
    			return false;
    		}else{
    			return true;
    		}
    	},
    	
    	selectCardList:function(){
    		var iCardList = App.storage.get("userCardList");
    		$("#bankList").empty();
     		for(var i=0;i<iCardList.length;i++){
	  			var kcoll=iCardList[i];
	  			this.addRow(kcoll);
	  		}
     		$this=this;
     	  	$('.bankCountList .itm').off().on('click', function(){
     			$(this).addClass('active').siblings().removeClass('active');
     			var dataValue = $(this).attr("data-value");
     			var data = dataValue.split("|");
     			$this.cardNo = data[0];
     			$this.bandFlag = data[1];
     			$this.cardType = data[2];
     			$this.bankIconUrl = data[3];
     			$this.mobileNo = data[4];
     			$this.orgName = data[5];
     			$this.orgCode = data[6];
  				$("#bankName").html($this.orgName).attr("data-val",$this.orgCode);
  				$("#cardNo").html(Utils.getFmtAcc($this.cardNo));
  				var bankClass = 'ar-'+($this.bankIconUrl).split('_')[1];		  						
  				$("#cardClass").removeClass().addClass("add-card area "+bankClass);
  				if($this.cardType!="04"&&$this.bindCardNo != $this.cardNo){
  					$("#inputPasswd").show();
  				}else{
  					$("#inputPasswd").hide();
  				}
  				$this.initPage1();

     		});
			this.initPage6();
    	},
    	addRow:function(kcoll){
    		var htmlClass ="itm ";
    		if(kcoll.cardNo == this.cardNo){
    			htmlClass+="active";
    		}
    		var bankIconUrl = kcoll.bankIconUrl;
    		var bankClass = 'bnk-'+bankIconUrl.split('_')[1];	
    		
    		var dataValue = kcoll.cardNo+"|"+kcoll.bandFlag+"|"+kcoll.cardType+"|"+kcoll.bankIconUrl+"|"+kcoll.mobileNo+"|"+kcoll.bankName+"|"+kcoll.orgCode;
    		$("#bankList").append('<div class="'+htmlClass+'" data-value="'+dataValue+'">'+
    	        	'<i class="ico-bnk '+bankClass+'"></i>'+kcoll.bankName+'('+this.getCardfour(kcoll.cardNo)+')'+
    	            '</div>');
    	},
    	getCardfour:function(cardNo){
    		if(!cardNo){
    			return "";
    		}
    		return cardNo.substring(cardNo.length-4,cardNo.length);
    	},
    	addCard:function(){
    		App.navigate("myBankCard/myBankCardCtl/addCard");
    	},

    	tranDisc : function(){
			App.navigate("bosera/boseraCtl/tranDisc");
		},

    	gotoHongBao : function(){
  	    	Client.menuOpt("0");
			App.navigate("hongbao/hongbaoCtl/redPacketInviteIndex");
  	    }, 

    	gotoAccount:function(){
    		App.navigate("account/mycountCtl/mycount");
    	},
		//他行无跳转支付通知结果查询
    	ePayAsynchronzation:function(){
		 	var $this =this;
			var param = {
					orderNo:this.orderNo
			};
			Client.hideLucencyPanel();
			Client.openWaitPanel("正在提交中，请稍候");
			Ajax({url:"/transfer/ePayAsynchronzation",data:param, success:function(data){
			    	if(Utils.isEmpty(data.errorCode)||data.errorCode=='00'){		//directServer报错
 			    		var retCode = data.retCode;
 			    		var retMsg = data.retMsg;
 			    		var cardNo = data.payAccount;
 			    		var recAccountNo = data.recAccount;
 			    		var tranAmt = data.tranAmt;
 			    		if(retCode=="000000"){		//hzpaylife报错
 				    		var orderNo = data.orderNo;
 				    		var orderState = data.orderState;
 				    		var tranState = data.tranState;
 				    		var errorCode= data.errorCode;
 				    		var errorMessage = data.errorMessage;

 				    		if(orderState == "20" && tranState=="20"){//成功
 	
 			    				if(!MUI.isEmpty(App.storage.get("paramAccount"))){
 			    					App.storage.remove("paramAccount");	
 			    				}  
 			    				if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
 			    					App.storage.remove("balanceInfo");	
 			    				}  
 				    			if($this.activate){
 				    				$this.elecAccActivate(cardNo,tranAmt);
 				    			}else{
 				    				if($this.hongbaoStartTemp == "1"){
 				    					$("#hongbao").hide();
 				    				}
 									$("#submitBtn2").removeClass('disabled').removeAttr('disabled');
 			  			    		$("#payAcc_suc").text( Utils.formatAcc(cardNo) );
 			  			    		$("#recAccName_suc").text( Utils.formatAcc($this.eleCardNo) );
 			  			    		$("#recAmt_suc").text( Utils.formatCurrency(tranAmt)); 			
 			  			    		$this.initPage3();
 			  			    		Client.hideWaitPanel(1);
 				    			}
 					    	}else if((tranState=="20" && orderState!="20") || tranState=="40" ){//可疑 					    	
					    		$("#errorMessageText").text( "您的交易本行已经受理，稍后请查询交易结果！");
 	 				    		$this.initPage4();
 	 				    		Client.hideWaitPanel(1);
 					    	}else{

 					    		$("#errorMessageText").text( "失败原因："+errorMessage);
 	 				    		$this.initPage4();
 	 				    		Client.hideWaitPanel(1);
 					    	} 	
 			    		}else{
 				    		$("#errorMessageText").text( "失败原因："+retMsg);
 				    		$this.initPage4();
 				    		Client.hideWaitPanel(1);
 			    		}
 			    	}else{
// 			    		Utils.alertinfo(data.errorMessage);
//				    	Client.hideWaitPanel(1);
				    	$("#errorMessageText").text( "失败原因："+data.errorMessage);
				    	$this.initPage4();
				    	Client.hideWaitPanel(1);
 			    	}
			}});
		 },
	});
});