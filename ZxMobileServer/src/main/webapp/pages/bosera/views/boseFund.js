define(function(require, exports, module) {

	var boseFundTpl = require("text!../template/boseFund.html");

	var boseFundView = module.exports = ItemView
			.extend({

				events : {
					"click #buy" : "buy",
					"click #back" : "goBack"
				},

				template : boseFundTpl,
				// 定义日志TAG便于错误信息查找
				initialize : function() {

					var boseRate = App.storage.get("boseRate");
					if (boseRate) {
						$("#sevRate").text(boseRate.boseSevRate);
						$("#tsRate").text(boseRate.boseTsRate);
					} else {
						this.initBose();
					}

					var iSevenRateInfo = App.storage.get("boseSevRate");
					if (!iSevenRateInfo) {
						iSevenRateInfo = [ {
							sevenyield : 0.00,
							updateDate : '7-01',
							wanVol : 0.00
						}, {
							sevenyield : 0.00,
							updateDate : '7-02',
							wanVol : 0.00
						}, {
							sevenyield : 0.00,
							updateDate : '7-03',
							wanVol : 0.00
						}, {
							sevenyield : 0.00,
							updateDate : '7-04',
							wanVol : 0.00
						}, {
							sevenyield : 0.00,
							updateDate : '7-05',
							wanVol : 0.00
						}, {
							sevenyield : 0.00,
							updateDate : '7-06',
							wanVol : 0.00
						}, {
							sevenyield : 0.00,
							updateDate : '7-07',
							wanVol : 0.00
						} ];
						this.sevenRateQuery();
					}
					this.initChat(iSevenRateInfo, "0");

					var $this = this;
					$(".chartBox .tab .cell").on(
							"click",
							function() {
								var index = $(this).attr("data-index");
								$("#chatTitle").text(
										index == "0" ? "七日年化收益率(%)"
												: "万份年化收益(元)");
								$(this).addClass("active").siblings("div")
										.removeClass("active");
								var iSevenRateInfo = App.storage
										.get("boseSevRate");
								$this.initChat(iSevenRateInfo, index);
							});

					$('.director .list-item')
							.on(
									'click',
									function() {
										var me = $(this), cnt = me.next(), setH = cnt
												.find('.para').get(0).offsetHeight, offsetTop = me
												.offset().top;
										setTimeout(function() {
											window.scrollTo(0, offsetTop);
										}, 200);
										me.hasClass('spr') ? me
												.removeClass('spr')
												&& cnt.css('height', 0) : me
												.addClass('spr')
												&& cnt.css('height', setH);
									});

					var iBoseraIncome = App.storage.get("iBoseraIncome");
					if (!iBoseraIncome && Utils.checkSession()) {
						this.queryIcome();
					}
				},

				initBose : function() {
					var $this = this;
					var param = {
						productId : Utils.getParamDisplay("PB_BOSERA", '1')
					};
					Ajax({
						url : "/bosera/boseraProductSynchro",
						data : param,
						success : function(data) {
							if (data.errorCode) {
								Utils.alertinfo(data.errorMessage);
								App.storage.set("boseRate", false);
							} else {
								var iBoseraProduct = data.iBoseraProduct;
								var boseSevRate = "0.000";
								var boseTsRate = "0.000";
								if (iBoseraProduct.length > 0) {
									boseSevRate = Utils.formatCurrency(
											iBoseraProduct[0].trans_amt2, 3);
									boseTsRate = Utils.formatCurrency(
											iBoseraProduct[0].trans_amt3, 3);
								}
								$("#sevRate").text(boseSevRate);
								$("#tsRate").text(boseTsRate);
								App.storage.set("boseRate", {
									boseSevRate : boseSevRate,
									boseTsRate : boseTsRate
								});
							}
							Client.hideWaitPanel(1);
						}
					});

				},

				sevenRateQuery : function() {
					var financeNo = Utils.getParamDisplay("PB_BOSERA", '1');
					var param = {
						financeNo : financeNo
					};
					var $this = this;
					Ajax({
						url : "/finance/life_sevenRateQuery",
						data : param,
						success : function(data) {
							if (MUI.isEmpty(data.errorCode)) {

								var iSevenRateInfo = data.iSevenRateInfo;
								App.storage.set("boseSevRate", iSevenRateInfo);

								$this.initChat(iSevenRateInfo, "0");

							} else {
								Utils.alertinfo(data.errorMessage);
							}
						}
					});
				},

				initChat : function(iSevenRateInfo, type) {

					var dateArr = [], sevenyieldArr = [], wanVolArr = [], sortArr = [];
					for (var a = 0; a < iSevenRateInfo.length; a++) {
						var kColl = iSevenRateInfo[a];
						var sevenyield = Utils.toRetentionDigit(
								kColl.sevenyield, 3);
						var updateDate = kColl.updateDate;
						var wanVol = kColl.wanVol;
						var date = updateDate.substr(4, 2) + "-"
								+ updateDate.substr(6, 2);
						dateArr.push(date);
						sevenyieldArr.push(sevenyield);
						wanVolArr.push(wanVol);
						sortArr.push(type == "0" ? sevenyield : wanVol);
					}
					sortArr.sort(function(a, b) {
						return a - b;
					});
					var distans = ((sortArr[sortArr.length - 1] - sortArr[0]) / 2) || (sortArr[sortArr.length - 1]/2);
					var max = (parseFloat(sortArr[sortArr.length - 1]) + parseFloat(distans))
							.toFixed(2);
					var min = (parseFloat(sortArr[0]) - parseFloat(distans))
							.toFixed(2);
					// 初始化图表
					echarts
							.init(document.getElementById('linechart'))
							.setOption(
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
												textStyle : {
													color : '#979797'
												}
											},
											boundaryGap : false,
											data : dateArr
										} ],
										yAxis : [ {
											type : 'value',
											scale : true,
											max : max,
											min : min,
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
												formatter : function(value) {
													var val = Math
															.round(value * 1000) / 1000;
													return val.toFixed(3);
												}
											},
										} ],
										series : [ {
											name : '成交',
											type : 'line',
											symbol : 'emptyCircle',
											symbolSize : 3,
											smooth : true,
											itemStyle : {
												normal : {
													color : 'rgb(0,160,255)',
													lineStyle : {
														width : 1,
														color : 'rgb(0,160,255)'
													},
													areaStyle : {
														color : 'rgba(0,153,255,0.6)'
													}
												}
											},
											data : type == "0" ? sevenyieldArr
													: wanVolArr,
										} ]
									});
					Client.hideWaitPanel(1);
				},

				queryIcome : function() {
					var param = {
						productId : Utils.getParamDisplay("PB_BOSERA", '1'),
						cardNo : Utils.trim(Utils.getEleCard().cardNo),
						accountType : Utils
								.trim(Utils.getEleCard().accountType)
					};
					Ajax({
						url : "/bosera/queryBoseraFinance",
						data : param,
						success : function(data) {
							if (MUI.isEmpty(data.errorCode)) {
								var iBoseraIncome = data.iBoseraQuery;
								App.storage.set("iBoseraIncome", iBoseraIncome);
							}
						}
					});
				},

				buy : function(type) {
					if (Utils.checkSession()) {

						if (!Utils.checkRealUser() || !Utils.checkActivate()) {
							return;
						}
						if (type && type == "1") {
							Client.openWaitPanel("");
							setTimeout(function() {
								App.navigate("bosera/boseraCtl/boseFundBuy");
							}, 3000);
						} else {
							App.navigate("bosera/boseraCtl/boseFundBuy");
						}
					} else {
						Client.toLogin("curView.buy('1')");
					}
				},

				goBack : function() {
					App.back();
				},

			});
});
