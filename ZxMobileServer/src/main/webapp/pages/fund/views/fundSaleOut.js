define(function(require, exports, module) {

	var fundSaleOutTemplate = require("text!../template/fundSaleOut.html");

	var FundSaleOutView = module.exports = ItemView.extend({

		template : fundSaleOutTemplate,

		events : {
			"click #sureSaleOut" : "sureSaleOut",
			"click #pwd" : "showPwd",
			"click #successReturn" : "gotoFundIndex",
			"click #errorReturn" : "gotoSaleOutWrite",
			"click #all" : "showAll",
			"keyup #inputShare":"formValidate",
		},

		initialize : function() {
			var pageStep1 = {
				title : '卖出',
				leftButton : {
					name : '返回',
					func : 'curView.goBack()'
				}
			};
			Client.initPageTitle(pageStep1);
			
			var param = App.storage.get("_parameters");
        	this.init(param);
		},
		
		init : function(param) {
        	$("#cardNo").text(Utils.formatAcc(Utils.getEleCard().cardNo));
        	var cardNo = Utils.getEleCard().cardNo;//获取电子账号
  			var accountType = Utils.getEleCard().accountType;//获取电子账号类型
    		if (Utils.isInteger(cardNo)) {
    			Utils.queryCommBalance(cardNo,accountType);//查询余额
    		};
    		if(App.storage.get("_parameters").fundUseVol==""){//可卖份额
    			$("#fundVol").text("当前可卖--");
    		}else{
    			$("#fundVol").text("当前可卖"+Utils.formatCurrency(App.storage.get("_parameters").fundUseVol,2)+"份");
    		}
    		
    		this.fundFeeQuery();
    		
    		$("#inputShare").on("keyup",function(){
				var fundAmt = $(this).val();
				if(fundAmt.split('.')[1] && fundAmt.split('.')[1].length > 2){
					fundAmt = fundAmt.substring(0,fundAmt.indexOf('.')+3);
					$(this).val(fundAmt);
				}
			});
        },
        
        fundFeeQuery:function(){//费率查询
			var fundCode=App.storage.get("_parameters").fundCode;
			var tacode=App.storage.get("_parameters").TACode;
			
			var $this = this;
    		var param1 = {
    				fundCode :fundCode,
    				turnPageBeginPos:"1",
    				turnPageShowNum:"100",
    				tacode:tacode
    		};
    		Ajax({url:"/fund/fundFeeQuery",data:param1, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var icoll = data.iFundFeeinfo;
    				var fundRateTemp=0;
    				for(var len=0;len<icoll.length;len++){
						var kcoll = icoll[len];
						var fundRate =kcoll.fundRate;
						if(len==0){
							fundRateTemp=fundRate;
						}
						if(fundRate>fundRateTemp){
							fundRateTemp=fundRate;
						}
					}
    				if(fundRateTemp==""){
    					fundRateTemp='无赎回费';
    				}else{
    					fundRateTemp=Utils.toRetentionDigit(fundRateTemp*100,2)+'%';
    				}
    				$("#fundFee").text(fundRateTemp);
    			}else{
    				Client.alertinfo(data.errorMessage,"提醒");
    				Client.hideWaitPanel(1);
    			}
    		},error:function(){
    			Client.hideWaitPanel(1);
    		}
    		});
		},
        
        showAll: function(){
			var fundUseVol = App.storage.get("_parameters").fundUseVol;
			$("#inputShare").val(Utils.removeComma(fundUseVol));
		},
        
        sureSaleOut : function(){
        	var $this=this;
        	if($("#sureSaleOut").hasClass("disabled")){
    			return;
    		}
        	
			var inputFundVol=$("#inputShare").val();
			var fundUseVol=App.storage.get("_parameters").fundUseVol;
			var cardNo = Utils.getEleCard().cardNo;
  			var accountType = Utils.getEleCard().accountType;
	        var fundName=App.storage.get("_parameters").fundName;
	        var fundCode=App.storage.get("_parameters").fundCode;
	        
	        if(!this.checkAmount(inputFundVol)){
    			return false;
    		}
	        if(parseFloat(inputFundVol) > parseFloat(fundUseVol)){
  				Utils.alertinfo("没有足够的份额！");	
    			return false;
  			}
	        
  			if(!$this.pwd||!$this.pwdKey){
  				if(	$('.ui-view').attr('data-position')!=0){
	     			return;
	     		}
    			Utils.alertinfo("请输入正确交易密码！");
    			return false;
    		}
  			
  			inputFundVol=parseFloat(inputFundVol);
			var param={
					cardNo:cardNo, 
					accountType:accountType,
					fundCode:fundCode,
					fundName:fundName,
					actionFlag:"0",
					assoDate:"",
					largRedFlag:"0",
					fundVol:inputFundVol,
					password:this.pwd, 
					pwdkey:this.pwdKey
				};
				Client.openWaitPanel("拼命加载中，请稍候");
				Ajax({url:"/fund/fundRedeem",data:param, success:function(data){//基金卖出
					if(Utils.isEmpty(data.errorCode)){
						if(!MUI.isEmpty(App.storage.get("paramFinanceUserMobBalInfo"))){
	    					App.storage.remove("paramFinanceUserMobBalInfo");	
	    				}  
	    				if(!MUI.isEmpty(App.storage.get("paramAccount"))){
	    					App.storage.remove("paramAccount");	
	    				}
	    				if(!MUI.isEmpty(App.storage.get("balanceInfo"))){
	    					App.storage.remove("balanceInfo");	
	    				}
						$("#fundNameSucc").html("<i></i>"+fundName+"<span class='ft12 fc-9' >("+fundCode+")</span>");
						$("#fundAmtSucc").text(Utils.formatCurrency(data.fundVol,2));
						$("#cardNoSucc").text(Utils.cardNoFomart(cardNo)+"(电子账户)");
						$this.initPageSucc();
						Client.hideWaitPanel(1);
						$this.clearPwd();
					}else{
						Utils.alertinfo(data.errorMessage);
	    				Client.hideWaitPanel(1);
	    				$this.clearPwd();
	    				return;
	    			}
				},error:function(){
    				$this.initPageError();
					Client.hideWaitPanel(1);
	    			$this.clearPwd();
	    		}});
        },
        
        checkAmount :function(amtShow){
    		if(Utils.isEmpty(amtShow) ){
    			Utils.alertinfo("请输入份额");
    			return false;
    		}else if(Utils.isMoney(amtShow)){
    			if(Utils.formatCurrency(amtShow,2)=='0.00'){
        			Utils.alertinfo("请输入大于零的份额");
        			return false;	
    			}else{
        			return true;
    			}
    		}else{
    			Utils.alertinfo("亲，份额格式错误或者份额过大哦~","1");
    			return false;
    		}
        },
        
        initPageSucc : function(){//成功结果页面
        	var pageStep = {
            		title:"卖出结果",
            		leftButton:{
            			name : '返回',
            			func: 'curView.gotoBack()'
            		}
            		
            	};

        	Client.initPageTitle(pageStep);
			this.showPage(2);
			Client.hideWaitPanel(1);
    	},
    	initPageError : function(){//失败结果页面
        	var pageStep = {
            		title:"卖出结果",
            		leftButton:{
            			name : '返回',
            			func: 'curView.gotoSaleOut()'
            		}
            		
            	};

        	Client.initPageTitle(pageStep);
			this.showPage(3);
    	}, 

      //控制页面显示
    	showPage : function(num){
    		for(var i=1;i<=3;i++){
    			if(i==num){
    				$("#fundSignPage"+i).show();
    			}else{
    				$("#fundSignPage"+i).hide();
    			}
    		}
    	},
        
        showPwd : function(){
			Utils.focusPosition($("#pwd").parent());
			var opt = {
				elem:"#pwd",//当前对像
				type:'number',//text 字母与数字 number数字键盘
				max:'6',
				callback:'curView.savePassword'
			};
			Client.showPwdPicker(opt);//显示安全键盘
		},
		
		savePassword : function(obj){
			this.pwd = obj.pwd;
			this.pwdKey = obj.pwdKey;
			this.formValidate();
		},
		
		clearPwd : function(){
    		$("#pwd").val("");
    		this.pwdKey = null;
    		this.pwd = null;
			Client.loadPwdKey();//通知重载随机数
			this.formValidate();
    	},
    	
    	formValidate:function(){
    		var purchaseAmt	= $("#inputShare").val();
    		if(purchaseAmt && this.pwd && this.pwdKey && $("#pwd").val().length>=6){
    			$("#sureSaleOut").removeClass("disabled");
    		}else{
    			$("#sureSaleOut").addClass("disabled");
    		}
    	},
    	
    	gotoBack: function(){
    		App.storage.remove("iFundBalinfoList");//清除金额
    		App.storage.remove("iCustConsininfoList");//清除待确认
    		App.storage.remove("iFundDealInfoList");//清除历史
    		App.back(2);
    	},
    	
    	gotoFundIndex: function(){//按钮 跳转基金主页
    		App.storage.remove("iFundBalinfoList");//清除金额
    		App.storage.remove("iCustConsininfoList");//清除待确认
    		App.storage.remove("iFundDealInfoList");//清除历史
    		App.navigate("fund/fundCtl/fundIndex");
    	},
    	
    	gotoSaleOutWrite : function(){//按钮 跳转卖出填写页
			this.showPage(1);
    	},
    	
    	gotoSaleOut: function(){////失败页标题栏返回    返回卖出页面
			App.back();
    	},
		
		
		goBack : function(){
			App.back();
    	},
    	
	});
});