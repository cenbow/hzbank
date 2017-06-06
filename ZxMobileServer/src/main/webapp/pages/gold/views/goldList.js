define(function(require, exports, module) {
	
	var goldListTpl = require("text!../template/goldList.html");

	var goldListView = module.exports = ItemView.extend({

		template : goldListTpl,

		initialize : function() {
		
		},
		
		queryInCome:function(){
			var cardNo = Utils.trim(Utils.getEleCard().cardNo);
			var beginDate=Utils.getDifferentDate(-30,'yyyyMMdd');
			var endDate=Utils.getDifferentDate(0,'yyyyMMdd');
			var param = {
					cardNo:cardNo,
					startTime:beginDate,
					endTime:endDate
				};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/bosera/queryBoseraDetail", data:param, 
				success:function(data){
					if(data.errorCode){
						$("#noData").show();
						$("#wrapper1").hide();
						Client.hideWaitPanel(100);
						return;
					}else{
						var html="";
						var actualNum=0;
						$.each(data.iBoseraDetail,function(i,product){
							if(product.tranType != "2"){
								return true;
							}
							var transDate="";
							var tranAmt="";
							transDate=product.tranTime;
							tranAmt=Utils.formatCurrency(product.tranAmt,2);
							actualNum++;
							html += '<li class="row" id="box">'+
										'<div class="cell fc-9">'+transDate+'</div>'+
										'<div class="fc-9 ft16 fc-orange">'+tranAmt+'</div>'+
									'</li>';
						});
						
						$("#queryList").html(html);
							
						if($("#queryList li").length <= 0){
							$("#noData").show();
							$("#wrapper1").hide();
						}else{
							$("#noData").hide();
							$("#wrapper1").show();
						}
						
					    Client.hideWaitPanel(100);
					}
					
				}
			});
		},
		
		goBack : function(){
			App.back();
    		Client.hideWaitPanel(1);
    	}
	});
});