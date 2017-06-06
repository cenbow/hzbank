define(function (require, exports, module) {
	
	var fundInvestManagementTemplate = require("text!../template/fundInvestManagement.html");
	
	var FundInvestManagementView = module.exports = ItemView.extend({
		
		template : fundInvestManagementTemplate,
		
		events:{
			"click #addInvest" : "gotoFundRank",
		},
		
		initialize : function(){
			var pageStep1 = {
        		title:'定投管理',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        	
        	};

        	Client.initPageTitle(pageStep1);
        	
 			this.fundDateAdmQuery();
        },
        
        fundDateAdmQuery: function(){//定投查询
			Client.openWaitPanel("加载中...");
			var cardNo =Utils.getEleCard().cardNo;
			var $this =this;
			var param1 = {
	 				cardNo:cardNo,
	 				turnPageBeginPos:"1",
	 				turnPageShowNum:"1000",
	 				pageFlag:"0"//翻页时动态
	 		};
	 		Ajax({url:"/fund/fundDateAdmQuery",data:param1, success:function(data){//查询
	 			if(MUI.isEmpty(data.errorCode)){
	 				var icoll = data.iFundInvestinfo;
 					$("#iFundInvestinfo").empty();
 					for(var len=0;len<icoll.length;len++){
						var kcoll = icoll[len];
						$this.addRow("iFundInvestinfo",kcoll,len);
					}
 					
 					var turnPageTotalNum = data.turnPageTotalNum;
					$this.noData(turnPageTotalNum);
 					
 					App.storage.set("iFundInvestinfoList",icoll);
 					Client.hideWaitPanel(1);
	 			}else{
	 				Client.alertinfo(data.errorMessage,"提醒");
	 				Client.hideWaitPanel(1);
	 			}
	 		},error:function(){
    			Client.hideWaitPanel(1);
    		}});
		},
		
    	noData:function(turnPageTotalNum){
    		if(turnPageTotalNum==0){
				$("#iFundInvestinfo").hide();
				$('#noData').show();
			}else{
				$('#noData').hide();
				$("#iFundInvestinfo").show();
			}
    	},
        
		 addRow : function(id,kcoll,len){
			 var Span=kcoll.Span;//扣款周期数
		    var Period=kcoll.Period;//扣款周期单位(月0,周1,日2)
		    var investDay=kcoll.investDay;//扣款日期(月:1-28号,周:星期1-5,日:第1天)
		    var fundAmt=Utils.formatCurrency(kcoll.fundAmt,1);
		    fundAmt=fundAmt.substring(0,fundAmt.indexOf("."));
		    var NextInvestDate=Utils.formatDate(kcoll.NextInvestDate,'yyyyMMdd','yyyy-MM-dd');
		    var cardNo=Utils.formatAcc(Utils.getEleCard().cardNo);
			 var html ='<div class="list" id="div_'+kcoll.fundCode+len+'">'+
					        	'<div class="list-item">'+
					            	'<h1>'+kcoll.fundName+' <span class="ft13 fc-9">('+kcoll.fundCode+')</span></h1>'+
					                '<p class="ft13 fc-9">扣款账户: '+cardNo+'(电子账户)</p>'+
					            '</div>'+
					            '<div class="list-item row ft13">'+
					            	'<div class="cell">';
				if(Period=='0'){
					if(Span=='1'){
						html +='<span class="fc-9">每月 '+investDay+'日定投：</span>';
	        		}else if(Span=='2'){
	        			html +='<span class="fc-9">每两月 '+investDay+'日定投：</span>';
	        		}
				}else if(Period=='1'){
					investDay=this.weeks(investDay);
					if(Span=='1'){
						html +='<span class="fc-9">每周 '+investDay+'定投：</span>';
	        		}else if(Span=='2'){
	        			html +='<span class="fc-9">每两周 '+investDay+'定投：</span>';
	        		}
				}else if(Period=='2'){
					html +='<span class="fc-9">每日 定投：</span>';
				}
				html +=fundAmt+'元</div>'+
			            	'<div class="cell"><span class="fc-9">下次扣款：</span>'+NextInvestDate+'</div>'+
			            '</div>'+
			        '</div>';
	    		$("#"+id).append(html);
	    		var $this = this;
	    		$("#div_"+kcoll.fundCode+len).on('click', function() {
	    			$this.gotoFundInvestDetail(kcoll);
	    		});
	    		
	    	},
	    	
	    	weeks : function(date){
				switch(date){
					case '01':
						return "周一";
						break;
					case '02':
						return "周二";
						break;
					case '03':
						return "周三";
						break;
					case '04':
						return "周四";
						break;
					case '05':
						return "周五";
						break;
					default:
						return "未知";
						break;
				}
			},
		
	    	gotoFundInvestDetail : function(kcoll){//
//	    		 App.storage.set("iFundInvestinfo",kcoll);
	    		App.navigate("fund/fundCtl/fundInvestDetail",kcoll);
	    	},
	    	
	        gotoFundRank : function(){
	        	App.navigate("fund/fundCtl/fundRankNew");
	    	},
	        
	        goBack : function(){
	        	App.navigate("fund/fundCtl/myFund");
	    	},
	});
});