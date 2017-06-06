define(function (require, exports, module) {
	
	var MyCunTemplate = require("text!../template/myCun.html");
	
	var MyCunView = module.exports = ItemView.extend({
		
        template : MyCunTemplate,
        
        events:{
        	"click #tapCunCancel":"tapCunCancel",
        	"click #tapHistoryDetail":"tapHistoryDetail"
        },
        
        initialize : function(){
        	//初始化菜单方法
	       	 var pageStep1 = {
	       		  	title:'结构性存款持有',
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
        	var myDesignList = App.storage.get("myDesignList");
        	if(myDesignList){
					if(myDesignList.length <=0){
						$("#noData").show();
						$("#currentHave").hide();
					}else{
						$("#noData").hide();
						$("#currentHave").show();
					}
					for(var i=0;i<myDesignList.length;i++){
						var kcoll = myDesignList[i];
						this.addRow(kcoll);
					}
    	    		Client.hideWaitPanel(1);
        	}else{
        		this.depositQuery();
        	}
        },
        depositQuery : function(){
        	var $this=this;
			Client.openWaitPanel("拼命加载中，请稍候");
        	Ajax({url:"/design/productVolQuery",data:{},success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var icoll = data.designAbilityVolInfo;
					if(icoll.length <=0){
						$("#noData").show();
						$("#currentHave").hide();
					}else{
						$("#noData").hide();
						$("#currentHave").show();
					}
					for(var i=0;i<icoll.length;i++){
						var kcoll = icoll[i];
						$this.addRow(kcoll);
					}
					App.storage.set("myDesignList",icoll);
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
    			Client.hideWaitPanel(1);

        	}});
        },
        addRow : function(kcoll){
    		$("#currentHave").append( '<li class="row">'+
    			      '<div class="cell">'+
    			        '<h1>'+kcoll.financeName+'</h1>'+
    			        '<h1>'+kcoll.financeNo+'</h1>'+
    			        '<h2 class="fc-9 ft12">'+kcoll.prdbegindate+'~'+kcoll.prdenddate+'</h2>'+
    			       '</div>'+
    			        '<div>'+
    			        	 '<h1 class="ft12">'+Utils.formatCurrency(kcoll.financeAmt)+'元</h1>'+
    			        '</div>'+
    			    '</li>');
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