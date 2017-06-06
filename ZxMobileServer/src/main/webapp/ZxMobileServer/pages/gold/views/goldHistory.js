define(function(require, exports, module){
	
	var goldHistoryTpl = require("text!../template/goldHistory.html");
	
	var goldHistoryView = module.exports = ItemView.extend({
		
		events : {
		},
		
		template : goldHistoryTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			
			this.queryHistory(1);
		},
		
		queryHistory : function(pos){
			var $this = this;
			var param = {
					productId:Utils.getParamDisplay("PB_BOSERA",'3'),
					turnPageBeginPos:pos,
					turnPageShowNum:"15"
			};
			Ajax({url:"/bosera/boseraMessageQuery", data:param, 
				success:function(data){
					if(data.errorCode){
						Utils.alertinfo(data.errorMessage);
						$(".table").hide();
						$('#noData').show();
					}else{
						var html = "";
						$.each(data.iBoseraMessageList,function(index,item){
							html += '<tr><td width="30%">'+item.fundlastnavdate+'</td>'+
							'<td width="23%">'+parseFloat(item.fundlastnav).toFixed(4)+'</td>'+
							'<td width="23%">'+parseFloat(item.fundNavHis).toFixed(4)+'</td>'+
							'<td class="'+(item.upsAndDowns>=0?'fc-orange':'fc-green')+'">'+(item.upsAndDowns>0?'+':'')+parseFloat(item.upsAndDowns).toFixed(2)+'%</td></tr>';
						});
						
						if(!pos||pos=="1"){
							$('#list').html(html);
							$this.initDrag();
						}else{
							$('#list').append(html);
						}
						$('#list').attr("total",data.turnPageTotalNum);
						
						if(data.turnPageTotalNum<=$("#list tr").length){
		    				$this.mysc.dragLoad = false;
							$(".pullUp").hide();
		    			}else{
		    				$(".pullUp").show();
		    			}
						
						if(data.turnPageTotalNum=="0"){
							$this.mysc.dragLoad = false;
							$(".table").hide();
							$('#noData').show();
						}else{
							$('#noData').hide();
							$(".table").show();
							$this.mysc.dragLoad = true;
						}
					}
					$this.mysc && $this.mysc.refresh();
					Client.hideWaitPanel(1);
				}
			});
		},
		
		initDrag : function(){
		    
		    /*********************调用滚动插件**************************/
			
			var el = document.querySelector('#wrapper');
			el.style.height = pubParam.clientHeight - 41 + 45 + 'px';
			var $this = this;
			this.mysc = MUI.loadRefresh(el, {
				dragRefresh : false,
				loadCallback : function(){
		    	   var pos = $('#list tr').length+1;
		    	   if(pos < $('#list').attr("total")){
						 $this.queryHistory(pos);
		    	   }
		   	    }
		    });

		    /***********************************************/
		},
		
		goBack : function(){
			App.back();
		}		
	
	});
});
