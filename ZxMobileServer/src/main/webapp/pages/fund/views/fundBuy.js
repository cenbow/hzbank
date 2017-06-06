define(function (require, exports, module) {
	
	var fundBuyTemplate = require("text!../template/fundBuy.html");
	
	var FundListInfoView = module.exports = ItemView.extend({
		
        template : fundBuyTemplate,
        
        events:{
        	"click #nextBtn" : "nextBuy",
        	"keyup #tranAmtText" : "checkButton1",
        	"blur #tranAmtText" : "checkButton1",
        	"click #buyBtn" : "submitBuy",
        	"click #pwd" : "showPassword",
        	"click #submitBtn" : "submitBuy",
        	"click #successReturn" : "doToFundList",
        	"click #errorReturn" : "gotoBuyPage2",
        	"click #profit" : "doToProfit"
        },
        
        initialize : function(){

        	var pageStep1 = {
        		title:"基金购买",
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        		
        	};

        	Client.initPageTitle(pageStep1);
        	this.init();
        },
        
        
        init : function(param){       	
        	this.password = "";
        	this.pwdkey = "";
        	var cardNo = this.model.get("cardNo");
        	var accountType = this.model.get("accountType");
    		if (Utils.isInteger(cardNo)) {
    			Utils.queryCommBalance(cardNo,accountType);
    		}else{
    			Client.hideWaitPanel(1);
    		}
        },
        nextBuy : function(){
			if($("#nextBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
        	var tranAmt = $("#tranAmtText").val();
        	var balance = $("#showBalanceSpan").text();
    		if(!Utils.checkAmount(tranAmt)){
    			return false;
    		}
    		
    		if(parseFloat(tranAmt) > parseFloat(balance.replace(/,/g,""))){
				Utils.alertinfo("您的账户余额不足哦~");
    			return false;
    		}
        	var minbuyamt = this.model.get("minbuyamt");
    		if(parseFloat(tranAmt) < parseFloat(minbuyamt.replace(/,/g,""))){
				Utils.alertinfo("购买金额不能小于起购金额哦~");
    			return false;
    		}
    		
        	var pageStep2 = {
            		title:"基金购买",
            		leftButton:{
            			name : '返回',
            			func: 'curView.gotoBuyPage()'
            		}
            		
            	};
            Client.initPageTitle(pageStep2);
        	
			$("#balanceSpan").text(balance);
			$("#tranAmtSub").text(Utils.formatCurrency(tranAmt,2));
        	this.showPage(2);
        },
        gotoBuyPage : function(){
        	var pageStep1 = {
            		title:"基金购买",
            		leftButton:{
            			name : '返回',
            			func: 'curView.goBack()'
            		}
            		
            	};

        	Client.initPageTitle(pageStep1);
        	this.showPage(1);
        },
        submitBuy : function(){
			if($("#buyBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
        	var $this = this;
    		var tranAmt	= $("#tranAmtText").val();
    		var cardNo = this.model.get("cardNo");
    		var accountType = this.model.get("accountType");
    		var TAName = this.model.get("TAName");
    		var TACode = this.model.get("TACode");
    		var fundCode = this.model.get("fundCode");
    		var fundName = this.model.get("fundName");

    		if(!$this.password||!$this.pwdkey){
    			Utils.alertinfo("请输入交易密码！");
    			return false;
    		}
    			
    		var param = {
    			cardNo:cardNo,
    			accountType:accountType,
    			TACode:TACode,
    			TAName:TAName,
    			fundCode:fundCode,
    			fundName:fundName,
    			fundAmt:tranAmt,
    			currencyType:"00",
    			password:this.password,
    			pwdkey:this.pwdkey
    		};
    		Client.openWaitPanel("加载中");
    		Ajax({url:"/fund/fundPurchase",data:param, success:function(data){ //基金申购
				if(Utils.isEmpty(data.errorCode)){
    				$('#recAmt_suc').text(Utils.formatCurrency(tranAmt));
					 App.storage.remove("myFundInfo");
					 App.storage.remove("myFundList");
					 App.storage.remove("fundCancelList");
    				$this.initPageSucc();  
    			}else{
    				$('#errorMessage').text(data.errorMessage);
    				$this.initPageError();
//    				Utils.alertinfo(data.errorMessage);
    			}
				Client.hideWaitPanel(1);
    			$("#pwd").val("");
    			$this.password=$this.pwdkey="";
    			$this.checkButton2();
    			Client.loadPwdKey();
    		},error:function(){
    			Client.loadPwdKey();
    		}});
    	},
        
    	//控制页面显示
    	showPage : function(num){
    		for(var i=1;i<=5;i++){
    			if(i==num){
    				$("#fundPage"+i).show();
    			}else{
    				$("#fundPage"+i).hide();
    			}
    		}
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
    	
    	savePassword : function(obj){
    		this.password = obj.pwd;
    		this.pwdkey = obj.pwdKey;
    		this.checkButton2();
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

        goBack : function(){
        	App.back();
    	},
    	checkButton1 : function(){
  		  (!Utils.isEmpty($('#tranAmtText').val())) ?
  				    $("#nextBtn").removeClass('disabled').removeAttr('disabled') : $("#nextBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
      	},
    	checkButton2 : function(){
  		  (!Utils.isEmpty(this.password)) ?
  				    $("#submitBtn").removeClass('disabled').removeAttr('disabled') : $("#submitBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
      	},
      	
    	initPageSucc : function(){//成功结果页面
        	var pageStep3 = {
            		title:"基金购买",
            		leftButton:{
            			name : '返回',
            			func: 'curView.doToFundList()'
            		}
            		
            	};

            	Client.initPageTitle(pageStep3);
			this.showPage(3);
    	},
    	
    	doToFundList : function(){
    		App.navigate("fund/fundCtl/fundListInfo");
    	},
    	
    	initPageError : function(){//成功结果页面
        	var pageStep4 = {
            		title:"基金购买",
            		leftButton:{
            			name : '返回',
            			func: 'curView.gotoBuyPage2()'
            		}
            		
            	};

            Client.initPageTitle(pageStep4);
			this.showPage(4);
    	},
        gotoBuyPage2 : function(){
        	var pageStep2 = {
            		title:"基金购买",
            		leftButton:{
            			name : '返回',
            			func: 'curView.gotoBuyPage()'
            		}
            		
            	};
            Client.initPageTitle(pageStep2);
        	this.showPage(2);
        },
    	doToProfit : function(){
    		var param = {
    				fundCode:Utils.trim(App.storage.get("_parameters").fundCode),
    				turnPageBeginPos:1,
    				turnPageShowNum:10
    		};
    		Ajax({url:"/fund/fundFeeQuery",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var icoll = data.iFundFeeInfo;
					App.storage.set("iFundFeeInfo",icoll);
		    		App.navigate("fund/fundCtl/fundRate");
    			}else{
    				Client.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}
    		}});
    	},
	});
	
});