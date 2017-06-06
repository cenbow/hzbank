define(function(require, exports, module) {
	
	var boseInComeTpl = require("text!../template/boseInCome.html");

	var boseInComeView = module.exports = ItemView.extend({

		template : boseInComeTpl,

		initialize : function() {
			
        	document.getElementById('noData').style.height = pubParam.clientHeight + 49 -93 + 'px';
        	var totalAmt = App.storage.get("_parameters").totalAmt;
        	$('#tranAmtTotal').text(Utils.formatCurrency(totalAmt));
        	this.queryInCome();
        	
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
    	}, 
    	
    	
    	 /*********************调用滚动插件(暂不用)**************************/
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