define(function (require, exports, module) {
	
	var MyCunHistoryTemplate = require("text!../template/myCunHistory.html");
	
	var MyCunHistoryView = module.exports = ItemView.extend({
		
        template : MyCunHistoryTemplate,
        
        events:{
        	"click #tapCurrentHave":"tapCurrentHave",
        	"click #tapCunCancel":"tapCunCancel"
        },
        
        initialize : function(){
        	//初始化菜单方法
	       	 var pageStep1 = {
	       		  	title:'结构性存款历史查询',
	       			leftButton:{
	       				name : '返回',
	       				func: 'curView.goBack()'
	       			},
	       			rightButton:{
	       				name : '帮助',
	       				func : 'curView.help()'
	       			}
	       	  };
        	Client.initPageTitle(pageStep1);
        	var setHeight = pubParam.clientHeight - 220; //需要占满屏幕高度所需高度
    		document.querySelector('#noData').style.height = setHeight+ 'px';
        	this.initData();

   		    
        },

        initData : function(){
        	var designHistoryList = App.storage.get("designHistoryList");
        	if(designHistoryList){
					if(designHistoryList.length <=0){
						$("#noData").show();
						$("#historyDetail").hide();
					}else{
						$("#noData").hide();
						$("#historyDetail").show();
					}
					for(var i=0;i<designHistoryList.length;i++){
						var kcoll = designHistoryList[i];
						this.addRow(kcoll);
					}
    	    		Client.hideWaitPanel(1);
        	}else{
        		this.depositHistoryQuery();
        	}
        },
        depositHistoryQuery : function(){
          	var $this=this;
			Client.openWaitPanel("拼命加载中，请稍候");
			var param ={
					startDate : Utils.getDifferentMonth(-12,"yyyyMMdd"),
					endDate : Utils.getServerDate("yyyyMMdd")
			};
        	Ajax({url:"/design/productHisDealQueryAjax",data:param,success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var icoll = data.designabilityDealInfo;
					if(icoll.length <=0){
						$("#noData").show();
						$("#historyDetail").hide();
					}else{
						$("#noData").hide();
						$("#historyDetail").show();
					}
					for(var i=0;i<icoll.length;i++){
						var kcoll = icoll[i];
						$this.addRow(kcoll);
					}
					App.storage.set("designHistoryList",icoll);
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
    			Client.hideWaitPanel(1);

        	}});
        },
        
    	addRow : function(kcoll){
    		var state = kcoll.state;
			var stateVal = "";
			if(state=="00"){
				stateVal = "撤单";
			}else if(state=="01"){
				stateVal = "产品到期";
			}else if(state=="02"){
				stateVal = "预受理";
			}else if(state=="03"){
				stateVal = "已受理";
			}else if(state=="04"){
				stateVal = "认购失败";
			}else{
				stateVal = "--";
			}
    		$("#historyDetail").append( '<li class="strucBox">'+
    	          	'<h1>'+kcoll.financeName+'（'+kcoll.financeNo+')</h1>'+
		            '<div class="row">'+
		            	'<div class="cell br">'+
		                	'<h2>年化利率</h2>'+
		                    '<h3 class="fc-orange"><b>'+Utils.toRetentionDigit(kcoll.financePreInterestRate*100,2)+'</b>%</h3>'+
		                '</div>'+
		                '<div class="cell">'+
		                	'<h2>产品期限</h2>'+
		                    '<h3><b>'+kcoll.debtPeriod+'</b> 天</h3>'+
		               ' </div>'+
		            '</div>'+
		            '<ul class="dateList">'+
		                '<li class="row">'+
		                	'<div class="cell">成立日期：'+kcoll.prdbegindate+'</div>'+
		                    '<div class="cell">到期日期：'+kcoll.prdenddate+'</div>'+
		               ' </li>'+
		                '<li class="row">'+
	                		'<div class="cell">认购金额：<span class="fc-blue">￥'+Utils.formatCurrency(kcoll.financeAmt)+' 元</span></div>'+
		                '</li>'+
		            '</ul>'+
		            '<div class="row">'+
	                	'<div class="cell ">时间：<span class="fc-orange">'+kcoll.transDate+' '+kcoll.transTime+'</span></div>'+
	                    '<div class="cell txt-r"><span class="fc-orange">'+stateVal+'</span></div>'+
	                '</div> '+   
		        '</li>');
    	},  	
     	//我持有的结构性存款
    	tapCurrentHave : function(){
        	var myDesignList = App.storage.get("myDesignList");
			if(!MUI.isEmpty(myDesignList)){
   				App.navigate("account/mycountCtl/myCun");
				return;
        	}
			Client.openWaitPanel("拼命加载中，请稍候");
        	Ajax({url:"/design/productVolQuery",data:{},success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var icoll = data.designAbilityVolInfo;
					App.storage.set("myDesignList",icoll);
	   				App.navigate("account/mycountCtl/myCun");

    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}

        	}});  
  	  	},
  	//结构性存款撤单查询
    	tapCunCancel : function(){
        	var designCancelList = App.storage.get("designCancelList");
			if(!MUI.isEmpty(designCancelList)){
   				App.navigate("account/mycountCtl/myCunCancel");
				return;
        	}
			Client.openWaitPanel("拼命加载中，请稍候");
        	Ajax({url:"/design/productRepealQuery",data:{},success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var icoll = data.designabilityRepealInfo;
					App.storage.set("designCancelList",icoll);
	   				App.navigate("account/mycountCtl/myCunCancel");

    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}

        	}});  
  	  	},
        goBack : function(){
        	App.navigate("account/mycountCtl/mycount");
     	  },
     	  
		help : function(){
			  App.navigate("anymore/anymoreCtl/messageCenter");
		}
	
	});
});