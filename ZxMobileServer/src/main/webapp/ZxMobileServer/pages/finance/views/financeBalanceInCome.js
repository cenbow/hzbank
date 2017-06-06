define(function(require, exports, module) {
	
	var financeBalanceInComeTpl = require("text!../template/financeBalanceInCome.html");

	var financeBalanceInComeView = module.exports = ItemView.extend({

		template : financeBalanceInComeTpl,

		events : {
			
		},
		
		// 初始化
		initialize : function() {
			var pageStep1 = {
	        		title:'累计收益',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
					rightButton:{
						name : '',
					}
	        	};
	        	Client.initPageTitle(pageStep1);	
	        	document.getElementById('noData').style.height = pubParam.clientHeight + 49 -93 + 'px';
	        	var totalAmt = App.storage.get("param").totalAmt;
	        	$('#tranAmtTotal').text(Utils.formatCurrency(totalAmt));
	        	this.queryInCome(1);
			    this.list=[];
//			    this.initDrag();
		},
		
		queryInCome:function(pos){
			var financeNo =  App.storage.get("param").financeNo;
			var cardNo = Utils.trim(Utils.getCardNoByFlag("0","cardFlag1"));
			var beginDate=Utils.getDifferentDate(-30,'yyyyMMdd');
			var endDate=Utils.getDifferentDate(0,'yyyyMMdd');
			var pageFlag="0";
			var param = {	
					financeNo:financeNo,
					cardNo:cardNo,
					beginDate:beginDate,
					endDate:endDate,
					pageFlag:pageFlag,
					turnPageBeginPos:pos||1,
					turnPageShowNum:"1000"
				};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/finance/queryFinanceBalanceInCome", data:param, 
				success:function(data){
					if(data.errorCode){
						$("#noData").show();
						$("#wrapper1").hide();
						Client.hideWaitPanel(100);
						return;
					}else{
						var html="";
						var actualNum=0;
						$.each(data.iBalanceDetail,function(i,product){
							var amtDir=product.amtDir;
							var transDate="";
							var tranAmt="";
							if(amtDir=="2"){
								transDate=product.transDate;
								transDate=transDate.substring(0,4)+"-"+transDate.substring(4,6)+"-"+transDate.substring(6,8);
								tranAmt=Utils.formatCurrency(product.tranAmt,2);
								actualNum++;
								html += '<li class="row" id="box" index="'+(pos+i)+'">'+
											'<div class="cell fc-9">'+transDate+'</div>'+
											'<div class="fc-9 ft16 fc-orange">'+tranAmt+'</div>'+
										'</li>';
							}
						});
						if(!pos||pos=="0"){
							$("#queryList").html(html).attr("total",actualNum);
							$this.list = data.iBalanceDetail;
						}
						else{
							$("#queryList").append(html).attr("total",actualNum);
							$this.list = $this.list.concat(data.iBalanceDetail);
						}
							
//						if(actualNum<=$("#queryList").find('#box').length){
//		    				$this.mysc.dragLoad = false;
//							$(".pullUp").hide();
//		    			}else{
//		    				$(".pullUp").show();
//		    			}
						
						if(actualNum=="0"){
//							$this.mysc.dragLoad = false;
							$("#noData").show();
							$("#wrapper1").hide();
						}else{
							$("#noData").hide();
							$("#wrapper1").show();
//							$this.mysc.dragLoad = true;
						}
						
//						$this.mysc.refresh();
					    Client.hideWaitPanel(100);
					}
					
				}
			});
		},
		
		goBack : function(){
			App.back();
    		Client.hideWaitPanel(1);
    	}, 
    	
    	
    	 /*********************调用滚动插件**************************/
    	initDrag : function(){
			var el = document.getElementById('wrapper1');
			document.getElementById('noData').style.height = el.style.height = pubParam.clientHeight + 49 -93 + 'px';
			var $this = this;
			this.mysc = MUI.loadRefresh(el, {
				dragRefresh : false,
				loadCallback : function(){
		    	   var pos = $("#queryList").find('#box').length+1;
		    	   if(pos <= $("#queryList").attr("total")){
		    		   $this.queryInCome(pos);
		    	   }
		   	    }
		    });
		},
		 /******************************************************/
	});
});