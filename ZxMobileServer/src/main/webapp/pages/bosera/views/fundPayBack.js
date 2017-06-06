define(function(require, exports, module){
	
	var fundPayBackTpl = require("text!../template/fundPayBack.html");
	
	var fundPayBackView = module.exports = ItemView.extend({
		
		events : {
			"click #submit" : "submit",
			"click #back" : "goBack",
			"keyup #purchaseAmt":"formValidate",
			"click #pwd" : "showPwd"
		},
		
		template : fundPayBackTpl,
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
    		
    		var iBoseraIncome = App.storage.get("iBoseraIncome");
			if(iBoseraIncome){
				this.showIncome(iBoseraIncome);
			}else{
				this.queryIcome();
			}
		},
		
		submit : function(){
			var $this = this;
    		var financeNo = Utils.getParamDisplay("PB_BOSERA",'1');
    		var purchaseAmt	= $("#purchaseAmt").val();
    		
    		if($("#submit").hasClass("disabled")){
    			return;
    		}
    		
    		var purchaseAmt	= $("#purchaseAmt").val();
    		if(!Utils.checkAmount(purchaseAmt)){
    			return;
    		}
    		
    		var totalVol = $("#totalVol").text().replace(/,/g,"");
    		if(parseFloat(purchaseAmt) > parseFloat(totalVol)){
    			Utils.alertinfo("赎回金额超过持有份额！");
    			return false;
    		}
    		
    		var param = {
				cardNo : Utils.getEleCard().cardNo,
				accountType: Utils.getEleCard().accountType,
    			productId:financeNo,
    			redeemShare:purchaseAmt,
    			password:this.pwd,
    			pwdkey:this.pwdKey
    		};
    		Client.openWaitPanel("加载中");
    		Ajax({url:"/bosera/boseraAssetRansom",data:param, success:function(data){ 
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
    				if(!MUI.isEmpty(App.storage.get("iBoseraIncome"))){
    					App.storage.remove("iBoseraIncome");
    				}
    				App.navigate("bosera/boseraCtl/payBackResult",{purchaseAmt:Utils.formatCurrency(purchaseAmt),cardNo:$this.model.get("cardNo")});
    			}else{
    				if(data.errorCode=="-24904"){
    					Utils.alertinfo("赎回超过单笔限额或单日累计限额");
    				}else if(data.errorCode=="-18071"){
    					Utils.alertinfo("交易繁忙，请稍后再试！");
    				}else{
    					Utils.alertinfo(data.errorMessage);
    				}
    				Client.hideWaitPanel(1);
    			}
    			$this.clearPwd();
    		},error:function(){
    			Client.hideWaitPanel(1);
    			$this.clearPwd();
    		}});
		},
		
		queryIcome : function(){
			var $this = this;
			Ajax({url:"/bosera/queryBoseraFinance",data:{productId:Utils.getParamDisplay("PB_BOSERA",'1')},
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						var iBoseraIncome = data.iBoseraQuery;
						App.storage.set("iBoseraIncome",iBoseraIncome);
						
						$this.showIncome(iBoseraIncome);
	    			}
					$this.income = true;
					$this.qryHideWait();
			}});
		},
		
		showIncome : function(iBoseraIncome){
			if(iBoseraIncome && iBoseraIncome.length >0){
				$.each(iBoseraIncome,function(i,income){
					if(income.productId == Utils.getParamDisplay("PB_BOSERA",'1')){
						$("#totalVol").text(Utils.formatCurrency(income.totalVol, 2));
					}
				});
			}
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
    	
		goBack : function(){
			$('.ui-view').removeAttr('style');
			App.back();
		},
	
	});
});
