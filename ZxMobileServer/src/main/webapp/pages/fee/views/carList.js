define(function(require, exports, module){
	
	var carListTpl = require("text!../template/carList.html");
	
	var carListView = module.exports = ItemView.extend({
		
		events : {
		},
		
		template : carListTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			this.initDrag();
			
			this.pageBeginPos = 1;
        	this.pageShowNum = 10;
        	this.queryOrderList("0");
        	
        	var setHeight = (document.documentElement.clientHeight || window.innerHeight); //需要占满屏幕高度所需高度
    		document.querySelector('#noData').style.height = setHeight+ 'px';
			
		},
		
		queryOrderList : function(drag){
			var $this = this;
        	var param = {
    			turnPageBeginPos:$this.pageBeginPos,
        		turnPageShowNum:$this.pageShowNum,
        		timeBegin:"",
        		timeEnd:"",
        		tranState:"20",
        		businesCode:'',
        		feeTypeCode:"12"
        	};
        	
    		Ajax({url:"/fee/queryFeeTransList", data:param, success:function(data){
    			if(data.errorCode){
    				Utils.alertinfo(data.errorMessage);
    			}else{
    				var ul = $(".payTuition");
        			
        			var turnPageTotalNum = data.turnPageTotalNum;
        			ul.attr("total",turnPageTotalNum);
        			
        			var html = "";
        			$.each(data.transQueryList,function(i,transList){
        				
        				var orderList = transList.orderNum+"|"+transList.payacCount+"|"+transList.payacCountName+"|"+transList.billkeyName;
        				
        				html += '<div class="list-item arr" data="'+orderList+'">'+
        							'<div class="time">'+
    									'<h1>'+Utils.getWeek(Utils.parseDate(transList.subTime,'yyyyMMddhhmmss').getDay())+'</h1>'+
    									'<h2 class="ft12">'+transList.subTime.substring(4,6)+'-'+transList.subTime.substring(6,8)+'</h2>'+
        							'</div>'+
        							'<i class="h"></i>'+
        							'<h1 class="ft16">-'+transList.tranAmt+'</h1>'+
        							'<h2 class="fc-8 ft12">'+transList.feeName+'</h2>'+
        						'</div>';
        			});
        			
        			if(drag=="1")
        				ul.append(html);
        			else
        				ul.html(html);
        			
        			ul.find('.list-item').off().on("click",function(){
        				var orderList = $(this).attr("data");
        				var orderNum = orderList.split("|")[0];
        				var payacCount = orderList.split("|")[1];
        				var payacCountName = orderList.split("|")[2];
        				var billkeyName = orderList.split("|")[3];
        				var params = {
        						orderNum : orderNum,
        						payacCount : payacCount,
        						payacCountName : payacCountName,
        						billkeyName : billkeyName,
        				};
        				App.navigate("fee/feeCtl/carOrderDetail",params);
        			});
        			
        			if(turnPageTotalNum<=ul.find('.list-item').length){
        				$this.mysc.dragLoad = false;
    					$(".pullUp").hide();
        			}
        			
        			if(turnPageTotalNum=="0"){
    					$this.mysc.dragLoad = false;
    					$("#wrapper").hide();
    					$('#noData').show();
    				}else{
    					$('#noData').hide();
    					$("#wrapper").show();
    					$this.mysc.dragLoad = true;
    				}
        			
    			}
    			
    			Client.hideWaitPanel(1);
    			$this.mysc.refresh();//DOM 加载结束后必须调用
    		}});
        },
		
		initDrag : function(){
     		/*********************调用滚动插件**************************/
			
			var el = document.querySelector('#wrapper');
			el.style.height = (document.documentElement.clientHeight || window.innerHeight) + 'px';
			var $this = this;
			this.mysc = MUI.loadRefresh(el, {
				dragRefresh : false,
				loadCallback : function(){
					if($(".payTuition .list-item").length>=$(".payTuition").attr("total")){
	 	 				return false;
	 	 			}
	  		    	$this.pageBeginPos = $this.pageBeginPos + $this.pageShowNum;
	 	 			$this.queryOrderList("1");
		   	    }
		    });

		    /***********************************************/
     	},
     	
		goBack : function(){
			App.back();
		}
	
	});
});
