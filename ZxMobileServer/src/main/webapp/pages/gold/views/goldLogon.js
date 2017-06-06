define(function(require, exports, module){
	
	var goldLogonTpl = require("text!../template/goldLogon.html");
	
	var goldLogonView = module.exports = ItemView.extend({
		
		events : {
			"click #back" : "goBack",
			"click #buy" : "buy",
			"click #payback" : "payback",
			"click #goldGuide" : "goldGuide",
			"click #buyList" : "tobuyList",
			"click #saleList" : "tosaleList",
			"click #goldRecods" :  "goldRecods"
		},
		
		template : goldLogonTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			
			var $this = this;
			
			if(!Utils.checkBoseFinance("2")){
				$("#payback").hide();
			}
			
			$(".filter span").on("click",function(){
				var iBoseraFundPrice = App.storage.get("iBoseraFundPrice");
				$(this).addClass("active").siblings().removeClass("active");
				$this.initChat(iBoseraFundPrice, "0" , $(this).attr("data-value"));
			});
			
			var iBoseraFundPrice = App.storage.get("iBoseraFundPrice");
			if(iBoseraFundPrice){
				this.initChat(iBoseraFundPrice, "0" , '22');
			}else{
				this.boseraFundPrice();
			}
			
			var boseGold = App.storage.get("boseGold");
			if (boseGold) {
				this.showData(boseGold);
			} else {
				this.initGold();
			}
			
			var iGoldIncome = App.storage.get("iGoldIncome");
			if (iGoldIncome) {
				this.showIncome(iGoldIncome);
				this.income = true;
				this.qryHideWait();
			} else {
				this.queryIcome();
			}
			
			if(Utils.checkBoseFinance("2")){
				this.queryRecods();
			}
			
			var tabPointPage = $('.tabPoint >div');
			$('.fudDetail .tab .cell').on('click', function() {
				var idx = tabPointPage.eq($(this).index());
				$(this).addClass('active').siblings().removeClass('active');
				idx.show().siblings().hide();
			});
			
			$('.director .list-item').on('click', function(){
				var me = $(this), 
			    cnt = me.next(), 
			    setH = cnt.find('.para').get(0).offsetHeight,
				offsetTop = me.offset().top;
				setTimeout(function(){
					window.scrollTo(0, offsetTop);
				},200);
				me.hasClass('spr') ? 
				me.removeClass('spr') && cnt.css('height',0) : 
				me.addClass('spr') && cnt.css('height',setH);
				me.parent().siblings().find(".list-item").hasClass('spr') ? me.parent().siblings().find(".list-item").removeClass('spr')
						&& me.parent().siblings().find(".list-item").next().css('height', 0) : null;
			});
			
			$('.list.coin .list-item').off().on('click',function() {
				App.navigate("gold/goldCtl/goldDetail");						
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
						goldDone = true;
						var iCommonFundList = data.iCommonFundList;
						$.each(iCommonFundList,function(index,boseGold){
							if(boseGold.productId == Utils.getParamDisplay("PB_BOSERA",'3')){
								App.storage.set("boseGold", boseGold);
								$this.showData(boseGold);
							}
						});
					}
					Client.hideWaitPanel(1);
				}
			});
		},
		
		queryIcome : function(){
			var $this = this;
			var param = {
					productId:Utils.getParamDisplay("PB_BOSERA",'3'),
					cardNo : Utils.trim(Utils.getEleCard().cardNo)
			};
			Ajax({url:"/bosera/boseraGoldShareQuery",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						var iShareList = data.iShareList;
						var iGoldIncome = "";
						$.each(iShareList,function(i,ishare){
							if(ishare.productId == Utils.getParamDisplay("PB_BOSERA",'3')){
								iGoldIncome = ishare;
								return false;
							}
						});
						iGoldIncome = iGoldIncome || {totalVol:0.00,financeUseVol:0.00,yesterdayIncome:0.00,accumulateIncome:0.00};
						App.storage.set("iGoldIncome",iGoldIncome);
						$this.showIncome(iGoldIncome);
	    			}
					$this.income = true;
					$this.qryHideWait();
			}});
		},
		
		showData : function(boseGold){
			if(!boseGold){
				return;
			}
			
			$.each(boseGold,function(key,value){
				if(key == "fundlastnav"){
					$("."+key).text(Utils.formatCurrency(value*100 , 2));
				}else{
					if(key!='goldPrice') value = value*100;
					$("#"+key).text(((value < 0||key=='goldPrice')?"":"+")+Utils.formatCurrency(value || "0.00",2));
					if(value < 0){
						$("#"+key).parents(".fc-orange").removeClass("fc-orange").addClass("fc-green");
					}
				}
			});
		},
		
		showIncome:function(iGoldIncome){
			if(!iGoldIncome){
				return;
			}
			var fundlastnav =App.storage.get("boseGold").fundlastnav;
			$("#kg").text((iGoldIncome.totalVol/100).toFixed(4));
			$("#amount").text((iGoldIncome.totalVol*fundlastnav).toFixed(2));
			$("#yesterdayIncome").text(parseFloat(iGoldIncome.yesterdayIncome).toFixed(2));
			$("#accumulateIncome").text(parseFloat(iGoldIncome.accumulateIncome).toFixed(2));
		},
		
		queryRecods : function() {
			var param = {
					productId : Utils.getParamDisplay("PB_BOSERA", '3'),
					cardNo : Utils.getEleCard().cardNo,
					startTime : Utils.toDateString(new Date(new Date().getTime()-31536000000),"yyyyMMdd"),
					endTime : Utils.toDateString(new Date(),"yyyyMMdd")
			};
			Ajax({
				url : "/bosera/boseraGoldDetailQuery",
				data : param,
				success : function(data) {
					if (MUI.isEmpty(data.errorCode)) {
						var buy=0,sale=0;
						$.each(data.iBoseraGolgDetail,function(i,item){
							if(item.state=="0"){
								item.financeType=="0"&&(buy+=1);
								item.financeType=="1"&&(sale+=1);
							}
						});
						$("#bNum").text(buy);
						$("#sNum").text(sale);
					} else {
						Utils.alertinfo(data.errorMessage);
					}
				}
			});
		},
		
		boseraFundPrice : function() {
			var param = {
					productId : Utils.getParamDisplay("PB_BOSERA", '3')
			};
			var $this = this;
			Ajax({
				url : "/bosera/boseraFundPrice",
				data : param,
				success : function(data) {
					if (MUI.isEmpty(data.errorCode)) {

						var iBoseraFundPrice = data.iBoseraFundPrice;
						App.storage.set("iBoseraFundPrice", iBoseraFundPrice);

						$this.initChat(iBoseraFundPrice, "0" , '22');
						
					} else {
						Utils.alertinfo(data.errorMessage);
					}
				}
			});
		},
    	
    	initChat : function(iBoseraFundPrice,type,len) {
			iBoseraFundPrice = iBoseraFundPrice.slice(0,len);
			var dateArr = [], fundlastnavArr = [], goldPriceArr = [], sortArr = [],$this=this;
			for (var a = 0; a < iBoseraFundPrice.length; a++) {
				if(a%3 != 0){
					continue;
				}
				var kColl = iBoseraFundPrice[a];
				var fundlastnav = Utils.toRetentionDigit(kColl.fundlastnav*100, 2);
				var startDate = kColl.startDate;
				var goldPrice = Utils.toRetentionDigit(kColl.goldPrice,2);
				var date = startDate.substr(4, 2) + "-"
						+ startDate.substr(6, 2);
				dateArr.unshift(date);
				fundlastnavArr.unshift(fundlastnav);
				goldPriceArr.unshift(goldPrice);
				sortArr.push(fundlastnav);
				sortArr.push(goldPrice);
			}
			var length = fundlastnavArr.length;
			goldPriceArr.splice(0,(length%7==0?7:length%7)-1);
			fundlastnavArr.splice(0,(length%7==0?7:length%7)-1);
			dateArr.splice(0,(length%7==0?7:length%7)-1);
			sortArr.sort(function(a, b) {
				return a - b;
			});
			var distans = ((sortArr[sortArr.length - 1] - sortArr[0]) / 2) || (sortArr[sortArr.length - 1]/2);
			var max = (parseFloat(sortArr[sortArr.length - 1]) + parseFloat(distans))
					.toFixed(2);
			var min = (parseFloat(sortArr[0]) - parseFloat(distans))
					.toFixed(2);
			min = min<0?0:min;
			// 初始化图表
			echarts.init(document.getElementById('linechart')).setOption(
					{
						grid : {
							x : 40,
							y : 5,
							x2 : 15,
							y2 : 30,
							borderWidth : 0
						},
						tooltip : {
							trigger : 'item',
							formatter : "{b}: {c}"
						},
						calculable : false,
						xAxis : [ {
							type : 'category',
							axisLine : {
								lineStyle : {
									width : 1,
									color : '#d6d5dc'
								}
							},
							splitLine : {
								lineStyle : {
									type : 'dotted',
									color : '#d6d5dc'
								}
							},
							axisTick : {
								show : false
							},
							axisLabel : {
								interval: (dateArr.length - 1)/7-1,
								textStyle : {
									color : '#979797'
								}
							},
							boundaryGap : false,
							data :dateArr
						} ],
						yAxis : [ {
							type : 'value',
							max : max,
							min : min,
							scale : true,
							axisLine : {
								lineStyle : {
									width : 1,
									color : '#d6d5dc'
								}
							},
							splitLine : {
								lineStyle : {
									type : 'dotted',
									color : '#d6d5dc'
								}
							},
							axisTick : {
								show : false
							},
							axisLabel : {
								textStyle : {
									color : '#979797'
								},
								formatter : function(data) {
									var val = Math
									.round(data * 1000) / 1000;
									return val.toFixed(1);
								}
							},
						} ],
						series : [ {
							name : '成交',
							type : 'line',
							symbol : 'emptyCircle',
							symbolSize : 2,
							itemStyle : {
								normal : {
									color : '#0094e8',
									lineStyle : {
										width : 1,
										color : '#0094e8'
									}
								}
							},
							data :  goldPriceArr
						}, {
							name : '成交',
							type : 'line',
							symbol : 'emptyCircle',
							symbolSize : 2,
							itemStyle : {
								normal : {
									color : '#ff6c00',
									lineStyle : {
										width : 1,
										color : '#ff6c00'
									}
								}
							},
							data : fundlastnavArr,
						} ]
					});
			
			this.chat = true;
			this.qryHideWait();
		},
		
		caculateX : function(len){
			switch(len){
				case '22':
					return '0';
					break;
				case '66':
					return '2';
					break;
				case '132':
					return '5';
					break;
				case '264':
					return '11';
					break;
			}
		},
		
		buy : function(){
			var state = App.storage.get("goldState");
			var $this = this;
			if(state){
				$this.gotoBuy(state);
			}else{
				Client.openWaitPanel(1);
				if(!Utils.checkBoseFinance("2")){
					$this.gotoBuy();
				}else{
					var param = {
							productId:Utils.getParamDisplay("PB_BOSERA",'3'),
							cardNo : Utils.trim(Utils.getEleCard().cardNo)
					};
					Ajax({
						url : "/bosera/riskRankCheck",
						data : param,
						success : function(data) {
							if (MUI.isEmpty(data.errorCode)) {
								App.storage.set("goldState",data.state);
								$this.gotoBuy(data.state);
							} else {
								Utils.alertinfo(data.errorMessage);
								App.navigate("gold/goldCtl/goldRisk");
							}
						}
					});
				}
			}
		},
		
		gotoBuy : function(state){
			if(state == "0" && Utils.checkBoseFinance("2")){
				App.navigate("gold/goldCtl/goldBuy");
			}else{
				var goldSign = App.storage.get("goldSign");
				if(Utils.checkBoseFinance("2") && goldSign && goldSign.riskLevel>0){
					Client.alertinfo("当前产品超过了您的风险承受能力！您确定要买入吗？","提示","App.navigate('gold/goldCtl/goldBuy')",true);
					Client.hideWaitPanel(1);
					return;
				}
				App.navigate("gold/goldCtl/goldRisk");
			}
		},
		
		goldRecods : function(){
			App.navigate("gold/goldCtl/goldRecods");
		},
		
		payback : function(){
			App.navigate("gold/goldCtl/goldSale");
		},
		
		goldGuide : function(){
			App.navigate("gold/goldCtl/goldGuide");
		},
		
		goBack : function(){
			App.back();
		},
		
		refresh:function(){
			this.opt.type = "1";
    		App.storage.remove("iGoldIncome");
    		App.storage.remove("balanceInfo");
    		this.initialize();
		},
		
		toDetail : function(){
			App.navigate("gold/goldCtl/gold");
		},
		
		tobuyList : function(){
			App.navigate("gold/goldCtl/goldRecods?type=0");
		},
		
		tosaleList : function(){
			App.navigate("gold/goldCtl/goldRecods?type=1");
		},
		
		qryHideWait: function(){
			if(this.income&&this.chat){
				if(!this.opt){
					this.opt = {
							callback:"curView.refresh()"
					};
				}
				Client.dragRefresh(this.opt);
				Client.hideWaitPanel(1);
			}
		}
	});
});
