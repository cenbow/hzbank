define(function(require, exports, module) {

	var indexTpl = require("text!../template/index.html");
	require("swipeBanner");
	var indexView = module.exports = ItemView
			.extend({

				template : indexTpl,

				events : {
					"click #pro" : "wantInv",
					"click #loan" : "loanCenter",
					"click #fee" : "fee",
					"click #boseFund" : "boseFund",
					"click #finance" : "toFinance",
					"click #reg":"reg",
					"click #floatPacket" : "tohongbao",
						
					"click #fundIndex" : "fundIndex",
				},

				initialize : function() {
					
					this.boseIsDone = false;
					this.rateIsDone = false;
					this.saleIsDone = false;
					var $this = this;
					this.opt = {
							callback:"curView.refresh()"
					};
					
					var indexMenu = pubParam.indexMenu;
					if(indexMenu){
						$(".menuRow").addClass(indexMenu.icon);
					}
					
					if(pubParam.versionCtl && pubParam.versionCtl.updatestate != "0"){
						if(pubParam.versionCtl.updatestate == "2"){ //提示非强制更新；
							Client.openClientPanel();
							$(".updateVersion").show();
							this.count();
							$("#timeoutCircleClose").on("click",function(){
								if(!$(this).hasClass("close")){
									return;
								}
								Client.dragRefresh($this.opt);
								Client.hideClientPanel();
								$(".updateVersion").hide();
								pubParam.versionCtl.updatestate = "0";
							});
						}else if(pubParam.versionCtl.updatestate == "1"){ //强制更新；
							Client.openClientPanel();
							$(".updateVersion").show();
							$("#timeoutCircleClose,.myCircle").hide();
						}
						this.initButton();
					}else{
						Client.dragRefresh(this.opt);
					}
					
					var adList = App.storage.get("adList");
					if (!adList)
						this.initAd();
					else {
						this.showAd(adList);
					}
					
					var saleProducts = App.storage.get("saleProducts");
					if(saleProducts){
						this.initProducts(saleProducts);
					}else{
						this.queryProducts();
					}
					
					var boseRate = App.storage.get("boseRate");
					if (boseRate) {
						$("#sevRate").text(boseRate.boseSevRate);
						$("#tsRate").text(boseRate.boseTsRate);
						this.rateIsDone = true;
						this.qryHideWait();
					} else {
						this.initData();
					}
					
					this.isNoticeShow = false;
					var iBankNotice = App.storage.get("iBankNotice");
					if(iBankNotice){
						if(iBankNotice.length>0){
							this.isNoticeShow =true;
						}else{
							this.isNoticeShow =false;
						}
					}else{
						this.initNotice();
					}
					
					var iBoseraIncome = App.storage.get("iBoseraIncome");
					if(!iBoseraIncome && Utils.checkSession()){
	   		    		this.queryBoseFinance();
	   		    	}else{
	   		    		this.boseIsDone = true;
	   		    		$this.qryHideWait();
	   		    	}
					
					iPreFundList=App.storage.get("PreFundList");//优选
					if(!iPreFundList){
			    		this.preferredFund();
					}else{
						this.initPreferredFund(iPreFundList);
					}
					Client.hideWaitPanel(1);
					
					
					Client.loadFinished();
					$this.initHeight();
					
					var boseGold = App.storage.get("boseGold");
					if (!boseGold) {
						this.initGold();
					}
					
					
				},
				
				initData : function() {
					var $this = this;
					var param = {
						productId : Utils.getParamDisplay("PB_BOSERA",'1')
					};
					Ajax({
						url : "/bosera/boseraProductSynchro",
						data : param,
						success : function(data) {
							if (data.errorCode) {
								//Utils.alertinfo(data.errorMessage);
								App.storage.set("boseRate", false);
							} else {
								var iBoseraProduct = data.iBoseraProduct;
								var boseSevRate = "0.000";
								var boseTsRate = "0.000";
								if(iBoseraProduct.length>0){
									boseSevRate = Utils.formatCurrency(iBoseraProduct[0].trans_amt2,3);
									boseTsRate = Utils.formatCurrency(iBoseraProduct[0].trans_amt3,3);
								}
								$("#sevRate").text(boseSevRate);
								$("#tsRate").text(boseTsRate);
								App.storage.set("boseRate", {
									boseSevRate : boseSevRate,
									boseTsRate : boseTsRate
								});
							}
							$this.rateIsDone = true;
							$this.qryHideWait();
							if($this.opt.type == "1")
								Client.dragRefresh($this.opt);
						},
						error:function(){
							if($this.opt.type == "1")
								Client.dragRefresh($this.opt);
						}
					});

				},
				
				queryProducts : function(){
					var param = {
							actionFlag:"1",
							resultSort:"00",
							turnPageBeginPos:1,
							turnPageShowNum:"2"
						};
					var $this = this;
					var isLogon = Utils.checkSession();
					var url="";
					if(!isLogon){
						url="/product/saleProducts";
					}else{
						url="/product/saleProductsSession";
					}
					Ajax({url:url, data:param, 
						success:function(data){
							if (data.errorCode) {
								Utils.alertinfo(data.errorMessage);
							} else {
								$this.initProducts(data);
								App.storage.set("saleProducts", data);
							}
						}
					});
				},
				
				initProducts:function(data){
					
					var html = '<div class="list-item tit row arr" id="more">'
						+'<div class="ft16 mr10">幸福金禧</div>'
						+'<span class="ft12 fc-9">资金有规划，踏实又省心</span></div><div class="list">';
					$.each(data.iSalePlatList,function(i,product){
						var tranflag = product.tranflag;
						var tranClass = "";
						var tranName = "";
						if(tranflag=="10"){
							tranName="";
							tranClass="";
						}else if(tranflag=="00"){
							tranName="可转让";
							tranClass="could-transfer-2";
						}
						var state=product.state;
						var financePreInterestRate=Utils.formatCurrency(product.financePreInterestRate,2);
						var myCircleClass="";
						var financeUseVolTem="";
						var raisebegin = Utils.formatDate(product.raisebegindate+product.raisebegintime, "yyyyMMddhhmmss", "yyyy-MM-dd hh:mm");
						var percent="";
						if(state=="1"){
							var days = product.raisebegindate - parseInt(Utils.toDateString(new Date(),"yyyyMMdd"));
							if(days == 0){
								percent= "今天<br />"+raisebegin.split(" ")[1]+"<br />开售";
							}else if(days == 1){
								percent= "明天<br />"+raisebegin.split(" ")[1]+"<br />开售";
							}else if(days == 2){
								percent= "后天<br />"+raisebegin.split(" ")[1]+"<br />开售";
							}else{
								percent= "即将<br />开售";
							}
							
							myCircleClass = "";
						}else if(state=="2"){//募集中
							financeUseVolTem=Utils.formatCurrency(product.financeUseVol, 2);
							if(financeUseVolTem=='0.00'){
								percent="已售罄";
								myCircleClass="soldout";
							}else{
								myCircleClass="";
								percent="立即<br />抢购";
							}
						}else{
							percent="已售罄";
							myCircleClass="soldout";
						}
						html += '<div class="list-item proItem" index="'+i+'">'+
						'<div class="row scanIfo">'+
							'<div class="tt">'+
								'<h1 class="fc-orange">'+
									'<b>'+financePreInterestRate+'</b>%'+
								'</h1>'+
								'<p>预期年化收益</p>'+
							'</div>'+
							'<div class="cell">'+
								'<h3 class="ft16">'+product.financeName+'<span class="'+tranClass+'">'+tranName+'</span></h3>'+
									'<p>'+product.financePeriod+'天持有期，'+product.minbuyamt+'元起投</p>'+
							'</div></div>'+
							'<i class="seal '+myCircleClass+'">'+percent+'</i>'+'</div>';
					});
					$("#products").html(html);
					this.list = data.iSalePlatList;
					
					var $this = this;
					$(".proItem").off().on("click",function(){
						
						var index = $(this).attr("index");
						App.navigate("product/productCtl/investDetail",$this.list[index]);
						return false;
					});
					
					$("#more,.more").off().on("click",function(){
						App.navigate("product/productCtl/saleProducts");
					});
					this.saleIsDone = true;
					this.qryHideWait();
				},
				
		/*		initProducts:function(data){
						
					var html = '<div class="list-item tit row arr" id="more">'
						+'<div class="ft16 mr10">幸福金禧</div>'
						+'<span class="ft12 fc-9">资金有规划，踏实又省心</span></div><div class="list">';
					if(data.count1 >'1' ||  data.count2=='0'){
						$.each(data.iSalePlatList,function(i,product){
							var tranflag = product.tranflag;
							var tranClass = "";
							var tranName = "";
							if(tranflag=="10"){
								tranName="";
								tranClass="";
							}else if(tranflag=="00"){
								tranName="可转让";
								tranClass="could-transfer-2";
							}
							var state=product.state;
							var financePreInterestRate=Utils.formatCurrency(product.financePreInterestRate,2);
							var myCircleClass="";
							var financeUseVolTem="";
							var raisebegin = Utils.formatDate(product.raisebegindate+product.raisebegintime, "yyyyMMddhhmmss", "yyyy-MM-dd hh:mm");
							var percent="";
							if(state=="1"){
								var days = product.raisebegindate - parseInt(Utils.toDateString(new Date(),"yyyyMMdd"));
								if(days == 0){
									percent= "今天<br />"+raisebegin.split(" ")[1]+"<br />开售";
								}else if(days == 1){
									percent= "明天<br />"+raisebegin.split(" ")[1]+"<br />开售";
								}else if(days == 2){
									percent= "后天<br />"+raisebegin.split(" ")[1]+"<br />开售";
								}else{
									percent= "即将<br />开售";
								}
								
								myCircleClass = "";
							}else if(state=="2"){//募集中
								financeUseVolTem=Utils.formatCurrency(product.financeUseVol, 2);
								if(financeUseVolTem=='0.00'){
									percent="已售罄";
									myCircleClass="soldout";
								}else{
									myCircleClass="";
									percent="立即<br />抢购";
								}
							}else{
								percent="已售罄";
								myCircleClass="soldout";
							}
							html += '<div class="list-item proItem" index="'+i+'">'+
							'<div class="row scanIfo">'+
							'<div class="tt">'+
							'<h1 class="fc-orange">'+
							'<b>'+financePreInterestRate+'</b>%'+
							'</h1>'+
							'<p>预期年化收益</p>'+
							'</div>'+
							'<div class="cell">'+
							'<h3 class="ft16">'+product.financeName+'<span class="'+tranClass+'">'+tranName+'</span></h3>'+
							'<p>'+product.financePeriod+'天持有期，'+product.minbuyamt+'元起投</p>'+
							'</div></div>'+
							'<i class="seal '+myCircleClass+'">'+percent+'</i>'+'</div>';
						});
					}else if(data.count1=='0' && data.count2 >'0'){
						$.each(data.iTransferProData,function(i,product){
							var tranName="可转让";
							var tranClass="could-transfer-2";
							var percent="立即<br />抢购";
							var myCircleClass="";
							var tranRate=Utils.formatCurrency(product.tranRate,2);
							html += '<div class="list-item proItem" index="'+i+'">'+
							'<div class="row scanIfo">'+
							'<div class="tt">'+
							'<h1 class="fc-orange">'+
							'<b>'+tranRate+'</b>%'+
							'</h1>'+
							'<p>预期年化收益</p>'+
							'</div>'+
							'<div class="cell">'+
							'<h3 class="ft16">'+product.financeName+'<span class="'+tranClass+'">'+tranName+'</span></h3>'+
							'<p>'+product.fundRestDay+'天持有期，转让价格'+product.transferAMT+'元</p>'+
							'</div></div>'+
							'<i class="seal '+myCircleClass+'">'+percent+'</i>'+'</div>';
						});
					}else if(data.count1=='1' && data.count2 >'0'){
						var iSalePlatList = data.iSalePlatList;
						var iTransferProData = data.iTransferProData;
						var tranflag = iSalePlatList[0].tranflag;
						var tranClass = "";
						var tranName = "";
						if(tranflag=="10"){
							tranName="";
							tranClass="";
						}else if(tranflag=="00"){
							tranName="可转让";
							tranClass="could-transfer-2";
						}
						var state=iSalePlatList[0].state;
						var financePreInterestRate=Utils.formatCurrency(iSalePlatList[0].financePreInterestRate,2);
						var myCircleClass="";
						var financeUseVolTem="";
						var raisebegin = Utils.formatDate(iSalePlatList[0].raisebegindate+iSalePlatList[0].raisebegintime, "yyyyMMddhhmmss", "yyyy-MM-dd hh:mm");
						var percent="";
						if(state=="1"){
							var days = iSalePlatList[0].raisebegindate - parseInt(Utils.toDateString(new Date(),"yyyyMMdd"));
							if(days == 0){
								percent= "今天<br />"+raisebegin.split(" ")[1]+"<br />开售";
							}else if(days == 1){
								percent= "明天<br />"+raisebegin.split(" ")[1]+"<br />开售";
							}else if(days == 2){
								percent= "后天<br />"+raisebegin.split(" ")[1]+"<br />开售";
							}else{
								percent= "即将<br />开售";
							}
							
							myCircleClass = "";
						}else if(state=="2"){//募集中
							financeUseVolTem=Utils.formatCurrency(iSalePlatList[0].financeUseVol, 2);
							if(financeUseVolTem=='0.00'){
								percent="已售罄";
								myCircleClass="soldout";
							}else{
								myCircleClass="";
								percent="立即<br />抢购";
							}
						}else{
							percent="已售罄";
							myCircleClass="soldout";
						}
						html += '<div class="list-item proItem" index="'+0+'">'+
						'<div class="row scanIfo">'+
						'<div class="tt">'+
						'<h1 class="fc-orange">'+
						'<b>'+financePreInterestRate+'</b>%'+
						'</h1>'+
						'<p>预期年化收益</p>'+
						'</div>'+
						'<div class="cell">'+
						'<h3 class="ft16">'+iSalePlatList[0].financeName+'<span class="'+tranClass+'">'+tranName+'</span></h3>'+
						'<p>'+iSalePlatList[0].financePeriod+'天持有期，'+iSalePlatList[0].minbuyamt+'元起投</p>'+
						'</div></div>'+
						'<i class="seal '+myCircleClass+'">'+percent+'</i>'+'</div>';
						
						var tranName="可转让";
						var tranClass="could-transfer-2";
						var percent="立即<br />抢购";
						var myCircleClass="";
						var tranRate=Utils.formatCurrency(iTransferProData[0].tranRate,2);
						var transferAMT=Utils.formatCurrency(iTransferProData[0].transferAMT,2);
						html += '<div class="list-item proItem" index="'+1+'">'+
						'<div class="row scanIfo">'+
						'<div class="tt">'+
						'<h1 class="fc-orange">'+
						'<b>'+tranRate+'</b>%'+
						'</h1>'+
						'<p>预期年化收益</p>'+
						'</div>'+
						'<div class="cell">'+
						'<h3 class="ft16">'+iTransferProData[0].financeName+'<span class="'+tranClass+'">'+tranName+'</span></h3>'+
						'<p>'+iTransferProData[0].fundRestDay+'天持有期，转让价格'+transferAMT+'元</p>'+
						'</div></div>'+
						'<i class="seal '+myCircleClass+'">'+percent+'</i>'+'</div>';
					}
					$("#products").html(html);
					
					if(data.count1 >'1' ||  data.count2=='0'){
						this.list = data.iSalePlatList;
					}else if(data.count1=='0' && data.count2 >'0'){
						this.list = data.iTransferProData;
					}else if(data.count1=='1' && data.count2 >'0'){
						
					}
					var $this = this;
					$(".proItem").off().on("click",function(){
						var index = $(this).attr("index");
						if(data.count1 >'1' ||  data.count2=='0'){
							App.navigate("product/productCtl/investDetail",$this.list[index]);
						}else if(data.count1=='0' && data.count2 >'0'){
							if(!isLogon){  
								Client.toLogin("curView.queryProducts()");
							 }else{
					   			if(!Utils.checkRealUser()){
						        	return;
					   			}
								if(!Utils.checkActivate()){
									return;
								}
								$this.list = data.iTransferProData;
								App.navigate("product/productCtl/transferBuy",$this.list[index]);
							 }
						}else if(data.count1=='1' && data.count2 >'0'){
							if(index == '0'){
								$this.list = data.iSalePlatList;
								App.navigate("product/productCtl/investDetail",$this.list[0]);
							}else{
								var isLogon = Utils.checkSession();
								if(!isLogon){  
									Client.toLogin("curView.queryProducts()");
								 }else{
						   			if(!Utils.checkRealUser()){
							        	return;
						   			}
									if(!Utils.checkActivate()){
										return;
									}
									$this.list = data.iTransferProData;
									App.navigate("product/productCtl/transferBuy",$this.list[0]);
								 }
							}
						}
						return false;
					});
					
					$("#more,.more").off().on("click",function(){
						if(data.count1 >'1' ||  data.count2=='0'){
							App.navigate("product/productCtl/saleProducts");
						}else if(data.count1=='0' && data.count2 >'0'){
							var transferFlag ="0";
							var param = {transferFlag:transferFlag};
				        	App.navigate("product/productCtl/saleProducts",param);//跳转到转让区
						}else if(data.count1=='1' && data.count2 >'0'){
							App.navigate("product/productCtl/saleProducts");
						}

						//App.navigate("product/productCtl/saleProducts");
					});
					this.saleIsDone = true;
					this.qryHideWait();
				},*/
				
				initAd : function() {
					var $this = this;
					var param = {
						adCode : "ZX_HOMEAD"
					};
					Ajax({
						url : "/pubServer/getAdvertiseList",
						data : param,
						success : function(data) {
							if (data.errorCode) {
								Utils.alertinfo(data.errorMessage);
							} else {
								if(data.menu){
									var indexMenu = data.menu[0];
									$(".menuRow").addClass(indexMenu.icon);
									pubParam.indexMenu = indexMenu;
								}
								var adList = data.adList;
								$this.showAd(adList);
								App.storage.set("adList", data.adList);
							}
						}
					});
				},

				showAd : function(adList) {
					var hongbaoStartTemp = "0";
					for(index in adList){
						if(adList[index].adPointTo == "hongbao/hongbaoCtl/redPacketInviteIndex"){
							$("#floatPacket").show();
							hongbaoStartTemp = "1";
							break;
						}
					}
					App.storage.set("hongbaoStart",{hongbaoStartTemp:hongbaoStartTemp});
					var $this = this;
					if(pubParam.clientHeight <= 0){
						setTimeout(function(){
							$this.showAd(adList);
						},100);
						return;
					}
					var html = '';
					for (var i = 0; i < adList.length; i++) {
						var href = adList[i].adIsPointTo=="1"?adList[i].adPointTo:"";
						html = '<li class="img" data-value="'+href+'">'+
								'<img src="'+ adList[i].adUrl.substring(1,adList[i].adUrl.length) + '"  ></li>' + html;
					}
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
							if(href == "hongbao/hongbaoCtl/redPacketInviteIndex"){
								if(Utils.checkSession()){
									if(Utils.checkRealUser()){
										if(!Utils.checkActivate()){
											return;
										}
										App.navigate(href);
									}
								}else{
									Client.toLogin("curView.tohongbao()");
								}
							}else if(href == "bosera/boseraCtl/boseFund"){
								$this.boseFund();
							}else if(href == "anymore/anymoreCtl/share"){
								$this.share();
							}else{
								App.navigate(href);
							}
						}
					});
				},
				
				queryBoseFinance:function(){
					var param = {
							productId:Utils.getParamDisplay("PB_BOSERA",'1'),
							cardNo : Utils.trim(Utils.getEleCard().cardNo),
				    		accountType : Utils.trim(Utils.getEleCard().accountType)
					};
					var $this = this;
					Ajax({url:"/bosera/queryBoseraFinance",data:param,
						success:function(data){
							if(MUI.isEmpty(data.errorCode)){
								App.storage.set("iBoseraIncome",data.iBoseraQuery);
			    			}
							$this.boseIsDone = true;
							$this.qryHideWait();
					}});
				},
				
				refresh:function(){
					$("#percent").text("0.000");
					$("#fiveRate").text("0.000");
					this.opt.type = "1";
					this.initData();
					this.queryProducts();
				},
				
				initHeight : function(){
					var $this = this;
					
					if(pubParam.clientHeight <= 0 || parseFloat(pubParam.clientHeight) < 300){
						setTimeout(function(){
							pubParam.clientHeight = document.documentElement.clientHeight || window.innerHeight;
							$this.initHeight();
						},100);
					}
				},
				
				goToDepositPage : function() {
					Client.menuOpt("2");
					var isLogon = Utils.checkSession();
					if (!isLogon) {
						App.navigate("deposit/depositCtl/deposit");
					} else {
						if(!Utils.checkActivate()){
							return;
						}
						App.navigate("deposit/depositCtl/depositLoad");
					}
				},

				goToSaleProductPage : function() {
					Client.menuOpt("2");
		    		App.navigate("product/productCtl/saleProducts");
				},

				login : function() {
					Client.toLogin("curView.init()");
				},

				init : function() {
					if(location.href.indexOf("index/index/index")<0){
						return;
					}
					Client.openWaitPanel("拼命加载中，请稍候");
					var pageStep = {
						title : '杭银直销',
						leftButton : {
							name : '',
							func : 'scan'
						},
						rightButton : Utils.checkSession() ? {
	       					name : this.isNoticeShow?'活动':'无活动',
	    					func : 'curView.active()'
						} : {
							name : '登录',
							func : 'curView.login()'
						}
					};
					Client.initPageTitle(pageStep);
					if(Utils.checkSession()){
						this.queryBoseFinance();
					}else{
						this.qryHideWait();
					}
				},
				
				wantInv : function() {
					App.navigate("product/productCtl/wantInv");
				},
				
				loanCenter : function() {
					App.navigate("houseloan/houseloanCtl/loanCenter");
				},
				
				reg : function() {
					App.navigate("mortgage/mortgageCtl/notice");
				},
				
				active : function() {
					if(this.isNoticeShow){
						App.navigate("anymore/anymoreCtl/activitiesMore");
					}
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
						
						if(Utils.checkBoseFinance("1"))
							App.navigate("bosera/boseraCtl/boseFinance");
						else
							App.navigate("bosera/boseraCtl/boseFundLogon");
					}
		    	},
		    	
				fee : function(){
					if (Utils.checkSession()) {
						if(Utils.checkRealUser()){
							if(!Utils.checkActivate()){
								return;
							}
							App.navigate("fee/feeCtl/feeMenu");
						}
					} else {
						Client.toLogin("curView.fee()");
					}
				},
				
				initNotice : function(){
					 var $this = this;
					 var param = {}; 
					 Ajax({url:"/anyMore/queryNotice", data:param, success:function(data){
						if(MUI.isEmpty(data.errorCode)){
							var icol=data.cd.iBankNotice;
							App.storage.set("iBankNotice",icol);
							if(!MUI.isEmpty(icol)&&icol.length>0){
								$this.isNoticeShow =true;
							}else{
								$this.isNoticeShow =false;
							}
							$this.init();
						}
					}});
				},
				tohongbao:function(){
					if (Utils.checkSession()) {
						if(Utils.checkRealUser()){
							if(!Utils.checkActivate()){
								return;
							}
							App.navigate("hongbao/hongbaoCtl/redPacketInviteIndex");
						}
					} else {
						Client.toLogin("curView.tohongbao()");
					}
				},
				
				qryHideWait: function(){
					if(this.boseIsDone&&this.rateIsDone&&this.saleIsDone){
						Client.hideWaitPanel(1);
					}
				},
				
				scan : function(){
					if(pubParam.clientVersion >= "3.0.0"){
						Client.scanLogin();
					}else{
						Utils.alertinfo("敬请期待");
					}
						
				},
				
				count : function(){
					function setCircle(elem, x, attr){
					   var lcir = elem.querySelector('.left i');
					   var rcir = elem.querySelector('.right i'); 
					   elem.setAttribute('data-time', attr);
					   if(x == 100){
						  elem.className = 'myCircle done';
					   }else if(x<=50){
						 elem.className = 'myCircle';
						 var deg = 3.6*x - 180;
						 lcir.style.transform = lcir.style.webkitTransform = 'rotate('+deg+'deg)';
						 rcir.style.transform = rcir.style.webkitTransform = '';
					   }else{
						 elem.className = 'myCircle';
						 var deg = 3.6*(x-50) - 180;
						 lcir.style.transform = lcir.style.webkitTransform = 'rotate(0deg)';
						 rcir.style.transform = rcir.style.webkitTransform = 'rotate('+deg+'deg)';
					   }
					}
					var timeoutCircle = document.getElementById('timeoutCircle');
					var timeoutCircleClose = document.getElementById('timeoutCircleClose');
					var time = 5; // 5秒倒计时
					var per = 100; // 百分比起始
					var timeoutTimer = null;
					setCircle(timeoutCircle, per, time);
					function setonce(){
						timeoutTimer && clearTimeout(timeoutTimer);
						timeoutTimer = setTimeout(function(){
							time--;
							per -= 20;
							setCircle(timeoutCircle, per, time);
							console.log(per);
							timeoutTimer && clearTimeout(timeoutTimer);
							if(time === 0){
								timeoutCircleClose.style.display = 'block';
								timeoutCircle.style.display = 'none';
							}else{
								setonce();
							}
						}, 1000);
					}
					setonce();
				},
				
				initButton:function(){
					this.sendFlag = false;
					var $this = this;
					var userId = MUI.Cache.get("userId");
					if(userId && Utils.checkMobile(userId.data)){
						$("#sendMsg").show().on("click",function(){
							if($this.sendFlag){
								Client.alertinfo("短信已发送，请勿重复操作");
								return;
							}
							Client.openWaitPanel();
							Ajax({url:"/mobile/sendDownload", data:{mobileNo:userId.data}, success:function(data){
								Client.hideWaitPanel(1);
								if(MUI.isEmpty(data.errorCode)){
									$this.sendFlag = true;
									Client.alertinfo("下载地址已发送至"+userId.data+"手机，请查阅短信下载最新版杭银直销APP！");
								}
							}});
						});
					}else{
						$("#copy").css("background-color","#2893ed")
								  .css("color","#fff");
					}
					$("#copy").on("click",function(){
						Client.clipboard("http://www.hzbank.com.cn/mobile/zxyh_3.0.5.html");
						Client.alertinfo("链接已复制，请将链接地址粘贴至浏览器地址栏中打开，下载最新版杭银直销APP！");
					});
				},
				
				fundIndex : function() {
					App.navigate("fund/fundCtl/fundIndex");
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
		    				actionFlag:"01"//首页：01 我要投资：02 单品优选：03 热门基金：04 高收益：05 性价比：06 老基金：07
		    		};
					
					var $this=this;
		    		Ajax({url:"/fund/fundQuery",data:param,success:function(data){
			    			if(MUI.isEmpty(data.errorCode)){
			    				var icoll = data.iPreFundList;
			    				$("#preferredFund1").empty();
			    				for(var len=0;len<icoll.length;len++){
									var kcoll = icoll[len];
									$this.addRow("preferredFund1",kcoll);
								}
			    				App.storage.set("PreFundList",icoll);
			    			}else{
			    				Client.alertinfo(data.errorMessage,"提醒");
			    				Client.hideWaitPanel(1);
			    			}
		    		},error:function(){
		    			Client.hideWaitPanel(1);
		    		}});
		    	},
		    	
		    	initPreferredFund :function(icoll){
		    		$("#preferredFund1").empty();
					for(var len=0;len<icoll.length;len++){
						var kcoll = icoll[len];
						this.addRow("preferredFund1",kcoll);
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
		    		
		    		var html = '<div class="list-item" id="div_'+kcoll.fundCode+'">'+
		    					  '<div class="row">'+
									'<div class="pr15">';
		    		
		    		if(risePer=="" || risePer=="--"){
		    			html +='<h1 class="fc-green" style="width:94px;">'+
							'<span class="ft-big">--</span>'+
						'</h1>';
		    		}else if(!risePer.indexOf("-")){
		    			html +='<h1 class="fc-green" style="width:94px;">'+
									'<span class="ft-big">'+risePer.substring(0,risePer.length-1)+'<span class="ft14">%</span></span>'+
								'</h1>';
		    		}else{
		    			html +='<h1 class="fc-orange" style="width:94px;">'+
									'<span class="ft-big">+'+risePer.substring(0,risePer.length-1)+'<span class="ft14">%</span></span>'+
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
		    			html+='<h1 class="ft16">--</h1>';
		    		}else if(fundName.length<=10){
		    			
		    			html+='<h1 class="ft16">'+fundName+'</h1>';
		    		}else{
		    			html+='<h1 class="ft16">'+fundName.substring(0,10)+'...</h1>';
		    		}
					html+='<h2 class="fc-9 ft13 mt5">'+kcoll.fundDescribe+'</h2>'+
						'<h2 class="keywords">';
								
		    		if(kcoll.fundRemark1!=""){
		    			html+='<span>'+kcoll.fundRemark1+'</span>'; 
		    		}
		    		if(kcoll.fundRemark2!=""){
		    			html+='<span>'+kcoll.fundRemark2+'</span>';
		    		}
		    		html+='</h2></div></div></div></div>';
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
			
			initGold : function() {
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
										App.storage.set("boseGold", boseGold);
									}
								});
							}
						}
					});
				},
				
			share:function(){
				if (Utils.checkSession()) {
					if(Utils.checkRealUser()){
						if(!Utils.checkActivate()){
							return;
						}
						var param = {
						};
						Client.openWaitPanel("加载中");
						Ajax({url:"/anyMore/isActivity",data:param, success:function(data){
							if(MUI.isEmpty(data.errorCode)){
								var param = {
										"url":data.url,
										"isFlag":data.isFlag
								};
								App.storage.set("param",param);
								MUI.Cache.save("shareUnNew", true);
								if(data.isFlag=="1"){
									//有红包
									App.navigate("anymore/anymoreCtl/share",param);
								}else {
									//没有红包
									App.navigate("anymore/anymoreCtl/share1",param);
								}
								
							}else{
								Utils.alertinfo(data.errorMessage);
							}
							Client.hideWaitPanel(1);
						}});
					}
				} else {
					Client.toLogin("curView.share()");
				}
			},
	});
});