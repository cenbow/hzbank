define(function(require, exports, module) {
	
	var transferBuyTpl = require("text!../template/transferBuy.html");

	var transferBuyView = module.exports = ItemView.extend({

		template : transferBuyTpl,

		events : {
			"click #makesure" : "makesure",
			"click #pwd" : "showPwd",
			"click #bank" : "goBack",
			"click #look" : "look",
			"click #agreement" : "agreement",
			"click #hongbao" : "toredPacketInviteIndex"
		},
		
		// 初始化
		initialize : function() {
			var pageTest = {
    			  	title:'幸福金禧购买',
    				leftButton:{
    					name : '返回',
    					func :'curView.goBack()'
    				},
    				rightButton:{
            			name : ''
    				}
    			  };
    		Client.initPageTitle(pageTest);
    		this.pwd = "";
	        this.pwdKey = "";
	        var buyIncome = "";
	        var financeName = "";
	        var tranRate = "";
	        var fundRestDay = "";
	        var transferAMT = "";
	        if(App.storage.get("_parameters")){
	        	buyIncome = Utils.formatCurrency(App.storage.get("_parameters").buyIncome,2)||0.00;
	        	financeName = App.storage.get("_parameters").financeName;
	        	tranRate = Utils.formatCurrency(App.storage.get("_parameters").tranRate,2);
	        	fundRestDay = App.storage.get("_parameters").fundRestDay;
	        	transferAMT = Utils.formatCurrency(App.storage.get("_parameters").transferAMT,2);
	        }
    		$("#financeName").text(financeName);
    		$("#buyIncome").text(buyIncome);
    		$("#tranRate").text(tranRate);
    		$("#fundRestDay").text(fundRestDay);
    		$("#transferAMT").text(transferAMT);
    		$("#cardNo").text(Utils.formatAcc(Utils.getEleCard().cardNo));
    		
    		var cardNo = Utils.getEleCard().cardNo;//获取电子账号
  			var accountType = Utils.getEleCard().accountType;//获取电子账号类型
    		if (Utils.isInteger(cardNo)) {
    			Utils.queryCommBalance(cardNo,accountType);
    		};
    		Client.hideWaitPanel(100);
    		return;
		},
		
		
		look :function(){//跳到持有页面中去,要重新出发一下查询持有产品的接口
			App.storage.remove("_parameters");
			App.navigate("account/mycountCtl/mycount");
		},
		
		agreement :function(){
			var transferFlag ="0";
			var financeNo = App.storage.get("_parameters").financeNo;
			var param = {
					transferFlag:transferFlag,
					financeNo:financeNo
					};
			App.navigate("product/productCtl/agreement",param);
			Client.menuOpt("0");
		},
		
		makesure : function(){
	    	var $this=this;
	    	var transferAMT = $("#transferAMT").text();
	    	var showBalanceSpan=Utils.removeComma(document.getElementById("showBalanceSpan").innerHTML);
			var cardNo = Utils.getEleCard().cardNo;
  			var accountType = Utils.getEleCard().accountType;
  			var tranFlowNo  = App.storage.get("_parameters").tranFlowNo;//交易流水号（转让发布之后会返回一个流水号）
  			if(parseFloat(transferAMT)>parseFloat(showBalanceSpan)){
  				Client.alertinfo("抱歉，账户余额不足，无法完成交易，请先充值！","提示","curView.toPay()",true);
    			return false;
    		}
  			
  			if(!$this.pwd||!$this.pwdKey){
  				if(	$('.ui-view').attr('data-position')!=0){
	     			return;
	     		}
    			Utils.alertinfo("请输入交易密码！");
    			return false;
    		}
  			
    		var checkStt = document.getElementById("checkbox").checked;
			if(!checkStt){
				Utils.alertinfo("请阅读《相关协议》");
				return false;
			}
			var param={
				tranFlowNo:tranFlowNo,
				password:this.pwd, 
				pwdkey:this.pwdKey, 
				eleAccount:cardNo, 
				accountType:accountType
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/product/transferProductBuy",data:param, success:function(data){
				if(Utils.isEmpty(data.errorCode)){
					var transferstate = data.transferstate;
					var activityFlag = data.activityFlag;
					if(transferstate=="20"){//购买成功
						App.storage.remove("paramAccount");
						$("#product").hide();
						$("#success").show();
						if(activityFlag=="01"){
							$("#hongbao").show();
						}
						$("#fail").hide();
						$this.initPage1();
						var cardNo = data.eleAccount;//获取电子账号
						var applyMoney = Utils.formatCurrency(data.transferAMT,2);
						$("#cardNo1").text(Utils.formatAcc(cardNo));
			  			$("#applyMoney").text(applyMoney);
					}else{//购买失败
						$("#product").hide();
						$("#success").hide();
						$("#fail").show();
						$this.initPage2();
					}
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
				Client.hideWaitPanel(1);
				$this.clearPwd();
			},error:function(){
    			Client.hideWaitPanel(1);
    			$this.clearPwd();
    			
    		}});
		},
		
		initPage1 : function(){
			var pageStep1 = {
            		title:'购买成功',
            		leftButton:{
            			name : '返回',
            			func: 'curView.goBack()'
            		},
            		rightButton:{
            			name : ''
            		}
            	};
            Client.initPageTitle(pageStep1);
            App.storage.remove("balanceInfo");
		},

		initPage2 : function(){
			var pageStep2 = {
            		title:'购买失败',
            		leftButton:{
            			name : '返回',
            			func: 'curView.goBack()'
            		},
            		rightButton:{
            			name : ''
            		}
            	};
            Client.initPageTitle(pageStep2);
		},
		
		
		//去充值
		toPay : function(){
			App.navigate("transfer/transferCtl/recharge");
		},
		
		
		showPwd : function(){
			Utils.focusPosition($("#pwd").parent(),100);
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
		},
		
		clearPwd : function(){
    		$("#pwd").val("");
    		this.pwdKey = null;
    		this.pwd = null;
			Client.loadPwdKey();
			$("#login-pswd i").hide();
    	},
		
    	toredPacketInviteIndex : function(){
			App.navigate("hongbao/hongbaoCtl/redPacketInviteIndex");
    	},
    	
		goBack : function(){
			var transferFlag ="0";
			var param = {transferFlag:transferFlag};
			App.navigate("product/productCtl/saleProducts",param);
		},
		
	});
});