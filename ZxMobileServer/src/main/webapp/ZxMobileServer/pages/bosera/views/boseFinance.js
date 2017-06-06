define(function(require, exports, module){
	
	var boseFinanceTpl = require("text!../template/boseFinance.html");
	
	var boseFinanceView = module.exports = ItemView.extend({
		
		events : {
			"click #finance" : "finance",
			"click #bosera" : "bosera"
		},
		
		template : boseFinanceTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		   
			var iBoseraIncome = App.storage.get("iBoseraIncome");
			if(iBoseraIncome){
				this.showIncome(iBoseraIncome);
			}else{
				this.queryIcome();
			}
		},
		
		queryIcome : function(){
			var $this = this;
			var param = {
					productId:Utils.getParamDisplay("PB_BOSERA",'1'),
					cardNo : Utils.trim(Utils.getEleCard().cardNo),
		    		accountType : Utils.trim(Utils.getEleCard().accountType)
			};
			Ajax({url:"/bosera/queryBoseraFinance",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						var iBoseraIncome = data.iBoseraQuery;
						App.storage.set("iBoseraIncome",iBoseraIncome);
						
						$this.showIncome(iBoseraIncome);
	    			}
					$this.income = true;
			}});
		},
		
		showIncome : function(iBoseraIncome){
			if(iBoseraIncome && iBoseraIncome.length >0){
				var totalVol=0,
					incomeNew=0,
					fundIncome=0;
				$.each(iBoseraIncome,function(i,income){
					if(income.productId == Utils.getParamDisplay("PB_BOSERA",'1')){
						$("#boseVol").text(Utils.formatCurrency(income.totalVol));
						$("#boseIcome").text(Utils.formatCurrency(income.incomeNew));
						totalVol += parseFloat(income.totalVol);
						incomeNew += parseFloat(income.incomeNew);
						fundIncome += parseFloat(income.fundIncome);
					}else if(income.productId == Utils.getParamDisplay("PB_FINANCE_BALANCE","1")){
						$("#finVol").text(Utils.formatCurrency(income.totalVol));
						$("#finIcome").text(Utils.formatCurrency(income.incomeNew));
						totalVol += parseFloat(income.totalVol);
						incomeNew += parseFloat(income.incomeNew);
						fundIncome += parseFloat(income.fundIncome);
					}
				});
				
				$("#totalVol").text(Utils.formatCurrency(totalVol, 2));
				$("#fundIncome").text(Utils.formatCurrency(fundIncome, 2));
				$("#totalNew").text(Utils.formatCurrency(incomeNew, 2));
			}
			Client.hideWaitPanel(1);
		},
		
		finance : function(){
			App.navigate("bosera/boseraCtl/boseFundLogon?type=finance");
		},
		
		bosera : function(){
			App.navigate("bosera/boseraCtl/boseFundLogon");
		},
		
		goBack : function(){
			App.back();
		}
	});
});
