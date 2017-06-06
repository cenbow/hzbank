define(function(require, exports, module){
	
	var boseFundBuyTpl = require("text!../template/boseFundBuy.html");
	
	var boseFundBuyView = module.exports = ItemView.extend({
		
		events : {
			"click #submit" : "submit",
			"click #pwd" : "showPwd",
			"keyup #purchaseAmt":"formValidate",
			"click #checkbox":"formValidate",
			"click #agreement" : "agreement",
			"click #back" : "goBack"
		},
		
		template : boseFundBuyTpl,
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
    			if(!Utils.checkBoseFinance("0"))
    				this.boseraAssetQuery();
    			else
    				$("#sign").addClass("hidden");
    		}else{
    			this.queryBoseFinance();
    		}
		},
		
		submit : function(){
			var $this = this;
    		if($("#submit").hasClass("disabled")){
    			return;
    		}
    		var purchaseAmt	= $("#purchaseAmt").val();
    		var showBalanceSpan=Utils.removeComma(document.getElementById("showBalanceSpan").innerHTML);
    		if(parseFloat(purchaseAmt)>parseFloat(showBalanceSpan)){
    			Client.alertinfo("抱歉，账户余额不足，无法完成交易，请先充值！","提示","curView.toPay()",true);
    			return;
    		}
    		if(!Utils.checkAmount(purchaseAmt)){
    			return;
    		}
			if(!Utils.checkBoseFinance("0")){
				if($("#sign input:checked").length>0){
					var param = {
						customManagerId:"100000000",
						signState:"1",
						signProduct:Utils.getParamDisplay("PB_BOSERA",'1')
					};
					Client.openWaitPanel("加载中");
					Ajax({url:"/bosera/boseraAsset",data:param, success:function(data){
		    			if(!data.errorCode){
		    				var goldSign = App.storage.get("goldSign");
		    				goldSign = goldSign || {};
		    				goldSign.signState = '1';
		    				App.storage.set("goldSign",goldSign);
		    				$this.buySubmit();
		    			}else{
		    				Utils.alertinfo(data.errorMessage);
		    				Client.hideWaitPanel(1);
		    			}
					}});
				}
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
    		var financeNo = Utils.getParamDisplay("PB_BOSERA",'1');
    		var financeName = "幸福添利";
    		financeName = financeName.replace(" • ",".");
    		var purchaseAmt	= $("#purchaseAmt").val();
    		
    		var param = {
				cardNo : Utils.getEleCard().cardNo,
				accountType: Utils.getEleCard().accountType,
    			productId:financeNo,
    			purchaseAmt:purchaseAmt,
    			customManagerId:"",
    			password:this.pwd,
    			pwdkey:this.pwdKey
    		};
    		Client.openWaitPanel("加载中");
    		Ajax({url:"/bosera/boseraAssetBuy",data:param, success:function(data){  //幸福添利转入
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
    				App.navigate("bosera/boseraCtl/buyResult",{purchaseAmt:Utils.formatCurrency(purchaseAmt),cardNo:$this.model.get("cardNo")});
    			}else{
    				if(data.errorCode == '-18071'){
    					Utils.alertinfo("系统繁忙，请稍后再试");
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
		
		queryBoseFinance:function(){
			var param = {
					productId:Utils.getParamDisplay("PB_BOSERA",'1'),
					cardNo : Utils.trim(Utils.getEleCard().cardNo),
		    		accountType : Utils.trim(Utils.getEleCard().accountType)
			};
			var $this = this;
			Ajax({url:"/bosera/queryBoseraFinance",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						App.storage.set("iBoseraIncome",data.iBoseraQuery);
						if(!Utils.checkBoseFinance("0"))
							$("#sign").removeClass("hidden");
						else
							$("#sign").addClass("hidden");
	    			}
			}});
		},
		
		boseraAssetQuery : function(){
			var param = {
					cardNo : Utils.trim(Utils.getEleCard().cardNo)
			};
			Ajax({url:"/bosera/boseraAssetQuery",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						App.storage.set("goldSign",data);
	    			}
					if(!Utils.checkBoseFinance("0"))
						$("#sign").removeClass("hidden");
	    			else
	    				$("#sign").addClass("hidden");
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
    		if(purchaseAmt && this.pwd && this.pwdKey && $("#pwd").val().length>=6
    								&& (Utils.checkBoseFinance("0")||$("#sign input:checked").length>0)){
    			$("#submit").removeClass("disabled");
    		}else{
    			$("#submit").addClass("disabled");
    		}
    	},
    	
		goBack : function(){
			$('.ui-view').removeAttr('style');
			App.back();
		},
		
		agreement : function(){
			Client.openWaitPanel("加载中");
			App.navigate("bosera/boseraCtl/boseAgreement");
		}
		
	});
});
