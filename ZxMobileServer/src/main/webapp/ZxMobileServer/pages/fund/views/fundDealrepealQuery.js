define(function (require, exports, module) {
	
	var fundDealrepealQueryTemplate = require("text!../template/fundDealrepealQuery.html");
	
	var fundDealrepealQueryView = module.exports = ItemView.extend({
		
        template : fundDealrepealQueryTemplate,
        
        events:{
        },
        
        initialize : function(){
        	
        	//初始化菜单方法
        	var pageStep = {
        		  title:'基金撤单',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        	};
        	
        	Client.initPageTitle(pageStep);

        	this.init();       	
        },
        init : function(){
        	var fundCancelList = App.storage.get("fundCancelList");
        	if(!fundCancelList){
        		this.fundCancelQuery();
        	}else{
				$("#fundCancelList").empty();
				$('#noData').hide();
				if(fundCancelList.length == 0){
					$('#noData').show();
				}else{	
					for(var len=0;len<fundCancelList.length;len++){
						var kcoll = fundCancelList[len];
						this.addRow("fundCancelList",kcoll);
					}
				}
    			Client.hideWaitPanel(1);
        	}
        },
    	
        fundCancelQuery : function(){
        	
    		var cardNo = Utils.getCardNoByFlag("0","cardFlag1");
        	var $this = this;
        	var param={
        		cardNo:cardNo,
        		pageFlag:"0",
        		turnPageBeginPos:0,
        		turnPageShowNum:50
        	};
        	Ajax({url:"/fund/fundCancelQuery",data:param,success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var icoll = data.iFundDealrepealInfo;
					$("#fundCancelList").empty();
					$('#noData').hide();
					if(icoll.length == 0){
						$('#noData').show();
					}else{	
						for(var len=0;len<icoll.length;len++){
							var kcoll = icoll[len];
							$this.addRow("fundCancelList",kcoll);
						}
						 App.storage.set("fundCancelList",icoll);
					}
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
    			Client.hideWaitPanel(1);

        	}});  
        }, 
        
    	addRow : function(id,kcoll){
    		var serialNo = Utils.trim(kcoll.SerialNo);

    		var htmlStr = "";
    		if(kcoll.tradeStatusName == '已撤单'||kcoll.tradeStatusName == '成功'){
    			htmlStr = '<input type="button" value="'+kcoll.tradeStatusName+'" class="zen-btn disabled" />';
    		}else{
    			htmlStr = '<input id="cancel_'+serialNo+'" type="button" value="撤单" class="zen-btn" />';
    		}
    		$("#"+id).append('<li>'+
    			      '<div class="row">'+
    			        '<h1>'+kcoll.fundName+'</h1>'+
    			        '<div class="control">'+
    			          '<div class="cell ft14 fc-9">'+
    			            '<h2>金额：<span class="ft16 fc-orange">'+Utils.formatCurrency(kcoll.fundAmt,2)+'</span> 元</h2>'+
    			            '<h3>交易名称：'+kcoll.transName+'</h3>'+
    			          '</div>'+
    			          '<div class="cell">'+htmlStr+'</div>'+
    			        '</div>'+
    			      '</div>'+
    			      '<div class="row detailIfo">'+
    			        '<h4>'+
    			          '<span>现有份额：<span>'+Utils.formatCurrency(kcoll.fundVol,2)+'份</span></span>'+        
    			          '<span>交易状态：<span class="ft14 fc-blue">'+kcoll.tradeStatusName+'</span></span>'+
    			        '</h4>'+
    			      '</div>'+
    			    '</li>');

    		var $this = this;
    		$("#cancel_"+serialNo).on('click', function(){
    			$this.gotoCancelInfo(kcoll);
    		});
    	}, 
     	
        goBack : function(){
        	App.back();
    	},

    	gotoCancelInfo : function(kcoll){
   			App.navigate("fund/fundCtl/fundDealrepeal",kcoll);
    	}
	});
	
     
 	
});