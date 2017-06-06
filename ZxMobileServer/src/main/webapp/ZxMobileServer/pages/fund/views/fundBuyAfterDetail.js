define(function (require, exports, module) {
	
	var fundBuyAfterDetailTemplate = require("text!../template/fundBuyAfterDetail.html");
	
	var FundBuyAfterDetailView = module.exports = ItemView.extend({
		
		template : fundBuyAfterDetailTemplate,
		
		events:{
			 "click #fundDetailPage" : "gotofundDetailPage",
			 "click #sale" : "gotoSale",
			 "click #buyIn" : "gotoBuyIn",
			 "click #fundTranRecord" : "fundTranRecord",
			 "click #shareBonus" : "shareBonus",
		},
		
		initialize : function(){
			this.iFundDealInfoHisList={};//买入,卖出点集合
			this.buyInparam = {};
			var pageStep1 = {
        		title:'幸福基金',
        		leftButton:{
        			name : '返回',
        			func: 'curView.goBack()'
        		}
        	};

        	Client.initPageTitle(pageStep1);
        	Client.menuOpt("0");
        	var param = App.storage.get("_parameters");
        	this.init(param);
        	
//        	$('#rule').addClass('spr');
//			$('#cnt').css('height','auto');
			
        },
        
        init : function(param) {
        	var paramT = this.JsonNvl(param, "--");//空值替换
			this.model.set(paramT);
			if(paramT.profit.indexOf("-")<0){//判涨幅颜色
				$("#profit").attr("class","fc-orange");
			}
			this.queryFundInfo();//查询iFundInfo
			
//        	this.fundHistoryNavToChat();//历史净值查询(关于曲线)
        	this.fundHisDealLocalQuery();//买入.卖出点
        	var $this=this;
			$("#monthActive").addClass("active").siblings().removeClass("active");
			$(".filter span").on("click",function(){//曲线切换
				var fundHistoryNavLists = App.storage.get("fundHistoryNavLists");
				if($(this).hasClass('active')){//防止二次点击
	     	    	   return;
	     	       }
				$(this).addClass("active").siblings().removeClass("active");
				$this.initChat(fundHistoryNavLists, "0" , $(this).attr("data-value"));
				
			});
        },
        
        JsonNvl : function(param, val) {
			var paramT = {};
			for ( var key in param) {
				if (MUI.isEmpty(param[key])) {
					paramT[key] = val;
				} else {
					paramT[key] = param[key];
				}
			}
			return paramT;
		},
        
		 queryFundInfo : function(){
			 Client.openWaitPanel("加载中...");
			 var fundCode = App.storage.get("_parameters").fundCode;	
			 var param = {
	    				taCode:"00",
	    				fundName:fundCode,
	    				fundType:"0",
	    				fundSellState:"0",
	    				resultSort:"30",
	    				turnPageBeginPos:"1",
	    				turnPageShowNum:"1000",
	    				actionFlag:""
	    		};
			 var $this=this;
	    		Ajax({url:"/fund/fundQuery",data:param,success:function(data){
		    			if(MUI.isEmpty(data.errorCode)){
		    				var icoll = data.iFundInfo;
							var kcoll = icoll[0];
							var dayRisePer=kcoll.dayRisePer;
							var fundlastnav=kcoll.fundlastnav;
							var fundlastnavdate=kcoll.fundlastnavdate;
							if(fundlastnav==""){
								$("#fundlastnav").text("--");
							}else{
								$("#fundlastnav").text(fundlastnav);
							}
							if(fundlastnavdate==""){
								$("#fundlastnavdate").text("--");
							}else{
								$("#fundlastnavdate").text(fundlastnavdate);
							}
							if(dayRisePer==""){
								$("#dayRisePer").text("--");
							}else if(dayRisePer.indexOf("-")){
								$("#dayRisePer").html('<h2 class="fc-orange">+'+dayRisePer+'</h2>');
							}else{
								$("#dayRisePer").html('<h2 class="fc-green">'+dayRisePer+'</h2>');
							}
							Client.hideWaitPanel(1);
							App.storage.set("iEFundBaseinfo",kcoll);
							
							$this.fundHistoryNavToChat();//历史净值查询(关于曲线)
		    			}else{
		    				Client.alertinfo(data.errorMessage,"提醒");
		    				Client.hideWaitPanel(1);
		    			}
		    			
	    		},
	    		error:function(){
	    			Client.hideWaitPanel(1);
	    		}
	    		});
	    	},
		
	    	
		gotoSale :function(){//卖出
			
			App.navigate("fund/fundCtl/fundSaleOut");
		},
		
		gotoBuyIn:function(){//买入
			var kcoll=App.storage.get("iEFundBaseinfo");
			App.navigate("fund/fundCtl/fundBuyIn",kcoll);
		},
		
        gotofundDetailPage:function(){//跳转基金详情页
        	var kcoll=App.storage.get("iEFundBaseinfo");
        	App.navigate("fund/fundCtl/fundDetailPage",{iEFundBaseinfo:kcoll});
		},
        
		shareBonus :function(){//修改分红方式
			var kcoll = App.storage.get("_parameters");
			App.navigate("fund/fundCtl/fundShareBonusMode",kcoll);
    	},
		
    	fundTranRecord: function(){//交易记录
    		var icoll=App.storage.get("iCustConsininfoList");
    		App.navigate("fund/fundCtl/fundTranRecord",icoll);
    	},
		
        goBack : function(){
        	App.navigate("fund/fundCtl/myFund");
    	},
    	
    	fundHistoryNavToChat : function() {// 历史净值查询(关于曲线)
			Client.openWaitPanel("加载中...");
			var fundCode = App.storage.get("_parameters").fundCode;
			var param2 = {
				fundCode : fundCode,
				turnPageBeginPos:"1",
				turnPageShowNum:"1000",
			};
			var $this = this;
			Ajax({url : "/fund/fundHistoryNavQuery",data : param2,success : function(data) {// 查询
				if (MUI.isEmpty(data.errorCode)) {
					var icoll = data.fundHistoryNavList;
					App.storage.set("fundHistoryNavLists",icoll);
					$this.initChat(icoll, "0" , 22);
					
					Client.hideWaitPanel(100);
				} else {
					Client.alertinfo(data.errorMessage, "提醒");
					Client.hideWaitPanel(1);
				}
			},error:function(){
    			Client.hideWaitPanel(1);
    		}});
		},
		
		initChat : function(fundHistoryNavLists,type,len) {//fundlastnav,AINDEXEODPRICES
			var param =App.storage.get("iEFundBaseinfo");
			if(len=="22"){
				if(param.monthRisePer==""){
					$("#gains").text("--");
				}else if (param.monthRisePer.indexOf("-")<0) {
					$("#gains").removeClass("fc-green").addClass("fc-orange");
					$("#gains").text("+"+param.monthRisePer);
				}else{
					$("#gains").removeClass("fc-orange").addClass("fc-green");
					$("#gains").text(param.monthRisePer);
				}
			}
			else if(len=="66"){
				if(param.threemonthRisePer==""){
					$("#gains").text("--");
				}else if (param.threemonthRisePer.indexOf("-")) {
					$("#gains").removeClass("fc-green").addClass("fc-orange");
					$("#gains").text("+"+param.threemonthRisePer);
				}else{
					$("#gains").removeClass("fc-orange").addClass("fc-green");
					$("#gains").text(param.threemonthRisePer);
				}
			}else if(len=="132"){
				if(param.halfyearRisePer==""){
					$("#gains").text("--");
				}else if (param.halfyearRisePer.indexOf("-")) {
					$("#gains").removeClass("fc-green").addClass("fc-orange");
					$("#gains").text("+"+param.halfyearRisePer);
				}else{
					$("#gains").removeClass("fc-orange").addClass("fc-green");
					$("#gains").text(param.halfyearRisePer);
				}
			}else if(len=="264"){
				if(param.yearRisePer==""){
					$("#gains").text("--");
				}else if (param.yearRisePer.indexOf("-")) {
					$("#gains").removeClass("fc-green").addClass("fc-orange");
					$("#gains").text("+"+param.yearRisePer);
				}else{
					$("#gains").removeClass("fc-orange").addClass("fc-green");
					$("#gains").text(param.yearRisePer);
				}
			}
			var fundHistoryNavLists1=[];
			for (var i = 0; i < fundHistoryNavLists.length;i++) {
				if(fundHistoryNavLists[i].fundtotalnav=="" ||fundHistoryNavLists[i].AINDEXEODPRICES==""){//累计净值和沪深300指数为空删除 
					continue;
				}
				fundHistoryNavLists1.push(fundHistoryNavLists[i]);
			}
			var fundHistoryNavLists2 = fundHistoryNavLists1.slice(0,len);
			fundHistoryNavLists2.sort(
					function(a,b){
						if(a.fundlastnavdate<b.fundlastnavdate) return -1;
						if(a.fundlastnavdate>b.fundlastnavdate) return 1;
						return 0;
					}
			);
			if(fundHistoryNavLists2.length!=0){
				var csi=Utils.toRetentionDigit(fundHistoryNavLists2[fundHistoryNavLists2.length-1].AINDEXEODPRICES,2);
				$("#csi").text(csi);
			}else{
				$("#csi").text("--");
			}
			
			var dateArr = [], csiArr = [], fundlastnavArr = [], sortArr = [];
			var buyPointArr=[],dataArr2=[],buyPointTochatArr=[];
			
			var j=0;
			var csi = "";//沪深300指数
			var icoll=this.iFundDealInfoHisList;
			for (var a = 0; a < fundHistoryNavLists2.length;) {
				var fundlastnavdate ="";
				var fundtotalnav="";
				var date ="";
				
				if(len=='22'){
					dataArr2=this.chatType(fundHistoryNavLists2,a,1,'22',icoll);
					a=a+1;
				}else if(len=='66'){
						dataArr2=this.chatType(fundHistoryNavLists2,a,3,'66',icoll);
						a=a+3;
				}else if(len=='132'){
						dataArr2=this.chatType(fundHistoryNavLists2,a,4,'132',icoll);
						a=a+4;
				}else if(len=='264'){
						dataArr2=this.chatType(fundHistoryNavLists2,a,6,'264',icoll);
						a=a+6;
				}
				dataArr2.sort(
						function(a,b){
							if(a.fundlastnavdate<b.fundlastnavdate) return -1;
							if(a.fundlastnavdate>b.fundlastnavdate) return 1;
							return 0;
						}
				);
				for(var i=0;i<dataArr2.length;i++){//对新数组取值
					if(dataArr2[i].hasOwnProperty("buyFlag")){
						buyPointArr.push(dataArr2[i]);
					}
					csi = dataArr2[i].AINDEXEODPRICES;
					fundtotalnav =dataArr2[i].fundtotalnav;
					fundlastnavdate = dataArr2[i].fundlastnavdate;
					date = Utils.formatDate(fundlastnavdate,'yyyy-MM-dd','MM-dd');
					dateArr.push(date);
					csiArr.push(csi);
					fundlastnavArr.push(fundtotalnav);
				}
				dataArr1=[];
				dataArr2=[];
			}
			var length = fundlastnavArr.length;
			fundlastnavArr.splice(0,(length%7==0?7:length%7)-1);
			csiArr.splice(0,(length%7==0?7:length%7)-1);
			dateArr.splice(0,(length%7==0?7:length%7)-1);
			var csiBegin="";
			var fundlastnavBegin="";
			if(j==0){//取数组第一个值
				csiBegin=csiArr[0];
				fundlastnavBegin = fundlastnavArr[0];
				j++;
			} 
			for(var i=0;i<csiArr.length;i++){//对数组数值格式处理
				csi=(parseFloat(csiArr[i])-parseFloat(csiBegin))/parseFloat(csiBegin);
				csi =Utils.toRetentionDigit(csi*100,2);
				csiArr[i]=csi;
				sortArr.push(csi);
			}
			for(var i=0;i<fundlastnavArr.length;i++){
				fundtotalnav=(parseFloat(fundlastnavArr[i])-parseFloat(fundlastnavBegin))/parseFloat(fundlastnavBegin);
				fundtotalnav=Utils.toRetentionDigit(fundtotalnav*100,2);
				fundlastnavArr[i]=fundtotalnav;
				sortArr.push(fundtotalnav);
			}
			var isLogon = Utils.checkSession();
			if (isLogon) {//判登录 
				var icoll=this.iFundDealInfoHisList;
				var repeat=false;
				for(var i=0;i<icoll.length;i++){
					var kcoll=icoll[i];
					var fundCode=kcoll.fundCode;
					if(fundCode==App.storage.get("_parameters").fundCode){//筛选非本基金的买入卖出点
						repeat=true;
						break;
					}
					
				}
				if(repeat){
					for(var len=0;len<buyPointArr.length;len++){
						var transDate=buyPointArr[len].fundlastnavdate;
						transDate = Utils.formatDate(transDate,'yyyy-MM-dd','MM-dd');
						var index=0;
						for(var j=0;j<dateArr.length;j++){
							if(dateArr[j]==transDate){
								index=j;
							}
						}
						var buyPoint={};
						buyPoint.name="买入点";
						buyPoint.value="";
						buyPoint.xAxis=transDate;
						buyPoint.yAxis=fundlastnavArr[index];
						buyPointTochatArr.push(buyPoint);//显示买入,卖出点
						
					}
				}
//				alert(JSON.stringify(buyPointTochatArr));
			}
			sortArr.sort(function(a, b) {
				return a - b;
			});
			var max = parseFloat(sortArr[sortArr.length - 1]);
			var min = parseFloat(sortArr[0]);
			// 初始化图表
			echarts.init(document.getElementById('linechart')).setOption(
					{
						grid : {
							x : 58,//左上角横坐标
							y : 5,
							x2 : 15,//右下角横坐标
							y2 : 30,
							borderWidth : 0
						},
						tooltip : {
							trigger : 'item',
							formatter : "{a}"
						},
						calculable : false,
						xAxis : [ {
							type : 'category',
							axisLine : {
								show: false,
								lineStyle : {
									width : 1,
									color : 'rgba(0,0,0,0)'
								}
							},
							splitLine : {
								lineStyle : {
									type : 'dotted',
									color : '#d6d5dc'
								},
							},
							axisTick : {
								show : false
							},
							axisLabel : {
								textStyle : {
									color : '#979797'
								},
								interval:Math.ceil((dateArr.length - 1)/7)-1,
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
									return val.toFixed(2)+"%";
								},
							},
						} ],
						series : [ 
							{
								name : '买入',
								type : 'line',
								symbol : 'none',
								itemStyle : {
									normal : {
										color : '#f3a2ee',
										lineStyle : {
											width : 2,
											color : '#f3a2ee'
										}
									}
								},
								markPoint:{
									symbol : 'circle',
									symbolSize :1.5,
									itemStyle : {
										normal : {
											color : '#ff6c00',
										}
									},
									data :buyPointTochatArr
								},
								data :fundlastnavArr
							},
						   {
								name : '成交',
								type : 'line',
								symbol : 'none',
								itemStyle : {
									normal : {
										color : '#0094e8',
										lineStyle : {
											width : 1,
											color : '#0094e8'
										}
									}
								},
								data :csiArr
						   }
							 ]
					});
			Client.hideWaitPanel(1);
		},
		
		chatType : function(fundHistoryNavLists2,a,arrLength,len,icoll){//曲线抽点
			var dataArr1=[],dataArr2=[];
			for(var b=0;b<arrLength;b++,a++){//分成固定长度(3,4,6)数组
				if(a>=fundHistoryNavLists2.length)
					break;
				dataArr1.push(fundHistoryNavLists2[a]);
			}
			if(len=='22'){
				var isLogon = Utils.checkSession();
				if (isLogon) {//判登录,筛选买入点
					for(var i=0;i<icoll.length;i++){
						var kcoll=icoll[i];
						var transDate=Utils.formatDate(kcoll.cfmDate,'yyyyMMdd','yyyy-MM-dd');
						var busiName=kcoll.busiName;
						for(var j=0;j<dataArr1.length;j++){
							if(dataArr1[j].fundlastnavdate==transDate){
								if(busiName=="申购"){
									dataArr1[j].buyFlag="0";
								}
							}
						}
					}
				}
				dataArr2=dataArr1;
			}else{
					dataArr2.push(dataArr1[dataArr1.length-1]);
					if(dataArr1.length!=1){
						dataArr1.sort(//根据累计净值排序
								function(a,b){
									if(a.fundtotalnav<b.fundtotalnav) return-1;
									if(a.fundtotalnav>b.fundtotalnav) return 1;
									return 0;
								}
						);
						if(dataArr1[0].fundlastnavdate!=dataArr2[dataArr2.length-1].fundlastnavdate){
							dataArr2.unshift(dataArr1[0]);//取最值放入新数组
						}
						if(dataArr1[dataArr1.length-1].fundlastnavdate!=dataArr2[dataArr2.length-1].fundlastnavdate){
							dataArr2.unshift(dataArr1[dataArr1.length-1]);//取最值放入新数组
						}
						var isLogon = Utils.checkSession();
						if (isLogon) {//判登录,筛选买入点
							for(var i=0;i<icoll.length;i++){
								var kcoll=icoll[i];
								var transDate=Utils.formatDate(kcoll.cfmDate,'yyyyMMdd','yyyy-MM-dd');
								var busiName=kcoll.busiName;
								for(var j=0;j<dataArr1.length;j++){
									if(dataArr1[j].fundlastnavdate==transDate){
										if(busiName=="申购"){
											dataArr1[j].buyFlag="0";
										}
									}
								}
							}
						}
						for(var len=0;len<dataArr1.length;len++){
							if(dataArr1[len].hasOwnProperty("buyFlag")){
								dataArr2.push(dataArr1[len]);
							}
						}
						var new_arr=[];
						for(var i=0;i<dataArr2.length;i++){//数据去重
							var repeat=false;
							for(var j=0;j<new_arr.length;j++){
								if(dataArr2[i].fundlastnavdate==new_arr[j].fundlastnavdate ){
									repeat=true;
									break;
								}
							}
							if(!repeat){
								new_arr.push(dataArr2[i]);
							}
						}
						dataArr2=new_arr;
					}
			}
			return dataArr2;
		},
		
		fundHisDealLocalQuery: function(){
			Client.openWaitPanel("加载中...");
			var cardNo =Utils.getEleCard().cardNo;
			var fundCode=App.storage.get("_parameters").fundCode;
        	var beginDate =Utils.getDifferentMonth(-24,"yyyyMMdd");
        	var endDate =Utils.getServerDate("yyyyMMdd");
    		var $this=this;
        	var param2 = {
    				cardNo:cardNo,
    				beginDate:beginDate,
    				endDate:endDate,
    				fundCode:fundCode,
    				TACode:"",
    				turnPageBeginPos:"1",
    				turnPageShowNum:"1000",
    		};
    		Ajax({url:"/fund/fundHisDealLocalQuery",data:param2, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var icoll = data.iFundDealInfo;
    				$this.iFundDealInfoHisList=icoll;
//    				$this.fundHistoryNavToChat();//在登录情况下,先查询出买入,卖出点再加载曲线
    				Client.hideWaitPanel(1);
    			}else{
    				Client.alertinfo(data.errorMessage,"提醒");
    				Client.hideWaitPanel(1);
    			}
    		}});
        },
    	
	});
});