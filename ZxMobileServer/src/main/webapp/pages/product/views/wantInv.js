define(function (require, exports, module) {
	
	var addIsDone = false;
	var rateIsDone = false;
	var boseIsDone = false;
	var saleIsDone = false;
	var goldDone = false;
	var fundIsDone = false;
	var paramAdPicAddress = {};//图片地址session传参
	var paramRate = {};
    var modelData = {};
    
    var iPreFundList={};
	var WantInvTemplate = require("text!../template/wantInv.html");
	
	var WantInvView = module.exports = ItemView.extend({
	  
		template : WantInvTemplate,
		
		events: {
			"click #deposit" : "goToDepositPage",
			"click #fund" : "goToFundPage",
			"click #design" : "goToDesign",
			"click #boseFund" : "boseFund",
			"click #gold":"gold",
			"click #saleProducts" : "queryProducts",
			"click #fund" : "goToFundIndex",
		},
		
		initialize : function(){
			modelData = {};
			addIsDone = false;
			rateIsDone = false;
			boseIsDone = false;
			saleIsDone = false;		
			goldDone = false;
			fundIsDone = false;
			MUI.createCarousel({
				  elementName : '#bannerslideIndexw',
				  aspectRatio : 28/64
			});
			
			iPreFundList=App.storage.get("iPreFundList");
			if(!iPreFundList){
	    		iPreFundList={};
				this.preferredFund();//优选
			}else{
				this.initPreferredFund(iPreFundList);
				fundIsDone = true;
				this.qryHideWait();
			}
			
			paramAdPicAddress = App.storage.get("paramAdPicAddress");
			if(!paramAdPicAddress){
				paramAdPicAddress = {};
				this.queryAdPicAddress();
			}else{
				var icoll = paramAdPicAddress.adList;
				modelData.icoll=icoll;
				addIsDone = true;
				this.qryHideWait();
			}
			
			paramRate = App.storage.get("paramRate");
			if(!paramRate){
				paramRate = {};
				this.queryRate();
			}else{
				modelData.oneYearRate=paramRate.oneYearRate;
				modelData.fiveYearRate=paramRate.fiveYearRate;
				rateIsDone = true;
				this.qryHideWait();
			}
			
			var boseRate = App.storage.get("boseRate");
			if (boseRate) {
				modelData.boseSevRate = boseRate.boseSevRate;
				modelData.boseTsRate = boseRate.boseTsRate;
				boseIsDone = true;
				this.qryHideWait();
			} else {
				this.initBose();
			}
			
			var boseGold = App.storage.get("boseGold");
			if (boseGold) {
				modelData.goldSevRate = Utils.formatCurrency(boseGold.nearestYearYield*100,2);
				goldDone = true;
				this.qryHideWait();
			} else {
				this.initGold();
			}
			
			var saleMaxRate = App.storage.get("saleMaxRate");
			if (saleMaxRate) {
				modelData.financePreInterestRate = Utils.formatCurrency(saleMaxRate.financePreInterestRate,2);
				saleIsDone = true;
				this.qryHideWait();
			} else {
				this.initSale();
			}
			
		
			//this.queryProducts();
			
		},
		
		initBose : function() {
			var $this = this;
			var param = {
				productId : Utils.getParamDisplay("PB_BOSERA",'1')
			};
			Ajax({
				url : "/bosera/boseraProductSynchro",
				data : param,
				success : function(data) {
					if (data.errorCode) {
						App.storage.set("boseRate", false);
					} else {
						var iBoseraProduct = data.iBoseraProduct;
						var boseSevRate = "0.000";
						var boseTsRate = "0.000";
						if(iBoseraProduct.length>0){
							boseSevRate = Utils.formatCurrency(iBoseraProduct[0].trans_amt2,3);
							boseTsRate = Utils.formatCurrency(iBoseraProduct[0].trans_amt3,3);
						}
						modelData.boseSevRate = boseSevRate;
						modelData.boseTsRate = boseTsRate;
						App.storage.set("boseRate", {
							boseSevRate : boseSevRate,
							boseTsRate : boseTsRate
						});
					}
					boseIsDone = true;
					$this.qryHideWait();
				},error:function(){
					boseIsDone = true;
					$this.qryHideWait();
				}
			});

		},
		
		initGold : function() {
			var $this = this;
			var param = {
			};
			Ajax({
				url : "/bosera/commonFundSynchronizer",
				data : param,
				success : function(data) {
					if (data.errorCode) {
						App.storage.set("boseGold", false);
					} else {
						var iCommonFundList = data.iCommonFundList;
						$.each(iCommonFundList,function(index,boseGold){
							if(boseGold.productId == Utils.getParamDisplay("PB_BOSERA",'3')){
								modelData.goldSevRate =Utils.formatCurrency(boseGold.nearestYearYield*100,2);
								App.storage.set("boseGold", boseGold);
							}
						});
					}
					goldDone = true;
					$this.qryHideWait();
				},error:function(){
					goldDone = true;
					$this.qryHideWait();
				}
			});
		},
		
		queryAdPicAddress: function(){
			var adCode = "ZX_PRODUCT_AD";//广告编码
			var $this = this;
			var param = {
					adCode:adCode
			};
			Ajax({url:"/pubServer/getAdvertiseList", data:param, success:function(data){
				if(Utils.isEmpty(data.errorCode)){
					var icoll = data.adList;
					paramAdPicAddress.adList=icoll;
					modelData.icoll=icoll;
					App.storage.set("paramAdPicAddress",paramAdPicAddress);//将参数放入session
					addIsDone = true;
					$this.qryHideWait();
				}else{
					addIsDone = true;
					Utils.alertinfo(data.errorMessage);
					$this.qryHideWait();
				}
			},error:function(){
				addIsDone = true;
				$this.qryHideWait();
			}});
		},
		
        queryRate : function(){
        	
        	var rate = this.rate =[];
        	var label = [];
        	var $this = this;

        	Ajax({url:"/finance/queryRmbRate",data:{}, 
    			success:function(data){
    				if(data.errorCode){
    					Utils.alertinfo(data.errorMessage);
    				}else{
    					var iApparList = data.iApparList;
    					
    					for(index in iApparList){
    						var appar = iApparList[index];
    						if(appar.aprName == '一年'){
    							paramRate.oneYearRate = Utils.toRetentionDigit(appar.aprShowMsg,2);
    							modelData.oneYearRate = Utils.toRetentionDigit(appar.aprShowMsg,2);
    						}else if(appar.aprName == '五年'){
    							paramRate.fiveYearRate = appar.aprShowMsg;
    							modelData.fiveYearRate = appar.aprShowMsg;
    						}
    						
    						rate.push(appar.aprShowMsg);
    						label.push(appar.aprName);
    					}
    					App.storage.set("paramRate",paramRate);
    					App.storage.set("depositRate",{rate:rate,label:label});
    				}
    				rateIsDone = true;
					$this.qryHideWait();
    				
    			}
        	,error:function(){
				rateIsDone = true;
				$this.qryHideWait();
			}});
        },
		
        initSale : function(){
        	
        	var $this = this;
        	Ajax({url:"/product/queryMaxRate",data:{}, 
    			success:function(data){
    				if(data.errorCode){
    					Utils.alertinfo(data.errorMessage);
    				}else{
    					modelData.financePreInterestRate = Utils.formatCurrency(data.financePreInterestRate,2);
    					App.storage.set("saleMaxRate",data);
    				}
    				saleIsDone = true;
					$this.qryHideWait();
    			}
        	,error:function(){
				saleIsDone = true;
				$this.qryHideWait();
			}});
        },
        
		qryHideWait: function(){
			if(boseIsDone&&addIsDone&&rateIsDone&&saleIsDone&&goldDone&& fundIsDone){
				
				Client.hideWaitPanel(1);
				Client.hideLucencyPanel();
				
				if(App.history.fragment.indexOf("product/productCtl/wantInv") < 0){
					return;
				}
				
				this.model.set(modelData);
				
				//轮播图
				MUI.createCarousel({
					  elementName : '#bannerslideIndexw',
					  aspectRatio : 28/64
				});
				
				this.opt ? null : this.opt = {
						callback:"curView.refresh()"
				};
				Client.dragRefresh(this.opt);
				
			}
			
		},
		
		refresh : function(){
			Client.openLucencyPanel();
    		addIsDone = false;
    		$(".cell h1").text("0.000");
    		modelData.random = Math.random();
    		this.opt.type = "1";
    		this.queryAdPicAddress();
    	},
		
		goToDepositPage: function(){
			var isLogon = Utils.checkSession();
			if(!isLogon){   
				App.navigate("deposit/depositCtl/deposit");
			 }else{
				if(!Utils.checkActivate()){
					return;
				}
				App.navigate("deposit/depositCtl/depositLoad");
			}
		},
		
		goToFundIndex: function(){
			App.navigate("fund/fundCtl/fundIndex");
		},
		
		toIndex : function(){
    		Client.menuOpt("1");
			App.navigate("index/index/index");
    	},
    	goToDesign : function(){
    		var url;
    		if (Utils.checkSession()) {
    			url="/design/productQueryByPageAjaxSession";
			}else{
				url="/design/productQueryByPageAjax";
			}
			Client.openWaitPanel("拼命加载中，请稍候");
        	Ajax({url:url,data:{}, 
    			success:function(data){
    				if(data.errorCode){
    					Utils.alertinfo(data.errorMessage);
        	    		Client.hideWaitPanel(1);
    				}else{
    					var depositHome = data.designabilityInfo;    
    					App.storage.set("depositHome",depositHome);
    		    		Client.menuOpt("2"); 
    					App.navigate("design/designCtl/depositHome");
    				}
    			}
        	});
    	}, 
		
    	boseFund : function(){
    		
    		if(!App.storage.get("boseRate")){
				Utils.alertinfo("暂无产品信息，请稍候再试");
				return;
			};
			
    		var isLogon = Utils.checkSession();
			if(!isLogon){   
				App.navigate("bosera/boseraCtl/boseFund");
			}else{
				if(!Utils.checkRealUser()){
					return;
				}
				if(!Utils.checkActivate()){
					return;
				}
				Client.openWaitPanel();
				if(Utils.checkBoseFinance("1"))
					App.navigate("bosera/boseraCtl/boseFinance");
				else
					App.navigate("bosera/boseraCtl/boseFundLogon");
			}
    	},
		
		gold : function(){
			
			if(!App.storage.get("boseGold")){
				Utils.alertinfo("暂无产品信息，请稍候再试");
				return;
			};
			
    		var isLogon = Utils.checkSession();
			if(!isLogon){   
				App.navigate("gold/goldCtl/gold");
			 }else{
				 
				if(!Utils.checkRealUser()){
					return;
				}
				
				if(!Utils.checkActivate()){
					return;
				}
				App.navigate("gold/goldCtl/gold");
			}
    	},
    	
    	queryProducts : function(){
			var param = {
					actionFlag:"0",
					resultSort:"00",
					turnPageBeginPos:1,
					turnPageShowNum:"6"
				};
			var $this = this;
			var isLogon = Utils.checkSession();
			var url="";
			if(!isLogon){
				url="/product/saleProducts";
			}else{
				url="/product/saleProductsSession";
			}
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:url, data:param, 
				success:function(data){
					if (data.errorCode) {
						Utils.alertinfo(data.errorMessage);
					} else {
						$this.goTosaleProducts(data);
					}
				}
			});
			
		},
    	
		goTosaleProducts : function(data){
			if(data.count1 == '0' &&  data.count2!='0'){
				var transferFlag ="0";
				var param = {transferFlag:transferFlag};
	        	App.navigate("product/productCtl/saleProducts",param);//跳转到转让区
			}else{
				App.navigate("product/productCtl/saleProducts");
			}
    	},
		
		preferredFund : function(){
			var param = {
    				taCode:"00",
    				fundName:"",
    				fundType:"0",
    				fundSellState:"0",
    				resultSort:"30",
    				turnPageBeginPos:"1",
    				turnPageShowNum:"1000",
    				actionFlag:"02"//首页：01 我要投资：02 单品优选：03 热门基金：04 高收益：05 性价比：06 老基金：07
    		};
			var $this=this;
    		Ajax({url:"/fund/fundQuery",data:param,success:function(data){
	    			if(MUI.isEmpty(data.errorCode)){
	    				var icoll = data.iPreFundList;
	    				var kcoll = icoll[0];
						$this.addRow(kcoll);
						App.storage.set("iPreFundList",icoll);
	    			}else{
	    				Client.alertinfo(data.errorMessage,"提醒");
	    			}
	    			fundIsDone = true;
					$this.qryHideWait();
    		},error:function(){
    			fundIsDone = true;
				$this.qryHideWait();
    		}
    		});
    	},

    	initPreferredFund :function(icoll){
    		var kcoll = icoll[0];
          	this.addRow(kcoll);
			
    	},
    	
    	addRow : function(kcoll){
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

    		if(fundName==""){
    			fundName='--';
    		}else if(fundName.length > 10){
    			fundName=fundName.substring(0,10)+'...';
    		}
    		
    		if(risePer=="" || risePer=="--"){
    			modelData.fundClass="fc-green";
    		}else if(!risePer.indexOf("-")){
    			modelData.fundClass="fc-green";
    		}else{
    			modelData.fundClass="fc-orange";
    		}
    		
    		if(rateDate=="01"){
    			modelData.rateDate = '近一月涨跌幅';
    		}else if(rateDate=="03"){
    			modelData.rateDate = '近三月涨跌幅';
    		}else if(rateDate=="06"){
    			modelData.rateDate = '近六月涨跌幅';
    		}else if(rateDate=="12"){
    			modelData.rateDate = '近一年涨跌幅';
    		}else if(rateDate=="36"){
    			modelData.rateDate = '近三年涨跌幅';
    		}
    		
    		modelData.fundName =fundName;
    		modelData.risePer = Utils.nvl(risePer,"--");
    	},
    	
    	JsonNvl : function(param, val) {
			if (MUI.isEmpty(param)) {
				paramT = val;
			} else {
				paramT = param;
			}
		
			return paramT;
    	},
	});
	
});


