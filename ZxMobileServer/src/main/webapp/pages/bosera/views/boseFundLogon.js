define(function(require, exports, module){
	
	var boseFundLogonTpl = require("text!../template/boseFundLogon.html");
	
	var boseFundLogonView = module.exports = ItemView.extend({
		
		events : {
			"click #back" : "goBack",
			"click #buy" : "buy",
			"click #payback" : "payback",
			"click #incomeList" :  "incomeList"
		},
		
		template : boseFundLogonTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    
			this.income = false;
			this.rate = false;
			this.chat = false;
			
			$('.director .list-item').off().on('click', function(){
				var me = $(this), 
			    cnt = me.next(), 
			    setH = cnt.find('.para').get(0).offsetHeight,
				offsetTop = me.offset().top;
				setTimeout(function(){
					window.scrollTo(0, offsetTop);
				},200);
				me.hasClass('spr') ? 
				me.removeClass('spr') && cnt.css('height',0) : 
				me.addClass('spr') && cnt.css('height',setH);
			});
			
			var type = Utils.search().type;
			if(type && type=="finance"){
				$("#buy").hide();
				$("#title").text("幸福添利-易方达");
				$("#payback").removeClass("white");
				
				$("#a").text("易方达天天理财货币A");
				$("#b").text("000009");
				$("#c").text("2013-03-04");
				$("#d").text("易方达基金");
				$("#e").text("工商银行");
				$("#f").text("石大怿");
				$("#g").text("易方达基金管理有限公司");
				$("#h").text("易方达基金");
				$("#i").text("按月");
			}
			
			var iBoseraIncome = App.storage.get("iBoseraIncome");
			if(iBoseraIncome){
				this.showIncome(iBoseraIncome);
				this.income = true;
				this.qryHideWait();
			}else{
				this.queryIcome();
			}
			
			if(type && type=="finance"){
				var paramFinanceBalance = App.storage.get("paramFinanceBalance");
	    		if(!paramFinanceBalance){
	    			this.financeBalanceInfo();
	    		}else{
	    			var financeVol = paramFinanceBalance.financeVol;
	    			var sevenDayAmt = paramFinanceBalance.sevenDayAmt;
	    			$('#sevRate').text(sevenDayAmt);
	    			$('#tsRate').text(financeVol);
	    			this.rate = true;
	    			this.qryHideWait();
	    		}
			}else{
				var boseRate = App.storage.get("boseRate");
				if (boseRate) {
					$("#sevRate").text(boseRate.boseSevRate+"%");
					$("#tsRate").text(boseRate.boseTsRate);
					this.rate = true;
					this.qryHideWait();
				} else {
					this.initRate();
				}
			}
			
			var iSevenRateInfo = (type && type=="finance")?App.storage.get("paramFinanceSevenRate")
														:App.storage.get("boseSevRate");
			if(!iSevenRateInfo){
				iSevenRateInfo = [{sevenyield:0.00,updateDate:'7-01',wanVol:0.00},
						           {sevenyield:0.00,updateDate:'7-02',wanVol:0.00},
						           {sevenyield:0.00,updateDate:'7-03',wanVol:0.00},
						           {sevenyield:0.00,updateDate:'7-04',wanVol:0.00},
						           {sevenyield:0.00,updateDate:'7-05',wanVol:0.00},
						           {sevenyield:0.00,updateDate:'7-06',wanVol:0.00},
						           {sevenyield:0.00,updateDate:'7-07',wanVol:0.00}];
				this.initChat(iSevenRateInfo);
				if(type && type=="finance"){
					this.financeSev();
				}else{
					this.sevenRateQuery();
				}
			}else{
				this.initChat(iSevenRateInfo);
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
					$this.qryHideWait();
			}});
		},
		
		showIncome : function(iBoseraIncome){
			if(iBoseraIncome && iBoseraIncome.length >0){
				var type = Utils.search().type;
				if(!Utils.checkBoseFinance("0") && !type){
					$("#payback").hide();
				}
				$.each(iBoseraIncome,function(i,income){
					if(income.productId == Utils.getParamDisplay("PB_BOSERA",'1') && !type){
						$("#totalVol").text(Utils.formatCurrency(income.totalVol, 2));
						$("#fundIncome").text(Utils.formatCurrency(income.fundIncome, 2));
						$("#totalNew").text(Utils.formatCurrency(income.incomeNew, 2));
					}else if(income.productId == Utils.getParamDisplay("PB_FINANCE_BALANCE","1") &&type&& type=="finance"){
						$("#totalVol").text(Utils.formatCurrency(income.totalVol, 2));
						$("#fundIncome").text(Utils.formatCurrency(income.fundIncome, 2)).attr("data-no",income.productId);
						$("#totalNew").text(Utils.formatCurrency(income.incomeNew, 2));
					}
				});
			}
		},
		
		initRate : function() {
			var $this = this;
			var param = {
				productId : Utils.getParamDisplay("PB_BOSERA",'1')
			};
			Ajax({
				url : "/bosera/boseraProductSynchro",
				data : param,
				success : function(data) {
					if (data.errorCode) {
						Utils.alertinfo(data.errorMessage);
						App.storage.set("boseRate", false);
					} else {
						var iBoseraProduct = data.iBoseraProduct;
						var boseSevRate = "0.000";
						var boseTsRate = "0.000";
						if(iBoseraProduct.length>0){
							boseSevRate = Utils.formatCurrency(iBoseraProduct[0].trans_amt2,3);
							boseTsRate = Utils.formatCurrency(iBoseraProduct[0].trans_amt3,3);
						}
						$("#sevRate").text(boseSevRate+"%");
						$("#tsRate").text(boseTsRate);
						App.storage.set("boseRate", {
							boseSevRate : boseSevRate,
							boseTsRate : boseTsRate
						});
					}
					$this.rate = true;
					$this.qryHideWait();
				}
			});
		},
		
		sevenRateQuery : function(){
    		var financeNo = Utils.getParamDisplay("PB_BOSERA",'1');
    		var param = {
    				financeNo:financeNo
    		};
    		var $this = this;
    		Ajax({url:"/finance/life_sevenRateQuery",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				
    				var iSevenRateInfo = data.iSevenRateInfo;
        			App.storage.set("boseSevRate",iSevenRateInfo);
    				
    				$this.initChat(iSevenRateInfo);
    				
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
    		}});
    	},
    	
    	financeSev : function(){
    		var financeNo = $("#fundIncome").attr("data-no");
    		var param = {
    				financeNo:financeNo
    		};
    		var $this = this;
    		Ajax({url:"/finance/life_sevenRateQuery",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var iSevenRateInfo = data.iSevenRateInfo;
    				App.storage.set("paramFinanceSevenRate",iSevenRateInfo);
    				
    				$this.initChat(iSevenRateInfo);
    			}
    		}});
    	},
    	
    	financeBalanceInfo : function(){
    		var financeNo = $("#fundIncome").attr("data-no");
    		var param = {
    				financeNo:financeNo
    		};
    		var $this = this;
    		Ajax({url:"/finance/life_financeBalanceInfo", data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var iFinanceBalanceInfo = data.iFinanceBalanceInfo;
    				var kColl =  iFinanceBalanceInfo[0];
    				var financeVol = kColl.financeVol;
    				var sevenDayAmt = kColl.sevenDayAmt;
    				var paramFinanceBalance={};
					paramFinanceBalance.sevenDayAmt=Utils.toRetentionDigit(sevenDayAmt*100,4);
    				paramFinanceBalance.financeVol=financeVol;
        			App.storage.set("paramFinanceBalance",paramFinanceBalance);//易方达
        			$("#sevRate").text(Utils.toRetentionDigit(sevenDayAmt*100,4)+"%");
					$("#tsRate").text(financeVol);
    			}else{
    				Utils.alertinfo(data.em);	//接口出错处理
    			}
    			$this.rate = true;
				$this.qryHideWait();
    		},error:function(){
    			$this.rate = true;
    			$this.qryHideWait();
    		}});
    	},
    	
		initChat : function(iSevenRateInfo){
			var type = Utils.search().type;
			var dateArr = [],sevenyieldArr=[],sortArr = [];
			for(var a = 0; a < iSevenRateInfo.length; a++){
				var kColl =	iSevenRateInfo[a];
				var sevenyield;
				if(type && type=="finance"){
					sevenyield = Utils.toRetentionDigit(kColl.sevenyield*100,3);
				}else{
					sevenyield = Utils.toRetentionDigit(kColl.sevenyield,3);
				}
				var updateDate = kColl.updateDate;
				var wanVol = kColl.wanVol;
				var date = updateDate.substr(4,2)+"-"+updateDate.substr(6,2);
				dateArr.push(date);
				sevenyieldArr.push(sevenyield);
				sortArr.push(sevenyield);
			}
			sortArr.sort(function(a, b) {
				return a - b;
			});
			var distans = ((sortArr[sortArr.length - 1] - sortArr[0]) / 2) || (sortArr[sortArr.length - 1]/2);
			var max = (parseFloat(sortArr[sortArr.length - 1]) + parseFloat(distans))
					.toFixed(2);
			var min = (parseFloat(sortArr[0]) - parseFloat(distans))
					.toFixed(2);
			
			// 初始化图表
			echarts.init(document.getElementById('linechart')).setOption({
				grid : {
					x: 40,
					y: 5,
					x2: 15,
					y2: 30,
					borderWidth: 0
				},
				tooltip: {
					trigger: 'item',
					formatter: "{b}: {c}"
				},
				calculable : false,
				xAxis : [
					{
						type : 'category',
						axisLine: {
							lineStyle:{
							 width : 1,	
							 color: '#d6d5dc'
							}
						},
						splitLine: {
							lineStyle:{
							 type : 'dotted',
							 color: '#d6d5dc'
							}
						},
						axisTick: {
						  show: false
						},
						axisLabel: {
							textStyle: { 
							  color: '#979797'
							}
						},
						boundaryGap : false,
						data : dateArr   
					}
				],
				yAxis : [
					{	
						type : 'value',
						scale: true,
						max : max,
						min : min,
						axisLine: {
							lineStyle:{
							 width : 1,	
							 color: '#d6d5dc'
							}
						},
						splitLine: {
							lineStyle:{
							 type : 'dotted',
							 color: '#d6d5dc'
							}
						},
						axisTick: {
						  show: false
						},
						axisLabel: {
							textStyle: { 
							  color: '#979797'
							},
							formatter : function(value) {
								var val = Math
										.round(value * 1000) / 1000;
								return val.toFixed(3);
							}
						},
					}
				],
				series : [
					{
						name:'成交',
						type:'line',
						symbol: 'emptyCircle',
	          			symbolSize: 3,
						smooth:true,
						itemStyle: {
							normal: {
								color: 'rgb(0,160,255)',
								lineStyle: {
									width: 1,
									color: 'rgb(0,160,255)'
								},
								areaStyle: {
								  color: 'rgba(0,153,255,0.6)'
								}
							}
						},
						data:sevenyieldArr,
					}
				]
			});
			this.chat = true;
			this.qryHideWait();
		},
		
		buy : function(){
			App.navigate("bosera/boseraCtl/boseFundBuy");
		},
		
		payback : function(){
			var type = Utils.search().type;
			if(type && type=="finance"){
	    		var param ={
	    				financeNo:$("#fundIncome").attr("data-no"),
	        			financeName:Utils.getParamDisplay("PB_FINANCE_BALANCE","2"),
	        			financeTotalVol:$("#totalVol").text()
	    		};
				App.navigate("finance/financeCtl/financeBalanceOut",param);
			}else{
				App.navigate("bosera/boseraCtl/fundPayBack");
			}
		},
		
		incomeList : function(){
			var type = Utils.search().type;
			var totalAmt=$("#fundIncome").text();
    		var financeNo= $("#fundIncome").attr("data-no");
    		var param = {
					"totalAmt":totalAmt,
					"financeNo":financeNo
			};
			if(type && type=="finance"){
				App.storage.set("param",param);
	    		App.navigate("finance/financeCtl/financeBalanceInCome",param);
	    	
			}else{
				App.navigate("bosera/boseraCtl/boseInCome",param);
			}
		},
		
		goBack : function(){
			App.back();
		},
		
		refresh:function(){
			this.opt.type = "1";
			$("#totalVol,#fundIncome,#totalNew").text("0.00");
    		App.storage.remove("iBoseraIncome");
    		App.storage.remove("balanceInfo");
    		this.initialize();
		},
		
		qryHideWait: function(){
			if(this.income&&this.rate&&this.chat){
				if(!this.opt){
					this.opt = {
							callback:"curView.refresh()"
					};
				}
				Client.dragRefresh(this.opt);
				Client.hideWaitPanel(1);
			}
		}
	});
});
