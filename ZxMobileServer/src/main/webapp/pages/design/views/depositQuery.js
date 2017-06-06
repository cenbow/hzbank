define(function (require, exports, module) {
	
	var depositQueryTemplate = require("text!../template/depositQuery.html");
	
	var depositQueryView = module.exports = ItemView.extend({
		
        template : depositQueryTemplate,
        
        events:{
        	"click #designCancel":"designCancel",
        },
        
        initialize : function(){
        	//初始化菜单方法
        	var pageStep1 = {
        		title:'结构性存款持有',
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
        	var myDesignList = App.storage.get("myDesignList");
        	if(myDesignList){
					if(myDesignList.length <=0){
						$("#noData").show();
					}else{
						$("#noData").hide();
					}
					for(var i=0;i<myDesignList.length;i++){
						var kcoll = myDesignList[i];
						$this.addRow(kcoll);
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
					}else{
						$("#noData").hide();
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
    		$("#myDepositList").append( '<li class="row">'+
    			      '<div class="cell">'+
    			        '<h1 class="ft13">'+kcoll.financeName+' '+kcoll.financeNo+'</h1>'+
    			        '<div class="row">'+
    			        	 '<div class="cell fc-orange">'+Utils.formatCurrency(kcoll.financeAmt)+'元</div>'+
    			          '<div class="cell ft12 fc-9 txt-r pr10">'+kcoll.prdbegindate+'~'+kcoll.prdenddate+'</div>'+
    			        '</div>'+
    			      '</div>'+
    			    '</li>');
    	},  	
        goBack : function(){
        	App.back();
    	}, 
  	  	//结构性存款撤单查询
  	    designCancel : function(){
        	var designCancelList = App.storage.get("designCancelList");
			if(!MUI.isEmpty(designCancelList)){
   				App.navigate("design/designCtl/depositCancelQuery");
				return;
        	}
			Client.openWaitPanel("拼命加载中，请稍候");
        	Ajax({url:"/design/productRepealQuery",data:{},success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var icoll = data.designabilityRepealInfo;
					App.storage.set("designCancelList",icoll);
	   				App.navigate("design/designCtl/depositCancelQuery");

    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}

        	}});  
  	  	},
    	
	});
});