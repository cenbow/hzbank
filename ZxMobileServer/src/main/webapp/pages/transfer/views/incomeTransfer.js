define(function (require, exports, module) {
	
	var incomeTransferTemplate = require("text!../template/incomeTransfer.html");
	
	var incomeTransferView = module.exports = ItemView.extend({
		
        template : incomeTransferTemplate,
        
        events:{
       	    "click #pwd" : "showPassword",
        	'click #inputSubButton':"doSubmit",
        	'click #inputKamiSubButton':"doKamiSubmit",
        	'blur #cardNoText':"checkCardBin",
        	'blur #tranAmtText':"checkAmount",
        	'click #ta_nextStep':"doTaPayApply",
        	'click #sendSMSBtn':"ePaySendSMS",        	
        	'click #ta_submit':"doTaPaySubmit",        	
        	"click .camera" : "ocrBankCard",
        	"click #toHistory" : "toHistory",
        	"click #dubBackButton,#succBackButton" : "toAccount"
        },

        initialize : function(){
        	
	       	 this.pageStep1 = {
	       		  	title:'充值',
	       			leftButton:{
	       				name : '返回',
	       				func: 'curView.goBack()'
	       			},
	       			rightButton:{
	       				name : '帮助',
	       				func : 'curView.help()'
	       			}
	       	  };	       	 
	       	  Client.initPageTitle(this.pageStep1);
	     	 
	       	  this.pageStep3 = {
	       			  title:'充值',
	       			  leftButton:{
	       				  name : '返回',
	       				  func: 'curView.goPage1()'
	       			  }
	       	  };
			  this.isFlag1=false;
			  this.isFlag2=true;

	       	  var $this = this;
	       	  if(MUI.isEmpty(App.storage.get("bindCardInfo"))){
		  		  this.getBindCardInfo();
		  	  }else{
		  		  this.param = {
						bindCardNo :Utils.trim(App.storage.get("bindCardInfo").bindCardNo),//绑定卡号 
						cardType :Utils.trim(App.storage.get("bindCardInfo").cardType),//绑定卡类型  04他行   
						bankName : Utils.trim(App.storage.get("bindCardInfo").bankName),//绑定卡银行名称
						bankType : Utils.trim(App.storage.get("bindCardInfo").bankType)//绑定卡银行类型				
//						/*他行充值测试数据  kym0710*/
//						bindCardNo : "6222988812340000",//绑定卡号
//					cardType : "04",//绑定卡类型  04他行   
//					bankName : "平安银行",//绑定卡银行名称
//					bankType : "03080000"//绑定卡银行类型
//						 					
//						
//						/*本行充值测试数据  prl1203*/
//				    bindCardNo :"603367571010284337",//绑定卡号
//					cardType :"01",//绑定卡类型  04他行   
//					bankName : "杭州银行",//绑定卡银行名称
//					bankType : "Utils.getParamDisplay("ORG_CODE","hzbank")"//绑定卡银行类型
						 
		  		  };
		  		  this.init(this.param);
		  	  }
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
    	},
        
        init : function(param){
        	var session = App.storage.get("UserInfo");
        	this.payName = Utils.trim(session.customerNameCN);
        	this.mobileNo = Utils.trim(session.regMobile);
      	  	this.certNo = Utils.trim(session.certNo);
      	 
      	  	this.eleCardNo =Utils.trim(Utils.getEleCard().cardNo);//电子账号
      	  	this.accountType2 =Utils.trim(Utils.getEleCard().accountType);//电子账户类型
      	  	this.openNode = Utils.trim(Utils.getEleCard().cardOpenNode);//
      	  	
      	  	$('#ta_mobileText').val(this.mobileNo);
      	  	$('#recAccountText').text(Utils.formatAcc(this.eleCardNo));
      	  	$('#cardNoText').val(param.bindCardNo);
      	  	$('#confim_recAcc').text(Utils.formatAcc(this.eleCardNo));
      	  	$('#confim_recAccName').text("("+this.payName+")");
	      	  var bindCardInfo = App.storage.get("bindCardInfo");
	      	  if(bindCardInfo&&bindCardInfo.orgCode){
	      		$('#bankNameText').val(bindCardInfo.orgName);
	      		this.bankName = bindCardInfo.orgName;
	      		this.bankClass = bindCardInfo.bankClass;
				$('#bankIconUrlText').removeClass().addClass(bindCardInfo.bankClass);
				$("#bankIconUrlText").show();
				this.showFalg(bindCardInfo.val);
				this.param = bindCardInfo;
				this.orgCode = bindCardInfo.orgCode;
				this.orgName = bindCardInfo.orgName;
	      	  }else{
	        	  	this.checkCardBin();  
	      	  }
      	  	
      	  	if(MUI.isEmpty(App.storage.get("paramAccount"))){//判断是否已将余额存入缓存中
      	  		Utils.queryCommBalance(this.eleCardNo,this.accountType2);
      	  	}else{
      	  		var balance = App.storage.get("paramAccount").balance;
      	  		$("#showBalanceSpan").text (balance);
      	  		Client.hideWaitPanel(1);
      	  	}
      	  	
  	  },
  	  //记录充值账户
  	  recordAccount : function(payAccount,payBankName,cardType,payBankNo){
  		    var $this=this;
	  		var param = {
					payAccount:payAccount,
					payBankName:payBankName,
					bankIconUrl:this.bankClass,
					cardType:cardType,
					payAccountName:this.payName,
					payBankNo:payBankNo
			};
			Ajax({url:"/transfer/recordAccount",data:param,
				success : function(data) {
					$this.isFlag2=true;
					$this.isShow();
				}
			});
		},
    	//获取绑定卡信息
    	getBindCardInfo:function(){
    			var elecCardNo = Utils.getEleCard().cardNo;//获取电子账号
    			var queryParam = {
    					cardNo:elecCardNo
    			};
    			var $this = this;
    			Ajax({url:"/account/elecAccBindQuery", data:queryParam, success:function(data){
    				Client.hideWaitPanel(1);
    				if(data.errorCode == undefined){
    					var bindCardInfo={
  							elecCardNo:elecCardNo,
  							bindCardNo:data.cd.bindCardNo,
  							cardType:data.cd.cardType,
  							bankName:data.cd.bankName,
  							bankType:data.cd.bankType
  					};
    					
    					App.storage.set("bindCardInfo",bindCardInfo);//保存绑定卡信息
    					$this.init(bindCardInfo);
    					
    				 }else if(data.errorCode == '-77333'){
    					
    				}
    		    }});
    	   },
		//根据卡号查询银行
		checkCardBin : function(){	
			var cardNo = Utils.trim($('#cardNoText').val());
			if(MUI.isEmpty(cardNo)||cardNo.length<5){
				Utils.alertinfo("请输入正确的卡号");
				return;
			}
			var $this = this;
			var params = {
					cardNo:cardNo,
					queryType:'1'
			};
    		Client.openWaitPanel("拼命加载中，请稍候");
		   	Ajax({url:"/bank/checkCardBin", data:params, success:function(data){
				Client.hideWaitPanel(1);
		   		if(data.errorCode == undefined){
					var icoll = data.iCardBinInfo;

		    		if(icoll!=null&&icoll.length>0){
		    			
						var kColl = icoll[0];
						var orgCode = kColl.orgCode;
						var orgName = kColl.orgName;
						$this.bankName = orgName;
						$this.orgCode = orgCode;
						$this.orgName = orgName;
						var bankIconUrl = kColl.bankIconUrl;
						$this.bankClass = 'ico-bnk bnk-'+bankIconUrl.split('_')[1]+' mr5';
						$('#bankNameText').val(orgName);
						$('#bankIconUrlText').removeClass().addClass($this.bankClass);
						$("#bankIconUrlText").show();
						var val='0';
					    if(orgCode==Utils.getParamDisplay("ORG_CODE","hzbank")){//本行
							var bindCardNo = App.storage.get("bindCardInfo").bindCardNo;
							if(cardNo == bindCardNo){//本行绑定卡
								val='1';
							}else{
								val='2';
							}
						}else{
							val='3';
					    }
					    var bindCardInfo = App.storage.get("bindCardInfo");
					    if(bindCardInfo.bindCardNo==cardNo){
					    	bindCardInfo.orgCode = orgCode;
					    	bindCardInfo.orgName = orgName;
					    	bindCardInfo.bankClass = $this.bankClass;
					    	bindCardInfo.val = val;
					    	App.storage.set("bindCardInfo",bindCardInfo);					    	
					    }
						$this.showFalg(val);
						$this.param = bindCardInfo;
				    }else{
				    	Utils.alertinfo('该卡暂不能充值！');  				    	
				    	$("#bankNameText").val("他行");
						$("#bankIconUrlText").hide();
						$this.showFalg(0);
				    }
		    		
				}else{
					Utils.alertinfo(data.errorMessage);
			    	$("#bankNameText").val("他行");
					$("#bankIconUrlText").hide();
					$this.showFalg('0');
				}
			}});
		},

		showFalg : function(val){
			if(val=='1'){//本行绑定卡
				$("#ta_mobileDiv").hide();
				$("#inputPasswd").hide();
				$("#inputSubDiv").show();
				$("#inputKamiSubDiv").hide();
				$("#ta_nextStepDiv").hide();
			}else if(val=='2'){//本行非绑定卡
				$("#ta_mobileDiv").hide();
				$("#inputPasswd").show();
				$("#inputSubDiv").hide();
				$("#inputKamiSubDiv").show();
				$("#ta_nextStepDiv").hide();
			}else if(val=='3'){
				$("#ta_mobileDiv").show();
				$("#inputPasswd").hide();
				$("#inputSubDiv").hide();
				$("#inputKamiSubDiv").hide();
				$("#ta_nextStepDiv").show();	
			}else{
				$("#inputSubDiv").show();
				$("#inputKamiSubDiv").hide();
				$("#ta_nextStepDiv").hide();
	 			$("#inputSubButton").addClass('disabled').attr('disabled',true);
			}
	  },
	  	//本行转入提交
 	   doSubmit :	function (){
 		   var $this = this;
 			var inputPayAccount = Utils.trim($('#cardNoText').val());
 			var tranAmt = Utils.trim($('#tranAmtText').val());
 
 			if(!this.checkCardNo(inputPayAccount) || !Utils.checkAmount(tranAmt)){
 				return false;
 			}

 			if((inputPayAccount != this.param.bindCardNo) && (this.param.cardType!='04')){ //判断是否输入的是绑定的本行卡
 				this.showFalg('2');
 				return false;;
 			}

 			Client.openWaitPanel("正在提交中，请稍候");
 			
 			var params = {
 		   			payAccount:inputPayAccount,
 					accountType:this.param.cardType,
 					recAccount:this.eleCardNo,
 					accountType2:this.accountType2,
 					payAmount:tranAmt,
 					openNode:this.openNode,					
 		 	};
 			$("#inputSubButton").addClass('disabled').attr('disabled',true);
 		 	Ajax({url:"/transfer/life_transferSameUserSub", data:params, success:function(data){
 				 
 				 $("#inputSubButton").removeClass('disabled').removeAttr('disabled');
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
 					 
 					 var bindCardNo = $this.param.bindCardNo;
 					 var recAccountNo = $this.eleCardNo;
 					 if(orderState == "20"){//成功
	    				 if(!MUI.isEmpty(App.storage.get("paramAccount"))){
		    					App.storage.remove("paramAccount");	
	    				 }  
	    				 if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
	    					App.storage.remove("balanceInfo");	
	    				 } 
 			    		$("#payAcc_suc").text( "转出账户："+Utils.cardNoFomart(bindCardNo) );
 			    		$("#recAccName_suc").text( Utils.cardNoFomart(recAccountNo) );
 			    		$("#recAmt_suc").text( Utils.formatCurrency(tranAmt)); 			
 			    		$this.initPage3();
 						$this.isFlag1=true;
 			    		$this.recordAccount(inputPayAccount,"杭州银行","1","");
 			    	 }else if(orderState == "10"){//可疑
 			    		 $("#payAcc_dub").text( "转出账户："+Utils.cardNoFomart(bindCardNo) );
 			    		 $("#recAccName_dub").text( Utils.cardNoFomart(recAccountNo) );
 			    		 $("#recAmt_dub").text( Utils.formatCurrency(tranAmt));
 			    		$this.initPage5();
 			    		Client.hideWaitPanel(1);
 			    	 }else{//失败
 			    		 $("#payAcc_err").text( "转出账户："+Utils.cardNoFomart(bindCardNo) );
 				    	 $("#recAccName_err").text( Utils.cardNoFomart(recAccountNo) );
 				    	 $("#recAmt_err").text( Utils.formatCurrency(tranAmt));
 				    	 $("#errorMessageText").text ( "失败原因："+data.errorMessage);
 				    	$this.initPage4();
 				    	Client.hideWaitPanel(1);
 			    	 }
 		    	  }else{
 		    		Utils.alertinfo(data.errorMessage);
 		    		Client.hideWaitPanel(1);
 		    	  }
 				 
 			},error:function(){
 				$("#inputSubButton").removeClass('disabled').removeAttr('disabled');
 				Client.hideWaitPanel(1);
 			}});
 			
 		},
 	  	//本行卡密转入提交
  		doKamiSubmit : function(){
 			var kamiPayAccount = Utils.trim($('#cardNoText').val());
 			var tranAmt = Utils.trim($('#tranAmtText').val());
  			var bindCardNo = this.param.bindCardNo;
  			var cardType = this.param.cardType;
  			var recAccountNo=this.eleCardNo;
  			if(!this.checkCardNo(kamiPayAccount) || !Utils.checkAmount(tranAmt)){
  				return false;
  			}
  			
  			if((kamiPayAccount == bindCardNo) && (cardType!='04')){ //判断是否输入的是绑定的本行卡
  				this.doSubmit();
  				return false;
  			}		
  			
  			if(Utils.isEmpty(this.password)){
  				Utils.alertinfo("密码不能为空！");
  				return false;
  			}
  			$("#inputKamiSubButton").addClass('disabled').attr('disabled',true);
  			//url = "life_KamiInnerTransfer.do";
  			var params = {
  					payAccount:kamiPayAccount,
  					recAccount:recAccountNo,
  					recAccountName:this.payName,
  					accountType2:this.accountType2,
  					payAmount:tranAmt,
  					openNode:this.openNode,
  					password:this.password,
  					pwdkey:this.pwdkey,
  			};
  			Client.openWaitPanel("正在提交中，请稍候");
  		   	var $this = this;
  		   	Ajax({url:"/transfer/life_KamiInnerTransfer", data:params, success:function(data){
  		   		$("#inputKamiSubButton").removeClass('disabled').removeAttr('disabled');
   				 if(Utils.isEmpty(data.errorCode)){		//zxServer报错
  					 var orderFlowNo = data.orderFlowNo;
  					 var orderState = data.orderState;
  					 var scoreTotal = data.scoreTotal;//总积分
  					 var scoreCurr = data.scoreCurr;//当前交易所得积分
  					 var orderSubmitTime = data.orderSubmitTime;
  					 var hostReturnCode = data.hostReturnCode;
  					 var hostErrorMessage = data.hostErrorMessage;
  					 var chargeFee = data.chargeFee;

  			    	 if(orderState == "20"){
	    				 if(!MUI.isEmpty(App.storage.get("paramAccount"))){
	    					App.storage.remove("paramAccount");	
	    				 }  
	    				 if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
	    					App.storage.remove("balanceInfo");	
	    				 } 
  			    		 $("#payAcc_suc").text( "转出账户："+Utils.cardNoFomart(kamiPayAccount) );
  			    		 $("#recAccName_suc").text( Utils.cardNoFomart(recAccountNo) );
  			    		 $("#recAmt_suc").text( Utils.formatCurrency(tranAmt));
  			    		 $this.initPage3();
  						 $this.isFlag1=true;
 			    		 $this.recordAccount(kamiPayAccount,"杭州银行","2","");
  			    	 }else if(orderState == "10"){//可疑
  			    		 $("#payAcc_dub").text( "转出账户："+Utils.cardNoFomart(kamiPayAccount) );
  			    		 $("#recAccName_dub").text( Utils.cardNoFomart(recAccountNo) );
  			    		 $("#recAmt_dub").text( Utils.formatCurrency(tranAmt));
  			    		 $this.initPage5();
  		  		   		 Client.hideWaitPanel(1);
  			    	 }else{
  			    		 $("#payAcc_err").text( "转出账户："+Utils.cardNoFomart(kamiPayAccount) );
  			    		 $("#recAccName_err").text( Utils.cardNoFomart(recAccountNo) );
  			    		 $("#recAmt_err").text( Utils.formatCurrency(tranAmt));
  			    		 $("#errorMessageText").text ( "失败原因："+data.errorMessage);
  			    		 $this.initPage4();
  		  		   		 Client.hideWaitPanel(1);
  			    	 }
  		    	  }else{
  		    		 Utils.alertinfo(data.errorMessage);
  	  		   		 Client.hideWaitPanel(1);
  		    	  }
   	 			 $("#pwd").val("");
    			 $this.password=$this.pwdkey="";
  		   		 Client.loadPwdKey();//重载随机数 
  			},error:function(){
	  		   	 Client.hideWaitPanel(1);
  		   		 $("#inputKamiSubButton").removeClass('disabled').removeAttr('disabled');
  				 $("#pwd").val("");
    			 $this.password=$this.pwdkey="";
  		   		 Client.loadPwdKey();//重载随机数 
  			}});
  		   	
  		},
   	   //他行转入下一步--订单申请
   	   doTaPayApply : function (){
 			if($("#ta_nextStep").attr('disabled')){ //确定按钮可点击
 				return;
 			}
 			var cardNo = Utils.trim($('#cardNoText').val());
   			var mobileNo = Utils.trim($('#ta_mobileText').val());
   			
//   			mobileNo = "13552535507";
//   			this.certNo = "341126197709218366";
//   			this.payName = "互联网";
  
 			var tranAmt = Utils.trim($('#tranAmtText').val());
   			if(!this.checkCardNo(cardNo) || !Utils.checkAmount(tranAmt)){
   				return false;
   			}
			if (Utils.isEmpty(mobileNo)){
		    	Utils.alertinfo("请输入的手机号码");	
				return;
			}
			
			if (!this.checkMobile(mobileNo)){
		    	Utils.alertinfo("您输入的手机号码有误，请重新输入");	
				return;
			}
   			$("#ta_nextStep").addClass('disabled').attr('disabled',true);
   			var parampay = {
   					payAccount:cardNo,
   					payAccountName:this.payName,
   					certNo:this.certNo,
   					certType:'01',   //01身份证
   					mobileNo:mobileNo,
   					amount:tranAmt,
   					recAccount:this.eleCardNo,
   					accountType2:this.accountType2,
   			};
   			var $this = this;
   			Client.openWaitPanel("正在提交中，请稍候");
   		   	Ajax({url:"/transfer/life_in_ePayPayApply", data:parampay, success:function(data){
   		   		 Client.hideWaitPanel(1);
   		   		 $("#ta_nextStep").removeClass('disabled').removeAttr('disabled');
   		   		 var retCode = data.retCode;
   		    	 var retMsg = data.retMsg;
   				 if(Utils.isEmpty(data.errorCode)){		//zxServer报错
   		    		if(retCode=="000000"){		//hzpaylife报错
   		    			$this.orderNo = data.orderFlowNo;
   			    		var tranState = data.tranState;
   			    		var returnErrCode = Utils.nvl(data.returnErrCode,'0');
   			    		var returnErrMessage = data.returnErrMessage;
   			    		if(returnErrCode=='00' || returnErrCode=='0' || returnErrCode.length=='0'){
   			    			$("#confim_payAcc_class").removeClass().addClass($this.bankClass);
   			    			$('#confim_payAcc').text(Utils.cardNoFomart(cardNo));
   							$('#confim_tranAmt').text(Utils.formatCurrency(tranAmt)+"元");
   							$this.initPage2();
   			    		}else{
   			    			Utils.alertinfo(returnErrMessage);
   			    		}
   		    		}else{
   		    			Utils.alertinfo(retMsg);
   		    		}
   		    	 }else{
   		    		 Utils.alertinfo(data.errorMessage);
   		    	 }
   				 
   			},error:function(){
   				$("#ta_nextStep").removeClass('disabled').removeAttr('disabled');
  		   		 Client.hideWaitPanel(1);
   			}});
   		},
		//发送验证码
		 ePaySendSMS : function(){
	 			if($("#sendSMSBtn").attr('disabled')){ //确定按钮可点击
	 				return;
	 			}
				$("#sendSMSBtn").addClass('disabled').attr('disabled',true);
				var parampay = {
						orderNo:this.orderNo,
						mobileNo:this.mobileNo,
				};
			   	var $this = this;
			   	Ajax({url:"/transfer/life_in_ePaySendSMS", data:parampay, success:function(data){
					var retCode = data.retCode;
			    	var retMsg = data.retMsg;
			    	 if(Utils.isEmpty(data.errorCode)){		//directServer报错
			    		if(retCode=="000000"){		//hzpaylife报错
			    			var count = 60;//60秒不允许再次发送
			    			var mess = '短信验证码已发送到您尾号为'+$this.mobileNo.substring(7,11)+'的手机上，有效期'+count+'秒';
				    		
				    		//$('#ta_submit').attr("disabled",false);
				    		$("#ta_submit").removeClass('disabled').removeAttr('disabled');
				    		$this.sendSMSInterval(count);
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
		//发送短信验证码倒计时
	 	sendSMSInterval : function(count){
	 		var $this = this;
			$('#sendSMSBtn').attr("data-value", count + '秒重发');
			count--;
			if(count == 0){
				$("#sendSMSBtn").removeClass('disabled').removeAttr('disabled');
				$('#sendSMSBtn').attr("data-value", "获取验证码");
			}else{
				setTimeout(function(){
					$this.sendSMSInterval(count);
				},1000);
			}
		 },
		//订单确认提交
		doTaPaySubmit : function(){
 			    if($("#ta_submit").attr('disabled')){ //确定按钮可点击
 			    	return;
 			    }
				var checkCode = Utils.trim($("#ta_confim_code").val());
	 			var cardNo = Utils.trim($('#cardNoText').val());
	 			var tranAmt = Utils.trim($('#tranAmtText').val());
	 			
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
				$("#ta_submit").addClass('disabled').attr('disabled',true);
			   	Ajax({url:"/transfer/life_in_ePayPayVerify", data:parampay, success:function(data){
			   		
					var retCode = data.retCode;
			    	var retMsg = data.retMsg;
			    	var cardNo = parampay.payAccount;
		    		var recAccountNo = parampay.recAccount;
		    		var tranAmt = parampay.tranAmt;
			    	if(data.errorCode == undefined){		//zxServer报错
			    		if(retCode=="000000"){		//hzpaylife报错
				    		var orderNo = data.orderNo;
				    		var orderState = data.orderState;
				    		var tranState = data.tranState;
				    		var errorCode= data.errorCode;
				    		var errorMessage = data.errorMessage;
				    		if(orderState == "20" && tranState=="20"){//成功
				    			var activate = App.storage.get("activate");
			    				if(!MUI.isEmpty(App.storage.get("paramAccount"))){
			    					App.storage.remove("paramAccount");	
			    				}  
			    				if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
			    					App.storage.remove("balanceInfo");	
			    				}  
				    			if(activate){
				    				$this.elecAccActivate();
				    			}else{		
									$("#ta_submit").removeClass('disabled').removeAttr('disabled');
				    				$("#payAcc_suc").text( "转出账户："+Utils.cardNoFomart(cardNo) );
				    				$("#recAccName_suc").text( Utils.cardNoFomart(recAccountNo) );
				    				$("#recAmt_suc").text( Utils.formatCurrency(tranAmt));
				    				$this.initPage3();
									$this.isFlag1=true;
				    			}
				    			$this.recordAccount(cardNo,$this.orgName,"3",$this.orgCode);
					    	}else if((tranState=="20" && orderState!="20") || tranState=="40" ){//可疑
								$("#ta_submit").removeClass('disabled').removeAttr('disabled');
					    		$("#payAcc_dub").text( "转出账户："+Utils.cardNoFomart(cardNo) );
					    		$("#recAccName_dub").text( Utils.cardNoFomart(recAccountNo) );
					    		$("#recAmt_dub").text( Utils.formatCurrency(tranAmt));
					    		$this.initPage5();
					    		Client.hideWaitPanel(1);
					    	}else{
								$("#ta_submit").removeClass('disabled').removeAttr('disabled');
					    		$("#payAcc_err").text( "转出账户："+Utils.cardNoFomart(cardNo) );
					    		$("#recAccName_err").text( Utils.cardNoFomart(recAccountNo) );
					    		$("#recAmt_err").text( Utils.formatCurrency(tranAmt));
					    		$("#errorMessageText").text( "失败原因："+data.errMessage);
					    		$this.initPage4();
					    		Client.hideWaitPanel(1);
					    	}
			    		}else if((retCode == "HPPC1022") || (retCode == "HPPC1026") || (retCode == "HPPC1023") || (retCode == "HPPC1024") || (retCode == "HPPC1025")){
							//'HPPC1022';--验证码输入格式不正确,请重新输入
							//'HPPC1026';--验证码无效,请重新获取
							//'HPPC1023';--验证码已过期，请重新生成之后再试
							//'HPPC1024';--验证码错误次数超限，请重新生成
							//'HPPC1025';--验证码输入错误,请重新输入
							$("#ta_submit").removeClass('disabled').removeAttr('disabled');
			    			$("#ta_confim_code").val("");
			    			Utils.alertinfo(retMsg);
			    			Client.hideWaitPanel(1);
			    		}else{
							$("#ta_submit").removeClass('disabled').removeAttr('disabled');
					    	$("#payAcc_err").text( Utils.cardNoFomart(cardNo) );
				    		$("#recAccName_err").text( Utils.cardNoFomart(recAccountNo) );
				    		$("#recAmt_err").text( Utils.formatCurrency(tranAmt));
				    		$("#errorMessageText").text( "失败原因："+retMsg);
				    		$this.initPage4();
				    		Client.hideWaitPanel(1);
			    		}
			    	}else{
						$("#ta_submit").removeClass('disabled').removeAttr('disabled');
			    		$("#payAcc_err").text ( Utils.cardNoFomart(cardNo) );
			    		$("#recAccName_err").text ( Utils.cardNoFomart(recAccountNo) );
			    		$("#recAmt_err").text ( Utils.formatCurrency(tranAmt));
			    		$("#errorMessageText").text ( "失败原因："+data.errorMessage);
			    		$this.initPage4();
			    		Client.hideWaitPanel(1);
			    	}
					 
				},error:function(){
					$("#ta_submit").removeClass('disabled').removeAttr('disabled');
					Client.hideWaitPanel(1);
				}});
			},
		 //激活
		 elecAccActivate:function(){
			 	$this =this;
				var cardNo = Utils.getEleCard().cardNo;
				var param = {
						cardNo:cardNo
				};
				Ajax({url:"/pubServer/elecAccActivate",data:param, success:function(data){
					$("#ta_submit").removeClass('disabled').removeAttr('disabled');
					if(MUI.isEmpty(data.errorCode)){
						var userInfo = App.storage.get("UserInfo");					
						userInfo.iCardInfo[Utils.getEleCard().elecAccIndex].cardStatus = '01';
						App.storage.set("UserInfo",userInfo);//将参数放入session
						App.storage.set("activate",false);
				 		App.navigate("settings/setCenterCtl/activateSuccess");
					}else{							
						Utils.alertinfo(data.errorMessage);
					}
					$this.isFlag1=true;
					$this.isShow();
				}});
		 },
		 isShow : function(){
			if(this.isFlag1&&this.isFlag2){
				Client.hideWaitPanel(1); 
			} 
		 },
        checkCheckNo : function(checkNo){
    		var isInteger = RegExp(/^\d{6}$/);
    		var flag = isInteger.test(checkNo);
    		if(checkNo.length!=6||!flag){
    			Utils.alertinfo("请输入手机验证码！");
    			return false;
    		}else{
    			return true;
    		}
    	},
        checkCardNo : function(cardNoT){
    		if(Utils.isNum(cardNoT)){
    			return true;
    		}else if((cardNoT == this.eleCardNo)){ //判断是否输入的是绑定的电子账户
    			Utils.alertinfo("银行卡号不可与电子账户一致！");	
    			return false;
    		}else if((cardNoT.length > 19)){ //判断是否输入的是绑定的电子账户
    			Utils.alertinfo("请输入不超过19位的银行卡号！");	
    			return false;
    		}else{
    			Utils.alertinfo("请输入卡号");	
    			return false;
    		}
    	},
      ocrBankCard : function(){
			Client.ocrBankCard("curView.cardRes");
	  },
		
	  cardRes : function(num){
			$('#cardNoText').val(num);		  
			this.checkCardBin();
	  },
	  
      goBack : function(){
      	App.back();
      },
      
      help : function(){
   		  App.navigate("anymore/anymoreCtl/messageCenter");
   	 },
  	  //控制页面显示
  	  showPage : function(num){
      	  for(var i=1;i<=7;i++){
      		  if(i==num){
      			  $("#incomePage"+i).show();
      		  }else{
      			  $("#incomePage"+i).hide();
      		  }
      	  }
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
	   		App.storage.remove("paramAccount");
			var pageStep = {
				title:'充值',
	  			leftButton:{
	  				name : '返回',
	  				func: 'curView.toAccount()'
	  			}
			};
			Client.initPageTitle(pageStep);
			this.showPage(3);
		},
		initPage4 : function(){//错误结果页面
			var $this = this;
			$('#errorBackButton').on('click',function(){
				$this.goPage1();
			});
			Client.initPageTitle(this.pageStep3);
			this.showPage(4);
		},
		
		initPage5 : function(){//可疑结果页面
	   		App.storage.remove("paramAccount");
			var $this = this;
			Client.initPageTitle(this.pageStep3);
			this.showPage(5);
		},
		toAccount : function(){
			App.back();
		},
     	goPage1 : function(url){
	   		 $('#incomePage6').hide();
	   		$("#sendSMSBtn").removeClass('disabled').removeAttr('disabled');
			$('#sendSMSBtn').attr("data-value", "获取验证码");
	   		 this.showPage(1);
	   		 Client.initPageTitle(this.pageStep1);
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
	  	toHistory : function(){
	  		var $this=this;
	  		var param = {
			};
			Client.openWaitPanel("正在提交中，请稍候");
			Ajax({url:"/transfer/rechargeAccQuery",data:param,
				success : function(data) {
					var iRecordAccountInfo = data.iRecordAccountInfo;
					if(iRecordAccountInfo&&iRecordAccountInfo.length>0){
						$("#proviceList").empty();
						for(var i=0;i<iRecordAccountInfo.length;i++){
							var kcoll = iRecordAccountInfo[i];
							$this.addRow(kcoll,i);
						}
						$("#noData").hide();
						$("#zen-iscroll-wrapper").show();
					}else{
						$("#noData").show();
						$("#zen-iscroll-wrapper").hide();
					}
					$this.initPage7();
		    		Client.hideWaitPanel(1);
				}
			});
		},
		addRow : function(kcoll,i){
	  		var $this=this;
			$("#proviceList").append('<li id="provice_'+i+'"><i class="'+kcoll.bankIconUrl+'"></i>'+Utils.cardNoFomart(kcoll.payAccount)+'</li>');
    		$("#provice_"+i).on('click', function() {
    			$("#cardNoText").val(kcoll.payAccount);
    			$("#bankIconUrlText").removeClass().addClass(kcoll.bankIconUrl);
    			$this.bankClass = kcoll.bankIconUrl;
    			$("#bankIconUrlText").show();
    			$("#bankNameText").val(kcoll.payBankName);
    			if(Utils.isEmpty(kcoll.payBankNo)||kcoll.cardType=='3'){
    				$this.checkCardBin();
    				$this.goPage1(); 
    			}else{
    				var cardType = kcoll.cardType;
    				if(cardType=='1'||cardType=='2'){//本行
    					var bindCardNo = App.storage.get("bindCardInfo").bindCardNo;
    					if(kcoll.payAccount == bindCardNo){//本行绑定卡
    						cardType='1';
    					}else{
    						cardType='2';
    					}
    				}
    				
    				$this.orgCode = kcoll.payBankNo;
    				$this.orgName = kcoll.payBankName;
    				$this.showFalg(cardType);
    				$this.goPage1();    				
    			}
    		});
		},
		initPage7 : function(){//历史充值账户
			var pageStep = {
					title:'历史充值账户',
		  			leftButton:{
		  				name : '返回',
		  				func: 'curView.goPage1()'
		  			}
				};
				Client.initPageTitle(pageStep);
				this.showPage(7);
		},
	});
});