define(function(require, exports, module){
	
	var orderListTpl = require("text!../template/orderList.html");
	
	var orderListView = module.exports = ItemView.extend({
		
		events : {
		},
		
		template : orderListTpl,
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
        		feeTypeCode:"08"
        	};
        	
    		Ajax({url:"/fee/queryFeeTransList", data:param, success:function(data){
    			if(data.errorCode){
    				Utils.alertinfo(data.errorMessage);
    			}else{
    				var ul = $(".payTuition");
        			
        			var turnPageTotalNum = data.turnPageTotalNum;
        			ul.attr("total",turnPageTotalNum);
        			
        			var html = "";
        			var term = "";
        			$.each(data.transQueryList,function(i,transList){
        				if(transList.businesCode == "110008051001"){
        					term = transList.billmonth.substring(4,6)>"06"?(transList.billmonth.substring(0,4)+'学年')
        							:(parseInt(transList.billmonth.substring(0,4))-1+'学年');
        				}else{
        					term = transList.billmonth.substring(4,6)>"06"?(transList.billmonth.substring(0,4)+'年第一学期')
        							:(parseInt(transList.billmonth.substring(0,4))-1+'年第二学期');
        				}
        				
        				html += '<div class="list-item arr" data="'+transList.orderNum+'">'+
        							'<div class="time">'+
    									'<h1>'+Utils.getWeek(Utils.parseDate(transList.subTime,'yyyyMMddhhmmss').getDay())+'</h1>'+
    									'<h2 class="ft12">'+transList.subTime.substring(4,6)+'-'+transList.subTime.substring(6,8)+'</h2>'+
        							'</div>'+
        							'<i class="b"></i>'+
        							'<h1 class="ft16">-'+transList.tranAmt+'</h1>'+
        							'<h2 class="fc-8 ft12">学费代缴-'+term+'</h2>'+
        						'</div>';
        			});
        			
        			if(drag=="1")
        				ul.append(html);
        			else
        				ul.html(html);
        			
        			ul.find('.list-item').off().on("click",function(){
        				var orderNum = $(this).attr("data");
        				App.navigate("fee/feeCtl/orderDetail?orderNum="+orderNum);
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
