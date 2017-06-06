define(function(require, exports, module){
	
	var goldBuyTpl = require("text!../template/goldBuy.html");
	
	var goldBuyView = module.exports = ItemView.extend({
		
		events : {
			"click #submit" : "submit",
			"click #pwd" : "showPwd",
			"keyup #purchaseAmt":"formValidate",
			"click #sign":"formValidate",
			"click #agreement" : "agreement",
			"click #back" : "goBack"
		},
		
		template : goldBuyTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    
			this.pwd = "";
			this.pwdKey = "";
			
			var cardNo = this.model.get("cardNo");
        	var accountType = this.model.get("accountType");
    		if (Utils.isInteger(cardNo)) {
    			Utils.queryCommBalance(cardNo,accountType);
    		}else{
    			Client.hideWaitPanel(1);
    		}
    		
    		var boseGold = App.storage.get("boseGold");
			if (boseGold) {
				var fundlastnav = Utils.formatCurrency(boseGold.fundlastnav*100 , 2);
				$("#fundlastnav").text(fundlastnav);
			}else{
				$("#fundlastnav").text("0.00");
			}
			
			var goldSign = App.storage.get("goldSign");
    		if(goldSign){
    			if(!Utils.checkBoseFinance("2"))
    				$("#sign").removeClass("hidden");
    			else
    				$("#sign").addClass("hidden");
    		}else{
    			this.queryGoldSign();
    		}
    		
			$("#purchaseAmt").on("keyup",function(){
				var purchaseAmt = $(this).val();
				if(purchaseAmt.split('.')[1] && purchaseAmt.split('.')[1].length > 2){
					purchaseAmt = purchaseAmt.substring(0,purchaseAmt.indexOf('.')+3);
					$(this).val(purchaseAmt);
				}
				var fee = purchaseAmt/(1.0005)*0.0005;
				fee = (fee<0.01&&fee>0)?0.01:fee;
				$("#kg").text(Utils.formatCurrency((purchaseAmt-fee.toFixed(2))/(boseGold.fundlastnav*100),4));
				$("#fee").text(Utils.formatCurrency(fee,2));
			});
		},
		
		submit : function(){
			var $this = this;
    		if($("#submit").hasClass("disabled")){
    			return;
    		}
    		var purchaseAmt	= $("#purchaseAmt").val();
    		var showBalanceSpan=Utils.removeComma(document.getElementById("showBalanceSpan").innerHTML);
    		
    		if(purchaseAmt > 1000000){
    			Utils.alertinfo("单笔限购100万元");
    			return;
    		}
    		
    		if(purchaseAmt%10!=0){
  				Utils.alertinfo("投资金额必须为最小追加单位(10元)的整数倍!");
    			return false;
  			}
    		
    		if(purchaseAmt < 10){
    			Utils.alertinfo("起购金额10元");
    			return;
    		}
    		if(parseFloat(purchaseAmt)>parseFloat(showBalanceSpan)){
    			Client.alertinfo("抱歉，账户余额不足，无法完成交易，请先充值！","提示","curView.toPay()",true);
    			return;
    		}
    		
			if(!Utils.checkBoseFinance("2")){
				var param = {
					customManagerId:"100000000",
					signProduct:Utils.getParamDisplay("PB_BOSERA",'3')
				};
				Client.openWaitPanel("加载中");
				Ajax({url:"/bosera/boseraAsset",data:param, success:function(data){
	    			if(!data.errorCode){
	    				var goldSign = App.storage.get("goldSign");
	    				goldSign = goldSign || {};
	    				goldSign.signState = '2';
	    				App.storage.set("goldSign",goldSign);
	    				$this.buySubmit();
	    			}else{
	    				Utils.alertinfo(data.errorMessage);
	    				Client.hideWaitPanel(1);
	    			}
				}});
			}else{
				$this.buySubmit();
			}
		},
		
		//去充值
		toPay : function(){
			App.navigate("transfer/transferCtl/recharge");
		},
		
		buySubmit : function(){
			var $this = this;
    		var financeNo = Utils.getParamDisplay("PB_BOSERA",'3');
    		var purchaseAmt	= $("#purchaseAmt").val();
    		var boseGold = App.storage.get("boseGold");
    		
    		var param = {
				cardNo : Utils.getEleCard().cardNo,
				accountType: Utils.getEleCard().accountType,
    			productId:financeNo,
    			purchaseAmt:purchaseAmt,
    			customManagerId:"",
    			password:this.pwd,
    			pwdkey:this.pwdKey,
    			share:purchaseAmt/boseGold.fundlastnav
    		};
    		Client.openWaitPanel("加载中");
    		Ajax({url:"/bosera/commonBoseraBuy",data:param, success:function(data){ 
    			var activityFlag = data.activityFlag;
    			if(data.errorCode==undefined){
    				if(!MUI.isEmpty(App.storage.get("paramFinanceUserMobBalInfo"))){
    					App.storage.remove("paramFinanceUserMobBalInfo");	
    				}  
    				if(!MUI.isEmpty(App.storage.get("paramAccount"))){
    					App.storage.remove("paramAccount");	
    				}
    				if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
    					App.storage.remove("balanceInfo");	
    				}
    				if(!MUI.isEmpty(App.storage.get("iGoldIncome"))){
    					App.storage.remove("iGoldIncome");
    				}
    				App.navigate("gold/goldCtl/goldBuyRes",{purchaseAmt:purchaseAmt,activityFlag:activityFlag});
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}
    			$this.clearPwd();
    		},error:function(){
    			Client.hideWaitPanel(1);
    			$this.clearPwd();
    		}});
		},
		
		showPwd : function(){
			Utils.focusPosition($("#pwd").parent(),100);
			$("#pwd").parent().addClass("focusState");
			var opt = {
				elem:"#pwd",//当前对像
				type:'number',//text 字母与数字 number数字键盘
				max:'6',
				callback:'curView.savePassword'
			};
			Client.showPwdPicker(opt);
		},
		
		savePassword : function(obj){
			this.pwd = obj.pwd;
			this.pwdKey = obj.pwdKey;
			this.formValidate();
		},
		
		clearPwd : function(){
    		$("#pwd").val("");
    		this.pwd = null;
    		this.pwdKey = null;
			Client.loadPwdKey();
			this.formValidate();
    	},
    	
    	formValidate:function(){
    		var purchaseAmt	= $("#purchaseAmt").val();
    		if(purchaseAmt && this.pwd && this.pwdKey && $("#pwd").val().length>=6){
    			$("#submit").removeClass("disabled");
    		}else{
    			$("#submit").addClass("disabled");
    		}
    	},
    	
    	queryGoldSign:function(){
    		var param = {
					cardNo : Utils.trim(Utils.getEleCard().cardNo)
			};
			Ajax({url:"/bosera/boseraAssetQuery",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						App.storage.set("goldSign",data);
						if(!Utils.checkBoseFinance("2"))
		    				$("#sign").removeClass("hidden");
		    			else
		    				$("#sign").addClass("hidden");
	    			}
			}});
    	},
    	
		goBack : function(){
			$('.ui-view').removeAttr('style');
			if(App.browseList[1].indexOf("riskRes")>=0){
				App.back(4);
			}else{
				App.back();
			}
		},
		
		agreement : function(){
			Client.openWaitPanel("加载中");
			App.navigate("bosera/boseraCtl/boseAgreement");
		}
		
	});
});
