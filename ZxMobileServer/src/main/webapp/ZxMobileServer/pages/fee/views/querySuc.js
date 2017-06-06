define(function(require, exports, module){
	
	var querySucTpl = require("text!../template/querySuc.html");
	
	var querySucView = module.exports = ItemView.extend({
		
		events : {
		},
		
		template : querySucTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			
			this.pageBeginPos = 1;
        	this.pageShowNum = 30;
        	var setHeight = (document.documentElement.clientHeight || window.innerHeight); //需要占满屏幕高度所需高度
    		document.querySelector('#noData').style.height = setHeight+ 'px';
			this.QueryCarTranseFeeResult("0");
//			this.initDrag();
		},
		
		QueryCarTranseFeeResult : function(drag){
			var $this = this;
        	var param = {
    			turnPageBeginPos:$this.pageBeginPos,
        		turnPageShowNum:$this.pageShowNum,
        		businesCode:'33011200001',
				feeTypeCode:'1200',
				tranState:'',
        		timeBegin:"",
        		timeEnd:""
        	};
        	
    		Ajax({url:"/fee/carTranseFeeResultQuery", data:param, success:function(data){
    			if(data.errorCode){
    				Utils.alertinfo(data.errorMessage);
    			}else{
    				var ul = $(".Pays");
        			var turnPageTotalNum = data.turnPageTotalNum;
        			ul.attr("total",turnPageTotalNum);
        			
        			var html = "";
        			$.each(data.cpjjtransQueryList ,function(i,cpjjtransQueryList){
        				var hostState = cpjjtransQueryList.hostState;
        				var tranState = cpjjtransQueryList.tranState;
        				var state = Utils.tranState(hostState,tranState);
        				var itCss ='';
        				if(state == '待支付'){
        					hostState = "待支付";
        					itCss = "fc-orange";
        				}else if(state == '处理中'){
        					hostState = "处理中";
        					itCss = "fc-orange";
        				}else if(state == '交易成功'){
        					hostState = "交易成功";
        					itCss = "fc-blue";
        				}else if(state == '交易失败'){
        					hostState = "交易失败";
        					itCss = "fc-orange";
        				}else if(state == '交易关闭'){
        					hostState = "交易关闭";
        					itCss = "fc-orange";
        				}else{
        					hostState = "支付可疑";
        					itCss = "fc-orange";
        				}
        				html += '<div class="list disabled">'+
        							'<div class="list-item lh2 fc-9 ft13">'+
        								'<div class="row">'+
        									'<div class="cell">'+'缴费项目'+'</div>'+
        									'<div>'+cpjjtransQueryList.feeName+'</div>'+
        								'</div>'+
        								'<div class="row">'+
	    									'<div class="cell">'+'缴费日期'+'</div>'+
	    									'<div>'+cpjjtransQueryList.subTime.substring(0,4)+'-'+cpjjtransQueryList.subTime.substring(4,6)+'-'+cpjjtransQueryList.subTime.substring(6,8)+'</div>'+
    									'</div>'+	
    									'<div class="row">'+
    										'<div class="cell">'+'缴款书编号'+'</div>'+
    										'<div>'+cpjjtransQueryList.billkey+'</div>'+
    									'</div>'+	
    									'<div class="row">'+
											'<div class="cell">'+'缴款人姓名'+'</div>'+
											'<div>'+cpjjtransQueryList.billkeyName+'</div>'+
										'</div>'+	
    									'<div class="row">'+
											'<div class="cell">'+'缴费金额'+'</div>'+
											'<div>'+cpjjtransQueryList.tranAmt+'</div>'+
										'</div>'+	
    									'<div class="row">'+
											'<div class="cell">'+'大写金额'+'</div>'+
											'<div>'+Utils.toChineseCurrency(cpjjtransQueryList.tranAmt)+'</div>'+
										'</div>'+	
    									'<div class="row">'+
											'<div class="cell">'+'订单号'+'</div>'+
											'<div>'+cpjjtransQueryList.orderNum+'</div>'+
										'</div>'+	
    									'<div class="row">'+
											'<div class="cell">'+'订单状态'+'</div>'+
											'<div class="'+itCss+'">'+hostState+'</div>'+
										'</div>'+	
        							'</div>'+
        						'</div>';
        				
        			});
        			ul.append(html);
//        			if(drag=="1"){
//        				alert(1010);
//        				ul.append(html);
//        			}else{
//        				alert(1111);
//        				ul.html(html);
//        			}
//        			
//        			ul.find('.list').off().on("click",function(){
//        				var orderNum = $(this).attr("data");
//        				App.navigate("fee/feeCtl/orderDetail?orderNum="+orderNum);
//        			});
//        			
//        			if(turnPageTotalNum<=ul.find('.Pays').length){
//        				alert("turnPageTotalNum="+turnPageTotalNum);
//        				alert("ul.find('.Pays').length="+ul.find('.Pays').length);
//        				alert(1212);
//        				$this.mysc.dragLoad = false;
//        				alert(1414);
//    					$(".pullUp").hide();
//    					alert(1313);
//        			}
        			
        			if(turnPageTotalNum=="0"){
//    					$this.mysc.dragLoad = false;
//    					$("#wrapper").hide();
    					$('#noData').show();
    				}else{
    					$('#noData').hide();
//    					$("#wrapper").show();
//    					$this.mysc.dragLoad = true;
    				}
        			
    			}
    			
    			Client.hideWaitPanel(1);
//    			$this.mysc.refresh();//DOM 加载结束后必须调用
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
					if($(".tab-pages ").length>=$(".tab-pages").attr("total")){
	 	 				return false;
	 	 			}
	  		    	$this.pageBeginPos = $this.pageBeginPos + $this.pageShowNum;
	 	 			$this.QueryCarTranseFeeResult("1");
		   	    }
		    });

		    /***********************************************/
     	},
		
		goBack : function(){
			App.back();
		}
	
	});
});
