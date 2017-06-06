define(function (require, exports, module) {
	
	var innerTransferTemplate = require("text!../template/innerTransfer.html");
	var payName = "";
	var payAccountNo = "";// 电子账号
	var accountType = "";// 电子账户类型
	var recAccountNo = "";
	var accountType2 = "";
	var openNode = "";
	var chargeFee = "0.00";
	var param = {};
	var recName = "";
	var bankName = "";
	var bankType = "";
	var bankIconUrl = "";
	var totalCollInSum = "0";
	var balance = "";
	var tranAmt = "";
	
	var InnerTransferView = module.exports = ItemView.extend({
		
        template : innerTransferTemplate,
        
        events:{
        	"click #pwd":"showPwdPicker",
        	"click #inputSubButton":"doNextSubmit",
        	"click #confirmSubmitButton":"doSubmit",
        	"click #tranAmtAll":"showBalanceSpan",
        	"click #successSubmitButton":"toCount",
        	"click #errorSubmitButton" : "inner_transfer"
        },
        
        initialize : function(){
        	// 初始化菜单方法
        	var pageStep = {
        		title : '提现',
        		leftButton : {
        			name : '返回',
        			func : 'curView.goBack()'
        		}
        	};

        	Client.initPageTitle(pageStep);
        	
        	var session = App.storage.get("UserInfo");
    		payName = Utils.trim(session.customerNameCN);
    		recName = payName;
    		payAccountNo = Utils.trim(Utils.getEleCard().cardNo);
    		accountType = Utils.trim(Utils.getEleCard().accountType);
    		openNode = Utils.trim(Utils.getEleCard().cardOpenNode);
    		$("#payAccountNameText").text("(" + payName + ")");
    		$("#payAccountText").text(Utils.formatAcc(payAccountNo));
    		$("#recNameText").text("(" + recName + ")");
    		
    		this.balance = App.storage.get("paramAccount").balance;
    		$("#showBalanceSpan").text(this.balance);

    		var iCardList = App.storage.get("userCardList");
    		for(var i=0;i<iCardList.length;i++){
    			var kcoll=iCardList[i];
    			if(kcoll.bandFlag=="1"){
    				recAccountNo = kcoll.cardNo;
    				accountType2 = accountType;
  		  		    $('#recAccountText').text(Utils.formatAcc(recAccountNo));
    			}
    		}
			Client.hideWaitPanel(1);
    		this.queryCollInAmtTotal();
        	
        },
        
        // 行内提现预跑
        doNextSubmit : function() {
			var $this = this;
			tranAmt = $('#tranAmtText').val();				
			tranAmt=Utils.formatCurrency(tranAmt,2);
			tranAmt=Utils.removeComma(tranAmt);

			if (!this.checkAmount(tranAmt)) {
    			return;
    		}
//    		$('#sp_payAccount').text(Utils.formatAcc(payAccountNo));
    		$('#sp_recAccount').text(Utils.formatAcc(recAccountNo));
    		$('#sp_recNameText').text("(" + recName + ")");
    		$('#sp_showBalanceSpan').text($("#showBalanceSpan").text());
    		$('#sp_transferSum').text(Utils.formatCurrency(tranAmt, 2));
    		$('#sp_tranAmtChineseSpan').text(Utils.toChineseCurrency(tranAmt));

    		param = {
    			transferType : "0",
    			payAccount : payAccountNo,
    			accountType : accountType,
    			recAccount : recAccountNo,
    			recAccountName : recName,
    			accountType2 : accountType2,
    			payAmount : tranAmt,
    			payRem : "",
    			addPayBook : "",
    			openNode : openNode,
    			cardType : accountType2
    		};
    		var $this = this;
    		Client.openWaitPanel("拼命加载中，请稍候");
    		Ajax({
    			url : "/transfer/preInnerTransfer",
    			data : param,
    			success : function(data) {
    				Client.hideWaitPanel(100);
    				if (data.errorCode) {
    					Utils.alertinfo(data.errorMessage);
    				} else {
    					$this.initPage2();
    				}
    			},
    			error : function() {
    				Client.hideWaitPanel(1);
    			}
    		});
    	},

    	// 确认提现
        doSubmit : function() {
    		if (Utils.trim(chargeFee) == "") {
    			chargeFee = "0.00";
    		}
    		if (!this.pwdObj||$("#pwd").val().length<6) {
    			Utils.alertinfo("请输入交易密码");
    			return;
    		}
    		var pwdkey = this.pwdObj.pwdKey;
    		var password = this.pwdObj.pwd;

    		var subParam = {
    			chargeFee : chargeFee,
    			sendMessageFlag : "0",
    			recMsgMobileNumer : "",
    			password : password,
    			pwdkey : pwdkey
    		};
    		var $this = this;
    		$.extend(param, subParam);
    		Client.openWaitPanel("拼命加载中，请稍候");
    		Ajax({
    			url : "/transfer/subInnerTransfer",
    			data : param,
    			success : function(data) {
    				$this.clearPwd();
    				Client.hideWaitPanel(1);
    				if (data.errorCode) {
//    					$("#errorText").text(data.errorCode);
//    					$("#errorMessageText").text(data.errorMessage);
//    					$('#page2').hide();
//    					$('#view_error').show();
						Utils.alertinfo(data.errorMessage);
    				} else {
    					var pageStep1 = {
			        		title : '提现',
			        		leftButton : {
			        			name : '返回',
			        			func : 'curView.toCount()'
			        		}
			        	};

			        	Client.initPageTitle(pageStep1);
//    					$('#r_payAccount').text(Utils.formatAcc(payAccountNo));
    					$('#r_recAccount').text(Utils.formatAcc(recAccountNo));
						$('#r_transferSum').text("￥ "+Utils.formatCurrency(tranAmt, 2)+" 元");
    					$('#r_recNameText').text("(" + recName + ")");
    	   				 if(!MUI.isEmpty(App.storage.get("paramAccount"))){
		    					App.storage.remove("paramAccount");	
	    				 }  
	    				 if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
	    					App.storage.remove("balanceInfo");	
	    				 } 

    					$('#page2').hide();
    					$('#view_success').show();
    				}
    			},
    			error : function() {
    				Client.loadPwdKey();// 重载随机数
    				Client.hideWaitPanel(1);
    				$this.clearPwd();
    			}
    		});
    	},

    	// 统计他行代收总金额
    	queryCollInAmtTotal : function() {
    		Ajax({
    			url : "/transfer/life_ePayTransAmtQuery",data:{},
    			success : function(data) {
    				if (data.errorCode) {
    					Utils.alertinfo(data.errorMessage);
    				} else {
    					totalCollInSum = Utils.nvl2(data.cd.totalSum, '0');
    				}
    			},
    			error : function() {
    			}
    		});
    	},

    	// 检查金额
    	checkAmount : function(amtShow) {
			var balance = Utils.removeComma(this.balance);
			if(Utils.isEmpty(amtShow)){
				Utils.alertinfo("请输入提现金额");
				return false;
			}else if(amtShow.length>13){
				Utils.alertinfo("金额长度不能大于13位");
				return false;
			}else if(!Utils.isMoney(amtShow)){
				return false;
			}else if(amtShow == '0.00'){
				Utils.alertinfo("提现金额不能为零");
				return false;
			}else if(parseFloat(amtShow) > parseFloat(balance)){
				Utils.alertinfo("提现金额不能超出账户余额");
				return false;
			}			
			return true;
    	},

    	// 获取绑定卡信息
    	getBindCardInfo : function() {
    		var queryParam = {
    			cardNo : payAccountNo
    		};
    		Ajax({
    			url : "/account/elecAccBindQuery",
    			data : queryParam,
    			success : function(data) {
    				if (data.errorCode) {
    					Utils.alertinfo(data.errorMessage);
    				} else {
    					recAccountNo = data.cd.bindCardNo;
    					accountType2 = data.cd.cardType;
    					$('#recAccountText').text(Utils.formatAcc(recAccountNo));
    				}
    				Client.hideWaitPanel(1);
    			}
    		});
    	},
    	
    	showBalanceSpan:function(){
    		$("#tranAmtText").val(Utils.removeComma($("#showBalanceSpan").text()));
    	},
    	
    	toCount:function(){
    		App.navigate("account/mycountCtl/mycount");
    	},
    	
        initPage1 : function() {
    		// 初始化第一步菜单
    		var pageStep = {
    			title : '提现',
    			leftButton : {
    				name : '返回',
    				func : 'curView.goBack()'
    			}
    		};
    		Client.initPageTitle(pageStep);
    		$('#page2').hide();
    		$('#page1').show();
    	},
    	
        initPage2 : function() {
    		// 初始化第二步菜单
    		var pageStep2 = {
    			title : '提现',
    			leftButton : {
    				name : '返回',
    				func : 'curView.initPage1()'
    			}
    		};
    		Client.initPageTitle(pageStep2);
    		$('#page1').hide();
    		$('#page2').show();
    	},
    	
    	showPwdPicker : function(){
			Utils.focusPosition($("#pwd").parent());
    		var opt = {
				elem : "#pwd",// 当前对像
				type : 'number',// text 字母与数字 number数字键盘
				max : '6',
				callback : 'curView.savePassword'
			};
			Client.showPwdPicker(opt);
    	},
    	
    	savePassword : function(obj) {
    		this.pwdObj = obj;
    	},
    	
    	clearPwd : function(){
    		$("#pwd").val("");
    		this.pwdObj = null;
			Client.loadPwdKey();
    	},
    	
        account_balance : function() {
    		App.navigate("account/mycountCtl/accountBalance");
    	},

    	inner_transfer : function() {
    		App.container.show(this);
    		this.initialize();
    	},

    	help : function() {
    		App.navigate("anymore/anymoreCtl/messageCenter");
    	},
        goBack : function(){
          	App.back();
        }
	});


});