define(function(require, exports, module) {
	
	var investRecordTpl = require("text!../template/investRecord.html");

	var investRecordView = module.exports = ItemView.extend({

		template : investRecordTpl,

		events : {
			
		},
		
		// 初始化
		initialize : function() {
			var pageStep1 = {
	        		title:'投资记录',
	        		leftButton:{
	        			name : '返回',
	        			func: 'curView.goBack()'
	        		},
					rightButton:{
						name : '',
					}
	        	};
	        	Client.initPageTitle(pageStep1);	        	
	        	
	        	this.queryRecord(1);
			    this.list=[];
			    this.initDrag();
		},
		
		queryRecord:function(pos){
			Client.openWaitPanel("拼命加载中，请稍候");
			var financeNo=App.storage.get("model").financeNo;
			var param = {	
					financeNo:financeNo,
					turnPageBeginPos:pos||1,
					turnPageShowNum:"10"
				};
			var $this = this;
			Ajax({url:"/product/recordProducts", data:param, 
				success:function(data){
				var html="";
				$.each(data.iSaleDetail,function(i,product){
					var mobileNo=Utils.getFmtMobile1(product.mobileNo);
					var daytime=product.orderSubmitTime.substring(0,8);
					daytime=daytime.substring(0,4)+"-"+daytime.substring(4,6)+"-"+daytime.substring(6,8);
					var hourtime=product.orderSubmitTime.substring(8,14);
					hourtime=hourtime.substring(0,2)+":"+hourtime.substring(2,4)+":"+hourtime.substring(4,6);
					var tranAmt=Utils.formatCurrency(product.tranAmt,2);
				

					
					
					html += '<li class="row .zen-list-5 " id="box" index="'+(pos+i)+'">'+
						        	'<div class="cell">'+ 
						            	'<h1 class="ft16">'+mobileNo+'</h1>'+
						                '<h2 class="fc-9 ft12">'+
						                	'<span class="mr10">'+daytime+'</span>'+ 
						                    '<span>'+hourtime+'</span>'+
						               ' </h2>'+
						           '</div>'+
						           '<div class="ft18 fc-blue lh2">'+tranAmt+'元</div>'+
						        '</li>';
						        
				});
					var turnPageTotalNum = data.turnPageTotalNum;
					if(!pos||pos=="0"){
						$("#queryList").html(html).attr("total",turnPageTotalNum);
						$this.list = data.iSaleDetail;
					}
					else{
						$("#queryList").append(html).attr("total",turnPageTotalNum);
						$this.list = $this.list.concat(data.iSaleDetail);
					}
						
					if(turnPageTotalNum<=$("#queryList").find('#box').length){
	    				$this.mysc.dragLoad = false;
						$(".pullUp").hide();
	    			}else{
	    				$(".pullUp").show();
	    			}
					
					if(turnPageTotalNum=="0"){
						$this.mysc.dragLoad = false;
						$("#noData").show();
						$("#wrapper").hide();
					}else{
						$("#noData").hide();
						$("#wrapper").show();
						$this.mysc.dragLoad = true;
					}
					
					$this.mysc.refresh();
				    Client.hideWaitPanel(100);
				}
			});
		},
		
		goBack : function(){
    		App.back();
    		Client.hideWaitPanel(1);
    	}, 
    	
    	
    	 /*********************调用滚动插件**************************/
    	initDrag : function(){
			var el = document.getElementById('wrapper');
			el.style.height = document.documentElement.clientHeight+ 'px';
			var $this = this;
			this.mysc = MUI.loadRefresh(el, {
				dragRefresh : false,
				loadCallback : function(){
		    	   var pos = $("#queryList").find('#box').length+1;
		    	   if(pos <= $("#queryList").attr("total")){
						 $this.queryRecord(pos);
		    	   }
		   	    }
		    });
		},
		 /******************************************************/
	});
});