define(function (require, exports, module) {
	
	
	var fundIndexTemplate = require("text!../template/fundIndex.html");
	
	var FundIndexView = module.exports = ItemView.extend({
		
		template : fundIndexTemplate,
		
		events:{
			"click #fundRank" : "fundRank",
			"click #fundOptional" : "fundOptional",
			"click #myFund" : "myFund",
			"click #hotFund" : "hotFund",
			"click #oldFund" : "oldFund",
			"click #fundHighYield" : "fundHighYield",
			"click #fundCostPerformance" : "fundCostPerformance",
		},
		
		initialize : function(){
			this.errorCode="";
			var pageStep1 = {
        		title:'幸福基金',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		},
        		rightButton:{
					name : pubParam.clientVersion>'3.0.7'?'fundSearch':'',
//        			name :'fundSearch',
					func : ''
				}
        	
        	};

        	Client.initPageTitle(pageStep1);
        	Client.hideWaitPanel(1);
        	Client.menuOpt("0");
        	this.showAd();//广告
        	
        	var iPreFundList=App.storage.get("iPreFundListIndex");
        	if(!iPreFundList){
        		iPreFundList={};
				this.preferredFund();//优选
				 Client.hideWaitPanel(1);
			}else{
				this.initPreferredFund(iPreFundList);
			}
        	
        	this.fundNews();
        },
        
		fundRank: function(){
			if (Utils.checkSession()) {
				if(Utils.checkRealUser()){
					if(!Utils.checkActivate()){
						return;
					}
					App.navigate("fund/fundCtl/fundRankNew");
				}
			} else {
				App.navigate("fund/fundCtl/fundRank");
			}
			
		},
		
		fundOptional: function(){
			if (Utils.checkSession()) {
				if(Utils.checkRealUser()){
					if(!Utils.checkActivate()){
						return;
					}
					App.navigate("fund/fundCtl/fundOptional");
				}
			} else {
				Client.toLogin("curView.fundOptional()");
			}
		},
		
		myFund: function(){
			if (Utils.checkSession()) {
				var cardNo =Utils.trim(Utils.getCardNoByFlag("0","cardFlag1"));
				if(!Utils.checkRealUser()){
					return;
				}
				
				if(!Utils.checkActivate()){
					return;
				}
				
		    	if (MUI.isEmpty(cardNo)) {
		    		Utils.alertinfo("您还未购买基金产品,快去选购吧!","提示");
	    			return;
				}
				this.fundBalQuery(cardNo);
			} else {
				Client.toLogin("curView.myFund()");
			}
		},
		
		hotFund: function(){//热门基金
			App.navigate("fund/fundCtl/hotFund");
		},
		
		oldFund :function(){//老基金
			App.navigate("fund/fundCtl/oldFund");
		},
		
		fundHighYield :function(){//高收益
			App.navigate("fund/fundCtl/fundHighYield");
		},
		
		fundCostPerformance :function(){//性价比
			App.navigate("fund/fundCtl/fundCostPerformance");
		},
		
		goBack : function(){
//        	App.back();
			App.navigate("product/productCtl/wantInv");
    	},
    	
    	fundNews :function(){//新闻资讯
    		var param = {
    				turnPageBeginPos:"1",
    				turnPageShowNum:"100",
    		};
			
			var $this=this;
    		Ajax({url:"/fund/fundNewsQuery",data:param,success:function(data){
	    			if(MUI.isEmpty(data.errorCode)){
	    				var icoll = data.fundNews;
	    				for(var len=0;len<icoll.length;len++){
							var kcoll = icoll[len];
							$this.addRow1("fundNews",kcoll);
						}
	    				Client.hideWaitPanel(1);
	    			}else{
	    				Client.alertinfo(data.errorMessage,"提醒");
	    				Client.hideWaitPanel(1);
	    			}
    		},error:function(){
    			Client.hideWaitPanel(1);
    		}});
    	},
    	
    	addRow1 : function(id,kcoll){
    		var html=
    			'<div class="list-item" id="div_'+kcoll.order+'">'+
				'<h1 class="ft16">'+kcoll.mainHead+'</h1>'+
				'<p class="pt10 fc-9">'+kcoll.head+'</p></div>';
    		$("#"+id).append(html);
    		var $this = this;
			$("#div_"+kcoll.order).on('click', function() {
				$this.fundNewsDetail(kcoll);
			});
    	},
    	
    	fundNewsDetail : function(kcoll){
	   		 App.storage.set("fundNews",kcoll);
	   		App.navigate("fund/fundCtl/fundNewsDetail",kcoll);
    	},
    	
    	preferredFund : function(){//优选
			var param = {
    				taCode:"00",
    				fundName:"",
    				fundType:"0",
    				fundSellState:"0",
    				resultSort:"30",
    				turnPageBeginPos:"1",
    				turnPageShowNum:"1000",
    				actionFlag:"03"//首页：01 我要投资：02 单品优选：03 热门基金：04 高收益：05 性价比：06 老基金：07
    		};
			
			var $this=this;
    		Ajax({url:"/fund/fundQuery",data:param,success:function(data){
	    			if(MUI.isEmpty(data.errorCode)){
	    				var icoll = data.iPreFundList;
	    				$("#preferredFund3").empty();
	    				for(var len=0;len<icoll.length;len++){
							var kcoll = icoll[len];
							$this.addRow("preferredFund3",kcoll);
						}
	    				
	    				App.storage.set("iPreFundListIndex",icoll);
	    			}else{
	    				Client.alertinfo(data.errorMessage,"提醒");
	    			}
    		},error:function(){
    			Client.hideWaitPanel(1);
    		}});
    	},
    	
    	initPreferredFund :function(icoll){
    		$("#preferredFund3").empty();
			for(var len=0;len<icoll.length;len++){
				var kcoll = icoll[len];
				this.addRow("preferredFund3",kcoll);
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
    					'<div class="list-item ">基金 | '+Utils.nvl(kcoll.fundType,"--");
    		if(kcoll.risklevel =="1"){
    			html+='<i style="height:14px; width:44px; display:inline-block; vertical-align:middle; background:url(./images/fund/lowr.png) no-repeat; background-size:100% 100%; margin:-3px 0 0 5px;"></i>';
    		}else if(kcoll.risklevel =="2"){
				html+='<i style="height:14px; width:44px; display:inline-block; vertical-align:middle; background:url(./images/fund/lowr2.png) no-repeat; background-size:100% 100%; margin:-3px 0 0 5px;"></i>';
			}			
			html+='</div><div class="list-item"><div class="row"><div class="pr15">';
			if(risePer=="" || risePer=="--"){
				html +='<h1 class="fc-green" style="width:104px;">'+
				'<span class="ft-big">--</span>'+
			'</h1>';
    		}else if(!risePer.indexOf("-")){
    			html +='<h1 class="fc-green" style="width:104px;">'+
							'<span class="ft-big">'+risePer+'</span>'+
						'</h1>';
    		}else{
    			html +='<h1 class="fc-orange" style="width:104px;">'+
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
    	
    	showAd : function() {
			if(pubParam.clientHeight <= 0){
				setTimeout(function(){
					$this.showAd(adList);
				},100);
				return;
			}
			var html = '<li class="img" data-value="fund/fundCtl/fundDirect"><img src="images/fund/banner_01.png"></li>'+
					'<li class="img" data-value=""><img src="images/fund/banner_02.png"></li>';
			$("#bannerslideIndex ul").html(html);

			$('#bannerslideIndex').swipeBanner({
				ratio: 960/445,
				delay: 3000,
				autoPlay: true,
				callback: function(i){
					console.log(i);
				},
				stopFn: function(){
					if(	Device.os == 'android'){
						Client.dragRefresh({
							type:"2"
						});
					}
				},
				allowFn: function(){
					if(	Device.os == 'android'){
						Client.dragRefresh({
							callback:"curView.refresh()",
							type:"0"
						});
					}
				}
			});
			
			$("#bannerslideIndex .img").off().on("click",function(){
				var href = $(this).attr("data-value");
				if(href){
					App.navigate(href);
				}
			});
		},
		
		fundBalQuery: function(cardNo){//我的基金（客户基金份额）查询
			Client.openWaitPanel("加载中...");
			var param1 = {
	 				cardNo:cardNo,
	 				turnPageBeginPos:"1",
	 				turnPageShowNum:"10",
	 				pageFlag:"0"//翻页时动态
	 		};
	 		Ajax({url:"/fund/fundBalQuery",data:param1, success:function(data){//查询
	 			if(MUI.isEmpty(data.errorCode)){
	 				var icoll = data.iFundBalinfo;
					App.storage.set("iFundBalinfoList",icoll);
					App.navigate("fund/fundCtl/myFund");
//			        Client.hideWaitPanel(1);
	 			}else if (data.errorCode == '1114'){
	 				Client.hideWaitPanel(1);
	 				Utils.alertinfo("您还未购买基金产品,快去选购吧!","提示");
	 				return;
	 			}else{
	 				Client.alertinfo(data.errorMessage,"提醒");
	 				Client.hideWaitPanel(1);
	 			}
	 		},error:function(){
    			Client.hideWaitPanel(1);
    		}});
		},
	});
});