define(function (require, exports, module) {
	
	var financeBalanceOutTemplate = require("text!../template/financeBalanceOut.html");
	
	var FinanceBalanceOutView = module.exports = ItemView.extend({
		
        template : financeBalanceOutTemplate,
        
        events:{
        	"click #pwd" : "showPassword",
        	"click #succBackButton" : "goBack",
        	"click #buyBtn" : "gotoBalanceOut",
        	"keyup #tranAmtText":"checkButton",
        	"blur #tranAmtText":"checkButton",
        },
        
        initialize : function(){
        	//初始化菜单方法
        	var pageStep1 = {
        		title:'幸福添利赎回',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		},
        		rightButton:{
        			name : '帮助',
        			func : 'curView.help()'
        		}
        	};

        	Client.initPageTitle(pageStep1);
        	
        	this.isQuick = true;
        	var cardNo = this.model.get("cardNo");
        	var accountType = this.model.get("accountType");
        	if (Utils.isInteger(cardNo)) {
    			Utils.queryCommBalance(cardNo, accountType);
    		}else{
            	Client.hideWaitPanel(1);
    		}; 
    		this.fundUseVol=0;
        },
        
        gotoBalanceOut : function(){
        	if(this.isQuick){
        		this.financeBalanceOut();//快速赎回
    		}else{
    			this.doRedeem();//普通赎回
    		}
        },
        
        financeBalanceOut : function(){
			if($("#buyBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
    		var tranAmt	= $("#tranAmtText").val();
    		var cardNo = this.model.get("cardNo");
    		if(!Utils.checkAmount(tranAmt)){
    			return false;
    		}
    		var financeTotalVol = this.model.get("financeTotalVol");
    		financeTotalVol = financeTotalVol.replace(/,/g,"");
    		if(parseFloat(tranAmt)>parseFloat(financeTotalVol)){
    			Utils.alertinfo("输入的金额不能大于持有份额！");	
    			return false;
    		}

    		if(MUI.isEmpty(this.password)){
    			Utils.alertinfo("请输入交易密码");
    			return false;
    		}
    		
    		var param = {
    			cardNo:cardNo,
    			accountType:this.model.get("accountType"),
    			financeNo:this.model.get("financeNo"),
    			tranAmt:tranAmt,
    			password:this.password,
    			pwdkey:this.pwdkey
    		};
    		var $this = this;
    		Client.openWaitPanel("拼命加载中，请稍候");
    		Ajax({url:"/finance/transOutFinanceBalance",data:param, success:function(data){  //幸福添利转入
    			$this.clearPwd();
    			if(Utils.isEmpty(data.errorCode)){
    				var returnCode = data.returnCode;
    				if(returnCode.indexOf("-24904" ) == 0 ){
    	    			var financeAmt = data.financeAmt;
    	   			    Client.alertinfo("您提交的金额已超过当日快速赎回累计限额（剩余额度为"+Utils.formatCurrency(financeAmt)+"元），是否进行普通赎回（普通赎回的资金于T+1日返回您的账户）？","提示","curView.redeemFinanceBalance()",true);
    					Client.hideWaitPanel(1);
    	   			    return;
    				}else{
    					
    					$('#recAccName_suc').text(Utils.cardNoFomart(cardNo));
    					$('#recAmt_suc').text(Utils.formatCurrency(tranAmt));
    					var param = App.storage.get("paramOwn");
    					if(!MUI.isEmpty(param)){
    						param.happyAddProAmt = parseFloat(param.happyAddProAmt)-parseFloat(tranAmt);
    						param.ownAmt = parseFloat((param.ownAmt+'').replace(/,/g,''))-parseFloat(tranAmt);
    						App.storage.set("paramOwn",param);						
    					}
    					
    					$this.initPage2();
    					
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
    					Client.hideWaitPanel(1);
    				}

    			}else{    				    				
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}
    			
    		},error:function(){
    			$this.clearPwd();
    		}});
    	},
    	
    	redeemFinanceBalance : function(){    	
			this.isQuick = false;
    		var param = {
        			cardNo:this.model.get("cardNo"),
    			 	pageFlag:'0',
    			 	fundCode:this.model.get("financeNo"),
    			 	isFundT0:'1',
    			 	turnPageBeginPos:1,		
    			 	turnPageShowNum:1000
        		};
        		var $this = this;
        		Client.openWaitPanel("拼命加载中，请稍候");
        		Ajax({url:"/fund/fundBalQuery",data:param, success:function(data){  //幸福添利转入
        			if(Utils.isEmpty(data.errorCode)){      					
        				var turnPageTotalNum = data.turnPageTotalNum;
        				if(turnPageTotalNum == 0) {
        					$this.fundUseVol=0;
        					$('#redeem_fundBal').text("0.00");
        				}else{
        					var iFundBalinfo = data.iFundBalinfo;
        					$this.fundUseVol = iFundBalinfo[0].fundUseVol-1;
        					
        					if($this.fundUseVol<0){
        						$this.fundUseVol=0;
        					}
        					$('#redeem_fundBal').text(Utils.formatCurrency($this.fundUseVol));
        				}
        				$('#fundUseVolDiv').show();
//        				$("#mgrNoTr").show();
        				$("#largRedFlagTr").show();
    					Client.hideWaitPanel(1);

        			}else{  
						$this.fundUseVol=0;
    					$('#redeem_fundBal').text("0.00");
        				$('#fundUseVolDiv').show();
//        				$("#mgrNoTr").show();
        				$("#largRedFlagTr").show();
            			Utils.alertinfo(data.errorMessage);
        				Client.hideWaitPanel(1);
        			}

        		},error:function(){
					$this.fundUseVol=0;
					$('#redeem_fundBal').text("0.00");
    				$('#fundUseVolDiv').show();
//    				$("#mgrNoTr").show();
    				$("#largRedFlagTr").show();
    				Client.hideWaitPanel(1);
        		}});
    	},
    	
    	doRedeem : function(){
			if($("#buyBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
    		var tranAmt	= $("#tranAmtText").val();
    		var cardNo = this.model.get("cardNo");
    		if(!Utils.checkAmount(tranAmt)){
    			return false;
    		}
    		var financeTotalVol = this.model.get("financeTotalVol");
    		financeTotalVol = financeTotalVol.replace(/,/g,"");
    		if(parseFloat(tranAmt)>parseFloat(financeTotalVol)){
    			Utils.alertinfo("输入的金额不能大于持有份额！");	
    			return false;
    		}
    		
    		if(parseFloat(tranAmt)>parseFloat(this.fundUseVol)){
    			Utils.alertinfo("输入的金额不能大于最大赎回份额！");	
    			return false;
    		}
    		
    		var mgrNo = $("#mgrNoText").val();
    		var largRedFlag = $("#largRedFlag").val();;
    		
    		if(MUI.isEmpty(this.password)){
    			Utils.alertinfo("请输入交易密码");
    			return false;
    		}
    		
    		var param = {
    			cardNo:cardNo,
    			financeNo:this.model.get("financeNo"),
    			financeVol:tranAmt,
    			mgrNo:mgrNo,
    			largRedFlag:largRedFlag,
    			password:this.password,
    			pwdkey:this.pwdkey
    		};
    		var $this = this;
    		Client.openWaitPanel("拼命加载中，请稍候");
    		Ajax({url:"/finance/redeemFinanceBalance",data:param, success:function(data){  //幸福添利转入
    			if(Utils.isEmpty(data.errorCode)){
    					
					$('#recAccName_suc').text(Utils.cardNoFomart(cardNo));
					$('#recAmt_suc').text(Utils.formatCurrency(tranAmt));
					var param = App.storage.get("paramOwn");
					
					if(!MUI.isEmpty(param)){
						param.happyAddProAmt = parseFloat(param.happyAddProAmt)-parseFloat(tranAmt);
						param.ownAmt = parseFloat((param.ownAmt+'').replace(/,/g,''))-parseFloat(tranAmt);
						App.storage.set("paramOwn",param);						
					}
					
					$this.initPage2();
					
					if(!MUI.isEmpty(App.storage.get("paramFinanceUserMobBalInfo"))){
						App.storage.remove("paramFinanceUserMobBalInfo");
					}
					
					if(!MUI.isEmpty(App.storage.get("paramAccount"))){
						App.storage.remove("paramAccount");	
					}  
					if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
						App.storage.remove("balanceInfo");	
					} 				
					Client.hideWaitPanel(1);

    			}else{  
        			if(data.errorCode.indexOf("1645" ) == 0 ){
        				Utils.alertinfo("普通赎回暂不支持全额赎回，请预留至少0.01份额在您的货币基金账户中");
    				}else{
        				Utils.alertinfo(data.errorMessage);
    				}
    				Client.hideWaitPanel(1);
    			}
    			$this.clearPwd();
    		},error:function(){
    			$this.clearPwd();
    		}});
    	},
    	savePassword : function(obj){
    		this.password = obj.pwd;
    		this.pwdkey = obj.pwdKey;
   		 	this.checkButton();
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
    	
    	clearPwd : function(){
    		$("#pwd").val("");
			this.password = "";
			this.pwdkey = "";
			this.checkButton();
			Client.loadPwdKey();
    	},
    	
//    	checkAmount : function(amtShow){
//    		if(Utils.isEmpty(amtShow) ){
//    			Utils.alertinfo("请输入金额");
//    			return false;
//    		}else if(Utils.isMoney(amtShow)){
//    			return true;
//    		}else{
//    			Utils.alertinfo("金额格式错误");
//    			return false;
//    		}
//    	},
    	
    	//控制页面显示
        showPage : function(num){
    		for(var i=1;i<=5;i++){
    			if(i==num){
    				$("#financeOutPage"+i).show();
    			}else{
    				$("#financeOutPage"+i).hide();
    			}
    		}
    	},
    	
    	initPage2 : function(){//成功结果页面
    		
    		//初始化结果页面头部菜单
    		var pageStep3 = {
    			title:'赎回结果',
    			leftButton:{
    				name: '返回',
    				func: 'curView.goBack()'
    			}
    		};
    		
    		Client.initPageTitle(pageStep3);
    		this.showPage(2);
    	},
    	
    	initPage3 : function(){//错误结果页面
    		$('#errorBackButton').on('click',function(){
    			App.goBack();
    		});
    		Client.initPageTitle(pageStep3);
    		showPage(3);
    	},
    	
    	initPage4 : function(){//可疑结果页面
    		$('#dubBackButton').on('click',function(){
    			App.goBack();
    		});
    		Client.initPageTitle(pageStep3);
    		showPage(4);
    	},
    	
        goBack : function(){
			var param = {
					financeNo:this.model.get("financeNo"),
					financeName:this.model.get("financeName")
				};	
			App.storage.set("_parameters",param);
			$('.ui-view').removeAttr('style');
			App.back();
    	},
    	
    	help : function(){
    		App.navigate("anymore/anymoreCtl/messageCenter");
    	},
    	checkButton : function(){
  		  //验证码开始进行匹配
  		  (!Utils.isEmpty($('#tranAmtText').val())&&!Utils.isEmpty(this.password)) ?
  				    $("#buyBtn").removeClass('disabled').removeAttr('disabled') : $("#buyBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
  	},
        
	});
	
	
});