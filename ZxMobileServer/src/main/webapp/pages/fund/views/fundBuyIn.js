define(function (require, exports, module) {
	
	var fundBuyInTemplate = require("text!../template/fundBuyIn.html");
	
	var FundBuyInView = module.exports = ItemView.extend({
		
		template : fundBuyInTemplate,
		
		events:{
			"click #sureBuyIn" : "sureBuyIn",
			"click #pwd" : "showPwd",
			"click #successReturn" : "gotoMyCount",
        	"click #errorReturn" : "gotoBuyInWrite",
        	"keyup #inputMoney":"formValidate",
        	"click #drawLottery":"gotoDrawLottery"
		},
		
		initialize : function(){
			var pageStep1 = {
        		title:'买入',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        		
        	};

        	
        	Client.initPageTitle(pageStep1);
        	Client.hideWaitPanel(1);
        	$("#cardNo").text(Utils.formatAcc(Utils.getEleCard().cardNo));
        	var cardNo = Utils.getEleCard().cardNo;//获取电子账号
  			var accountType = Utils.getEleCard().accountType;//获取电子账号类型
    		if (Utils.isInteger(cardNo)) {
    			Utils.queryCommBalance(cardNo,accountType);//查询余额
    		};
    		if(App.storage.get("iEFundBaseinfo").fundlastnav==""){//当前净值
    			$("#fundlastnav").text("当前净值是--");
    		}else{
    			$("#fundlastnav").text("当前净值是"+App.storage.get("iEFundBaseinfo").fundlastnav);
    		}
    		this.fundFeeQuery();
    		
    		$("#inputMoney").on("keyup",function(){
				var fundAmt = $(this).val();
				if(fundAmt.split('.')[1] && fundAmt.split('.')[1].length > 2){
					fundAmt = fundAmt.substring(0,fundAmt.indexOf('.')+3);
					$(this).val(fundAmt);
				}
			});
    		
        },

        sureBuyIn : function(){
        	var $this=this;
        	if($("#sureBuyIn").hasClass("disabled")){
    			return;
    		}
			var fundAmt=$("#inputMoney").val();
			var cardNo = Utils.getEleCard().cardNo;
  			var accountType = Utils.getEleCard().accountType;
	        var fundName=App.storage.get("iEFundBaseinfo").fundName;
	        var fundCode=App.storage.get("iEFundBaseinfo").fundCode;
	        var showBalanceSpan=Utils.removeComma(document.getElementById("showBalanceSpan").innerHTML);
	        var minbuyamt=App.storage.get('iEFundBaseinfo').minbuyamt;
	        var toaddamt=App.storage.get('iEFundBaseinfo').toaddamt;
	        
	        if(!Utils.checkAmount(fundAmt)){
    			return false;
    		}
	        
  			if(parseFloat(fundAmt) > parseFloat(showBalanceSpan)){
  				Client.alertinfo("抱歉，账户余额不足，无法完成交易，请先充值！","提示","curView.toPay()",true);
    			return false;
  			}
  			
  			if(!$this.pwd||!$this.pwdKey){
  				if(	$('.ui-view').attr('data-position')!=0){
	     			return;
	     		}
  				Utils.alertinfo("请输入正确交易密码！");
    			return false;
    		}
  			
  			fundAmt=parseFloat(fundAmt);
			var param={
					cardNo:cardNo, 
					accountType:accountType,
					TACode:"00",
					fundCode:fundCode,
					fundName:fundName,
					fundAmt:fundAmt,
					currencyType:"00",
					password:this.pwd, 
					pwdkey:this.pwdKey
				};
				Client.openWaitPanel("拼命加载中，请稍候");
				Ajax({url:"/fund/fundPurchase",data:param, success:function(data){//基金申购
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
						$("#fundAmtSucc").text(Utils.formatCurrency(data.fundAmt,2));
						$("#cardNoSucc").text(Utils.cardNoFomart(cardNo)+"(电子账户)");
						
    					if(data.addChanceFlag == "0"){//首购增加抽奖次数展示
    						$("#drawLottery").show();  
    					}else{
    						$("#drawLottery").hide();   	
    					}
						
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
       
        fundFeeQuery:function(){//费率查询
			var fundCode=App.storage.get("iEFundBaseinfo").fundCode;
			var tacode=App.storage.get("iEFundBaseinfo").TACode;
			
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
    				$this.queryPubApparShowMsg(icoll);
    			}else{
    				Client.alertinfo(data.errorMessage,"提醒");
    				Client.hideWaitPanel(1);
    			}
    		},
    		error:function(){
    			Client.hideWaitPanel(1);
    		}
    		});
		},
		
		queryPubApparShowMsg :function(icoll){//查询公共参数（关于基金折扣）
			var param1 = {
				 aprCode:"FUND_FEE_DISCOUNT",
				 aprValue:"1"
    		};
    		Ajax({url:"/pubServer/queryPubApparShowMsg",data:param1, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var aprShowMsg = data.aprShowMsg;
    				var fundRateTemp=0;
    				for(var len=0;len<icoll.length;len++){
						var kcoll = icoll[len];
						var fundRate =kcoll.fundRate;
						if(len==0){
							fundRateTemp=fundRate;
						}
						if(fundRate>fundRateTemp){//遍历费率最大值
							fundRateTemp=fundRate;
						}
					}
    				if(fundRateTemp==""){
    					$("#fundFee").text('');
    					$("#fundFeeDisCount").text('无申购费');
    				}else{
    					$("#fundFee").text(Utils.toRetentionDigit(fundRateTemp*100,2)+'%');
    					$("#fundFeeDisCount").text(Utils.toRetentionDigit(fundRateTemp*aprShowMsg*100,2)+'%');
    				}
    			}else{
    				Client.alertinfo(data.errorMessage,"提醒");
    				Client.hideWaitPanel(1);
    			}
    		},
    		error:function(){
    			Client.hideWaitPanel(1);
    		}});	
		},
        
        
        initPageSucc : function(){//成功结果页面
        	var pageStep = {
            		title:"买入结果",
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
            		title:"买入结果",
            		leftButton:{
            			name : '返回',
            			func: 'curView.gotoDetail()'
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
    		var purchaseAmt	= $("#inputMoney").val();
    		if(purchaseAmt && this.pwd && this.pwdKey && $("#pwd").val().length>=6){
    			$("#sureBuyIn").removeClass("disabled");
    		}else{
    			$("#sureBuyIn").addClass("disabled");
    		}
    	},
    	
    	gotoBack: function(){
    		App.storage.remove("iFundBalinfoList");//清除金额
    		App.storage.remove("iCustConsininfoList");//清除待确认
    		App.storage.remove("iFundDealInfoList");//清除历史
    		if(App.browseList[2].indexOf("fundSign")>=0){//当上上一页面是签约页面，返回时回跳4步
				App.back(4);
			}else{
				App.back(2);
			}
    	},
    	
    	
		gotoDetail : function(){//失败页标题栏返回    返回详情页面
			App.back(1);
    	},
		
    	gotoMyCount: function(){//成功页按钮 跳转我的账户
    		Client.menuOpt("3");
    		App.storage.remove("iFundBalinfoList");//清除金额
    		App.storage.remove("iCustConsininfoList");//清除待确认
    		App.storage.remove("iFundDealInfoList");//清除历史
			App.navigate("account/mycountCtl/mycount");
    	},
    	
    	gotoBuyInWrite : function(){//失败页按钮 跳转买入填写页
			this.showPage(1);
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
		goBack : function(){
			if(App.browseList[1].indexOf("fundSign")>=0){//当上一页面是签约页面，返回时回跳3步
				App.back(3);
			}else{
				App.back();
			}
    	},
    	
    	//去充值
		toPay : function(){
			App.navigate("transfer/transferCtl/recharge");
		},
	});
});