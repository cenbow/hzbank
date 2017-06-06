define(function (require, exports, module) {
	
	var fundBalQueryTemplate = require("text!../template/fundBalQuery.html");
	
	var fundBalQueryView = module.exports = ItemView.extend({
		
        template : fundBalQueryTemplate,
        
        events:{
        },
        
        initialize : function(){
        	
        	//初始化菜单方法
        	var pageStep = {
        		  title:'我的基金',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        	};
        	
        	Client.initPageTitle(pageStep);

        	this.init();       	
        },
        init : function(){
        	var myFundList = App.storage.get("myFundList");
        	if(!myFundList){
        		this.fundBalQuery();
        	}else{
				$("#myFundList").empty();
				$('#noData').hide();
        		if(myFundList.length == 0){
					$('#noData').show();
				}else{	
					for(var len=0;len<myFundList.length;len++){
						var kcoll = myFundList[len];
						this.addRow("myFundList",kcoll);
					}
				}
    			Client.hideWaitPanel(1);
        	}
        },
    	
        fundBalQuery : function(){
        	
    		var cardNo = Utils.getCardNoByFlag("0","cardFlag1");
        	var $this = this;
        	var param={
        		cardNo:cardNo,
        		pageFlag:"0",
        		fundVolTotal:0,
        		turnPageBeginPos:0,
        		turnPageShowNum:50
        	};
        	Ajax({url:"/fund/fundBalQuery",data:param,success:function(data){
        		$("#myFundList").empty();
        		$('#noData').hide();
    			if(MUI.isEmpty(data.errorCode)){
					var icoll = data.iFundBalinfo;
					if(icoll.length == 0){
						$('#noData').show();
					}else{						
						for(var len=0;len<icoll.length;len++){
							var kcoll = icoll[len];
							$this.addRow("myFundList",kcoll);
						}
						App.storage.set("myFundList",icoll);
					}

    			}else{
    				if(data.errorCode=="1114"){
						$('#noData').show();
    				}else{
        				Utils.alertinfo(data.errorMessage);
    				}
    			}
    			Client.hideWaitPanel(1);

        	}});  
        }, 
        
    	addRow : function(id,kcoll){
    		var fundCode = Utils.trim(kcoll.fundCode);
       		var profitSumClass = 'ft16';
            if(kcoll.profit > 0){
            	profitSumClass = 'ft16 fc-orange';
            }else if(kcoll.profit < 0){
            	profitSumClass = 'ft16 fc-green';
            } 
       		var totIncomeClass = 'ft16';
            if(kcoll.totIncome > 0){
            	totIncomeClass = 'ft16 fc-orange';
            }else if(kcoll.totIncome < 0){
            	totIncomeClass = 'ft16 fc-green';
            } 
            var fundVol=Utils.nvl(kcoll.fundVol,"0");
            var fundUseVol=Utils.nvl(kcoll.fundUseVol,"0");
            var htmlstr="";
        	if(parseFloat(fundVol)>0&&parseFloat(fundUseVol)>0){//认购份额>可用份额
        		htmlstr = '<input id="redeemInfo_'+fundCode+'" type="button" value="赎回" class="zen-btn" />';
        	}else{
        		htmlstr = '<input type="button" value="已赎回" class="zen-btn disabled" />';
        	}
    		$("#"+id).append('<li>'+
    			      '<div class="row">'+
    			        '<h1>'+kcoll.fundName+'</h1>'+
    			        '<div class="control">'+
    			          '<div class="cell">'+
    			            '<h2 class="'+profitSumClass+'">'+Utils.formatCurrency(kcoll.profit,2)+'</h2>'+
    			            '<h3 class="ft12 fc-9">浮动盈亏</h3>'+
    			          '</div>'+
    			          '<div class="cell ml10">'+
    			            '<h2 class="'+totIncomeClass+'">'+Utils.formatCurrency(kcoll.totIncome,2)+'</h2>'+
    			            '<h3 class="ft12 fc-9">累计收入</h3>'+
    			          '</div>'+
    			          '<div class="cell">'+htmlstr+'</div>'+
    			        '</div>'+
    			      '</div>'+
    			      '<div class="row detailIfo">'+
    			        '<h4>'+
    			          '<span>产品代码：'+kcoll.fundCode+'</span>'+          
    			          '<span>当前市值：'+kcoll.fundNav+' 元</span>'+
    			        '</h4>'+
    			        '<h4>'+
    			          '<span>现有份额：'+kcoll.fundVol+' 份</span>'+ 	     
    			          '<span>可用份额：'+kcoll.fundUseVol+' 份</span>'+ 
    			        '</h4>'+	
    			        '<h4>'+
    			          '<span>购买成本：'+kcoll.fundCost+' 元</span>'+         
    			         /* '<span>交易日期：'+kcoll.fundName+'</span>'+ */
    			        '</h4>'+
    			      '</div>'+
    			    '</li>');

    		var $this = this;
    		$("#redeemInfo_"+fundCode).on('click', function(){
    			$this.gotoRedeemInfo(kcoll);
    		});
    	}, 
     	
        goBack : function(url){
    		App.navigate("account/mycountCtl/holdingAsset");
    	},

    	gotoRedeemInfo : function(kcoll){
   			App.navigate("fund/fundCtl/fundRedeem",kcoll);
    	}
	});
	
     
 	
});