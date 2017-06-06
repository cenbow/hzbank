define(function(require, exports, module) {

	var fundDetailTemplate = require("text!../template/fundDetaill.html");
	var FundDetailInfoView = module.exports = ItemView.extend({

			template : fundDetailTemplate,

			events : {
				"click #buyBtn" : "gotoBuy",
				"click #fundDetailPage" : "gotofundDetailPage",
				"click #optional" : "Optional",
				"click #fundDirect" : "gotofundDirect",
				"click #gotoNavList" : "gotoNavList",
				"click #invest" : "gotoInvest"
			},

			initialize : function() {
				this.btnFlag="0";//区分买入和定投的标志
				this.iFundDealInfoHisList={};//买入,卖出点集合
				var $this = this;
				var pageStep1 = {
					title : "幸福基金",
					leftButton : {
						name : '返回',
						func : 'curView.goBack()'
					}

				};

				Client.initPageTitle(pageStep1);
				Client.menuOpt("0");
				var param =App.storage.get("_parameters").iEFundBaseinfo;
				this.init(param);

				// 业绩表现和历史净值切换
				var pgns = $('.pgn .table');
				$('.fudDetail .tab .cell').on('click',function() {
					if($(this).hasClass('active')){//防止二次点击
		     	    	   return;
		     	       }
					$(this).addClass('active').siblings()
							.removeClass('active');
					var cur = pgns.eq($(this).index());
					cur.show().siblings().hide();
					if ($(this).text() == "历史净值") {
		        		$this.fundHistoryNavQuery();//历史净值查询
					}
				});
				// 交易规则等样式
				$('.director .list-item').on('click',function() {
						var me = $(this), cnt = me.next(), setH = cnt
								.find('.para').get(0).offsetHeight, offsetTop = me
								.offset().top - 1;
						me.hasClass('spr') ? me.removeClass('spr') && cnt.css('height', 0) : me.addClass('spr')	&& cnt.css('height', setH);
						me.parent().siblings().find(".list-item").hasClass('spr') ? me.parent().siblings().find(".list-item").removeClass('spr')
								&& me.parent().siblings().find(".list-item").next().css('height', 0) : null;

						setTimeout(function() {
							window.scrollTo(0, offsetTop);
						}, 200);
				});
				
			    $("#monthActive").addClass("active").siblings().removeClass("active");
				$(".filter span").on("click",function(){//曲线切换
					var fundHistoryNavLists = App.storage.get("fundHistoryNavLists");
					if($(this).hasClass('active')){//防止二次点击
		     	    	   return;
		     	       }
					$(this).addClass("active").siblings().removeClass("active");
					$this.initChat(fundHistoryNavLists, "0" , $(this).attr("data-value"));
					
				});
				
				var isLogon = Utils.checkSession();
				if (!isLogon) {//判登录 显示按钮文本
					$("#optional").text("加自选");
					this.fundHistoryNavToChat();
					Client.hideWaitPanel(1);
				}else{
					$("#optional").text("加自选");
					this.OptionalQuery();//自选查询
					this.fundHisDealLocalQuery();//买入.卖出点
				}
				
				
			},

			init : function(param) {
				var paramT = this.JsonNvl1(param, "--");// 空值替换
				this.model.set(paramT);
				
				
				var avgreturnWeek = param.avgreturnWeek;
				var monthRisePer = param.monthRisePer;
				var threemonthRisePer = param.threemonthRisePer;
				var halfyearRisePer =param.halfyearRisePer;
				var yearRisePer =param.yearRisePer;
				var avgreturnThreeYear = param.avgreturnThreeYear;
				var avgreturnThisYear = param.avgreturnThisYear;
				var dayRisePer=param.dayRisePer;
				
				
				if(avgreturnWeek==""){
					$("#week").text("--");
				}else if (avgreturnWeek.indexOf("-") < 0) {// 判涨幅颜色
					$("#week").attr("class", "fc-orange");
					$("#week").text("+"+Utils.toRetentionDigit(avgreturnWeek,2)+"%");
				}else{
					$("#week").attr("class", "fc-green");
					$("#week").text(Utils.toRetentionDigit(avgreturnWeek,2)+"%");
				}
				if(monthRisePer==""){
					$("#month").text("--");
				}else if (monthRisePer.indexOf("-") < 0) {
					$("#month").attr("class", "fc-orange");
					$("#month").text("+"+monthRisePer);
				}
				if(threemonthRisePer==""){
					$("#threeMonth").text("--");
				}else if (threemonthRisePer.indexOf("-") < 0) {
					$("#threeMonth").attr("class", "fc-orange");
					$("#threeMonth").text("+"+threemonthRisePer);
				}
				if(halfyearRisePer==""){
					$("#halfYear").text("--");
				}else if (halfyearRisePer.indexOf("-") < 0) {
					$("#halfYear").attr("class", "fc-orange");
					$("#halfYear").text("+"+halfyearRisePer);
				}
				if(yearRisePer==""){
					$("#year").text("--");
				}else if (yearRisePer.indexOf("-") < 0) {
					$("#year").attr("class", "fc-orange");
					$("#year").text("+"+yearRisePer);
				}
				if(avgreturnThreeYear==""){
					$("#threeYear").text("--");
				}else if (avgreturnThreeYear.indexOf("-") < 0) {
					$("#threeYear").attr("class", "fc-orange");
					$("#threeYear").text("+"+Utils.toRetentionDigit(avgreturnThreeYear,2)+"%");
				}else{
					$("#threeYear").attr("class", "fc-green");
					$("#threeYear").text(Utils.toRetentionDigit(avgreturnThreeYear,2)+"%");
				}
				if(avgreturnThisYear==""){
					$("#thisYear").text("--");
				}else if (avgreturnThisYear.indexOf("-") < 0) {
					$("#thisYear").attr("class", "fc-orange");
					$("#thisYear").text("+"+Utils.toRetentionDigit(avgreturnThisYear,2)+"%");
				}else{
					$("#thisYear").attr("class", "fc-green");
					$("#thisYear").text(Utils.toRetentionDigit(avgreturnThisYear,2)+"%");
				}
				
				if (param.fundlastnav=="") {
//					$("#buyBtn").addClass('disabled').attr('disabled',true);
					$("#buyBtn").removeClass('white').addClass('disabled').attr('disabled',true);
				}
				
				if(dayRisePer==""){
					$("#dayRisePer").text("--");
				}else if(dayRisePer.indexOf("-")){
					$("#dayRisePer").html('<h2 class="ft32 fc-orange">+'+dayRisePer+'</h2>');
				}else{
					$("#dayRisePer").html('<h2 class="ft32 fc-green">'+dayRisePer+'</h2>');
				}
				
				if(param.fundlastnavdate==""){
					$("#fundlastnavdate").text("--");
				}else{
					$("#fundlastnavdate").text(param.fundlastnavdate.substring(5,10));
				}
				
				
				
			},

			JsonNvl1 : function(param, val) {
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

			gotoBuy : function() {//买入
				this.btnFlag="0";
				var isLogon = Utils.checkSession();
				if (!isLogon) {
					App.storage.set("_parameters2", "1");
					Client.toLogin("curView.gotoBuy()");
				} else {
					if (Utils.checkRealUser()) {
						var kcoll = App.storage.get("_parameters").iEFundBaseinfo;
						this.signFundQuery(kcoll);
					}else{
						Client.hideWaitPanel(1);
					}
				}
			},

			gotoInvest : function() {//定投
				this.btnFlag="1";
				var isLogon = Utils.checkSession();
				if (!isLogon) {
					App.storage.set("_parameters2", "1");
					Client.toLogin("curView.gotoInvest()");
				} else {
					if (Utils.checkRealUser()) {
						var kcoll = App.storage.get("_parameters").iEFundBaseinfo;
						this.signFundQuery(kcoll);
					}else{
						Client.hideWaitPanel(1);
					}
				}
			},

			signFundQuery : function(kcoll) {// 基金测评,签约,购买,定投
				$("#buyBtn").removeClass('white').addClass('disabled').attr('disabled',true);
				$("#optional").removeClass('white').addClass('disabled').attr('disabled',true);
				$("#invest").addClass('disabled').attr('disabled',true);
				if (!Utils.checkActivate()) {// 检查账户是否实名已激活
					return;
				}
				var cardNo = Utils.trim(Utils.getCardNoByFlag("0","cardFlag1"));
				var accountType = Utils.trim(Utils.getCardTypeByFlag("0","cardFlag1"));
				if (MUI.isEmpty(cardNo)) {
					kcoll.isFundSign = "0";// 去签约
					kcoll.btnFlag = this.btnFlag;
					App.storage.set("iEFundBaseinfo",kcoll);
					App.navigate("fund/fundCtl/fundRiskReq", {iEFundBaseinfo:kcoll});// 先评测后签约
					return;
				}

				var param1 = {
					cardNo : cardNo,
					accountType : accountType
				};
				var $this = this;
				Client.openWaitPanel("加载中");
				Ajax({url : "/fund/custRiskLevelQuery",data : param1,success : function(data) {// 客户基金风险等级查询
					if (MUI.isEmpty(data.errorCode)) {
						var param2 = {
							TACode : kcoll.TACode,
							cardNo : cardNo,
							fundCode : kcoll.fundCode
						};
						Ajax({url : "/fund/fundQueryRisk",data : param2,success : function(data) {// 基金产品风险等级查询
							if (MUI.isEmpty(data.errorCode)) {
								App.storage.set("iEFundBaseinfo",kcoll);
								if($this.btnFlag=="0"){
									App.navigate("fund/fundCtl/fundBuyIn",{iEFundBaseinfo:kcoll});
								}else if($this.btnFlag=="1"){
									App.navigate("fund/fundCtl/fundTimeInvest",{iEFundBaseinfo:kcoll});
								}
							} else {
								if (data.errorCode == '2005') {
									if($this.btnFlag=="0"){
										Client.alertinfo("当前基金超过了您的风险承受能力!您确定要买入吗?","提示","curView.toBuy()",true,"curView.Cancel()");
									}else if($this.btnFlag=="1"){
										Client.alertinfo("当前基金超过了您的风险承受能力!您确定要定投吗?","提示","curView.toInvest()",true,"curView.Cancel()");
									}
									Client.hideWaitPanel(1);
								} else if (data.errorCode == '2006'|| data.errorCode == '2035') {
									kcoll.isFundSign = "1";// 评测
									kcoll.btnFlag = $this.btnFlag;
									App.storage.set("iEFundBaseinfo",kcoll);
									App.navigate("fund/fundCtl/fundRiskReq",{iEFundBaseinfo:kcoll});// 直接评测
								} else {
									Client.alertinfo(data.errorMessage,"提醒");
									$this.Cancel();
									Client.hideWaitPanel(1);
								}
							}
						},
						error:function(){
							$this.Cancel();
			    			Client.hideWaitPanel(1);
			    		}
						});
				} else if (data.errorCode == '-89008') {
						kcoll.isFundSign = "1";// 评测
						kcoll.btnFlag = this.btnFlag;
						App.storage.set("iEFundBaseinfo",kcoll);
						App.navigate("fund/fundCtl/fundRiskReq", {iEFundBaseinfo:kcoll});// 基金评测
					} else {
						Client.alertinfo(data.errorMessage, "提醒");
						$this.Cancel();
						Client.hideWaitPanel(1);
					}
			},error:function(){
				$this.Cancel();
    			Client.hideWaitPanel(1);
    		}
				});

		},

		toBuy:function(){
			var kcoll = App.storage.get("_parameters").iEFundBaseinfo;
			App.storage.set("iEFundBaseinfo",kcoll);
			App.navigate("fund/fundCtl/fundBuyIn",{iEFundBaseinfo:kcoll});
		},
		
		toInvest:function(){
			var kcoll = App.storage.get("_parameters").iEFundBaseinfo;
			App.storage.set("iEFundBaseinfo",kcoll);
			App.navigate("fund/fundCtl/fundTimeInvest",{iEFundBaseinfo:kcoll});
		},
		
			gotofundDetailPage : function() {// 跳转基金详情页
				App.navigate("fund/fundCtl/fundDetailPage");
			},

			gotofundDirect : function() {// 跳转基金新手指南
				App.navigate("fund/fundCtl/fundDirect");
			},
			
			gotoNavList : function() {// 跳转历史净值列表
				App.navigate("fund/fundCtl/fundHistoryNavList");
			},
			
			goBack : function() {
				App.back();
			},

			Optional : function() {// 自选
				var isLogon = Utils.checkSession();
				if (!isLogon) {
					Client.menuOpt("0");
					App.storage.set("_parameters2", "1");
					Client.toLogin("curView.initialize()");
				} else {
					Client.hideWaitPanel(1);
					$("#optional").removeClass('white').addClass('disabled').attr('disabled',true);
					$("#buyBtn").removeClass('white').addClass('disabled').attr('disabled',true);
					$("#invest").addClass('disabled').attr('disabled',true);
					var fundName = App.storage.get("_parameters").iEFundBaseinfo.fundName;
					var optionalText =$("#optional").text();
					if(optionalText=="加自选"){
						this.OptionalAdd();
					}else if(optionalText=="删自选"){
						Client.alertinfo("确认删除" + fundName + "?","提示","curView.OptionalDelete()",true,"curView.Cancel()");
						
					}
				}
			},

			Cancel:function(){
				$("#optional").addClass('white').removeClass('disabled').removeAttr('disabled');
				$("#invest").removeClass('disabled').removeAttr('disabled');
				if(App.storage.get("_parameters").iEFundBaseinfo.fundlastnav==""){
					Client.hideWaitPanel(1);
					return;
				}
				$("#buyBtn").addClass('white').removeClass('disabled').removeAttr('disabled');
			},
			
			OptionalAdd : function() {//加自选
				Client.openWaitPanel("加载中");
				var $this =this;
				var cardNo =Utils.getEleCard().cardNo;
				var fundCode = App.storage.get("_parameters").iEFundBaseinfo.fundCode;
				var TACode = App.storage.get("_parameters").iEFundBaseinfo.TACode;//top置顶标记(00未置顶,01置顶),topTime
				var topTime=Utils.getServerDate("yyyyMMddhhmmss");//置顶时间
				var param2 = {
						strs : cardNo + "|" + fundCode + "|"+ TACode + "|08|00|"+topTime+"#"
				};
				Ajax({url : "/fund/fundCardRelateSave",data : param2,success : function(data) {// 添加
						if (MUI.isEmpty(data.errorCode)) {
							Client.alertinfo("成功添加自选","提醒");
							$("#optional").text("删自选");
							$this.Cancel();
							Client.hideWaitPanel(100);
						}else {
							Client.alertinfo(data.errorMessage, "提醒");
							$this.Cancel();
							Client.hideWaitPanel(1);
						}
				},error:function(){
					$this.Cancel();
	    			Client.hideWaitPanel(1);
	    		}});
			},
			
			OptionalDelete : function() {//删自选
				Client.openWaitPanel("加载中");
				var $this =this;
				var cardNo =Utils.getEleCard().cardNo;
				var fundCode = App.storage.get("_parameters").iEFundBaseinfo.fundCode;
				var TACode = App.storage.get("_parameters").iEFundBaseinfo.TACode;
				var topTime=Utils.getServerDate("yyyyMMddhhmmss");//置顶时间
				var param3 = {
						strs : cardNo + "|" + fundCode + "|"+ TACode + "|08|00|"+topTime+"#"
					};
				Ajax({url : "/fund/funCardRelateDelete",data : param3,success : function(data) {// 删除
						if (MUI.isEmpty(data.errorCode)) {
							$("#optional").text("加自选");
							Client.hideWaitPanel(100);
							$this.Cancel();
						}
						else {
							Client.alertinfo(data.errorMessage, "提醒");
							$this.Cancel();
							Client.hideWaitPanel(1);
						}
					},
					error:function(){
						$this.Cancel();
		    			Client.hideWaitPanel(1);
		    		}});
			},
			
			OptionalQuery : function() {//自选查询
					var cardNo =Utils.getEleCard().cardNo;
					var fundCode = App.storage.get("_parameters").iEFundBaseinfo.fundCode;
					var param1 = {
							cardNo : cardNo,
							resultSort : "1",// 0,净值/1,日涨幅
							actionFlag : "0"// 1,正序;0,倒序
					};
					Ajax({url : "/fund/queryFocusFund",data : param1,success : function(data) {// 查询
						if (MUI.isEmpty(data.errorCode)) {
							var icoll = data.iEFundBaseinfo;
							if(icoll.length==0){
								$("#optional").text("加自选");
								Client.hideWaitPanel(1);
							}
							for ( var len = 0; len < icoll.length; len++) {
								var kcoll = icoll[len];
								var fundCodeRet = kcoll.fundCode;
								if (fundCodeRet==fundCode) {// 存在
									temp='1';
									$("#optional").text("删自选");
									Client.hideWaitPanel(100);
									break;
								}else{//不存在
									temp='0';
									$("#optional").text("加自选");
									Client.hideWaitPanel(100);
								}
							}
						}else {
							Client.alertinfo(data.errorMessage, "提醒");
							$("#optional").text("加自选");
							Client.hideWaitPanel(1);
						}
					},error:function(){
		    			Client.hideWaitPanel(1);
		    		}});
				
						
			},

			fundHistoryNavQuery : function() {// 历史净值查询
				Client.openWaitPanel("加载中...");
				var fundCode = App.storage.get("_parameters").iEFundBaseinfo.fundCode;
				var param2 = {
					fundCode : fundCode,
					turnPageBeginPos:"1",
    				turnPageShowNum:"6",
				};
				var $this = this;
				Ajax({url : "/fund/fundHistoryNavQuery",data : param2,success : function(data) {// 查询
					if (MUI.isEmpty(data.errorCode)) {
						var icoll = data.fundHistoryNavList;
						$("#fundHistoryNavList").empty();
						for ( var len = 0; len < icoll.length; len++) {
							var kcoll = icoll[len];
							$this.addRow("fundHistoryNavList", kcoll);
						}
						Client.hideWaitPanel(1);
					} else {
						Client.alertinfo(data.errorMessage, "提醒");
						Client.hideWaitPanel(1);
					}
				},error:function(){
	    			Client.hideWaitPanel(1);
	    		}});
			},

			addRow : function(id, kcoll) {
				var fundlastnav = this.JsonNvl(kcoll.fundlastnav, "--");// 空值替换
				var fundtotalnav = this.JsonNvl(kcoll.fundtotalnav, "--");
				var dayRisePer = this.JsonNvl(kcoll.dayRisePer, "--");
				var html = '<tr>' + 
							'<td>' + kcoll.fundlastnavdate+'</td>' + 
							'<td class="fc-3">' + fundlastnav+
							'</td>'+ '<td class="fc-3">' + fundtotalnav+ '</td>';
				if (!dayRisePer.indexOf("-")) {
					html += '<td class="fc-green">' + dayRisePer+ '</td></tr>';
				} else {
					html += '<td class="fc-orange">+' + dayRisePer+ '</td></tr>';
				}
				$("#" + id).append(html);
				},

				JsonNvl : function(param, val) {

					if (MUI.isEmpty(param)) {
						paramT = val;
					} else {
						paramT = param;
					}

					return paramT;
				},
				
				fundHistoryNavToChat : function() {// 历史净值查询(关于曲线)
					//Client.openWaitPanel("加载中...");
					var fundCode = App.storage.get("_parameters").iEFundBaseinfo.fundCode;
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
					var param =App.storage.get("_parameters").iEFundBaseinfo;
					if(len=="22"){
						if(param.monthRisePer==""){
							$("#gains").text("--");
						}else if (param.monthRisePer.indexOf("-") < 0) {
							$("#gains").removeClass("fc-green").addClass("fc-orange");
							$("#gains").text("+"+param.monthRisePer);
						}else{
							$("#gains").removeClass("fc-orange").addClass("fc-green");
							$("#gains").text(param.monthRisePer);
						}
					}else if(len=="66"){
						if(param.threemonthRisePer==""){
							$("#gains").text("--");
						}else if (param.threemonthRisePer.indexOf("-") < 0) {
							$("#gains").removeClass("fc-green").addClass("fc-orange");
							$("#gains").text("+"+param.threemonthRisePer);
						}else{
							$("#gains").removeClass("fc-orange").addClass("fc-green");
							$("#gains").text(param.threemonthRisePer);
						}
					}else if(len=="132"){
						if(param.halfyearRisePer==""){
							$("#gains").text("--");
						}else if (param.halfyearRisePer.indexOf("-") < 0) {
							$("#gains").removeClass("fc-green").addClass("fc-orange");
							$("#gains").text("+"+param.halfyearRisePer);
						}else{
							$("#gains").removeClass("fc-orange").addClass("fc-green");
							$("#gains").text(param.halfyearRisePer);
						}
					}else if(len=="264"){
						if(param.yearRisePer==""){
							$("#gains").text("--");
						}else if (param.yearRisePer.indexOf("-") < 0) {
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
							if(fundCode==App.storage.get("_parameters").iEFundBaseinfo.fundCode){//筛选非本基金的买入卖出点
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
								buyPoint.name=transDate;
								buyPoint.value="";
								buyPoint.xAxis=transDate;
								buyPoint.yAxis=fundlastnavArr[index];
								buyPointTochatArr.push(buyPoint);//显示买入,卖出点
								
							}
						}
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
									formatter :"{a}"
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
					var cardNo =Utils.getEleCard().cardNo;
		        	var fundCode=App.storage.get("_parameters").iEFundBaseinfo.fundCode;
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
		    				$this.fundHistoryNavToChat();//在登录情况下,先查询出买入,卖出点再加载曲线
		    			}else{
		    				Client.alertinfo(data.errorMessage,"提醒");
		    				Client.hideWaitPanel(1);
		    			}
		    		}});
		        },
				
			});
});