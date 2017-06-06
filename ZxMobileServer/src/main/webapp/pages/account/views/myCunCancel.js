define(function (require, exports, module) {
	
	var MyCunCancelTemplate = require("text!../template/myCunCancel.html");
	
	var MyCunCancelView = module.exports = ItemView.extend({
		
        template : MyCunCancelTemplate,
        
        events:{
        	"click #tapCurrentHave":"tapCurrentHave",
        	"click #tapHistoryDetail":"tapHistoryDetail"
        },
        
        initialize : function(){
        	//初始化菜单方法
	       	 var pageStep1 = {
	       		  	title:'结构性存款撤单',
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
        	var designCancelList = App.storage.get("designCancelList");
        	if(designCancelList){
					if(designCancelList.length <=0){
						$("#noData").show();
						$("#currentHaveCancel").hide();
					}else{
						$("#noData").hide();
						$("#currentHaveCancel").show();
					}
					for(var i=0;i<designCancelList.length;i++){
						var kcoll = designCancelList[i];
						this.addRow(kcoll);
					}
    	    		Client.hideWaitPanel(1);
        	}else{
        		this.depositCancelQuery();
        	}
        },
        depositCancelQuery : function(){
        	var $this=this;
			Client.openWaitPanel("拼命加载中，请稍候");
        	Ajax({url:"/design/productRepealQuery",data:{},success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var icoll = data.designabilityRepealInfo;
					if(icoll.length <=0){
						$("#noData").show();
						$("#currentHaveCancel").hide();
					}else{
						$("#noData").hide();
						$("#currentHaveCancel").show();
					}
					for(var i=0;i<icoll.length;i++){
						var kcoll = icoll[i];
						$this.addRow(kcoll);
					}
					App.storage.set("designCancelList",icoll);
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
    			Client.hideWaitPanel(1);

        	}});
        },
        
    	addRow : function(kcoll){
    		$("#currentHaveCancel").append(
    				'<li class="row">'+
    			       '<div class="cell">'+
    			         '<h1>'+kcoll.financeName+' '+kcoll.financeNo+'</h1>'+
    			         '<h2 class="fc-9 ft12">'+kcoll.transDate+' '+kcoll.transTime+'</h2>'+
    			        '</div>'+
    			        '<div>'+
    			         	 '<h1 class="ft12">'+Utils.formatCurrency(kcoll.financeAmt)+'元</h1>'+
    			         	'<div class="do"><a href="javascript:;" class="fr" id="cancel_'+kcoll.serialNo+'">撤单</a></div>'+
    			       '</div>'+
    			     '</li>');
    		var $this = this;
    		$("#cancel_"+kcoll.serialNo).on('click', function() {
   				App.navigate("design/designCtl/depositCancel",kcoll);
    		});
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
  	//结构性存款历史查询
  	  	tapHistoryDetail : function(){
	  	  	var designHistoryList = App.storage.get("designHistoryList");
			if(!MUI.isEmpty(designHistoryList)){
					App.navigate("account/mycountCtl/myCunHistory");
				return;
	    	}
			Client.openWaitPanel("拼命加载中，请稍候");
			var param ={
					startDate : Utils.getDifferentMonth(-12,"yyyyMMdd"),
					endDate : Utils.getServerDate("yyyyMMdd")
			};
	    	Ajax({url:"/design/productHisDealQueryAjax",data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var icoll = data.designabilityDealInfo;
					App.storage.set("designHistoryList",icoll);
	   				App.navigate("account/mycountCtl/myCunHistory");
	
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