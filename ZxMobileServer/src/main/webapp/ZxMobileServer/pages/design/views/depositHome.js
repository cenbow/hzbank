define(function (require, exports, module) {
	
	var depositHomeTemplate = require("text!../template/depositHome.html");
	
	var depositHomeView = module.exports = ItemView.extend({
		
        template : depositHomeTemplate,
        
        events:{

        },
        
        initialize : function(){
        	//初始化菜单方法
        	var pageStep1 = {
        		title:'结构性存款',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
//        		},
//        		rightButton:{
//        			name : '帮助',
//        			func : 'curView.help()'
        		}
        	};
        	
        	Client.initPageTitle(pageStep1);
        	
        	var $this=this;
        	var depositHome = App.storage.get("depositHome");
        	if(depositHome){
					if(depositHome.length <=0){
						$("#noData").show();
					}else{
						$("#noData").hide();
					}
					for(var i=0;i<depositHome.length;i++){
						var kcoll = depositHome[i];
						$this.addRow(kcoll);
					}
    	    		Client.hideWaitPanel(1);
        	}else{
        		this.depositHomeQuery();
        	}
        	
        },
        depositHomeQuery : function(){
        	var $this=this;
        	var url;
        	if(Utils.checkSession()){
        		url = "/design/productQueryByPageAjaxSession";
        	}else{
        		url = "/design/productQueryByPageAjax";
        	}
        	Ajax({url:url,data:{}, 
    			success:function(data){
    				if(data.errorCode){
    					Utils.alertinfo(data.errorMessage);
    				}else{
    					var depositHome = data.designabilityInfo;
    					if(depositHome.length <=0){
    						$("#noData").show();
    					}else{
    						$("#noData").hide();
    					}
    					for(var i=0;i<depositHome.length;i++){
    						var kcoll = depositHome[i];
    						$this.addRow(kcoll);
    					}
    					App.storage.set("depositHome",depositHome);
    				}
    	    		Client.hideWaitPanel(1);
    			}
        	});
        },
        
    	addRow : function(kcoll){
    		$("#depositHome").append( '<li class="strucBox">'+
	    	          	'<h1>'+kcoll.financeName+'（'+kcoll.financeNo+')</h1>'+
			            '<div class="row">'+
			            	'<div class="cell br">'+
			                	'<h2>年化利率</h2>'+
			                    '<h3 class="fc-orange"><b>'+Utils.toRetentionDigit(kcoll.financePreInterestRate*100,2)+'</b>% -<b>'+Utils.toRetentionDigit(kcoll.interestRate*100,2)+'</b>%</h3>'+
			                '</div>'+
			                '<div class="cell">'+
			                	'<h2>产品期限</h2>'+
			                    '<h3><b>'+kcoll.depositPeriod+'</b> 天</h3>'+
			               ' </div>'+
			            '</div>'+
			            '<ul class="dateList">'+
			            	'<li class="row">'+
			                	'<div class="cell">募集开始：'+kcoll.startDate+'</div>'+
			                    '<div class="cell">募集结束：'+kcoll.endDate+'</div>'+
			                '</li>'+
			                '<li class="row">'+
			                	'<div class="cell">成立日期：'+kcoll.prdbegindate+'</div>'+
			                    '<div class="cell">到期日期：'+kcoll.prdenddate+'</div>'+
			               ' </li>'+
			                '<li class="row" id="LimitLi_'+kcoll.financeNo+'" style="display:none;">'+
		                		'<div class="cell">发行额度：<span class="fc-blue" id="totalAmt_'+kcoll.financeNo+'"></span></div>'+
		                		'<div class="cell">剩余额度：<span class="fc-blue" id="limitAvail_'+kcoll.financeNo+'"></span></div>'+
			                '</li>'+
			            '</ul>'+
			            '<div class="row">'+
			            	'<div class="cell hook">挂钩标的：'+kcoll.subjectName+'</div>'+
			            	'<div class="btngrp">'+
		                    '<a href="javascript:;" class="zen-btn query" id="LimitQuery_'+kcoll.financeNo+'">查看额度</a>'+
		                    '<a href="javascript:;" class="zen-btn" id="buy_'+kcoll.financeNo+'">立即认购</a>'+
		                    '</div>'+
			            '</div> '+   
			        '</li>');
    		var $this = this;
    		$("#LimitQuery_"+kcoll.financeNo).on('click', function() {

        		Client.openWaitPanel("拼命加载中，请稍候");
            	Ajax({url:"/design/productLimitQuery",data:{financeNo:kcoll.financeNo}, 
        			success:function(data){
        				if(data.errorCode){
        					Utils.alertinfo(data.errorMessage);
        				}else{
        					$("#totalAmt_"+kcoll.financeNo).text("￥"+Utils.formatCurrency(data.totalAmt));
        					$("#limitAvail_"+kcoll.financeNo).text("￥"+Utils.formatCurrency(data.limitAvail));
        					$("#LimitLi_"+kcoll.financeNo).show();
        				}
        	    		Client.hideWaitPanel(1);
        			}
            	});
    		});    		
    		$("#buy_"+kcoll.financeNo).on('click', function() {
    			var isLogon = Utils.checkSession();
    			App.storage.set("_parameters",kcoll);
    			if(!isLogon){ 
    				Client.toLogin("curView.designBuy()");
				}else{
					$this.designBuy();
    			}
    		});
    	},
    	
    	designBuy : function(){
   
   			if(!Utils.checkRealUser()){
	        	return;
   			}
			if(!Utils.checkActivate()){
				return;
			}
			 
     		Client.openWaitPanel("拼命加载中，请稍候");
        	Ajax({url:"/design/isSignQuery",data:{}, 
    			success:function(data){
    				if(data.errorCode){
    					Utils.alertinfo(data.errorMessage);
    				}else{
						if(data.signFlag != '1') {
		    	    		Client.hideWaitPanel(1);
		    	    		Client.alertinfo("您未签约结构性存款，请先签约。","提示","curView.gotoDesign()",true);
						}else{												
			   				App.navigate("design/designCtl/depositBuy");
						}
    				}
    			}
        	}); 
    	},
    	
    	gotoDesign : function(){
			App.navigate("design/designCtl/depositSign");
    	},   	
        goBack : function(){
        	App.back();
    	},   	
    	
	});
});