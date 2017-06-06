define(function (require, exports, module) {
	
	var fundCostPerformanceTemplate = require("text!../template/fundCostPerformance.html");
	var FundCostPerformanceView = module.exports = ItemView.extend({
		 
		template : fundCostPerformanceTemplate,
	        
        events:{
        	
        },
        initialize : function(){
        	var pageStep1 = {
        		title:'幸福基金',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        
        	};
        	Client.initPageTitle(pageStep1);
        	
        	var iPreFundList=App.storage.get("iPreFundListCostPerformance");
        	if(!iPreFundList){
        		iPreFundList={};
				this.preferredFund();//优选
			}else{
				this.initPreferredFund(iPreFundList);
				Client.hideWaitPanel(1);
			}
        },
        
        preferredFund : function(){//优选
        	Client.openWaitPanel("加载中...");
        	var param = {
    				taCode:"00",
    				fundName:"",
    				fundType:"0",
    				fundSellState:"0",
    				resultSort:"30",
    				turnPageBeginPos:"1",
    				turnPageShowNum:"1000",
    				actionFlag:"06"//首页：01 我要投资：02 单品优选：03 热门基金：04 高收益：05 性价比：06 老基金：07
    		};
			
			var $this=this;
    		Ajax({url:"/fund/fundQuery",data:param,success:function(data){
	    			if(MUI.isEmpty(data.errorCode)){
	    				var icoll = data.iPreFundList;
	    				$("#preferredFund6").empty();
	    				for(var len=0;len<icoll.length;len++){
							var kcoll = icoll[len];
							$this.addRow("preferredFund6",kcoll);
						}
	    				App.storage.set("iPreFundListCostPerformance",icoll);
	    				 Client.hideWaitPanel(1);
	    			}else{
	    				Client.alertinfo(data.errorMessage,"提醒");
	    				Client.hideWaitPanel(1);
	    			}
    		},error:function(){
    			Client.hideWaitPanel(1);
    		}});
    	},
    	
    	initPreferredFund :function(icoll){
    		$("#preferredFund6").empty();
			for(var len=0;len<icoll.length;len++){
				var kcoll = icoll[len];
				this.addRow("preferredFund6",kcoll);
			}
    	},
    	
    	addRow : function(id,kcoll){
    		var fundName=kcoll.fundName;
    		var avgreturnThreeYear=kcoll.avgreturnThreeYear;
    		var sharpratioThreeYear=kcoll.sharpratioThreeYear;//夏普比率 
    		var html ='<tr id="tr_'+kcoll.fundCode+'"><td width="50%">';
            if(fundName==""){
    			html+='<h1>--</h1>';
    		}else if(fundName.length<=10){
    			html+='<h1>'+fundName+'</h1>';
    		}else{
    			html+='<h1>'+fundName.substring(0,10)+'...</h1>';
    		}
			html+='<h2 class="ft13 fc-9">'+kcoll.fundCode+'</h2></td>';
	        if(avgreturnThreeYear==""){
	        	html+='<td width="25%">--</td>';
	        }else if (avgreturnThreeYear.indexOf("-") < 0) {
	        	html+='<td class="fc-orange" width="25%">+'+Utils.toRetentionDigit(avgreturnThreeYear,2)+'%</td>';
	        }else{
	        	html+='<td class="fc-green" width="25%">'+Utils.toRetentionDigit(avgreturnThreeYear,2)+'%</td>';
	        }
	        if(sharpratioThreeYear==""){
	        	html+=' <td>--</td></tr>';
	        }else{
	        	html+=' <td>'+Utils.toRetentionDigit(sharpratioThreeYear,2)+'</td></tr>';
	        }
			
    			
    		$("#"+id).append(html);
    		var $this = this;
    		$("#tr_"+kcoll.fundCode).on('click', function() {
    			$this.gotoDetail(kcoll);
    		});
    		
    	},
    	
    	gotoDetail : function(kcoll){
    		 App.storage.set("iEFundBaseinfo",kcoll);
    		App.navigate("fund/fundCtl/fundDetaill",{iEFundBaseinfo:kcoll});
    	},
        
        goBack : function(){
        	App.back();
    	}
	});
});