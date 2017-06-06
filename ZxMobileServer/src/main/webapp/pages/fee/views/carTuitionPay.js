define(function(require, exports, module){
	
	var carTuitionPayTpl = require("text!../template/carTuitionPay.html");
	var carTuitionPayView = module.exports = ItemView.extend({
		
		events : {
			"click #submit":"submit",
			"click #pwd" : "showPwd",
			"click #btn_sendSMS":"sendSMSInterval",
			"click #payCard" : "changeCard"
		},
		
		template : carTuitionPayTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			
			var tranAmt = App.storage.get("_parameters").amountTotal;
			this.orderInfo = null;
			var cardNo = Utils.getEleCard().cardNo;//获取电子账号
  			var accountType = Utils.getEleCard().accountType;//获取电子账号类型
    		if (Utils.isInteger(cardNo)) {
    			Utils.queryCommBalance(cardNo,accountType,"balance",true);
    		}
    		
    		if(parseFloat(tranAmt) <= 10000){
    			this.selectedCard = {cardNo : Utils.getEleCard().cardNo,	cardType : "03",index : "balance",bankIconUrl:'bnk_0110'};
    		}else{
    			this.selectedCard = {};
    		}
    		
    		var parameter = App.storage.get("_parameters");
    		if((parameter && parameter.cardNo) || parseFloat(tranAmt) > 10000){
    			var iCardList = App.storage.get("userCardList");
        		if(MUI.isEmpty(iCardList)){
        			Client.openWaitPanel("拼命加载中，请稍候");
        			this.queryCardList(parseFloat(tranAmt) > 10000?"bind":parameter.cardNo);
        		}else{
        			this.showSelected(iCardList,parseFloat(tranAmt) > 10000?"bind":parameter.cardNo);
        		}
    		}
    		
			var billkeyName = App.storage.get("_parameters").userName;
			$("#userName").text(billkeyName);
			$("#total").text(Utils.formatCurrency(tranAmt,2));
			this.validTime = 60;
			this.init();
    		
    		$(".back").on("click",function(){
    			$(".dialog").hide();
    		});
		},
		
		init : function(type){
			//获取随机加密因子
			var param = {};
			var $this = this;
			Ajax({url:"/orderPay/getpassRandomKey",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var pwdkey=data.cd.pwdkey;
    				var pwdvalue=data.cd.pwdvalue;
    				$this.pwdModel={
    						pwdkey:pwdkey,
    						pwdvalue:pwdvalue
    				};
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
    		}});
			if(type){
				$("#pwd").val("");
	    		this.pwd = null;
	    		this.pwdKey = null;
				return false;
			}
			
			param = App.storage.get("_parameters");
			Ajax({url:"/orderPay/checkOrder",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode) || data.errorCode == '0'){
    				$this.orderInfo = data.cd;
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
    			Client.hideWaitPanel(1);
    		}});
		},
		
		//发送短信验证码
	 	sendSMSInterval : function(){
	 		var $this = this;
	 		if(!$this.orderInfo){
	 			Utils.alertinfo("订单信息有误，请重新提交");
	 			return false;
	 		}
	 		if($("#btn_sendSMS").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
			$("#btn_sendSMS").addClass('disabled').attr('disabled',true);
	 		
	 		var orderList = $this.orderInfo.orderList;
	 		var mobileNo = App.storage.get("UserInfo").regMobile;
	 		var param = {
        			"orderList":orderList,
        			"mobileNo":mobileNo,
        			"cardNo":$this.selectedCard.cardNo,
        			"cardType": $this.selectedCard.cardType
    		};
	 		Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/orderPay/hzPaySMS",data:param, success:function(data){
				if(!data.errorCode){
					var count = $this.validTime;//60秒不允许再次发送
					var timerID = $this.timerID = setInterval(function(){
						$('#btn_sendSMS').text(count + '秒后重新获取');
						count--;
						if(count == 0||$("#btn_sendSMS").length==0){
							clearInterval(timerID);
							$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
							$('#btn_sendSMS').text('获取验证码');
						}
					},1000);
					$('#btn_sendSMS').text(count+ '秒后重新获取');
					count--;

				}else{
					if(data.errorCode){
						Utils.alertinfo(data.errorMessage);
					}else{
						Utils.alertinfo("发送验证码失败，请重试");
					}
					$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
				}
				Client.hideWaitPanel(1);
			},error:function(){
				$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
			}});
			
		 },
		 
		 //显示密码键盘
		 showPwd : function(){
			 	var $this = this;
				if(!$this.pwdModel || !$this.pwdModel.pwdkey){
					Utils.alertinfo("键盘参数有误，重新初始化中..");
					Client.openWaitPanel("拼命加载中，请稍候");
					$this.init();
					return;
				}
				Utils.focusPosition($("#pwd").parent(),100);
				var opt = {
					elem:"#pwd",//当前对像
					type:'number',//text 字母与数字 number数字键盘
					max:'6',
					callback:'curView.savePassword',
					randomKey : $this.pwdModel.pwdkey,//微通密码控件随机数Key
					randomValue : $this.pwdModel.pwdvalue //微通密码控件随机数value	
				};
				Client.showPwdPicker(opt);
		},
		
		savePassword : function(obj){
			this.pwd = obj.pwd;
			this.pwdKey = obj.pwdKey;
		},
		
		submit : function(){
			
			var total = Utils.removeComma($("#total").text());
			var balance = App.storage.get("balanceInfo").balanceAvailable;
			var parameter = App.storage.get("_parameters");
			var resultUrl = "fee/feeCtl/ensureResult";
			var $this = this;
			
			if(!$this.orderInfo){
	 			Utils.alertinfo("订单信息有误，请重新提交");
	 			return false;
	 		}
			
			var orderList = $this.orderInfo.orderList;
	 		var mobileNo = App.storage.get("UserInfo").regMobile;
	 		var password = this.pwd;
	 		var cardNo = $this.selectedCard.cardNo;
	 		var cardType = $this.selectedCard.cardType;
	 		var name = App.storage.get("UserInfo").customerNameCN;
	 		var vCode = $("#SMS").val();
	 		var pwdkey = this.pwdKey;
	 		if($this.selectedCard.index == 'balance' && parseFloat(total)>parseFloat(balance)){
  				Client.alertinfo("抱歉，账户余额不足，无法完成交易，请先充值！","提示","curView.toPay()",true);
    			return false;
    		}
	 		
	 		if(MUI.isEmpty(password)){
	     		if(	$('.ui-view').attr('data-position')!=0){
	     			return;
	     		}
	 			//Utils.alertinfo("请输入交易密码！");	
    			return false;
	 		}
	 		
	 		if(MUI.isEmpty(vCode)){
	 			Utils.alertinfo("请输入验证码！");	
    			return false;
	 		}
	 		if(vCode.length!="6"){
	 			Utils.alertinfo("请输入6位数的验证码！");	
    			return false;
	 		}
	 		
			var param = {
				"orderList":orderList,	
				"mobileNo":mobileNo,
				"password":password,
				"cardNo":cardNo,
				"cardType":cardType,
				"name":name,
				"vCode":vCode,
				"pwdkey":pwdkey,
				"confirmAmt":total
			};
	 		Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/orderPay/hzPayOrder",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var notifyMsg = data.cd.notifyMsg;
					var param = {
							"notifyMsg":notifyMsg || ""
						};
					if(data.cd.tranState == '10'){
						$(".Pays").hide();
						$("#incomePage7").show();
						var num=5;
						var timerID2 = setInterval(function(){
							$('#waitTime').text(num);
							if(num == 0||$("#waitTime").length==0){
								clearInterval(timerID2);
								$this.ePayAsynchronzation(data.cd);
							}
							num--;
						},1000);
					}else if(data.cd.tranState == "20"){
    					App.storage.remove("paramAccount");	
    					App.storage.remove("balanceInfo");
    					setTimeout(function(){
    						Ajax({url:parameter.notifyUrl || "/fee/studyPayResult",data:param, success:function(fdata){
    							App.navigate(resultUrl,{payres:data.cd,notifyres:fdata,feeTypeCode:parameter.feeTypeCode});
    			    		}});
    					},3000);
					}else{
						App.navigate(resultUrl,{payres:data.cd,feeTypeCode:parameter.feeTypeCode});
					}
    			}else{
    				$this.init("1");
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}
    		}});
		},
		
		queryCardList : function(cardNo){
   			var params={
   					cardNo:Utils.getEleCard().cardNo
   			};
   			var $this = this;
   			Ajax({url:"/cardManage/cardListQuery", data:params, 
   				success:function(data){
   					if(MUI.isEmpty(data.errorCode)){
   						var iCardList=data.iCardList;
   						$this.showSelected(iCardList,cardNo);
				  		App.storage.set("userCardList",iCardList);
   					}else{
   						Utils.alertinfo(data.errorMessage);
   					}
   				}
   			});
		},
		
		showSelected : function(iCardList,cardNo){
			var $this = this;
			$.each(iCardList,function(index,card){
				if(card.cardNo == cardNo || (cardNo=='bind' && card.bandFlag=="1")){
					var html = '<i class="ico-bnk '+'bnk-'+card.bankIconUrl.split('_')[1]+'"></i>'+
					   '<h1 data-value="'+card.cardNo+'">'+card.bankName+'('+card.cardNo.substring(card.cardNo.length-4,card.cardNo.length)+')</h1>'+
					   '<p class="ft10 fc-9">单笔限额'+$this.cashFormat(card.singleLimit)+'，日累计限额'+$this.cashFormat(card.dayLimit)+'</p>';
					$("#payCard").html(html);
					$this.selectedCard = card;
					return;
				}
			});
		},
		
		changeCard : function(){
			var $this = this;
			var sCardNo = $("#payCard h1").attr("data-value");
			Utils.epayPicker.init(".Pays",sCardNo||null,function(res){
				var html = '';
				$this.selectedCard = res;
				if(res.index == 'balance'){
					html = '<i class="ico-bnk bnk-0110"></i>'+
							   '<h1>账户余额&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h1>'+
							   '<p class="ft10 fc-9">可用余额<span id="balance"></span>元</p>';
				}else{
					html = '<i class="ico-bnk '+'bnk-'+res.bankIconUrl.split('_')[1]+'"></i>'+
					   '<h1 data-value="'+res.cardNo+'">'+res.bankName+'('+res.cardNo.substring(res.cardNo.length-4,res.cardNo.length)+')</h1>'+
					   '<p class="ft10 fc-9">单笔限额'+$this.cashFormat(res.singleLimit)+'，日累计限额'+$this.cashFormat(res.dayLimit)+'</p>';
				}
				$("#payCard").html(html);
				var cardNo = Utils.getEleCard().cardNo;//获取电子账号
	  			var accountType = Utils.getEleCard().accountType;//获取电子账号类型
	    		if (Utils.isInteger(cardNo)) {
	    			Utils.queryCommBalance(cardNo,accountType,"balance",true);
	    		}
	    		if(sCardNo != res.cardNo){
	    			clearInterval($this.timerID);
					$("#btn_sendSMS").removeClass('disabled').removeAttr('disabled');
					$('#btn_sendSMS').text('获取验证码');
					$("#SMS").val("");
	    		}
			});
		},
		
		ePayAsynchronzation:function(data){
		 	var $this =this;
		 	var parameters = App.storage.get("_parameters");
		 	var resultUrl = parameters.resultUrl || "fee/feeCtl/result";
			var param = {
					orderNo:parameters.orderNo,
					orderDate:parameters.TxDate
			};
			Client.openWaitPanel("正在提交中，请稍候");
			Ajax({url:parameters.confirmUrl || "/fee/hzpaytgOrderQuery",data:param, success:function(fdata){
				data.tranState = fdata.tranState;
				App.navigate(resultUrl,{payres:data,notifyres:fdata,feeTypeCode:parameters.feeTypeCode});
			}});
		 },
		 
		cashFormat : function(num){
			num = parseFloat(num);
			if(num>=10000){
				return num = num/10000+'万';
			}else if(num>=1000){
				return num = num/1000+'千';
			}else if(!num){
				return '无';
			}else{
				return num = num+'元';
			}
		},
		
		//去充值
		toPay : function(){
			App.navigate("transfer/transferCtl/recharge");
		},
		
		goBack : function(){
			App.back();
		}
	
	});
});
