define(function (require, exports, module) {
	
	var ResultTransferTemplate = require("text!../template/resultTransfer.html");
	
	var ResultTransferView = module.exports = ItemView.extend({
		
        template : ResultTransferTemplate,
        
        events:{
        	"click #tapCunCancel":"tapCunCancel",
        	"click #back":"back",
        	"click #look":"look"
        },
        
        initialize : function(){
        	//初始化菜单方法
	       	 var pageStep1 = {
	       		  	title:'成功发布转让',
	       			leftButton:{
	       				name : '返回',
	       				func: 'curView.goBack1()'
	       			},
	       			rightButton:{
	       				name : '',
	       				func : ''
	       			}
	       	  };
        	Client.initPageTitle(pageStep1);
        	$("#cardNo").text(Utils.formatAcc(Utils.getEleCard().cardNo));
    		this.initData();

   		    
        },

        initData : function(){
        	var transferstate = App.storage.get("_parameters").transferstate;
        	if(transferstate=="00"){
        		var financeName = App.storage.get("_parameters").financeName;
            	var transferAMT = Utils.formatCurrency(App.storage.get("_parameters").transferAMT,2);
            	var tranRate = Utils.formatCurrency(App.storage.get("_parameters").tranRate,2);
            	$("#financeName").text(financeName);
            	$("#transferAMT").text(transferAMT);
            	$("#tranRate").text(tranRate);
        	}else{
        		$("#success").hide();
        		$("#fail").show();
        		this.page2();
        	}
        	Client.hideWaitPanel(1);
        },
        
        page2 : function(){
        	 var pageStep2 = {
 	       		  	title:'发布转让失败',
 	       			leftButton:{
 	       				name : '返回',
 	       				func: 'curView.goBack()'
 	       			},
 	       			rightButton:{
 	       				name : '',
 	       				func : ''
 	       			}
 	       	  };
         	Client.initPageTitle(pageStep2);
        },
        
        back : function(){
        	App.back();
        },
        look : function(){
        	var transferFlag ="0";
			var param = {transferFlag:transferFlag};
        	App.navigate("product/productCtl/saleProducts",param);//跳转到转让区
        },
        
        goBack : function(){
        	App.back();
     	},
     	
     	goBack1 : function(){
     		App.navigate("account/mycountCtl/mycount");
     	},
	});
});