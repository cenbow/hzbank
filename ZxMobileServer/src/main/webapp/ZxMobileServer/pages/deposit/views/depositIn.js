define(function (require, exports, module) {
	
	var depositInTemplate = require("text!../template/depositIn.html");
	
	var DepositView = module.exports = ItemView.extend({
		
        template : depositInTemplate,
        
        events:{
        	"click #nextBtn":"depositNext",
        	"click #toIncome":"toIncome",
        	"click #buyBtn":"depositIn",
        	"keyup #tranAmt":"checkButton",
        	"blur #tranAmt":"checkButton",
        	"click #hongbao":"gotoHongbao",
        	"click #drawLottery":"gotoDrawLottery"
        },
        
        initialize : function(){
        	var pageStep1 = {
        		title:'幸福乐存申购',
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
        	this.showPage(1);
        	
        	//初始化结果页面头部菜单
        	this.pageStep3 = {
        		title:'申购结果',
        		leftButton:{
        			name: '返回',
        			func: 'curView.goBack();'
        		}
        	};
        	
        	var cardNo = this.cardNo = this.getCardNo('01',true).no;
        	var accountType = this.accountType = this.getCardNo('01',true).type;
        	var custName = this.custName = Utils.trim(App.storage.get("UserInfo").customerNameCN);
        	
    		if (Utils.isInteger(cardNo)) {
    			Utils.queryCommBalance(cardNo, accountType);
    		}
    		$('#cardNo').text(Utils.formatAcc(cardNo));
    		$('#custName').text("("+custName+")");
    		
        },
        
        depositNext : function(){
			if($("#nextBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
    		var tranAmt = $("#tranAmt").val();
    		if(!Utils.checkAmount(tranAmt)){
    			return false;
    		}
    		var balance = $("#showBalanceSpan").text();
    		balance = balance.replace(/,/g,"");
    		if(parseFloat(tranAmt)>parseFloat(balance)){
    			Utils.alertinfo("账户余额不足！");	
    			return false;
    		}
    		
       		if(parseFloat(tranAmt)<parseFloat(1000)){
				Utils.alertinfo("起购金额不能低于1000元哦~");
    			return false;
    		}
    		$('#tranAmt2').text(Utils.formatCurrency(tranAmt));
    		$('#cardNo2').text(Utils.formatAcc(this.cardNo));
    		$('#custName2').text(this.custName);
    		$('#showBalanceSpan2').text($("#showBalanceSpan").text());
    		this.initPage2();
    	},
    	
        depositIn : function(){
        	
    		var tranAmt	= $("#tranAmt").val();
       		if(!Utils.checkAmount(tranAmt)){
    			return false;
    		}
    		
    		var cardNo = this.cardNo;
    		var accountType = this.accountType;
    		param = {
    			cardNo:cardNo,
    			accountType:accountType,
    			transferSum:tranAmt,
    			savePeriod:'0'
    		};
    		var $this = this;
    		Client.openWaitPanel("拼命加载中，请稍候");
    		Ajax({url:"/finance/transInFinanceTerm",data:param, success:function(data){  //幸福添利转入
    			if(data.errorCode==undefined){
    				var orderState = data.orderState;
    				if(orderState == "20"){
    					$('#recAccName_suc').text(Utils.cardNoFomart(cardNo));
    					$('#recAmt_suc').text(Utils.formatCurrency(tranAmt));
    					var param = App.storage.get("paramOwn");
    					if(!MUI.isEmpty(param)){
	    					param.happySaveAmt = parseFloat(param.happySaveAmt)+parseFloat(tranAmt);
	    					param.ownAmt = parseFloat((param.ownAmt+'').replace(/,/g,''))+parseFloat(tranAmt);
	    					App.storage.set("paramOwn",param);
    					}
    					
    					if(data.state == '1'){//乐存红包展示
    	    				if(!MUI.isEmpty(App.storage.get("noRedPacketListData"))){
    	    					App.storage.remove("noRedPacketListData");	
    	    				} 
    	    				$("#hongbao").show();   						
    					}else{
    						$("#hongbao").hide();   						
    					}
//    					Utils.alertinfo(data.addChanceFlag);
    					if(data.addChanceFlag == "0"){//首购增加抽奖次数展示
    						$("#drawLottery").show();  
    					}else{
    						$("#drawLottery").hide();   	
    					}
    					
    					$this.initPage3();
	    				if(!MUI.isEmpty(App.storage.get("paramTreasureInfo"))){
	    					App.storage.remove("paramTreasureInfo");	
	    				}  
	    				if(!MUI.isEmpty(App.storage.get("paramAccount"))){
	    					App.storage.remove("paramAccount");	
	    				}  
	    				if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
	    					App.storage.remove("balanceInfo");	
	    				}
    					Client.hideWaitPanel();
    				}else{
    					$('#recAccName_err').text(Utils.cardNoFomart(cardNo));
    					$('#recAmt_err').text(Utils.formatCurrency(tranAmt));
    					$this.initPage4();
    					Client.hideWaitPanel();
    				}
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel();
    			}
    		}});
    	},
    	
    	getCardNo : function(type,related){	
    		var iCardInfo  = App.storage.get("UserInfo").iCardInfo;
    		var showCardNo;
    		if(undefined == related)related=true;
    		for(var len=0;len<iCardInfo.length;len++){
    			var accountType = iCardInfo[len].accountType;
    			if(accountType == type ){
    				var cardType = iCardInfo[len].cardType;
    				if(!related){
    					if("02" == cardType )continue;
    				}
    				showCardNo = iCardInfo[len].cardNo;
    			}
    		}
    		 return {no:showCardNo,type:accountType};
    	},
    	
    	//控制页面显示
    	showPage : function(num){
    		for(var i=1;i<=5;i++){
    			if(i==num){
    				$("#depositInPage"+i).show();
    			}else{
    				$("#depositInPage"+i).hide();
    			}
    		}
    	},
    	
    	initPage1 : function(){//确定页面
        	var pageStep1 = {
            		title:'幸福乐存申购',
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
            	this.showPage(1);
    	},
    	
    	initPage2 : function(){//确定页面
        	var pageStep2 = {
            		title:'幸福乐存申购',
            		leftButton:{
            			name : '返回',
            			func: 'curView.initPage1()'      
            		}
            	};
    		Client.initPageTitle(pageStep2);
    		this.showPage(2);
    	},
    	
    	initPage3 : function(){//成功结果页面
			if(!MUI.isEmpty(App.storage.get("paramAccount"))){
				App.storage.remove("paramAccount");	
			}
    		$('#succBackButton').on('click',function(){
    			App.back();
    		});
    		Client.initPageTitle(this.pageStep3);
    		this.showPage(3);
    	},
    	
    	initPage4 : function(){//错误结果页面
    		$('#errorBackButton').on('click',function(){
    			App.back();
    		});
        	var pageStep4 = {
            		title:'申购结果',
            		leftButton:{
            			name: '返回',
            			func: 'curView.initPage1()'
            		}
            	};
    		Client.initPageTitle(pageStep4);
    		this.showPage(4);
    	},

    	initPage5 : function(){//可疑结果页面
			if(!MUI.isEmpty(App.storage.get("paramAccount"))){
				App.storage.remove("paramAccount");	
			}   
    		$('#dubBackButton').on('click',function(){
    			App.back();
    		});
    		Client.initPageTitle(this.pageStep3);
    		this.showPage(5);
    	},
    	
        toIncome : function(){
			App.navigate("transfer/transferCtl/recharge");
        },
        
        goBack : function(){
        	if(App.browseList[1] == "deposit/depositCtl/deposit"){
        		App.browseList[1] = "deposit/depositCtl/depositLoad";
        	}
    		App.back();
    	},

    	help : function(){
    		App.navigate("anymore/anymoreCtl/messageCenter");
    	},
    	
    	gotoHongbao : function(){
			App.navigate("hongbao/hongbaoCtl/hongbao");
    	},
    	gotoDrawLottery : function(){
    		if(Utils.checkSession()){
				if(Utils.checkRealUser()){
					if(!Utils.checkActivate()){
						return;
					}
					App.navigate("draw/drawCtl/drawLottery");
				}
			}else{
				Client.toLogin("curView.drawLottery()");
			}
    	},
    	
    	checkButton : function(){
  		  //验证码开始进行匹配
  		  (!Utils.isEmpty($('#tranAmt').val())) ?
  				    $("#nextBtn").removeClass('disabled').removeAttr('disabled') : $("#nextBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
  	},
    	
	});


	
});