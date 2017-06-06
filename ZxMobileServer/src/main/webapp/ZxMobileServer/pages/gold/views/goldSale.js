define(function(require, exports, module){
	
	var goldSaleTpl = require("text!../template/goldSale.html");
	
	var goldSaleView = module.exports = ItemView.extend({
		
		events : {
			"click #submit" : "submit",
			"click #back" : "goBack",
			"keyup #purchaseAmt":"formValidate",
			"click #pwd" : "showPwd",
			"click #max":"max"
		},
		
		template : goldSaleTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			var cardNo = Utils.trim(Utils.getEleCard().cardNo);
    		var accountType = Utils.trim(Utils.getEleCard().accountType);
    		var boseGold = App.storage.get("boseGold");
			if (Utils.isInteger(cardNo)) {
    			Utils.queryCommBalance(cardNo,accountType);
    		}else{
    			Client.hideWaitPanel(1);
    		}
//			var iGoldIncome = App.storage.get("iGoldIncome");
//			if(iGoldIncome){
//				$("#amount").text((iGoldIncome.financeUseVol/100).toFixed(4));
//			} else {
				this.queryIcome();
//			}
			
			$("#purchaseAmt").on("keyup",function(){
				var purchaseAmt = $(this).val();
				if(purchaseAmt.split('.')[1] && purchaseAmt.split('.')[1].length > 2){
					purchaseAmt = purchaseAmt.substring(0,purchaseAmt.indexOf('.')+5);
					$(this).val(purchaseAmt);
				}
				var fee = 100*purchaseAmt*boseGold.fundlastnav/(1.0005)*0.0005;
				$("#kg").text((purchaseAmt*boseGold.fundlastnav*100 - fee.toFixed(2)).toFixed(2));
				$("#fee").text(fee.toFixed(2));
			});
		},
		
		submit : function(){
			var $this = this;
    		var financeNo = Utils.getParamDisplay("PB_BOSERA",'3');
    		var purchaseAmt	= $("#purchaseAmt").val();
    		
    		if($("#submit").hasClass("disabled")){
    			return;
    		}
    		
    		var purchaseAmt	= $("#purchaseAmt").val();
    		
    		var amount = $("#amount").text().replace(/,/g,"");
    		var amt = $("#kg").text();
    		if(parseFloat(amt) < 0.01){
    			Utils.alertinfo("卖出申请的份额小于单笔最低限额：0.01元！");
    			return false;
    		}
    		
    		var param = {
				cardNo : Utils.getEleCard().cardNo,
    			productId:financeNo,
    			redeemShare:purchaseAmt*100,
    			password:this.pwd,
    			pwdkey:this.pwdKey,
    			accountType:Utils.getEleCard().accountType
    		};
    		Client.openWaitPanel("加载中");
    		Ajax({url:"/bosera/commonBoseraRansom",data:param, success:function(data){ 
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
    				App.navigate("gold/goldCtl/goldBuyRes",{amount:purchaseAmt});
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
		
		queryIcome : function(){
			var $this = this;
			var param = {
					productId:Utils.getParamDisplay("PB_BOSERA",'3'),
					cardNo : Utils.trim(Utils.getEleCard().cardNo)
			};
			Ajax({url:"/bosera/boseraGoldShareQuery",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						var iShareList = data.iShareList;
						var iGoldIncome = "";
						$.each(iShareList,function(i,ishare){
							if(ishare.productId == Utils.getParamDisplay("PB_BOSERA",'3')){
								iGoldIncome = ishare;
								return false;
							}
						});
						iGoldIncome = iGoldIncome || {totalVol:0.00,financeUseVol:0.00,yesterdayIncome:0.00,accumulateIncome:0.00};
						App.storage.set("iGoldIncome",iGoldIncome);
						$("#amount").text((iGoldIncome.financeUseVol/100).toFixed(4));
	    			}
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
    	
    	max:function(){
    		$("#purchaseAmt").val($("#amount").text());
    		var purchaseAmt = $("#purchaseAmt").val();
    		var boseGold = App.storage.get("boseGold");
    		var fee = 100*purchaseAmt*boseGold.fundlastnav/(1.0005)*0.0005;
			$("#kg").text((purchaseAmt*boseGold.fundlastnav*100 - fee.toFixed(2)).toFixed(2));
			$("#fee").text(fee.toFixed(2));
    	},
    	
		goBack : function(){
			$('.ui-view').removeAttr('style');
			App.back();
		},
	
	});
});
