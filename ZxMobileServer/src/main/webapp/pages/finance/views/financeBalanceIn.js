define(function (require, exports, module) {
	
	var financeBalanceInTemplate = require("text!../template/financeBalanceIn.html");
	
	var FinanceBalanceInView = module.exports = ItemView.extend({
		
        template : financeBalanceInTemplate,
        
        events:{
        	"click #buyBtn" : "financeBalanceIn",
        	"click #pwd" : "showPassword",
        	"click #succBackButton":"goBack",
        	"keyup #tranAmtText":"checkButton",
        	"blur #tranAmtText":"checkButton",
        	"click #tradeBanner":"gotoShare",
        },
        
        initialize : function(){
        	//初始化菜单方法
        	var pageStep1 = {
        		title:'幸福添利申购',
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
        
        financeBalanceIn : function(){
			if($("#buyBtn").attr('disabled')){ //确定按钮可点击(华为机处理)
				return;
			}
        	var $this = this;
    		var tranAmt	= $("#tranAmtText").val();
    		var cardNo = this.model.get("cardNo");
    		var accountType = this.model.get("accountType");
    		var financeNo = this.model.get("financeNo");
    		var financeName = this.model.get("financeName");
    		financeName = financeName.replace(" • ",".");
    		
    		if(!Utils.checkAmount(tranAmt)){
    			return false;
    		}
    		if(!$this.password||!$this.pwdkey){
    			Utils.alertinfo("请输入交易密码！");
    			return false;
    		}
    			
    		var param = {
    			cardNo:cardNo,
    			accountType:accountType,
    			financeNo:financeNo,
    			financeName:financeName,
    			tranAmt:tranAmt,
    			password:this.password,
    			pwdkey:this.pwdkey
    		};
    		Client.openWaitPanel("加载中");
    		Ajax({url:"/finance/transInFinanceBalance",data:param, success:function(data){  //幸福添利转入
    			if(data.errorCode==undefined){
    				$('#recAccName_suc').text(Utils.cardNoFomart(cardNo));
    				$('#recAmt_suc').text(Utils.formatCurrency(tranAmt));
    				var isExist = Utils.nvl(data.isExist,"0");
    				if(isExist == '1'){
    					$("#tradeBanner").show();
    				}else{
    					$("#tradeBanner").hide();
    				}
    				var param = App.storage.get("paramOwn");
    				if(!MUI.isEmpty(param)){
    					param.happyAddProAmt = parseFloat(param.happyAddProAmt)+parseFloat(tranAmt);
    					param.ownAmt = parseFloat((param.ownAmt+'').replace(/,/g,''))+parseFloat(tranAmt);
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
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}
    			$("#pwd").val("");
    			$this.password=$this.pwdkey="";
    			$this.checkButton();
    			Client.loadPwdKey();
    		},error:function(){
    			Client.hideWaitPanel(1);
    			Client.loadPwdKey();
    		}});
    	},
    	
    	//控制页面显示
    	showPage : function(num){
    		for(var i=1;i<=5;i++){
    			if(i==num){
    				$("#financeInPage"+i).show();
    			}else{
    				$("#financeInPage"+i).hide();
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
			this.checkButton();
    	},
    	
    	initPage2 : function(){//成功结果页面
    		var pageStep3 = {
    			title:'购买',
    			leftButton:{
    				name: '返回',
    				func: 'curView.goBack()'
    			}
    		};
    		
			Client.initPageTitle(pageStep3);
			this.showPage(2);
    	},
    	
        goBack : function(){
        	if(!MUI.isEmpty(App.storage.get("paramAccount"))){
				App.storage.remove("paramAccount");	
			}
        	if(App.browseList[1] == "finance/financeCtl/financeBalance"){
        		App.browseList[1] = "finance/financeCtl/financeBalanceLoad";
        	}
        	if(App.browseList[1] == "finance/financeCtl/financeBalanceSign"){
        		App.back(2);
        	}else{
        		App.back();
        	}
			
    	},
    	
    	help : function(){
    		App.navigate("anymore/anymoreCtl/messageCenter");
    	},
    	checkButton : function(){
    		  //验证码开始进行匹配
    		  (!Utils.isEmpty($('#tranAmtText').val())&&!Utils.isEmpty(this.password)) ?
    				    $("#buyBtn").removeClass('disabled').removeAttr('disabled') : $("#buyBtn").addClass('disabled').attr('disabled',true);	//输入时匹配所有输入框是否为空以确认是否激活提交按钮		  
    	},
    	gotoShare : function(){
			var recommendNum = App.storage.get("recommendNum");
			App.storage.set("shareReturn",true);
			if(MUI.isEmpty(recommendNum)){
				var param = {
				};
	    		Client.openWaitPanel("加载中");
				Ajax({url:"/userSetting/createRandomNUm",data:param, success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						var recommendNum = data.cd.RecommendNum;
						App.storage.set("recommendNum",recommendNum);
						Client.menuOpt("0");
						App.navigate("userReg/userRegCtl/userRegResult2");
					}
					Client.hideWaitPanel(1);
				}});				
			}else{
				Client.menuOpt("0");
				App.navigate("userReg/userRegCtl/userRegResult2");
			}

    	}
    	
	});
	
});