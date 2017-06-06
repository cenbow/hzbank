define(function (require, exports, module) {
	
	var fundRateTemplate = require("text!../template/fundRate.html");
	
	var FundRateView = module.exports = ItemView.extend({
		
        template : fundRateTemplate,
        
        events:{
        },
        
        initialize : function(){

        	var pageStep1 = {
        		title:"费率折扣",
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        		
        	};

        	Client.initPageTitle(pageStep1);
        	this.init();
        },
        
        
        init : function(){
        	this.transNameTem="";
        	this.tableId="";
        	var iFundFeeInfo = App.storage.get("iFundFeeInfo");
        	if(!iFundFeeInfo){
            	this.queryFundRate();
        	}else{
				$("#fundRateList").empty();
				for(var len=0;len<iFundFeeInfo.length;len++){
					var kcoll = iFundFeeInfo[len];
					this.addRow("fundRateList",kcoll,len);
				}
    			Client.hideWaitPanel(1);
        	}
        },

        goBack : function(){
        	App.back();
    	},
    	queryFundRate : function(param){
    		var param = {
    				fundCode:this.model.get("fundCode"),
    				turnPageBeginPos:1,
    				turnPageShowNum:10
    		};
    		var $this = this;
    		Ajax({url:"/fund/fundFeeQuery",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
					var icoll = data.iFundFeeInfo;
					$("#fundRateList").empty();
					for(var len=0;len<icoll.length;len++){
						var kcoll = icoll[len];
						$this.addRow("fundRateList",kcoll,len);
					}
    			}else{
    				Client.alertinfo(data.errorMessage,"提醒");
    			}
    			Client.hideWaitPanel(1);
    		}});
    	},
    	addRow : function(id,kcoll,len){
    		   
    		var transName	= Utils.nvl(kcoll.transName,"");	
    		var fundRate	= Utils.nvl(kcoll.fundRate,"");  		
    		var MinAmt =Utils.nvl(kcoll.MinAmt,"");	
    		var MaxAmt =Utils.nvl(kcoll.MaxAmt,"");	
    		var maxFee =Utils.nvl(kcoll.maxFee,"");	
    		var subUnit =Utils.nvl(kcoll.subUnit,"");
    		
    		var fundFeeText="";
    		if(parseFloat(fundRate) != 0){
    			fundFeeText = Utils.formatCurrency(parseFloat(fundRate)*100)+"%";
    		}else if(parseFloat(maxFee)!=0){
    			fundFeeText = Utils.toRetentionDigit(Utils.trim(maxFee),0)+"元/笔";
    		}else{
    			fundFeeText = "0.00%";
    		}

    		var type="";
    		if(Utils.trim(subUnit)=='0'){
    			subUnit='年';
    			type = "1";
    		}else if(Utils.trim(subUnit)=='1'){
    		 	subUnit='月';
    			type = "1";
    		}else if(Utils.trim(subUnit)=='2'){
    		 	subUnit='万';
    			type = "2";
    		}else{
    		    subUnit='日';
    			type = "1";
    		}
    		var compositeText = "";
    		if(type == "2"){
    		    MinAmt=	Utils.toRetentionDigit(Utils.trim(MinAmt),0)/10000;
    		    MaxAmt=	Utils.toRetentionDigit(Utils.trim(MaxAmt),0)/10000;
    		    if(parseFloat(MinAmt) == 0){
    		    	compositeText = "购买金额 &lt; "+MaxAmt+"万";
    		    }else if(parseFloat(MaxAmt) > 9999){
    		    	compositeText = "购买金额 ≥ "+MinAmt+"万";
    		    }else{
    		    	compositeText = MinAmt+"万 ≤ 购买金额 &lt; "+MaxAmt+"万";
    		    }
    		}else{
    		    MinAmt=	Utils.toRetentionDigit(Utils.trim(MinAmt),0);
    		    MaxAmt=	Utils.toRetentionDigit(Utils.trim(MaxAmt),0);
    		    if(parseFloat(MinAmt) == 0){
    		    	compositeText = "持有时间 &lt; "+MaxAmt+subUnit;
    		    }else if(parseFloat(MaxAmt) > 50){
    		    	compositeText = "持有时间 ≥ "+MinAmt+subUnit;
    		    }else{
    		    	compositeText = MinAmt+subUnit+" ≤ 持有时间 &lt; "+MaxAmt+subUnit;
    		    }
    		}; 
    	    
    	    
    	    if(transName !=this.transNameTem){
    	    	$("#"+id).append('<div class="tbl mb10">'+
    	    		    '<h1>'+transName+'</h1>'+
    	    		    '<table width="100%" border="0" id="table_'+len+'">'+
    	    		    '</table>'+
    	    		  '</div>');
    	    	this.transNameTem = transName;
            	this.tableId=len;
    	    };
    	    
	    	$("#table_"+this.tableId).append('<tr>'+
	    	        '<td>'+compositeText+'</td>'+
	    	        '<td>'+fundFeeText+'</td>'+
	    	      '</tr>'); 	
    	    

    	},
	});
	
});