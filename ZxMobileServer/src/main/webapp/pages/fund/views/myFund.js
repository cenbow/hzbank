define(function (require, exports, module) {
	
	var myFundTemplate = require("text!../template/myFund.html");
	
	var MyFundView = module.exports = ItemView.extend({
		
		template : myFundTemplate,
		
		events:{
			"click #fundTranRecord" : "fundTranRecord",
			"click #confirm" : "fundTranRecord",
			"click #fundInvestManagement" : "fundInvestManagement",
		},
		
		initialize : function(){
        	var $this = this;
			var pageStep1 = {
        		title:'我的基金',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        	
        	};

        	Client.initPageTitle(pageStep1);
        	Client.menuOpt("0");
//        	var iFundBalinfo=App.storage.get("iFundBalinfoList");
//        	if(!iFundBalinfo){
        		$this.fundBalQuery();
//			}else{
//				$this.initFundBalQuery(iFundBalinfo);
//				 Client.hideWaitPanel(1);
//			}
        	
//        	var iCustConsininfo=App.storage.get("iCustConsininfoList");
//        	if(!iCustConsininfo){
        	$this.fundCurrentQuery();
//			}else{
//				$this.initFundCurrentQuery(iCustConsininfo);
//				 Client.hideWaitPanel(1);
//			}
        	
        	
        },
        
        fundBalQuery: function(){//我的基金（客户基金份额）查询
        	Client.openWaitPanel("加载中...");	
        	var cardNo =Utils.getEleCard().cardNo;
 	    		var $this = this;
 	    		var param1 = {
 	    				cardNo:cardNo,
 	    				turnPageBeginPos:"1",
 	    				turnPageShowNum:"10",
 	    				pageFlag:"0"//翻页时动态
 	    		};
 	    		Ajax({url:"/fund/fundBalQuery",data:param1, success:function(data){//查询
 	    			if(MUI.isEmpty(data.errorCode)){
 	    				var icoll = data.iFundBalinfo;
 	    				$("#iFundBalinfo").empty();
						var totalMoney=0;//总金额
						var totIncome=0;//累计盈亏
 	    				for(var len=0;len<icoll.length;len++){
							var kcoll = icoll[len];
							$this.addRow("iFundBalinfo",kcoll);
							totalMoney+=parseFloat(kcoll.fundNav);
							totIncome+=parseFloat(kcoll.totIncome);
						}
						$("#totalMoney").text(Utils.formatCurrency(totalMoney,2));
						$("#totIncome").text(Utils.formatCurrency(totIncome,2));
						
						var turnPageTotalNum = data.turnPageTotalNum;
						$this.noData(turnPageTotalNum);
	    				
						App.storage.set("iFundBalinfoList",icoll);
//				        	Client.hideWaitPanel(1);
 	    			}else if (data.errorCode == '1114'){
 	    				Client.hideWaitPanel(1);
 	    				return;
 	    			}else{
 	    				Client.alertinfo(data.errorMessage,"提醒");
 	    			}
 	    		},error:function(){
 	    			Client.hideWaitPanel(1);
 	    		}});
 		 
	    },
	    
	    initFundBalQuery:function(icoll){
//	    	Client.openWaitPanel("加载中...");	
	    	$("#iFundBalinfo").empty();
	    	var totalMoney=0;//总金额
			var totIncome=0;//累计盈亏
			if(icoll.length==0){
	    		this.noData(0);
	    	}
			for(var len=0;len<icoll.length;len++){
				var kcoll = icoll[len];
				this.addRow("iFundBalinfo",kcoll);
				totalMoney+=parseFloat(kcoll.fundNav);
				totIncome+=parseFloat(kcoll.totIncome);
			}
        	$("#totalMoney").text(Utils.formatCurrency(totalMoney,2));
			$("#totIncome").text(Utils.formatCurrency(totIncome,2));
    	},
	    
    	noData:function(turnPageTotalNum){
    		if(turnPageTotalNum==0){
				$("#iFundBalinfo").hide();
				$('#noData').show();
			}else{
				$('#noData').hide();
				$("#iFundBalinfo").show();
			}
    	},
    	
	    addRow : function(id,kcoll){
	    	var totIncome = this.JsonNvl(kcoll.totIncome, "--");
	    	var fundName=kcoll.fundName;
	    	var html =	'<div class="list fundList" id="div_'+kcoll.fundCode+'">';
        	if(fundName==""){
    			html+='<div class="list-item">--<span class="ft12 fc-9">('+kcoll.fundCode+')</span></div>';
    		}else if(fundName.length<=10){
    			
    			html+='<div class="list-item">'+fundName+'<span class="ft12 fc-9">('+kcoll.fundCode+')</span></div>';
    		}else{
    			html+='<div class="list-item">'+fundName.substring(0,10)+'...<span class="ft12 fc-9">('+kcoll.fundCode+')</span></div>';
    		}
        	
        	html +='<div class="list-item row lh2">'+
            	'<div class="cell pl10">'+
                	'<h1 class="ft13 fc-9">金额(元)</h1>'+
                    '<h2 class="ft16">'+Utils.formatCurrency(kcoll.fundNav,2)+'</h2>'+
                '</div>';
    			html +='<div class="cell txt-mid" >'+
			            	'<h1 class="ft13 fc-9">持有份额</h1>'+
			                '<h2>'+Utils.formatCurrency(kcoll.fundVol,2)+'</h2>'+
			            '</div>';
    		if(!totIncome.indexOf("-")){
    			html +='<div class="cell txt-r pr10">'+
				            	'<h1 class="ft13 fc-9">累计盈亏(元)</h1>'+
				                '<h2 class="ft16 fc-green">'+Utils.formatCurrency(totIncome,2)+'</h2>'+
				            '</div>'+
				        '</div>'+
				    '</div>';
    		}else{
    			html +='<div class="cell txt-r pr10">'+
				            	'<h1 class="ft13 fc-9">累计盈亏(元)</h1>'+
				                '<h2 class="ft16 fc-orange">'+Utils.formatCurrency(totIncome,2)+'</h2>'+
				            '</div>'+
				        '</div>'+
				    '</div>';
    		}
    		
    		$("#"+id).append(html);
    		var $this = this;
    		$("#div_"+kcoll.fundCode).on('click', function() {
    			$this.gotofundBuyAfterDetail(kcoll);
    		});
    		
    	},
        
    	JsonNvl : function(param, val) {
			
			if (MUI.isEmpty(param)) {
				paramT = val;
			} else {
				paramT = param;
			}
		
			return paramT;
    	},
        
    	fundCurrentQuery: function(){// 客户当前委托查询
        	Client.openWaitPanel("加载中...");
        	var cardNo =Utils.getEleCard().cardNo;
    		var $this =this;
        	var param2 = {
    				cardNo:cardNo,
    				pageFlag:"0",
    				turnPageBeginPos:"1",
    				turnPageShowNum:"1000",
    		};
    		Ajax({url:"/fund/fundCurrentQuery",data:param2, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var icoll = data.iCustConsininfo;
    				$("#iCustConsininfo").empty();
    				$this.flagConfirm(icoll);
					 App.storage.set("iCustConsininfoList",icoll);
					Client.hideWaitPanel(1);
    			}else if (data.errorCode == '1114'){
    				Client.hideWaitPanel(1);	
    				return;
	    		}else{
    				Client.alertinfo(data.errorMessage,"提醒");
    			}
    		},error:function(){
    			Client.hideWaitPanel(1);
    		}});
        },
    	
        flagConfirm :function(icoll){//待确认
        	var countb=0;//买入数
			var counts=0;//卖出数
			for(var len=0;len<icoll.length;len++){
				var kcoll = icoll[len];
				if((kcoll.transName)=="理财产品申购" && (kcoll.tradeStatusName=="受理" || kcoll.tradeStatusName=="预受理" ||kcoll.tradeStatusName=="确认中")){
					countb++;
				}else if((kcoll.transName)=="理财产品赎回" && (kcoll.tradeStatusName=="受理" || kcoll.tradeStatusName=="预受理" ||kcoll.tradeStatusName=="确认中")){
					counts++;
				}
			}
			if(countb==0 && counts==0){//考虑都为0的情况
//				$("#confirm").hide();
//				$("#confirm").html('<span>待确认</span>');
			}else if(countb==0){
				$("#confirm").html('<span>'+counts+'笔卖出待确认</span>');
			}else if(counts==0){
				$("#confirm").html('<span>'+countb+'笔买入待确认</span>');
			} else{
				$("#confirm").html('<span>'+countb+'笔买入待确认</span>'+ 
						'<span class="fc-b">|</span>'+ 
						'<span>'+counts+'笔卖出待确认</span>');
			}
        },
        
        initFundCurrentQuery:function(icoll){
        	$("#iCustConsininfo").empty();
        	this.flagConfirm(icoll);
    	},
    	
    	fundTranRecord: function(){//交易记录
    		var icoll=App.storage.get("iCustConsininfoList");
    		App.navigate("fund/fundCtl/fundTranRecord",icoll);
    	},
    	
    	gotofundBuyAfterDetail : function(kcoll){//购买后详情页
    		App.navigate("fund/fundCtl/fundBuyAfterDetail",kcoll);
    	},
    	
    	fundInvestManagement: function(){//定投管理
    		App.navigate("fund/fundCtl/fundInvestManagement");
    	},
    	
        goBack : function(){
        	if(App.browseList[1].indexOf("mycount")>=0){//
				App.back();
			}else{
				App.navigate("fund/fundCtl/fundIndex");
			}
    	},
	});
});