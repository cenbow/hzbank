define(function (require, exports, module) {
	
	var financeBalanceTemplate = require("text!../template/financeBalance.html");
	
	var FinanceBalanceView = module.exports = ItemView.extend({
		
        template : financeBalanceTemplate,
        
        events:{
        	"click #goToBuy" : "toLogin",
        	"keyup #inputAmt,#inputDayNum":"calculate",
        	"blur #inputAmt,#inputDayNum":"calculate",
        	"click #seven,#tensou":"tabChange"
        },
        
        initialize : function(){
        	var pageStep1 = {
        		title:'幸福添利',
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
        	
        	this.dateArr = [];
        	this.sevenyieldArr = [];
        	this.wanVolArr = [];
        	this.financeVol="";
        	this.sevenDayAmt="";
        	this.qryIsDone = false;
        	this.addIsDone = false;
        	
        	var $this = this;
        	this.opt = {
        			
    			chartType: "line",
    			
    		    myData: {
    			  labels : this.dateArr,
    			  data : this.sevenyieldArr
    		    }        		
        	};
        	this.opt2 = {
        			
    			chartType: "bar",
    			
    		    myData: {
    			  labels : this.dateArr,
    			  data : this.wanVolArr    			  
    		    }
        	};
        		
        	this.paramFinanceBalance = {};//幸福添利session传参
        	this.paramFinanceSevenRate = {};//幸福添利session传参
        	
        	$(".chart-tab span").on("click",function(){
        		$(".chart-tab span").removeClass("active");
        		$(this).addClass("active");
        		var index = $(this).attr("index");
        		if(index==1){
        			$("#finance").hide();
        			$("#sevenDay").show();
        			MUI.creatChart('#hs_chart_line',$this.opt);
        		}else if(index==2){
        			$("#sevenDay").hide();
        			$("#finance").show();
        			MUI.creatChart('#hs_chart_bar',$this.opt2);
        		}
        	});
        	
        	this.init();
        },
        
        
        init : function(){
    		this.paramFinanceBalance = this.model.get("paramFinanceBalance");
    		if(!this.paramFinanceBalance){
    			this.paramFinanceBalance = {};
    			this.financeBalanceInfo();
    		}else{
    			var financeVol = this.paramFinanceBalance.financeVol;
    			this.sevenDayAmt = this.paramFinanceBalance.sevenDayAmt;
    			$('#sevenDayAmt').text(this.sevenDayAmt);
    			$('#financeVol').text(financeVol);
    			this.addIsDone = true;
    			this.qryHideWait();
    		}
    		this.calculate();
    		this.paramFinanceSevenRate = this.model.get("paramFinanceSevenRate");
    		if(!this.paramFinanceSevenRate){
    			this.paramFinanceSevenRate = {};
    			this.sevenRateQuery();
    		}else{
    			var iSevenRateInfo = this.paramFinanceSevenRate.iSevenRateInfo;
    			for(var a = 0; a < iSevenRateInfo.length; a++){
    				var kColl =	iSevenRateInfo[a];
    				var sevenyield = Utils.toRetentionDigit(kColl.sevenyield*100,2);
    				var updateDate = kColl.updateDate;
    				var wanVol = kColl.wanVol;
    				var date = updateDate.substr(4,2)+"-"+updateDate.substr(6,2);
    				this.dateArr.push(date);
    				this.sevenyieldArr.push(sevenyield);
    				this.wanVolArr.push(wanVol);
    			}
    			MUI.creatChart('#hs_chart_line',this.opt);
    			Client.hideWaitPanel(100);
    			this.qryIsDone = true;
    			this.qryHideWait();
    		}
    	},
        
    	toLogin : function(){
    		Client.toLogin("curView.queryUserMobBalInfo()");
    	},
    	
    	goToBuy : function(){
    		this.queryUserMobBalInfo();
    	},
    	
    	queryUserMobBalInfo : function(){
   			if(!Utils.checkRealUser()){
	        	return;
   			}
			if(!Utils.checkActivate()){
				return;
			}
			 var param2 ={
						financeNo:this.model.get("financeNo"),
		    			financeName:this.model.get("financeName")
			 		};
    		var cardNo = Utils.getCardNoByFlag("0","cardFlag1");//获取基金账户
    		if(MUI.isEmpty(cardNo)){
				App.navigate("finance/financeCtl/financeBalanceSign",param2);	//跳转幸福添利签约页面
				return;
    		}
    		var param = {
    				cardNo:cardNo
    		};
    		var $this = this;
    		Ajax({url:"/finance/queryUserMobBalanceSign",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var state = data.state;	//状态（0：基金未签约；1：个人网银端已签约；2：直销签约	3 幸福添利未签约）

    				Client.menuOpt("5");
    				if(state == "3"){
    					App.navigate("finance/financeCtl/financeBalanceSign",param2);	//跳转幸福添利签约页面
    				}else if(state == "1"){
    					App.navigate("finance/financeCtl/financeBalancePrompt");//跳转幸福添利个人已签约提示页面
  						Client.hideWaitPanel(1);
      				}else if(state == "2"){
      					var financeNo = data.financeNo;	
      					if(financeNo == $this.model.get("financeNo")){
      						App.navigate("finance/financeCtl/financeBalanceIn",param2);	//跳转幸福添利购买页面
      						
      					}else{     						
      						App.navigate("finance/financeCtl/financeBalancePrompt2",param2);//跳转幸福添利提示页面
      						Client.hideWaitPanel(1);    						
      					}
    				}
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				$this.qryHideWait();
    			}
    		},error:function(){
    			$this.qryHideWait();
    		}});
    	},

    	sevenRateQuery : function(){
    		var financeNo = this.model.get("financeNo");
    		var param = {
    				financeNo:financeNo
    		};
    		var $this = this;
    		Ajax({url:"/finance/life_sevenRateQuery",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var iSevenRateInfo = data.iSevenRateInfo;
    				
    				$this.paramFinanceSevenRate.iSevenRateInfo=iSevenRateInfo;
    				
    				if(financeNo == Utils.getParamDisplay("PB_FINANCE_BALANCE","1")){
        				App.storage.set("paramFinanceSevenRate",$this.paramFinanceSevenRate);//易方达
    				}else if(financeNo == Utils.getParamDisplay("PB_FINANCE_BALANCE","3")){
        				App.storage.set("paramFinanceSevenRate2",$this.paramFinanceSevenRate);//天弘
    				}
    				
    				for(var a = 0; a < iSevenRateInfo.length; a++){
    					var kColl =	iSevenRateInfo[a];
    					var sevenyield = Utils.toRetentionDigit(kColl.sevenyield*100,2);
    					var updateDate = kColl.updateDate;
    					var wanVol = kColl.wanVol;
    					var date = updateDate.substr(4,2)+"-"+updateDate.substr(6,2);
    					$this.dateArr.push(date);
    					$this.sevenyieldArr.push(sevenyield);
    					$this.wanVolArr.push(wanVol);
    				}
    				$this.qryIsDone = true;
    				$this.qryHideWait();
    				setTimeout(function(){
    					MUI.creatChart('#hs_chart_line',$this.opt);
    				},300);
    				
    			}else{
    				Utils.alertinfo(data.errorMessage);
    				$this.qryIsDone = true;
    				$this.qryHideWait();
    			}
    		},error:function(){
    			$this.qryIsDone = true;
    			$this.qryHideWait();
    		}});
    	},
    	
    	financeBalanceInfo : function(){
    		var financeNo = this.model.get("financeNo");
    		var param = {
    				financeNo:financeNo
    		};
    		var $this = this;
    		Ajax({url:"/finance/life_financeBalanceInfo", data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var iFinanceBalanceInfo = data.iFinanceBalanceInfo;
    				var kColl =  iFinanceBalanceInfo[0];
    				financeVol = kColl.financeVol;
    				$this.sevenDayAmt = kColl.sevenDayAmt;
					$this.paramFinanceBalance.sevenDayAmt=Utils.toRetentionDigit($this.sevenDayAmt*100,4);
    				$this.paramFinanceBalance.financeVol=financeVol;
    				if(financeNo == Utils.getParamDisplay("PB_FINANCE_BALANCE","1")){
        				App.storage.set("paramFinanceBalance",$this.paramFinanceBalance);//易方达
    				}else if(financeNo == Utils.getParamDisplay("PB_FINANCE_BALANCE","3")){
        				App.storage.set("paramFinanceBalance2",$this.paramFinanceBalance);//天弘
    				}
    				$('#sevenDayAmt').text(Utils.toRetentionDigit($this.sevenDayAmt*100,4));
    				$('#financeVol').text(financeVol);
    				$this.addIsDone = true;
    				$this.qryHideWait();
    			}else{
    				Utils.alertinfo(data.em);	//接口出错处理
    				$this.addIsDone = true;
    				$this.qryHideWait();
    			}
    		},error:function(){
    			$this.addIsDone = true;
    			$this.qryHideWait();
    		}});
    	},
    	

    	
    	calculate : function(){
    		var rate = Utils.getParamDisplay("PB_DEPOSIT_RATE","100");
    		var inputAmt = $('#inputAmt').val();
    		var inputDayNum = $('#inputDayNum').val();
    		var expectAmt = Utils.formatCurrency(this.sevenDayAmt*inputDayNum*inputAmt/36500,2);	//七日年化收益率*金额*天数/36500
    		var expectBankAmt = Utils.formatCurrency(inputDayNum*rate*inputAmt/36500,2);
    		$('#expectAmt').text(expectAmt);
    		$('#expectBankAmt').text(expectBankAmt);
    	},
    	
    	qryHideWait : function(){
    		if(this.qryIsDone&&this.addIsDone){
    			Client.hideWaitPanel(100);
    		}
    	},
    	
        goBack : function(){
        	App.back();
    	},

    	help : function(){
    		App.navigate("anymore/anymoreCtl/messageCenter");
    	},
	});
	
});