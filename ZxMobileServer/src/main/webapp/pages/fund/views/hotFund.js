define(function (require, exports, module) {
	
	var hotFundTemplate = require("text!../template/hotFund.html");
	var HotFundView = module.exports = ItemView.extend({
		 
		template : hotFundTemplate,
	        
        events:{
        	
        },
        initialize : function(){
        	var pageStep1 = {
        		title:'热门基金',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        
        	};
        	Client.initPageTitle(pageStep1);
        	
        	var iPreFundList=App.storage.get("iPreFundListHotFund");
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
    				actionFlag:"04"//首页：01 我要投资：02 单品优选：03 热门基金：04 高收益：05 性价比：06 老基金：07
    		};
			
			var $this=this;
    		Ajax({url:"/fund/fundQuery",data:param,success:function(data){
	    			if(MUI.isEmpty(data.errorCode)){
	    				var icoll = data.iPreFundList;
	    				$("#preferredFund4").empty();
	    				for(var len=0;len<icoll.length;len++){
							var kcoll = icoll[len];
							$this.addRow("preferredFund4",kcoll);
						}
	    				App.storage.set("iPreFundListHotFund",icoll);
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
    		$("#preferredFund4").empty();
			for(var len=0;len<icoll.length;len++){
				var kcoll = icoll[len];
				this.addRow("preferredFund4",kcoll);
			}
    	},
    	
    	addRow : function(id,kcoll){
    		var rateDate =kcoll.rateDate;//关联收益率时间:近1月：01 近3月：03 近6月：06 近1年：12 近3年：36
    		var fundName=kcoll.fundName;
    		var risePer;
    		if(rateDate=="01"){
    				risePer = kcoll.monthRisePer;
    		}else if(rateDate=="03"){
    			risePer = kcoll.threemonthRisePer;
    		}else if(rateDate=="06"){
    			risePer = kcoll.halfyearRisePer;
    		}else if(rateDate=="12"){
    			risePer = kcoll.yearRisePer;
    		}else if(rateDate=="36"){
    			risePer = kcoll.avgreturnThreeYear;
    			if(risePer==""){
    				risePer = this.JsonNvl(risePer, "--");
    			}else{
    				risePer=Utils.toRetentionDigit(risePer,2)+"%";
    			}
    		}else{
    			risePer = "";
    		}
    		var html ='<div class="list fundList" id="div_'+kcoll.fundCode+'">'+
    					'<div class="list-item">'+
							'基金 | '+Utils.nvl(kcoll.fundType,"--");
    		if(kcoll.risklevel =="1"){
    			html+='<i style="height:14px; width:44px; display:inline-block; vertical-align:middle; background:url(./images/fund/lowr.png) no-repeat; background-size:100% 100%; margin:-3px 0 0 5px;"></i>';
    		}else if(kcoll.risklevel =="2"){
				html+='<i style="height:14px; width:44px; display:inline-block; vertical-align:middle; background:url(./images/fund/lowr2.png) no-repeat; background-size:100% 100%; margin:-3px 0 0 5px;"></i>';
			}				
			html+='</div><div class="list-item"><div class="row"><div class="pr15">';
    		
			if(risePer=="" || risePer=="--"){
				html +='<h1 class="fc-green">'+
				'<span class="ft-big">--</span>'+
			'</h1>';
    		}else if(!risePer.indexOf("-")){
    			html +='<h1 class="fc-green">'+
							'<span class="ft-big">'+risePer+'</span>'+
						'</h1>';
    		}else{
    			html +='<h1 class="fc-orange">'+
							'<span class="ft-big">+'+risePer+'</span>'+
						'</h1>';
    		}
    		if(rateDate=="01"){
    			html +='<p class="pt20 fc-9">近一月涨跌幅</p></div>';
    		}else if(rateDate=="03"){
    			html +='<p class="pt20 fc-9">近三月涨跌幅</p></div>';
    		}else if(rateDate=="06"){
    			html +='<p class="pt20 fc-9">近六月涨跌幅</p></div>';
    		}else if(rateDate=="12"){
    			html +='<p class="pt20 fc-9">近一年涨跌幅</p></div>';
    		}else if(rateDate=="36"){
    			html +='<p class="pt20 fc-9">近三年涨跌幅</p></div>';
    		}
    		html +='<div class="cell pl15 bl-e">';
    		if(fundName==""){
    			html+='<h1 class="ft16">--</h1>'+
				'<h2 class="fc-9 ft13 mt5">'+kcoll.fundDescribe+'</h2>';
    		}else if(fundName.length<=10){
    			
    			html+='<h1 class="ft16">'+fundName+'</h1>'+
    			'<h2 class="fc-9 ft13 mt5">'+kcoll.fundDescribe+'</h2>';
    		}else{
    			html+='<h1 class="ft16">'+fundName.substring(0,10)+'...</h1>'+
    			'<h2 class="fc-9 ft13 mt5">'+kcoll.fundDescribe+'</h2>';
    		}
						
    		if(kcoll.fundRemark1!=""){
    			html+='<h2 class="keywords"><span>'+kcoll.fundRemark1+'</span>'; 
    		}
    		if(kcoll.fundRemark2!=""){
    			html+='<span>'+kcoll.fundRemark2+'</span></h2></div></div></div></div>';
    		}
    		$("#"+id).append(html);
    		var $this = this;
    		$("#div_"+kcoll.fundCode).on('click', function() {
    			$this.gotoDetail(kcoll);
    		});
    		
    	},
    	
    	JsonNvl : function(param, val) {
			if (MUI.isEmpty(param)) {
				paramT = val;
			} else {
				paramT = param;
			}
		
			return paramT;
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