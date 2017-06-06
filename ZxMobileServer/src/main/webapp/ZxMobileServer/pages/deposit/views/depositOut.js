define(function (require, exports, module) {
	
	var depositOutTemplate = require("text!../template/depositOut.html");
	
	var DepositOutView = module.exports = ItemView.extend({
		
        template : depositOutTemplate,
        
        events:{
        	"click #outBtn":"depositOut",
        	"click #pwd" : "showPassword",
        	"keyup #tranAmtText":"checkButton",
        	"blur #tranAmtText":"checkButton",

        },
        
        initialize : function(){
        	//初始化菜单方法
        	var pageStep1 = {
        		title:'幸福乐存赎回',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		},
        		rightButton:{
        			name : '帮助',
        			func : 'curView.help()'
        		}
        	};
        	
        	this.pageStep3 = {
            		title:'赎回',
            		leftButton:{
            			name: '返回',
            			func: 'curView.goBack()'
            		}
            };
        	
        	Client.initPageTitle(pageStep1);
        	
        	this.password = "";
        	this.pwdkey = "";
        	
    		//隐藏加载中。。。
    		Client.hideWaitPanel();
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
    	
    	depositOut : function(){
			if($("#outBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
    		this.tranAmt = $("#tranAmtText").val();
    		var balance = this.model.get("balance").replace(/,/g,"");
    		if(!Utils.checkAmount(this.tranAmt)){
    			return false;
    		}
    		var rest = parseFloat(balance) - parseFloat(this.tranAmt);
    		this.transferType = 0;
    		if(parseFloat(rest)<parseFloat(this.model.get("pbNoticLmt")) && parseFloat(rest)>=0){
    			this.tranAmt = balance.toString();
    			this.transferType = 1;
    			Client.alertinfo("您支取此金额后，此账户剩余本金将小于起存金额，系统将对此账户全部赎回并自动销户。","提醒","curView.toSubmit()",true);
    		}else{
    			if(parseFloat(rest)<0){
    				Utils.alertinfo("支取金额大于此账户剩余本金。");
    				return;
    			}
    			this.toSubmit();
    		}
    		

    	},
    	toSubmit : function(){
    		var cardNo = this.model.get("cardNo");
    		var param = {
    				cardNo:cardNo,
    				accountType:this.model.get("accountType"),
    				noticeDepositAccount:this.model.get("accountNo"),
    				transferSum:this.tranAmt,
    				transferType:this.transferType,
    				password:this.password,
    				pwdkey:this.pwdkey
    		};
    		var $this = this;
    		Client.openWaitPanel("拼命加载中，请稍候");
    		Ajax({url:"/finance/transOutFinanceTerm",data:param, success:function(data){  //幸福添利转入
    			if(data.errorCode==undefined){
    				var orderState = data.orderState;
    				if(orderState == "20"){
    					$('#recAccName_suc').text(Utils.cardNoFomart(cardNo));
    					$('#recAmt_suc').text(Utils.formatCurrency($this.tranAmt));
    					var param = App.storage.get("paramOwn");
    					if(!MUI.isEmpty(param)){
    						param.happySaveAmt = parseFloat(param.happySaveAmt)-parseFloat($this.tranAmt);
    						param.ownAmt = parseFloat((param.ownAmt+'').replace(/,/g,''))-parseFloat($this.tranAmt);
    						App.storage.set("paramOwn",param);    						
    					}
    					$this.initPage2();
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
    					$('#recAmt_err').text(Utils.formatCurrency($this.tranAmt));
    					$this.initPage3();
    					Client.hideWaitPanel();
    				}
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel();
    			}
    			$this.clearPwd();
    		}});
    	},
    	
    	clearPwd : function(){
    		$("#pwd").val("");
			this.password = "";
			this.pwdkey = "";
			this.checkButton();
			Client.loadPwdKey();
    	},
    	
    	//控制页面显示
    	showPage : function(num){
    		for(var i=1;i<=5;i++){
    			if(i==num){
    				$("#depositOutPage"+i).show();
    			}else{
    				$("#depositOutPage"+i).hide();
    			}
    		}
    	},
    	
    	initPage2 : function(){//成功结果页面
			if(!MUI.isEmpty(App.storage.get("paramAccount"))){
				App.storage.remove("paramAccount");	
			}   
    		$('#succBackButton').on('click',function(){
    			App.back();
    		});
    		Client.initPageTitle(this.pageStep3);
    		this.showPage(2);
    	},
    	
    	initPage3 : function(){//错误结果页面
    		$('#errorBackButton').on('click',function(){
    			App.back();
    		});
    		Client.initPageTitle(this.pageStep3);
    		this.showPage(3);
    	},
    	
    	initPage4 : function(){//可疑结果页面
			if(!MUI.isEmpty(App.storage.get("paramAccount"))){
				App.storage.remove("paramAccount");	
			}   
    		$('#dubBackButton').on('click',function(){
    			App.back();
    		});
    		Client.initPageTitle(this.pageStep3);
    		this.showPage(4);
    	},
    	
        goBack : function(){
        	App.back();
    	},
    	
    	help : function(){
    		App.navigate("anymore/anymoreCtl/messageCenter");
    	},
    	checkButton : function(){
  		  //验证码开始进行匹配
  		  (!Utils.isEmpty($('#tranAmtText').val())&&!Utils.isEmpty(this.password)) ?
  				    $("#outBtn").removeClass('disabled').removeAttr('disabled') : $("#outBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
    	}, 
	});

	
});