define(function (require, exports, module) {
	
	var depositCancelQueryTemplate = require("text!../template/depositCancelQuery.html");
	
	var depositCancelQueryView = module.exports = ItemView.extend({
		
        template : depositCancelQueryTemplate,
        
        events:{
        	"click #myDesignList":"myDesignList",
        },
        
        initialize : function(){
        	//初始化菜单方法
        	var pageStep1 = {
        		title:'结构性存款撤单',
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
        	var designCancelList = App.storage.get("designCancelList");
        	if(designCancelList){
					if(designCancelList.length <=0){
						$("#noData").show();
					}else{
						$("#noData").hide();
					}
					for(var i=0;i<designCancelList.length;i++){
						var kcoll = designCancelList[i];
						$this.addRow(kcoll);
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
					}else{
						$("#noData").hide();
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
    		$("#designCancelList").append( '<li class="row">'+
    			       '<div class="cell">'+
    			         '<h1 class="ft13">'+kcoll.financeName+' '+kcoll.financeNo+'</h1>'+
    			         '<div class="row">'+
    			         	 '<div class="cell fc-orange">'+Utils.formatCurrency(kcoll.financeAmt)+'元</div>'+
    			           '<div class="cell ft12 fc-9 txt-r pr10">'+kcoll.transDate+' '+kcoll.transTime+'</div>'+
    			         '</div>'+
    			       '</div>'+
    			       '<div class="do"><a href="javascript:;" class="zen-btn" id="cancel_'+kcoll.serialNo+'">撤单</a></div>'+
    			     '</li>');
    		var $this = this;
    		$("#cancel_"+kcoll.serialNo).on('click', function() {
   				App.navigate("design/designCtl/depositCancel",kcoll);
    		});
    	},  	
        goBack : function(){
        	App.back();
    	},   	
  	  	//我持有的结构性存款
  	    myDesignList : function(){
        	var myDesignList = App.storage.get("myDesignList");
			if(!MUI.isEmpty(myDesignList)){
   				App.navigate("design/designCtl/depositQuery");
				return;
        	}
			Client.openWaitPanel("拼命加载中，请稍候");
        	Ajax({url:"/design/productVolQuery",data:{},success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var icoll = data.designAbilityVolInfo;
					App.storage.set("myDesignList",icoll);
	   				App.navigate("design/designCtl/depositQuery");

    			}else{
    				Utils.alertinfo(data.errorMessage);
    				Client.hideWaitPanel(1);
    			}

        	}});  
  	  	},
	});
});