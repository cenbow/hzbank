define(function (require, exports, module) {
	
	var financeBalanceLoadTemplate = require("text!../template/financeBalanceLoad.html");
	
	var FinanceBalanceLoadView = module.exports = ItemView.extend({
		
        template : financeBalanceLoadTemplate,
        
        events:{
        	'tap #financeIn' : "goToFinanceInPage",
        	'tap #financeOut' : "goToFinanceOutPage",
        	'click #oldInCome' : "goToOldInCome"
        },
        
        initialize : function(type){
        	var pageStep1 = {
    			title:this.model.get("financeName")==''?'幸福添利':this.model.get("financeName"),
    			leftButton:{
    				name : '返回',
    				func: 'curView.goBack()'
    			},
    			rightButton:{
        			name : '',
        			func: 'curView.flash()'
    			}
    		};

    		Client.initPageTitle(pageStep1);
    		
    		this.dateArr = [];
    		this.sevenyieldArr = [];
    		this.financeTotalVol = "0.00";
    		
    		this.opt = {
    			chartType: "line",
    		    myData: {
    			  labels : this.dateArr,
    			  data : this.sevenyieldArr
    		    }        		
        	};
           
    		var paramFinanceUserMobBalInfo = {};//幸福添利session传参
    		
			var sevenDayRate = Utils.getParamDisplay("PB_DEPOSIT_RATE","7");
			$('#sevenDayRate').text(sevenDayRate);
			
			
			paramFinanceUserMobBalInfo = App.storage.get("paramFinanceUserMobBalInfo");
			this.paramT={
					financeNo:this.model.get("financeNo"),
	    			financeName:this.model.get("financeName")
			};
			if(paramFinanceUserMobBalInfo && type!=1){
				var state = this.state = paramFinanceUserMobBalInfo.state;	//状态（0：基金未签约；1：个人网银端已签约；2：直销签约	3 幸福添利未签约 4已签约其他产品）					
				if(state == 0 || state == 3){
					App.navigate("finance/financeCtl/financeBalanceSign");	//跳转幸福添利签约页面
				}else if(state == 1){
					App.navigate("finance/financeCtl/financeBalancePrompt");//跳转幸福添利个人已签约提示页面
					Client.hideWaitPanel(1);	
					return;
				}else if(state == 4){
					if(paramFinanceUserMobBalInfo.financeNo == this.model.get("financeNo")){
						paramFinanceUserMobBalInfo = {};
						this.queryUserMobBalInfo(paramFinanceUserMobBalInfo);
					}else{
						
						App.navigate("finance/financeCtl/financeBalancePrompt2",this.paramT);//跳转幸福添利提示页面
						Client.hideWaitPanel(1);						
					}
				}else{
					if(!MUI.isEmpty(this.model.get("financeNo"))&&(paramFinanceUserMobBalInfo.financeNo != this.model.get("financeNo"))){
						App.navigate("finance/financeCtl/financeBalancePrompt2",this.paramT);//跳转幸福添利提示页面
						Client.hideWaitPanel(1);	
						return;
					}
					var iFinanceBalance = paramFinanceUserMobBalInfo.iFinanceBalance;
					var iFinanceBalanceInfo = paramFinanceUserMobBalInfo.iFinanceBalanceInfo;
					var iSevenRateInfo = paramFinanceUserMobBalInfo.iSevenRateInfo;
					var iBalanceTotal = paramFinanceUserMobBalInfo.iBalanceTotal;
					var tranAmt = "0.00";
					var financeVol = "0.00";
					var sevenDayAmt = "0.0000";
					var oneMonthAmt = "0.00";
					var totalAmt = "0.00";
					//幸福添利昨日收益查询
					if(iBalanceTotal.length>0){
						tranAmt = iBalanceTotal[0].tranAmt;
					}
					$("#oneYearRate").text(Utils.formatCurrency(tranAmt));
					if(iFinanceBalanceInfo.length>0){
						financeVol = iFinanceBalanceInfo[0].financeVol;
						sevenDayAmt = iFinanceBalanceInfo[0].sevenDayAmt;
					}
					$('#sp_sevenDayAmt').text(Utils.toRetentionDigit(sevenDayAmt*100,4));
					$('#sp_wanVol').text(financeVol);
					
					if(iFinanceBalance.length>0){
						this.financeTotalVol = iFinanceBalance[0].financeVol;
						oneMonthAmt = iFinanceBalance[0].oneMonthAmt;
						totalAmt = iFinanceBalance[0].totalAmt;
					}
					$('#financeTotalVol').text(Utils.formatCurrency(this.financeTotalVol));
					$('#sp_tranAmtTotal').text(Utils.formatCurrency(totalAmt));
					$('#sp_oneMonthAmt').text(Utils.formatCurrency(oneMonthAmt));
					
					for(var a = 0; a < iSevenRateInfo.length; a++){
						var kColl =  iSevenRateInfo[a];
						
						var sevenyield = Utils.toRetentionDigit(kColl.sevenyield*100,2);
						var updateDate = kColl.updateDate;
						var date = updateDate.substr(4,2)+"-"+updateDate.substr(6,2);
						this.dateArr.push(date);
						this.sevenyieldArr.push(sevenyield);
						
					}
					MUI.creatChart('#hs_chart_line',this.opt);
					
					Client.hideWaitPanel(1); 
					
				};
				this.flash();
			}else{
				paramFinanceUserMobBalInfo = {};
				this.queryUserMobBalInfo(paramFinanceUserMobBalInfo);
			};
        },
        
        queryUserMobBalInfo : function(paramFinanceUserMobBalInfo){
    		var cardNo = Utils.getCardNoByFlag("0","cardFlag1");
    		
    		if(MUI.isEmpty(cardNo)){
				App.navigate("finance/financeCtl/financeBalanceSign");	//跳转幸福添利签约页面
    			return;
    		}
    		
			var param = {
					cardNo:cardNo,
					fundCode:this.model.get("financeNo")
//					cardType:'FD'
			};
			var $this = this;
			Ajax({url:"/finance/queryUserMobBalInfo",data:param, success:function(data){
				if(Utils.isEmpty(data.errorCode)){
					var kcoll;
					var state = $this.state = data.state;	//状态（0：基金未签约；1：个人网银端已签约；2：直销签约	3 幸福添利未签约）
					var financeNo = data.financeNo;
					var iFinanceBalance = data.iFinanceBalance;
					var iFinanceBalanceInfo = data.iFinanceBalanceInfo;
					var iSevenRateInfo = data.iSevenRateInfo;
					//幸福添利昨日收益查询
					var iBalanceTotal = data.iBalanceTotal;
					
					paramFinanceUserMobBalInfo.state=state;
					paramFinanceUserMobBalInfo.financeNo=financeNo;
					paramFinanceUserMobBalInfo.iFinanceBalance=iFinanceBalance;
					paramFinanceUserMobBalInfo.iFinanceBalanceInfo=iFinanceBalanceInfo;
					paramFinanceUserMobBalInfo.iSevenRateInfo=iSevenRateInfo;
					paramFinanceUserMobBalInfo.iBalanceTotal=iBalanceTotal;
					
					App.storage.set("paramFinanceUserMobBalInfo",paramFinanceUserMobBalInfo);//将参数放入session
					
					if(state == 0 || state == 3){
						App.navigate("finance/financeCtl/financeBalanceSign");	//跳转幸福添利签约页面
						return;
					}else if(state == 1){
						App.navigate("finance/financeCtl/financeBalancePrompt");//跳转幸福添利个人已签约提示页面
						Client.hideWaitPanel();
						return;
					}else if(state == 4){
						App.navigate("finance/financeCtl/financeBalancePrompt2",$this.paramT);//跳转幸福添利提示页面
						Client.hideWaitPanel();
						return;
					}
					
					if(iBalanceTotal.length>0){
						kcoll = iBalanceTotal[0];
						tranAmt = kcoll.tranAmt;
						$("#oneYearRate").text(Utils.formatCurrency(tranAmt));
					}
					
					if(iFinanceBalanceInfo.length>0){
						financeVol = iFinanceBalanceInfo[0].financeVol;
						sevenDayAmt = iFinanceBalanceInfo[0].sevenDayAmt;
						$('#sp_sevenDayAmt').text(Utils.toRetentionDigit(sevenDayAmt*100,4));
						$('#sp_wanVol').text(financeVol);
					}
					
					if(iFinanceBalance.length>0){
						kcoll = iFinanceBalance[0];
						$this.financeTotalVol = kcoll.financeVol;
						oneMonthAmt = kcoll.oneMonthAmt;
						totalAmt = kcoll.totalAmt;
					}
					$('#financeTotalVol').text(Utils.formatCurrency($this.financeTotalVol));
					$('#sp_tranAmtTotal').text(Utils.formatCurrency(totalAmt));
					$('#sp_oneMonthAmt').text(Utils.formatCurrency(oneMonthAmt));
					for(var a = 0; a < iSevenRateInfo.length; a++){
						var kColl =  iSevenRateInfo[a];
						
						var sevenyield = Utils.toRetentionDigit(kColl.sevenyield*100,2);
						var updateDate = kColl.updateDate;
						var date = updateDate.substr(4,2)+"-"+updateDate.substr(6,2);
						$this.dateArr.push(date);
						$this.sevenyieldArr.push(sevenyield);
					}
					
					setTimeout(function(){
						MUI.creatChart('#hs_chart_line',$this.opt);
						$this.flash();
    				},300);
					Client.hideWaitPanel(1);
				}else{
					Utils.alertinfo(data.errorMessage);
					$this.flash();
					Client.hideWaitPanel(1);
				}
				Client.hideLucencyPanel();
			},error:function(){
				$this.flash();
				Client.hideWaitPanel(1);
				Client.hideLucencyPanel();
			}});
    	},
    	
    	goToFinanceInPage : function(){
    		var state = this.state;
    		var param ={
    				financeNo:this.model.get("financeNo"),
        			financeName:this.model.get("financeName")
    		};
			if(state == 0 || state == 3){
				App.navigate("finance/financeCtl/financeBalanceSign",param);	//跳转幸福添利签约页面
			}else if(state == 1){
				App.navigate("finance/financeCtl/financeBalancePrompt");//跳转幸福添利个人已签约提示页面
			}else if(state == 4){
				App.navigate("finance/financeCtl/financeBalancePrompt2",this.paramT);//跳转幸福添利提示页面
			}else if(state == 2){
				App.navigate("finance/financeCtl/financeBalanceIn",param);	//跳转幸福添利购买页面
			}
    	},
    	
    	goToFinanceOutPage : function(){
    		var state = this.state;
    		var param ={
    				financeNo:this.model.get("financeNo"),
        			financeName:this.model.get("financeName")
    		};
			if(state == 0 || state == 3){
				App.navigate("finance/financeCtl/financeBalanceSign",param);	//跳转幸福添利签约页面
			}else if(state == 1){
				App.navigate("finance/financeCtl/financeBalancePrompt");//跳转幸福添利个人已签约提示页面
			}else if(state == 4){
				App.navigate("finance/financeCtl/financeBalancePrompt2",this.paramT);//跳转幸福添利提示页面
			}else if(state == 2){
				param.financeTotalVol=this.financeTotalVol;
				App.navigate("finance/financeCtl/financeBalanceOut",param);
			}
    	},
    	
        goBack : function(){
    		App.back();
    	},
    	
    	goToOldInCome :function(){
    		Client.menuOpt("0");
    		var totalAmt=$("#sp_tranAmtTotal").text();
    		var financeNo=this.model.get("financeNo");
    		var param = {
					"totalAmt":totalAmt,
					"financeNo":financeNo
			};
			App.storage.set("param",param);
    		App.navigate("finance/financeCtl/financeBalanceInCome",param);
    	},
    	
    	help : function(){
    		App.navigate("anymore/anymoreCtl/messageCenter");
    	},
    	
        flash : function(){

        	this.ropt ? null : this.ropt = {
					callback:"curView.refresh()"
			};
			Client.dragRefresh(this.ropt);
    	},
    	
    	refresh : function(){
    		Client.openLucencyPanel();
    		$("b").text("0.00");
    		$("#financeTotalVol").text("0.00");
    		this.ropt.type = "1";
    		this.initialize(1);
    	}
    	
	});
	
});