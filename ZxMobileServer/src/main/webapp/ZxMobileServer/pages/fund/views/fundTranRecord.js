define(function (require, exports, module) {
	
	var fundTranRecordTemplate = require("text!../template/fundTranRecord.html");
	
	var FundIndexView = module.exports = ItemView.extend({
		
		template : fundTranRecordTemplate,
		
		events:{
			
		},
		
		initialize : function(){
        	this.pageFlag="0";
			var $this =this;
			var pageStep1 = {
        		title:'交易记录',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        		
        	};

        	
        	Client.initPageTitle(pageStep1);
        
        	$this.fundCurrentQuery(1);
        	var allTab = $('.fudDetail .tab .cell');
    	    var allCnt = $('.allCnt .cnt');
    	    allTab.on('click', function(){
    	        var cur = $(this);
    	        var curCnt = allCnt.eq(cur.index());
    	       if($(this).hasClass('active')){
    	    	   return;
    	       }
    	        allTab.removeClass('active');
    	        cur.addClass('active');
    	        allCnt.hide();
    	        curCnt.show();
    	        if(cur.index()==0){
    	        	$("#iCustConsininfo").empty();
    	        	$('#noData1').hide();
    	        	$this.fundCurrentQuery(1);
    	        }else if(cur.index()==1){
    	        	$("#iFundDealInfo").empty();
    	        	$('#noData2').hide();
    	        	$this.fundHisDealQuery(1);
    	        }else if(cur.index()==2){
    	        	$("#iFundDealrepealInfo").empty();
    	        	$('#noData3').hide();
    	        	$this.fundBusiConcelQuery(1);
    	        }
    	    });
    		$this.initDrag1();
        	$this.initDrag2();
        	$this.initDrag3();
        },
        
        fundCurrentQuery: function(pos){
        	Client.openWaitPanel("加载中...");
        	if(pos=="1"){
        		this.pageFlag="0";
        	}else{
        		this.pageFlag="1";
        	}
        	var cardNo = Utils.trim(Utils.getCardNoByFlag("0","cardFlag1"));
    		var $this = this;
    		var param1 = {
    				cardNo:cardNo,
    				pageFlag:this.pageFlag,
    				turnPageBeginPos:pos||1,
    				turnPageShowNum:"8",
    		};
    		Ajax({url:"/fund/fundCurrentQuery",data:param1, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var icoll = data.iCustConsininfo;
    				if(!pos||pos=="1"){
    					$("#iCustConsininfo").empty();
					}
					for(var len=0;len<icoll.length;len++){
						var kcoll = icoll[len];
						$this.addRow1("iCustConsininfo",kcoll);
						$this.mysc1.refresh();
					}
					var turnPageTotalNum = data.turnPageTotalNum;
    				if(turnPageTotalNum=="0"){
						$this.mysc1.dragLoad = false;
						$("#wrapper1").hide();
						$('#noData1').show();
					}else{
						$('#noData1').hide();
						$("#wrapper1").show();
						$this.mysc1.dragLoad = true;
					}
    				
    				if(turnPageTotalNum<=$("#iCustConsininfo").find('.box').length){
	    				$this.mysc1.dragLoad = false;
						$(".pullUp").hide();
	    			}else{
	    				$(".pullUp").show();
	    			}
	    			
    				
				    Client.hideWaitPanel(100);
    			}else{
    				Client.alertinfo(data.errorMessage,"提醒");
    				Client.hideWaitPanel(1);
    			}
    		},error:function(){
    			Client.hideWaitPanel(1);
    		}});
        },
        
        
        fundHisDealQuery: function(pos){
        	Client.openWaitPanel("加载中...");
        	if(pos=="1"){
        		this.pageFlag="0";
        	}else{
        		this.pageFlag="1";
        	}
        	var cardNo = Utils.trim(Utils.getCardNoByFlag("0","cardFlag1"));
        	var beginDate =Utils.getDifferentMonth(-24,"yyyyMMdd");
        	var endDate =Utils.getServerDate("yyyyMMdd");
        	var $this = this;
    		var param2 = {
    				cardNo:cardNo,
    				beginDate:beginDate,
    				endDate:endDate,
    				TACode:"",
    				turnPageBeginPos:pos||1,
    				turnPageShowNum:"8",
    				pageFlag:this.pageFlag,
    		};
    		Ajax({url:"/fund/fundHisDealQuery",data:param2, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var icoll = data.iFundDealInfo;
    				if(!pos||pos=="1"){
    					$("#iFundDealInfo").empty();
					}
					for(var len=0;len<icoll.length;len++){
						var kcoll = icoll[len];
						$this.addRow2("iFundDealInfo",kcoll);
						$this.mysc2.refresh();
					}
					var turnPageTotalNum = data.turnPageTotalNum;
    				if(turnPageTotalNum=="0"){
						$this.mysc2.dragLoad = false;
						$("#wrapper2").hide();
						$('#noData2').show();
					}else{
						$('#noData2').hide();
						$("#wrapper2").show();
						$this.mysc2.dragLoad = true;
					}
    				if(turnPageTotalNum<=$("#iFundDealInfo").find('.box').length){
	    				$this.mysc2.dragLoad = false;
						$(".pullUp").hide();
	    			}else{
	    				$(".pullUp").show();
	    			}
	    			
				    Client.hideWaitPanel(100);
    			}else{
    				Client.alertinfo(data.errorMessage,"提醒");
    				Client.hideWaitPanel(1);
    			}
    		}});
        },
        
        fundBusiConcelQuery: function(pos){//撤单查询
        	Client.openWaitPanel("加载中...");
        	if(pos=="1"){
        		this.pageFlag="0";
        	}else{
        		this.pageFlag="1";
        	}
        	var cardNo =Utils.getEleCard().cardNo;
        	var $this = this;	
        	var param1 = {
 	    				cardNo:cardNo,
 	    				turnPageBeginPos:pos||1,
 	    				turnPageShowNum:"8",
 	    				pageFlag:this.pageFlag,
 	    				orderFlag:""
 	    		};
 	    		Ajax({url:"/fund/busiConcelQuery",data:param1, success:function(data){//查询
 	    			if(MUI.isEmpty(data.errorCode)){
 	    				var icoll = data.iFundDealrepealInfo;
 	    				if(!pos||pos=="1"){
 	    					$("#iFundDealrepealInfo").empty();
 						}
 						for(var len=0;len<icoll.length;len++){
 							var kcoll = icoll[len];
 							$this.addRow3("iFundDealrepealInfo",kcoll,len);
 							$this.mysc3.refresh();
 						}
 						var turnPageTotalNum = data.turnPageTotalNum;
 	    				if(turnPageTotalNum=="0"){
 	    					$this.mysc3.dragLoad = false;
 							$("#wrapper3").hide();
 							$('#noData3').show();
 						}else{
 							$('#noData3').hide();
 							$("#wrapper3").show();
 							$this.mysc3.dragLoad = true;
 						}
 	    				
 	    				if(turnPageTotalNum<=$("#iFundDealrepealInfo").find('.box').length){
 		    				$this.mysc3.dragLoad = false;
 							$(".pullUp").hide();
 		    			}else{
 		    				$(".pullUp").show();
 		    			}
 	    				Client.hideWaitPanel(1);
 	    			}else{
 	    				Client.alertinfo(data.errorMessage,"提醒");
 	    				Client.hideWaitPanel(1);
 	    			}
 	    		},error:function(){
 	    			Client.hideWaitPanel(1);
 	    		}});
 		 
	    },
        
        
        addRow1 : function(id,kcoll){
        	var transDate=Utils.formatDate(kcoll.transDate,'yyyyMMdd','yyyy-MM-dd');
        	var transTime=kcoll.transTime;
        	var fundName=kcoll.fundName;
        	var html='<div class="list-item row box">'+
			        	'<div class="cell">';
		       if((kcoll.transName)=="理财产品申购"){
		    	   if(fundName==""){
		    		   html+='<p><span class="sellout">买入</span>--</p>';//买入
		    		}else if(fundName.length<=10){
		    			 html+='<p><span class="sellout">买入</span>'+fundName+'</p>';
		    		}else{
		    			 html+='<p><span class="sellout">买入</span>'+fundName.substring(0,10)+'...</p>';
		    		}
		    	  
		       }else if((kcoll.transName)=="理财产品赎回"){
		    	   if(fundName==""){
		    		   html+='<p><span class="sellout">卖出</span>--</p>';//卖出
		    		}else if(fundName.length<=10){
		    			 html+='<p><span class="sellout">卖出</span>'+fundName+'</p>';
		    		}else{
		    			 html+='<p><span class="sellout">卖出</span>'+fundName.substring(0,10)+'...</p>';
		    		}
		       }else{
		    	   if(fundName==""){
		    		   html+='<p><span class="sellout">'+kcoll.transName+'</span>--</p>';//其他
		    		}else if(fundName.length<=10){
		    			 html+='<p><span class="sellout">'+kcoll.transName+'</span>'+fundName+'</p>';
		    		}else{
		    			 html+='<p><span class="sellout">'+kcoll.transName+'</span>'+fundName.substring(0,10)+'...</p>';
		    		}
		       }     	 	
			            	
			   html+='<p class="fc-b9">'+transDate+' '+transTime.substring(0,2)+':'+transTime.substring(2,4)+'</p>'+
			            '</div>'+
			            '<div class="cell txt-r">';
			   if((kcoll.transName)=="理财产品申购"){	
				   html+='<p>'+Utils.formatCurrency(kcoll.fundAmt,2)+'(元)</p>';
			   }else if((kcoll.transName)=="理财产品赎回"){
				   html+='<p>'+Utils.formatCurrency(kcoll.fundVol,2)+'(份)</p>';
			   }
			    html+='<p class="fc-orange">'+kcoll.tradeStatusName+'</p>'+
			            '</div>'+
			        '</div>';
        	
        	$("#"+id).append(html);
        },
       
        addRow2 : function(id,kcoll){
        	var cfmDate=Utils.formatDate(kcoll.cfmDate,'yyyyMMdd','yyyy-MM-dd');
        	var fundName=kcoll.fundName;
        	var html='<div class="list-item row box">'+
			        	'<div class="cell">';
        	if((kcoll.busiName)=="申购"){
        		if(fundName==""){//判产品名字
		    		   html+='<p><span class="sellout">买入</span>--</p>';//买入
		    		}else if(fundName.length<=10){
		    			 html+='<p><span class="sellout">买入</span>'+fundName+'</p>';
		    		}else{
		    			 html+='<p><span class="sellout">买入</span>'+fundName.substring(0,10)+'...</p>';
		    		}
		    }else if((kcoll.busiName)=="赎回"){
		    	if(fundName==""){
		    		   html+='<p><span class="sellout">卖出</span>--</p>';//卖出
		    		}else if(fundName.length<=10){
		    			 html+='<p><span class="sellout">卖出</span>'+fundName+'</p>';
		    		}else{
		    			 html+='<p><span class="sellout">卖出</span>'+fundName.substring(0,10)+'...</p>';
		    		}
		    }else{
		    	 if(fundName==""){
		    		   html+='<p><span class="sellout">'+kcoll.busiName+'</span>--</p>';//其他
		    		}else if(fundName.length<=10){
		    			 html+='<p><span class="sellout">'+kcoll.busiName+'</span>'+fundName+'</p>';
		    		}else{
		    			 html+='<p><span class="sellout">'+kcoll.busiName+'</span>'+fundName.substring(0,10)+'...</p>';
		    		}
		       }   	
        	
        		html+='<p class="fc-b9">'+cfmDate+'</p>'+
            '</div>'+
            '<div class="cell txt-r">'+
            '<p>'+Utils.formatCurrency(kcoll.cfmAmt,2)+'(元)</p>';
        	if(kcoll.chargeFee!=""){
        		html+='<p class="fc-blue">手续费'+kcoll.chargeFee+'元</p></div>';
        	}
        	$("#"+id).append(html);
        },
        
        addRow3 : function(id,kcoll,len){
        	var transDate=Utils.formatDate(kcoll.transferDate,'yyyyMMdd','yyyy-MM-dd');
        	var transTime=kcoll.transTime;
        	var fundName=kcoll.fundName;
        	var html='<div class="list-item row box" id="div_'+kcoll.fundCode+len+'">'+
			        	'<div class="cell">';
		       if((kcoll.transName)=="理财产品申购"){
		    	   if(fundName==""){
		    		   html+='<p><span class="sellout">买入</span>--</p>';//买入
		    		}else if(fundName.length<=10){
		    			 html+='<p><span class="sellout">买入</span>'+fundName+'</p>';
		    		}else{
		    			 html+='<p><span class="sellout">买入</span>'+fundName.substring(0,10)+'...</p>';
		    		}
		    	  
		       }else if((kcoll.transName)=="理财产品赎回"){
		    	   if(fundName==""){
		    		   html+='<p><span class="sellout">卖出</span>--</p>';//卖出
		    		}else if(fundName.length<=10){
		    			 html+='<p><span class="sellout">卖出</span>'+fundName+'</p>';
		    		}else{
		    			 html+='<p><span class="sellout">卖出</span>'+fundName.substring(0,10)+'...</p>';
		    		}
		       }else{
		    	   if(fundName==""){
		    		   html+='<p><span class="sellout">'+kcoll.transName+'</span>--</p>';//其他
		    		}else if(fundName.length<=10){
		    			 html+='<p><span class="sellout">'+kcoll.transName+'</span>'+fundName+'</p>';
		    		}else{
		    			 html+='<p><span class="sellout">'+kcoll.transName+'</span>'+fundName.substring(0,10)+'...</p>';
		    		}
		       }     	 	
			            	
			   html+='<p class="fc-b9">'+transDate+' '+transTime.substring(0,2)+':'+transTime.substring(2,4)+'</p>'+
			            '</div>'+
			            '<div class="cell txt-r">';
			   if((kcoll.transName)=="理财产品申购"){	
				   html+='<p>'+Utils.formatCurrency(kcoll.fundAmt,2)+'(元)</p>';
			   }else if((kcoll.transName)=="理财产品赎回"){
				   html+='<p>'+Utils.formatCurrency(kcoll.fundVol,2)+'(份)</p>';
			   }
			    html+='<p class="fc-orange">'+kcoll.tradeStatusName+'</p>'+
			            '</div>'+
			        '</div>';
        	
        	$("#"+id).append(html);
        	var $this = this;
    		$("#div_"+kcoll.fundCode+len).on('click', function() {
    			$this.gotofundRevoke(kcoll);
    		});
        },
        
        gotofundRevoke : function(kcoll){
	   		 App.storage.set("iFundDealrepealInfo",kcoll);
	   		App.navigate("fund/fundCtl/fundRevoke",{iFundDealrepealInfo:kcoll});
	   	},
        
        goBack : function(){
        	App.back();
    	},
    	
    	initDrag1 : function(){
		    /*********************调用滚动插件**************************/
			
			var el = document.getElementById('wrapper1');
			el.style.height = document.documentElement.clientHeight - 45 + 'px';
			var noData = document.getElementById('noData1');//控制没数据时高度
			noData.style.height = document.documentElement.clientHeight - 42 + 'px';
			var $this = this;
			this.mysc1 = MUI.loadRefresh(el, {
				dragRefresh : false,
				loadCallback : function(){
					var pos = $("#iCustConsininfo").find('.box').length+1;
					$this.fundCurrentQuery(pos);
						
		   	    }
		    });
		    /***********************************************/
			
			
		},
		
		initDrag2 : function(){
		    /*********************调用滚动插件**************************/
			
			var el = document.getElementById('wrapper2');
			el.style.height = document.documentElement.clientHeight - 45 + 'px';
			var noData = document.getElementById('noData2');//控制没数据时高度
			noData.style.height = document.documentElement.clientHeight - 42 + 'px';
			var $this = this;
			this.mysc2 = MUI.loadRefresh(el, {
				dragRefresh : false,
				loadCallback : function(){
					var pos = $("#iFundDealInfo").find('.box').length+1;
					$this.fundHisDealQuery(pos);
						
		   	    }
		    });
		    /***********************************************/
			
			
		},
		initDrag3 : function(){
		    /*********************调用滚动插件**************************/
			
			var el = document.getElementById('wrapper3');
			el.style.height = document.documentElement.clientHeight - 45 + 'px';
			var noData = document.getElementById('noData3');//控制没数据时高度
			noData.style.height = document.documentElement.clientHeight - 42 + 'px';
			var $this = this;
			this.mysc3 = MUI.loadRefresh(el, {
				dragRefresh : false,
				loadCallback : function(){
					var pos = $("#iFundDealrepealInfo").find('.box').length+1;
					$this.fundBusiConcelQuery(pos);
						
		   	    }
		    });
		    /***********************************************/
			
			
		},
	});
});