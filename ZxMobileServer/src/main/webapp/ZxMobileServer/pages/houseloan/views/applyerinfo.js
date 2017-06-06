define(function(require, exports, module) {

	var applyerinfoTpl = require("text!../template/applyerinfo.html");

	var ApplyerinfoView = module.exports = ItemView
			.extend({

				events : {
					"click #applyercom" : "toapplyercom",

				},

				template : applyerinfoTpl,
				// 定义日志TAG便于错误信息查找
				initialize : function() {
					var pageTest = {
						title : '贷款申请',
						leftButton : {
							name : '返回',
							func : 'curView.Back()'
						},
						rightButton : {
							name : '取消',
							func : 'curView.cancel()'
						}
					}
					Client.initPageTitle(pageTest);
					Client.hideWaitPanel(10);
					var $this = this;

					$this.relationType = "0"; // 0 添加 1 编辑
					var firstinfo = App.storage.get("firstinfo");
					// this.iShareInfoStr = "";// 共有权人信息
					// $("#userName").text(firstinfo.);

					if (firstinfo.certType == "00") {

						$("#cardType").text("身份证");

					} else {

						$("#cardType").text("身份证");

					}
					;

					// 申请人

					$("#shenfenzhengNo").text(App.storage.get("CetrNo"));
					$("#applyername").text(firstinfo.userName);

					// $("#shenfenzhengNo").text("");
					$("#mobileNo").text(firstinfo.mobileNo);

					$("#emailaddress").val(firstinfo.email);
					// 户籍
					// $("#")
					if (firstinfo.censusRegister == "1") {

						$('#hjaddress').find('input').val("本市");
						this.hjaddress = "1";

					} else if (firstinfo.censusRegister == "2"){

						$('#hjaddress').find('input').val("外地");
						this.hjaddress = "2";

					}

					$("#nowaddress").val(firstinfo.presentAddress);

					// $("#nowaddrstatus")

					if (firstinfo.nowAddressStatus == "1") {

						$('#nowaddrstatus').find('input').val("自购有贷款");
						this.nowaddrstatus = "1";

					} else if (firstinfo.nowAddressStatus == "2") {

						$('#nowaddrstatus').find('input').val("自购无贷款");
						this.nowaddrstatus = "2";

					} else if (firstinfo.nowAddressStatus == "4") {

						$('#nowaddrstatus').find('input').val("亲属楼宇");

						this.nowaddrstatus = "4";

					} else if (firstinfo.nowAddressStatus == "5") {

						$('#nowaddrstatus').find('input').val("租住房屋");

						this.nowaddrstatus = "5";

					}

					$("#postaladdress").val(firstinfo.postalCode);

					$("#workplace").val(firstinfo.workPlace);
					if (firstinfo.workPlace == "无") {
						$("#applyerWorkAddr").hide()

					} else {

						$("#applyerWorkAddr").show()
						$("#workAddr").val(firstinfo.workAddr);

					}

					$("#companyphone").val(firstinfo.companyPhone);
					$("#post2").val(firstinfo.postalCode2);

					
					
					if (firstinfo.topDiplomas == "1") {

						$('#topdiplomas').find('input').val("研究生");
						this.topdiplomas = "1";

					} else if (firstinfo.topDiplomas == "2") {

						$('#topdiplomas').find('input').val("大学本科");
						this.topdiplomas = "2";

					} else if (firstinfo.topDiplomas == "6") {

						$('#topdiplomas').find('input').val("高中");

						this.topdiplomas = "6";

					} else if (firstinfo.topDiplomas == "99") {

						$('#topdiplomas').find('input').val("其他");

						this.topdiplomas = "99";

					};
					
					if (firstinfo.dutyPosition == "1") {

						$('#dutyposition').find('input').val("局级及以上");
						this.dutyposition = "1";

					} else if (firstinfo.dutyPosition == "2") {

						$('#dutyposition').find('input').val("处级");
						this.dutyposition = "2";

					} else if (firstinfo.dutyPosition == "3") {
						$('#dutyposition').find('input').val("科级");

						this.dutyposition = "3";

					} else if (firstinfo.dutyPosition == "4") {

						$('#dutyposition').find('input').val("科级以下");

						this.dutyposition = "4";

					}

					if (firstinfo.technicalpost == "1") {

						$('#technicalpost').find('input').val("高级职称");
						this.technicalpost = "1";

					} else if (firstinfo.technicalpost == "2") {

						$('#technicalpost').find('input').val("中级职称");
						this.technicalpost = "2";

					} else if (firstinfo.technicalpost == "3") {
						$('#technicalpost').find('input').val("初级职称");

						this.technicalpost = "3";

					} else if (firstinfo.technicalpost == "4") {

						$('#technicalpost').find('input').val("无职称");

						this.technicalpost = "4";

					}

					// 住址状态
					if (firstinfo.postAddress == "01") {

						$('#postAddr').find('input').val("现住址");
						this.postAddr = "01";

					} else if (firstinfo.postAddress == "02") {

						$('#postAddr').find('input').val("单位住址");
						this.postAddr = "02";

					}

				
					// 与共有权人关系
					function shareRelationStr(input) {
						input = $this.shareRelation = $.trim(input) + "";
						var str = "";
						switch (input) {
						case "2":
							str = "配偶";
							break;
						case "3":
							str = "子女";
							break;
						case "4":
							str = "父母";
							break;
						case "9":
							str = "其他";
							break;
						default:
							str = "未知";
						}
						return str;
					}

					//$('#sharerelation').find('input').val(shareRelationStr("4"));

					// $("#post3").val(firstinfo.postalCode3);
					if (firstinfo.fundNumber) {

						$("#gongjijingnum").val(parseFloat(firstinfo.fundNumber).toFixed(2));

					} else {
						$("#gongjijingnum").val("");

					}

					if (firstinfo.monthlyIncome) {
						$("#monthlyIncome").val(parseFloat(firstinfo.monthlyIncome).toFixed(2));
					} else {
						$("#monthlyIncome").val("");

					}

					if (firstinfo.otherLoanNumber) {
						$("#otherloannum").val(parseFloat(firstinfo.otherLoanNumber).toFixed(2));
					} else {
						$("#otherloannum").val("");
					}

					

					if (firstinfo.iShareInfo.length > 0) {
						for (var i = 0; i < firstinfo.iShareInfo.length; i++) {
							var shareInfo = Utils.trim(firstinfo.iShareInfo[i].shareName) + "|"
									+ Utils.trim(firstinfo.iShareInfo[i].shareCertNo) + "|"
									+ Utils.trim(firstinfo.iShareInfo[i].shareWorkPlace) + "|"
									+ Utils.trim(firstinfo.iShareInfo[i].shareMonthlyIncome) + "|"
									+ Utils.trim(firstinfo.iShareInfo[i].shareMobileNo) + "|"
									+ Utils.trim(firstinfo.iShareInfo[i].shareRelation);

							if (Utils.trim(firstinfo.iShareInfo[i].shareRelation) == "2") {
								$("#crightBox").append(
												'<div class="itm marry" id="marital" data-value="'
														+ shareInfo
														+ '"><div class="row">'
														+ '<div class="cell">姓名：<span id="spouseshareName">'
														+ firstinfo.iShareInfo[i].shareName
														+ '</span></div>'
														+ ' <div class="cell">与申请人关系：配偶</div></div><div class="row">'
														+ '<div class="cell">联系电话：<span id="spousesharePhone">'
														+ firstinfo.iShareInfo[i].shareMobileNo
														+ '</span></div></div>'
														+ '<div class="row"><div class="cell">月收入：<span id="spouseshareIncome">'
														+ firstinfo.iShareInfo[i].shareMonthlyIncome
														+ '</span>元</div></div><div class="row">'
														+ ' <div class="cell">身份证号：<span class="sharespanCertNO" id="spouseshareCertNo">'
														+ firstinfo.iShareInfo[i].shareCertNo
														+ '</span></div></div>'
														+ ' <div class="row"><div class="cell">公司名称：<span id="spouseshareCom">'
														+ firstinfo.iShareInfo[i].shareWorkPlace
														+ '</span> </div></div>');

							} else {

								
								
								$("#crightBox").append(
										'<div class="itm" data-value="' + shareInfo + '">' + '<div class="row">'
												+ '<div class="cell">姓名：<span id="sharespanName">'
												+ firstinfo.iShareInfo[i].shareName + '</span></div>'
												+ ' <div class="cell">与申请人关系：'
												+ shareRelationStr(firstinfo.iShareInfo[i].shareRelation) + '</div>'
												+ ' </div>' + '<div class="row">'
												+ '<div class="cell">联系电话：<span id="sharespanPhone">'
												+ firstinfo.iShareInfo[i].shareMobileNo + '</span></div>' + '</div>'
												+ '<div class="row">'
												+ ' <div class="cell">月收入：<span id="sharespanIncome">'
												+ firstinfo.iShareInfo[i].shareMonthlyIncome + '元</span></div>'
												+ ' </div>' + '<div class="row">'
												+ ' <div class="cell">身份证号：<span id="sharespanCertNO">'
												+ firstinfo.iShareInfo[i].shareCertNo + '</span></div>' + ' </div>'
												+ ' <div class="row">'
												+ '<div class="cell">公司名称：<span id="sharespanCom">'
												+ firstinfo.iShareInfo[i].shareWorkPlace + '</span> </div>' + '</div>'
												+ '<div class="row mdfy">' + '<button class="btn edit">编辑</button>'
												+ '<button class="btn delete">删除</button>' + '</div></div>');
							}
						}

						/*
						 * $(".delete").off().on("click", function() { if(confirm("确定删除此条共有权人信息？")){ $(this).parents(".itm").remove(); } });
						 */

						$(".delete").off().on("click", function() {
							var index = $(".delete").index($(this)[0]);
							Client.alertinfo("是否确认删除此条共有权人信息？", "提醒", "curView.deletewife(" + index + ")", true);
						});

						$(".edit").off().on("click", function() {
							// $(this).parents(".itm").remove();
							$('#comRightFill').show().siblings('.loanApp').hide();

							$this.relationDom = $(this).parents(".itm");
							var data = $this.relationDom.attr("data-value").split("|");
							$("#shareName").val(data[0]);
							$("#shareCertNo").val(data[1]);
							$("#shareWorkAddr").val(data[2]);
							$("#shareIncome").val(data[3]);
							$("#shareMobileNO").val(data[4]);
							$("#morenrelation").val(shareRelationStr(data[5]));
							$('#comRightFill').show().siblings('.loanApp').hide();

							$this.shareRelation = data[5];
							$this.relationType = "1";
							$this.relationDom = $(this).parents(".itm");
							var pageTest2 = {
								title : '共有权人编辑',
								leftButton : {
									name : '返回',
									func : 'curView.back()'
								},
								rightButton : {
									name : ''
								}
							}
							Client.initPageTitle(pageTest2);

						});

					} else {

						$("#comRightFill").hide();

					}

					// alert(firstinfo.spouseShareMark);

					// 婚姻状态
					if (firstinfo.maritalStatus == "2") {
						$("#maritalStatus input").val("已婚");
						this.maritalStatus = "2";
						// this.comRightSign = "1";
						$('#spouseIfo').show();
						
						
						$("#spouseName").val(firstinfo.spouseName);

						$("#spousecertNo").val(firstinfo.spouseCertNo);

						if (firstinfo.spouseFundNumber) {
							$("#spouseFunderNo").val(parseFloat(firstinfo.spouseFundNumber).toFixed(2));
						} else {

							$("#spouseFunderNo").val("");

						}

						if (firstinfo.spouseMonthlyIncome) {
							$("#spouseIncome").val(parseFloat(firstinfo.spouseMonthlyIncome).toFixed(2));
						} else {

							$("#spouseIncome").val("");

						}

						$("#spousebirth").val(firstinfo.spouseCertNo.substring(6, 14));

						$("#spouseMobilePhone").val(firstinfo.spouseMobileNo);

						$("#suposeworkplace").val(firstinfo.spouseWorkPlace);

						$("#suposecompanyphone").val(firstinfo.spouseCompanyPhone);
						
						
						if (firstinfo.spouseCensusRegister == "1") {

							$('#suposehjaddress').find('input').val("本市");
							this.suposehjaddress = "1";

						} else if (firstinfo.spouseCensusRegister == "2") {

							$('#suposehjaddress').find('input').val("外地");
							this.suposehjaddress = "2";

						}

						// 配偶学历

						if (firstinfo.spouseDiplomas == "1") {

							$('#suposetopdiplomas').find('input').val("研究生");
							this.suposetopdiplomas = "1";

						} else if (firstinfo.spouseDiplomas == "2") {

							$('#suposetopdiplomas').find('input').val("大学本科");
							this.suposetopdiplomas = "2";

						} else if (firstinfo.spouseDiplomas == "6") {

							$('#suposetopdiplomas').find('input').val("高中");

							this.suposetopdiplomas = "6";

						} else if (firstinfo.spouseDiplomas == "99") {

							$('#suposetopdiplomas').find('input').val("其他");

							this.suposetopdiplomas = "99";

						}

						// 配偶职务

						if (firstinfo.spouseDutyPosition == "1") {

							$('#suposedutyposition').find('input').val("局级及以上");
							this.suposedutyposition = "1";

						} else if (firstinfo.spouseDutyPosition == "2") {

							$('#suposedutyposition').find('input').val("处级");
							this.suposedutyposition = "2";

						} else if (firstinfo.spouseDutyPosition == "3") {
							$('#suposedutyposition').find('input').val("科级");

							this.suposedutyposition = "3";

						} else if (firstinfo.spouseDutyPosition == "4") {

							$('#suposedutyposition').find('input').val("科级以下");

							this.suposedutyposition = "4";

						}

						// 配偶职称

						if (firstinfo.spouseTechnicalpost == "1") {

							$('#suposetechnicalpost').find('input').val("高级职称");
							this.suposetechnicalpost = "1";

						} else if (firstinfo.spouseTechnicalpost == "2") {

							$('#suposetechnicalpost').find('input').val("中级职称");
							this.suposetechnicalpost = "2";

						} else if (firstinfo.spouseTechnicalpost == "3") {
							$('#suposetechnicalpost').find('input').val("初级职称");

							this.suposetechnicalpost = "3";

						} else if (firstinfo.spouseTechnicalpost == "4") {

							$('#suposetechnicalpost').find('input').val("无职称");

							this.suposetechnicalpost = "4";

						}

						
						
						
						if (firstinfo.spouseShareMark == "1") {
							$("#comRightSign input").val("是");
							this.comRightSign = "1";
							
							var spouseshareName = $("#spouseName").val();
							var spousesharePhone = $("#spouseMobilePhone").val();
							var spouseshareIncome = $("#spouseIncome").val();
							var spouseshareCertNo = $("#spousecertNo").val();
							var spouseshareCom = $("#suposeworkplace").val();

							var shareInfo = Utils.trim(spouseshareName) + "|" + Utils.trim(spouseshareCertNo) + "|"
									+ Utils.trim(spouseshareCom) + "|" + Utils.trim(spouseshareIncome) + "|"
									+ Utils.trim(spousesharePhone) + "|2";

							if ($("#crightBox .marry").length == 0) {
								$("#crightBox")
										.append(
												'<div class="itm marry" id="marital" data-value="'
														+ shareInfo
														+ '"><div class="row">'
														+ '<div class="cell">姓名：<span id="spouseshareName">'
														+ spouseshareName
														+ '</span></div>'
														+ ' <div class="cell">与申请人关系：配偶</div></div><div class="row">'
														+ '<div class="cell">联系电话：<span id="spousesharePhone">'
														+ spousesharePhone
														+ '</span></div></div>'
														+ '<div class="row"><div class="cell">月收入：<span id="spouseshareIncome">'
														+ spouseshareIncome
														+ '</span>元</div></div><div class="row">'
														+ ' <div class="cell">身份证号：<span class="sharespanCertNO" id="spouseshareCertNo">'
														+ spouseshareCertNo
														+ '</span></div></div>'
														+ ' <div class="row"><div class="cell">公司名称：<span id="spouseshareCom">'
														+ spouseshareCom + '</span> </div></div>');

							}

						} else if (firstinfo.spouseShareMark == "0") {
							$("#comRightSign input").val("否");
							this.comRightSign = "0";
							$("#crightBox .marry").remove();
						}

						
						
						
					} else if (firstinfo.maritalStatus == "1") {
						this.maritalStatus = "1";
						$("#maritalStatus input").val("未婚");
						this.comRightSign = "0";
						
						$('#spouseIfo').hide();
						// $('#spouseshareInfo').hide();
						
						$("#spouseName").val("");
						$("#spousecertNo").val("");
						$("#spouseMobilePhone").val("");
						$("#spouseFunderNo").val("");
						$("#spouseIncome").val("");
						$("#spousebirth").val("");
						$("#suposeworkplace").val("");
						$("#suposecompanyphone").val("");
						$("#suposehjaddress input").val("请选择");
						 this.suposehjaddress="";
						$("#suposetopdiplomas input").val("请选择");
						this.suposetopdiplomas="";
						$("#suposedutyposition input").val("请选择");
						this.suposedutyposition="";
						$("#suposetechnicalpost input").val("请选择");
						 this.suposetechnicalpost="";
						$("#comRightSign input").val("否");
						
						$("#crightBox .marry").remove();
						
						
					}
					
					
					// $("#gongjijingnum").val(data1.fundNumber);
					// $("#")

					/*
					 * if($("#maritalStatus input").val() == "未婚"){
					 * 
					 * $("#crightBox .marry").remove();
					 *  };
					 */

					
					$('#maritalStatus')
							.selectDialog(
									{
										list : [ '已婚|2', '未婚|1' ],
										callback : function(value, label) {
											$('#maritalStatus').find('input').val(label);
											if (value % 2 == 0) {
												$('#spouseIfo').show();
												$('#comRightSign').find('input').val("是");
												$this.comRightSign = "1";
												// alert($this.comRightSign);

												var spouseshareName = $("#spouseName").val();
												var spousesharePhone = $("#spouseMobilePhone").val();
												var spouseshareIncome = $("#spouseIncome").val();
												var spouseshareCertNo = $("#spousecertNo").val();
												var spouseshareCom = $("#suposeworkplace").val();

												var shareInfo = Utils.trim(spouseshareName) + "|"
														+ Utils.trim(spouseshareCertNo) + "|"
														+ Utils.trim(spouseshareCom) + "|"
														+ Utils.trim(spouseshareIncome) + "|"
														+ Utils.trim(spousesharePhone) + "|2";

												if ($("#crightBox .marry").length == 0) {
													$("#crightBox")
															.append(
																	'<div class="itm marry" id="marital" data-value="'
																			+ shareInfo
																			+ '"><div class="row">'
																			+ '<div class="cell">姓名：<span id="spouseshareName">'
																			+ spouseshareName
																			+ '</span></div>'
																			+ ' <div class="cell">与申请人关系：配偶</div></div><div class="row">'
																			+ '<div class="cell">联系电话：<span id="spousesharePhone">'
																			+ spousesharePhone
																			+ '</span></div></div>'
																			+ '<div class="row"><div class="cell">月收入：<span id="spouseshareIncome">'
																			+ spouseshareIncome
																			+ '</span>元</div></div><div class="row">'
																			+ ' <div class="cell">身份证号：<span class="sharespanCertNO" id="spouseshareCertNo">'
																			+ spouseshareCertNo
																			+ '</span></div></div>'
																			+ ' <div class="row"><div class="cell">公司名称：<span id="spouseshareCom">'
																			+ spouseshareCom + '</span> </div></div>');

												}
											} else {
												$('#spouseIfo').hide();
												/*
												 * $this.comRightSign = '0'; $('#comRightSign').find('input').val("否");
												 */
												// $('#crightBox').hide();
												// $("#addComBtn").hide();
												$this.comRightSign = "0";
												// alert($this.comRightSign);
												$("#spouseName").val("");
												$("#spousecertNo").val("");
												$("#spouseMobilePhone").val("");
												$("#spouseFunderNo").val("");
												$("#spouseIncome").val("");
												$("#spousebirth").val("");
												$("#suposeworkplace").val("");
												$("#suposecompanyphone").val("");
												$("#suposehjaddress input").val("请选择");
												 $this.suposehjaddress="";
												$("#suposetopdiplomas input").val("请选择");
												$this.suposetopdiplomas="";
												$("#suposedutyposition input").val("请选择");
												$this.suposedutyposition="";
												$("#suposetechnicalpost input").val("请选择");
												 $this.suposetechnicalpost="";
												$("#comRightSign input").val("否");
												
												$("#crightBox .marry").remove();
												// alert(this.comRightSign);
											}
											$this.maritalStatus = value;

										}
									});
					// alert(this.comRightSign);

					$('#comRightSign')
							.selectDialog(
									{
										list : [ '是|1', '否|0' ],
										callback : function(value, label) {
											$('#comRightSign').find('input').val(label);
											if (value * 1) {

												var spouseshareName = $("#spouseName").val();
												var spousesharePhone = $("#spouseMobilePhone").val();
												var spouseshareIncome = $("#spouseIncome").val();
												var spouseshareCertNo = $("#spousecertNo").val();
												var spouseshareCom = $("#suposeworkplace").val();

												var shareInfo = Utils.trim(spouseshareName) + "|"
														+ Utils.trim(spouseshareCertNo) + "|"
														+ Utils.trim(spouseshareCom) + "|"
														+ Utils.trim(spouseshareIncome) + "|"
														+ Utils.trim(spousesharePhone) + "|2";

												if ($("#crightBox .marry").length == 0) {
													$("#crightBox")
															.append(
																	'<div class="itm marry" id="marital" data-value="'
																			+ shareInfo
																			+ '"><div class="row">'
																			+ '<div class="cell">姓名：<span id="spouseshareName">'
																			+ spouseshareName
																			+ '</span></div>'
																			+ ' <div class="cell">与申请人关系：配偶</div></div><div class="row">'
																			+ '<div class="cell">联系电话：<span id="spousesharePhone">'
																			+ spousesharePhone
																			+ '</span></div></div>'
																			+ '<div class="row"><div class="cell">月收入：<span id="spouseshareIncome">'
																			+ spouseshareIncome
																			+ '</span>元</div></div><div class="row">'
																			+ ' <div class="cell">身份证号：<span class="sharespanCertNO" id="spouseshareCertNo">'
																			+ spouseshareCertNo
																			+ '</span></div></div>'
																			+ ' <div class="row"><div class="cell">公司名称：<span id="spouseshareCom">'
																			+ spouseshareCom + '</span> </div></div>');

												}

											} else {
												$("#crightBox .marry").remove();
											}
											// alert("value"+value)
											$this.comRightSign = value;
										}

			});

				

					$('#nowaddrstatus').selectDialog({
						list : [ '自购有贷款|1', '自购无贷款|2', '亲属楼宇|4', '租住房屋|5' ],
						callback : function(value, label) {
							$('#nowaddrstatus').find('input').val(label);
							$this.nowaddrstatus = value;
						}
					});

					
					$('#topdiplomas').selectDialog({
						list : [ '研究生|1', '大学本科|2', '高中|6', '其他|99' ],
						callback : function(value, label) {
							$('#topdiplomas').find('input').val(label);
							$this.topdiplomas = value;
						}
					});

					
					$('#hjaddress').selectDialog({
						list : [ '本市|1', '外地|2' ],
						callback : function(value, label) {
							$('#hjaddress').find('input').val(label);
							$this.hjaddress = value;
						}
					}),
					$('#dutyposition').selectDialog({
						list : [ '局级及以上|1', '处级|2', '科级|3', '科级以下|4' ],
						callback : function(value, label) {
							$('#dutyposition').find('input').val(label);
							$this.dutyposition = value;
						}
					});

					
					$('#technicalpost').selectDialog({
						list : [ '高级职称|1', '中级职称|2', '初级职称|3', '无职称|4' ],
						callback : function(value, label) {
							$('#technicalpost').find('input').val(label);
							$this.technicalpost = value;
						}
					});
					
					$('#postAddr').selectDialog({
						list : [ '现住址|01', '单位住址|02' ],
						callback : function(value, label) {
							$('#postAddr').find('input').val(label);
							$this.postAddr = value;
						}
					});
					$('#suposehjaddress').selectDialog({
						list : [ '本市|1', '外地|2' ],
						callback : function(value, label) {
							$('#suposehjaddress').find('input').val(label);
							$this.suposehjaddress = value;
						}
					}),

					$('#suposetopdiplomas').selectDialog({
						list : [ '研究生|1', '大学本科|2', '高中|6', '其他|99' ],
						callback : function(value, label) {
							$('#suposetopdiplomas').find('input').val(label);
							$this.suposetopdiplomas = value;
						}
					});

					$('#suposedutyposition').selectDialog({
						list : [ '局级及以上|1', '处级|2', '科级|3', '科级以下|4' ],
						callback : function(value, label) {
							$('#suposedutyposition').find('input').val(label);
							$this.suposedutyposition = value;
						}
					});

					$('#sharerelation').selectDialog({
						list : [ '子女|3', '父母|4', '其他|9' ],
						callback : function(value, label) {
							$('#sharerelation').find('input').val(label);
							App.storage.set("label", label);
							$this.shareRelation = value;
						}
					});

					$('#suposetechnicalpost').selectDialog({
						list : [ '高级职称|1', '中级职称|2', '初级职称|3', '无职称|4' ],
						callback : function(value, label) {
							$('#suposetechnicalpost').find('input').val(label);
							$this.suposetechnicalpost = value;
						}
					});

					// 添加共有权人的信息
					$('#addComBtn').on('click', function() {
						$('#comRightFill').show().siblings('.loanApp').hide();
					//	$this.shareRelation = "4";
						$this.relationType = "0";
						var pageTest2 = {
							title : '共有权人添加',
							leftButton : {
								name : '返回',
								func : 'curView.back()'
							},
							rightButton : {
								name : ''
							}
						}
						Client.initPageTitle(pageTest2);
					});

					// 返回申请人信息页面
					$('#shareinsert').on('click',function() {
										var shareInfo = Utils.trim($("#shareName").val()) + "|"
												+ Utils.trim($("#shareCertNo").val()) + "|"
												+ Utils.trim($("#shareWorkAddr").val()) + "|"
												+ Utils.trim($("#shareIncome").val()) + "|"
												+ Utils.trim($("#shareMobileNO").val()) + "|" + $this.shareRelation;
										var label = App.storage.get("label");
										var certNo = $("#shareCertNo").val();
										
										//alert($this.shareRelation);
										//alert($("#shareCertNo").val())
										
										
										if (!$this.checkCertNo18(certNo)) {
											return;
										}

										var shareName = $("#shareName").val();

										if (shareName) {
											if (!$this.checkname(shareName) || shareName.length > 20) {
												Utils.alertinfo("共有权人姓名格式不正确！");
												return;
											}
										} else {
											Utils.alertinfo("请输入共有权人姓名！");
											return;
										}
										;

										var shareWorkAddr = $("#shareWorkAddr").val();
										if (shareWorkAddr) {
											if (shareWorkAddr.length > 25) {
												Utils.alertinfo("共有权人单位名称过长！");
												return;
											}
										} else {

											Utils.alertinfo("请输入共有权人单位名称！");
											return;
										}
										;
										var shareIncome = $("#shareIncome").val();
										if (shareIncome) {
											if (!$this.checkmoney(shareIncome)) {
												Utils.alertinfo("共有权人月收入格式错误（如999999999.99）或者金额过大", "1");
												return;
											}
										} else {

											Utils.alertinfo("请输入共有权人月收入！");
											return;
										}
										;
										var shareMobileNO = $("#shareMobileNO").val();
										if (shareMobileNO) {
											if (!$this.checkMobile(shareMobileNO)) {
												Utils.alertinfo("手机号格式不正确！");
												return;
											}
										} else {

											Utils.alertinfo("请输入共有权人手机号！");

											return;

										};
										
										
										if ($("#sharerelation input").val() == "请选择"||$("#hjaddress input").val() == "") {
											Utils.alertinfo("请选择共有权人与申请人关系！");
											return;
										}
										
										
										$('#comRightFill').hide().siblings('.loanApp').show();
										if ($this.relationType == "1") {
											var dom = $this.relationDom;
											dom.replaceWith('<div class="itm" data-value="'
															+ shareInfo
															+ '">'
															+ '<div class="row">'
															+ '<div class="cell">姓名：<span id="sharespanName">'
															+ $("#shareName").val()
															+ '</span></div>'
															+ ' <div class="cell">与申请人关系：'
															+ shareRelationStr($this.shareRelation)
															+ '</div>'
															+ ' </div>'
															+ '<div class="row">'
															+ '<div class="cell">联系电话：<span id="sharespanPhone">'
															+ $("#shareMobileNO").val()
															+ '</span></div>'
															+ '</div>'
															+ '<div class="row">'
															+ ' <div class="cell">月收入：<span id="sharespanIncome">'
															+ $("#shareIncome").val()
															+ '元</span></div>'
															+ ' </div>'
															+ '<div class="row">'
															+ ' <div class="cell">身份证号：<span class="sharespanCertNO" id="sharespanCertNO">'
															+ $("#shareCertNo").val() + '</span></div>' + ' </div>'
															+ ' <div class="row">'
															+ '<div class="cell">公司名称：<span id="sharespanCom">'
															+ $("#shareWorkAddr").val() + '</span> </div>' + '</div>'
															+ '<div class="row mdfy">'
															+ '<button class="btn edit">编辑</button>'
															+ '<button class="btn delete">删除</button>' + '</div></div>');
										} else {
											$("#crightBox").append(
															'<div class="itm" data-value="'
																	+ shareInfo
																	+ '">'
																	+ '<div class="row">'
																	+ '<div class="cell">姓名：<span id="sharespanName">'
																	+ $("#shareName").val()
																	+ '</span></div>'
																	+ ' <div class="cell">与申请人关系：'
																	+ shareRelationStr($this.shareRelation)
																	+ '</div>'
																	+ ' </div>'
																	+ '<div class="row">'
																	+ '<div class="cell">联系电话：<span id="sharespanPhone">'
																	+ $("#shareMobileNO").val()
																	+ '</span></div>'
																	+ '</div>'
																	+ '<div class="row">'
																	+ ' <div class="cell">月收入：<span id="sharespanIncome">'
																	+ $("#shareIncome").val()
																	+ '元</span></div>'
																	+ ' </div>'
																	+ '<div class="row">'
																	+ ' <div class="cell">身份证号：<span  class="sharespanCertNO" id="sharespanCertNO">'
																	+ $("#shareCertNo").val() + '</span></div>'
																	+ ' </div>' + ' <div class="row">'
																	+ '<div class="cell">公司名称：<span id="sharespanCom">'
																	+ $("#shareWorkAddr").val() + '</span> </div>'
																	+ '</div>' + '<div class="row mdfy">'
																	+ '<button class="btn edit">编辑</button>'
																	+ '<button class="btn delete">删除</button>'
																	+ '</div></div>');
										}
										
										$("#comRightFill input").val("");
										$("#morenrelation").val("请选择");

										$(".delete").off().on("click",function() {
													var index = $(".delete").index($(this)[0]);
													Client.alertinfo("是否确认删除此条共有权人信息？", "提醒", "curView.deletewife("
															+ index + ")", true);
												});

										$(".edit").off().on("click", function() {
											// $(this).parents(".itm").remove();
											$this.relationDom = $(this).parents(".itm");
											var data = $this.relationDom.attr("data-value").split("|");
											$("#shareName").val(data[0]);
											$("#shareCertNo").val(data[1]);
											$("#shareWorkAddr").val(data[2]);
											$("#shareIncome").val(data[3]);
											$("#shareMobileNO").val(data[4]);
											$("#morenrelation").val(shareRelationStr(data[5]));
											$('#comRightFill').show().siblings('.loanApp').hide();

											$this.shareRelation = data[5];
											$this.relationType = "1";

											var pageTest2 = {
												title : '共有权人编辑',
												leftButton : {
													name : '返回',
													func : 'curView.back()'
												},
												rightButton : {
													name : ''
												}
											}
											Client.initPageTitle(pageTest2);

										});

									})

					$("#spousecertNo").change(function() {

						var spousecertNo = $("#spousecertNo").val();
						var spouseBirthDay = spousecertNo.substring(6, 14);
						$("#spousebirth").val(spouseBirthDay);
					});

					$("#workplace").change(function() {

						var workplace = $("#workplace").val();
						if (workplace == "无") {

							$("#applyerWorkAddr").hide();
							$("#workAddr").val("");

						} else {
							$("#applyerWorkAddr").show();
						}
					});

					$("#gongjijingnum").change(function() {
						var gongjijingnum = $("#gongjijingnum").val();
						if (gongjijingnum % 1 == 0) {
							gongjijingnum = gongjijingnum + '.00';
							$("#gongjijingnum").val(gongjijingnum);
						}

					});
					$("#monthlyIncome").change(function() {
						var monthlyIncome = $("#monthlyIncome").val();
						if (monthlyIncome % 1 == 0) {
							monthlyIncome = monthlyIncome + '.00';
							$("#monthlyIncome").val(monthlyIncome);
						}

					});

					$("#otherloannum").change(function() {
						var otherloannum = $("#otherloannum").val();
						if (otherloannum % 1 == 0 || otherloannum == "0") {
							otherloannum = otherloannum + '.00';
							$("#otherloannum").val(otherloannum);
						}

					});
					$("#spouseFunderNo").change(function() {
						var spouseFunderNo = $("#spouseFunderNo").val();
						if (spouseFunderNo % 1 == 0) {
							spouseFunderNo = spouseFunderNo + '.00';
							$("#spouseFunderNo").val(spouseFunderNo);
						}

					});
					$("#shareIncome").change(function() {
						var shareIncome = $("#shareIncome").val();
						if (shareIncome % 1 == 0) {
							shareIncome = shareIncome + '.00';
							$("#shareIncome").val(shareIncome);
						}

					});
					function shareinfo() {
						var shareInfo = Utils.trim($("#spouseshareName").text()) + "|"
								+ Utils.trim($("#spouseshareCertNo").text()) + "|"
								+ Utils.trim($("#spouseshareCom").text()) + "|"
								+ Utils.trim($("#spouseshareIncome").text()) + "|"
								+ Utils.trim($("#spousesharePhone").text()) + "|2";

						$("#marital").attr("data-value", shareInfo);

					}
					// 姓名
					$("#spouseName").change(function() {
						$("#spouseshareName").text($("#spouseName").val());
						shareinfo();
					});
					// 联系电话
					$("#spouseMobilePhone").change(function() {
						$("#spousesharePhone").text($("#spouseMobilePhone").val());
						shareinfo();
					});
					// 月收入
					$("#spouseIncome").change(function() {
						var spouseIncome = $("#spouseIncome").val();
						if (spouseIncome % 1 == 0) {
							spouseIncome = spouseIncome + '.00';
							$("#spouseIncome").val(spouseIncome);
						}

						$("#spouseshareIncome").text($("#spouseIncome").val());
						shareinfo();
					});
					// 身份证号码
					$("#spousecertNo").change(function() {
						$("#spouseshareCertNo").text($("#spousecertNo").val());
						shareinfo();
					});

					// 公司名称
					$("#suposeworkplace").change(function() {
						$("#spouseshareCom").text($("#suposeworkplace").val());
						shareinfo();
					});

				},

				deletewife : function(index) {
					$('.delete').eq(index).parents(".itm").remove();
				},

				Back : function() {

					var selbox = $('.selectBox');
					selbox.remove();
					App.back();

				},

				cancel : function() {
					alert(App.browseList.indexOf("houseloan/houseloanCtl/loanCenter"));
					var selbox = $('.selectBox');
					selbox.remove();
					App.navigate("houseloan/houseloanCtl/loanCenter");
				},
				toapplyercom : function() {

					var $this = this;
					$this.iShareInfoStr = "";
					$('#crightBox .itm:visible').each(function(i, e) {
						$this.iShareInfoStr += $(this).attr("data-value") + "#";
					});

					var contractnum2 = App.storage.get("contractnum");

					var msg = "";
					$("input:visible").each(function() {
						if ($(this).attr("id") == "emailaddress" || $(this).attr("id") == "suposecompanyphone") {
							return;
						}
						var value = $(this).val();
						if (!value) {
							msg = $(this).attr("placeholder");
							return false;
						}
					});
					if (msg) {
						Utils.alertinfo(msg);
						return false;
					}
					

					var spousecertNo = $("#spousecertNo").val();
					if (spousecertNo) {
						if (!this.checkCertNo18(spousecertNo)) {
							Utils.alertinfo("配偶身份证号格式不正确");
							return;
						}
					}
					//

					if ($("#nowaddrstatus input").val() == "请选择"||$("#nowaddrstatus input").val() == "") {
						Utils.alertinfo("请选择申请人现住址状况");
						return;
					}
					if ($("#hjaddress input").val() == "请选择"||$("#hjaddress input").val() == "") {
						Utils.alertinfo("请选择申请人户籍");
						return;
					}
					if ($("#topdiplomas input").val() == "请选择"||$("#topdiplomas input").val() == "") {
						Utils.alertinfo("请选择申请人最高学历");
						return;
					}
					if ($("#dutyposition input").val() == "请选择"||$("#dutyposition input").val() == "") {
						Utils.alertinfo("请选择申请人行政职务");
						return;
					}
					if ($("#technicalpost input").val() == "请选择"||$("#technicalpost input").val() == "") {
						Utils.alertinfo("请选择申请人职称");
						return;
					}
					if ($("#postAddr input").val() == "请选择"||$("#postAddr input").val() == "") {
						Utils.alertinfo("请选择申请人通讯地址");
						return;
					}
					if ($("#maritalStatus input").val() == "请选择"||$("#maritalStatus input").val() == "") {
						Utils.alertinfo("请选择婚姻状况");
						return;
					}
					if (($("#suposehjaddress input").val() == "请选择")&&($("#maritalStatus input").val() == "已婚")) {
						Utils.alertinfo("请选择配偶户籍");
						return;
					}
					if (($("#suposetopdiplomas input").val() == "请选择")&&($("#maritalStatus input").val() == "已婚")) {
						Utils.alertinfo("请选择配偶最高学历");
						return;
					}
					if (($("#suposedutyposition input").val() == "请选择")&&($("#maritalStatus input").val() == "已婚")) {
						Utils.alertinfo("请选择配偶行政职务");
						return;
					}
					if (($("#suposetechnicalpost input").val() == "请选择")&&($("#maritalStatus input").val() == "已婚")) {
						Utils.alertinfo("请选择配偶职称");
						return;
					}

					if ($("#comRightSign input").val() == "是" && $("#crightBox .marry").length <= 0) {
						Utils.alertinfo("配偶作为共有权人时，需有配偶信息");
						return;
					}
					if ($("#comRightSign input").val() == "否" && $("#crightBox .marry").length > 0) {
						Utils.alertinfo("当共有权人信息中有配偶时，共有权人标识不能为否");
						return;
					}
					if ($("#maritalStatus input").val() == "未婚" && $("#crightBox .marry").length > 0) {
						Utils.alertinfo("未婚时，配偶不应为共有权人");
						return;
					}
					if ($("#maritalStatus input").val() == "已婚" && $("#comRightSign input").val() == "是"
							&& $("#crightBox .marry").length <= 0) {
						Utils.alertinfo("已婚配偶作为共有权人时，需有配偶信息");
						return;
					}
					
					var spouseFunderNo = $("#spouseFunderNo").val();
					if (spouseFunderNo) {
						if (!this.checkmoney(spouseFunderNo)) {
							Utils.alertinfo("配偶公积金缴存额格式不对（如999999999.99）或者金额过大", "1");
							return;
						}
					}
					var spouseIncome = $("#spouseIncome").val();
					if (spouseIncome) {
						if (!this.checkmoney(spouseIncome)) {
							Utils.alertinfo("配偶月收入格式不对（如999999999.99）或者金额过大", "1");
							return;
						}
					}
					var monthlyIncome = $("#monthlyIncome").val();
					if (monthlyIncome) {
						if (!this.checkmoney(monthlyIncome)) {
							Utils.alertinfo("申请人月收入格式不对（如999999999.99）或者金额过大", "1");
							return;
						}
					}
					var otherloannum = $("#otherloannum").val();
					if (otherloannum) {
						if (!this.checkmoney(otherloannum)) {
							Utils.alertinfo("其他贷款月还款额格式不对（如999999999.99）或者金额过大", "1");
							return;
						}
					}
					var gongjijingnum = $("#gongjijingnum").val();
					if (gongjijingnum) {
						if (!this.checkmoney(gongjijingnum)) {
							Utils.alertinfo("申请人公积金缴存额格式不对（如999999999.99）或者金额过大", "1");
							return;
						}
					}

					var spouseMobilePhone = $("#spouseMobilePhone").val();
					if (spouseMobilePhone) {
						if (!this.checkMobile(spouseMobilePhone)) {
							Utils.alertinfo("配偶手机号格式不正确");
							return;
						}
					}
					;
					var emailaddress = $("#emailaddress").val();
					if (emailaddress) {
						if (!this.checkemail(emailaddress)) {
							Utils.alertinfo("电子邮箱格式不正确");
							return;
						}
					}
					;
					// 邮编一
					var postaladdress = $("#postaladdress").val();
					if (postaladdress) {
						if (!this.checkepostcode(postaladdress) || postaladdress.length != "6") {
							Utils.alertinfo("现住址邮编格式不正确");
							return;
						}
					}
					;
					// 邮编二
					var post2 = $("#post2").val();
					if (post2) {
						if (!this.checkepostcode(post2) || post2.length != "6") {
							Utils.alertinfo("单位邮编格式不正确");
							return;
						}
					}
					;
					// 邮编三
					/*
					 * var post3 = $("#post3").val(); if (post3) { if (!this.checkepostcode(post3) || post3.length != "6") {
					 * Utils.alertinfo("通讯地址邮编格式不正确"); return; } } ;
					 */

					var suposecompanyphone = $("#suposecompanyphone").val();

					if (suposecompanyphone) {
						if (!this.checkMobilePhone(suposecompanyphone)) {
							Utils.alertinfo("配偶单位电话格式不正确(xxxx-xxxxxxxx)");
							return;
						}
					}
					;
					var companyphone = $("#companyphone").val();

					if (companyphone) {
						if (!this.checkMobilePhone(companyphone)) {
							Utils.alertinfo("申请人单位电话格式不正确(xxxx-xxxxxxxx)");
							return;
						}
					}
					;

					var nowaddress = $("#nowaddress").val();

					if (nowaddress) {
						if (nowaddress.length > 25) {
							Utils.alertinfo("申请人现住址长度过长");
							return;
						}
					}
					;

					// 配偶姓名
					var spouseName = $("#spouseName").val();

					if (spouseName) {

						if (!this.checkname(spouseName) || spouseName.length > 20) {
							Utils.alertinfo("配偶姓名格式不正确");
							return;
						}
					}
					;

					var certNOList = [];
					$("#crightBox .sharespanCertNO").each(function() {
						certNOList.push($(this).text());
					});
					for (var i = 0; i < certNOList.length; i++) {
						for (var j = 0; j < certNOList.length; j++) {
							if (i != j && certNOList[i] == certNOList[j]) {
								Utils.alertinfo("身份证号不能重复");
								return;
							}
						}
					}

					var firstinfo = App.storage.get("firstinfo");
					firstinfo.email = $("#emailaddress").val();
					firstinfo.censusRegister = this.hjaddress, firstinfo.presentAddress = $("#nowaddress").val();
					firstinfo.nowAddressStatus = this.nowaddrstatus, firstinfo.postalCode = $("#postaladdress").val();
					firstinfo.workPlace = $("#workplace").val();
					firstinfo.workAddr = $("#workAddr").val();
					firstinfo.companyPhone = $("#companyphone").val();
					firstinfo.postalCode2 = $("#post2").val();
					firstinfo.fundNumber = $("#gongjijingnum").val();
					firstinfo.monthlyIncome = $("#monthlyIncome").val();
					firstinfo.otherLoanNumber = $("#otherloannum").val();
					firstinfo.topDiplomas = this.topdiplomas;
					firstinfo.dutyPosition = this.dutyposition;
					firstinfo.technicalpost = this.technicalpost;
					firstinfo.postAddress = this.postAddr;
					firstinfo.maritalStatus = this.maritalStatus;
					firstinfo.spouseName = $("#spouseName").val();
					firstinfo.spouseCertNo = $("#spousecertNo").val();
					firstinfo.spouseFundNumber = $("#spouseFunderNo").val();
					firstinfo.spouseMonthlyIncome = $("#spouseIncome").val();
					firstinfo.spouseCensusRegister = this.suposehjaddress;
					firstinfo.spouseBirthday = $("#spousebirth").val();
					firstinfo.spouseDiplomas = this.suposetopdiplomas;
					firstinfo.spouseDutyPosition = this.suposedutyposition;
					firstinfo.spouseTechnicalpost = this.suposetechnicalpost;
					firstinfo.spouseWorkPlace = $("#suposeworkplace").val();
					firstinfo.spouseCompanyPhone = $("#suposecompanyphone").val();
					firstinfo.spouseShareMark = this.comRightSign;
					firstinfo.spouseMobileNo = $("#spouseMobilePhone").val();
					firstinfo.shareRelation = this.shareRelation;
					firstinfo.strs = this.iShareInfoStr;

					var iShare = [];
					if (this.iShareInfoStr) {
						var sharein = this.iShareInfoStr.substring(0, this.iShareInfoStr.length - 1);
						iShare = sharein.split("#");
					}
					firstinfo.iShareInfo = [];
					for (var i = 0; i < iShare.length; i++) {
						var curiShareInfo = iShare[i];

						var curiShare = curiShareInfo.split("|");
						var info = {
							shareName : curiShare[0],
							shareCertNo : curiShare[1],
							shareWorkPlace : curiShare[2],
							shareMonthlyIncome : curiShare[3],
							shareMobileNo : curiShare[4],
							shareRelation : curiShare[5]
						}
						firstinfo.iShareInfo.push(info);
					}

					App.storage.set("firstinfo", firstinfo);

					// -----------------------------------------------------------------------------------------------------

					
					var param2 = {
						email : $("#emailaddress").val(),
						censusRegister : this.hjaddress,
						presentAddress : $("#nowaddress").val(),
						nowAddressStatus : this.nowaddrstatus,
						postalCode : $("#postaladdress").val(),
						workPlace : $("#workplace").val(),
						workAddr : $("#workAddr").val(),
						companyPhone : $("#companyphone").val(),
						postalCode2 : $("#post2").val(),
						fundNumber : $("#gongjijingnum").val(),
						monthlyIncome : $("#monthlyIncome").val(),
						otherLoanNumber : $("#otherloannum").val(),
						topDiplomas : this.topdiplomas,
						dutyPosition : this.dutyposition,
						technicalpost : this.technicalpost,
						postAddress : this.postAddr,
						maritalStatus : this.maritalStatus,
						spouseName : $("#spouseName").val(),
						spouseCertNo : $("#spousecertNo").val(),
						spouseFundNumber : $("#spouseFunderNo").val(),
						spouseMonthlyIncome : $("#spouseIncome").val(),
						spouseCensusRegister : this.suposehjaddress,
						spouseBirthday : $("#spousebirth").val(),
						spouseDiplomas : this.suposetopdiplomas,
						spouseDutyPosition : this.suposedutyposition,
						spouseTechnicalpost : this.suposetechnicalpost,
						spouseWorkPlace : $("#suposeworkplace").val(),
						spouseCompanyPhone : $("#suposecompanyphone").val(),
						spouseShareMark : this.comRightSign,
						spouseMobileNo : $("#spouseMobilePhone").val(),
						shareRelation : this.shareRelation,
						strs : this.iShareInfoStr,

						contractnum : App.storage.get("firstinfo").contractnum,
						certNo : App.storage.get("CetrNo"),
						userName : $("#applyername").text(),
						certType : "00",
						mobileNo : $("#mobileNo").text()

					};

					App.storage.set("applyerinfo", param2);
					Client.openWaitPanel("拼命加载中，请稍候");

					Ajax({
						url : "/houseloan/houseloansteptwo",
						data : param2,
						success : function(data) {
							if (MUI.isEmpty(data.errorCode)) {

								App.navigate("houseloan/houseloanCtl/loaninfo");

							} else {

								Client.alertinfo(data.errorMessage, "提醒");
							}
							Client.hideWaitPanel(1);

						}
					});

				},
				// 身份证检测
				checkCertNo18 : function(certNo) {
					if (Utils.isEmpty(certNo) || Utils.containSpecial(certNo) || certNo.length != 18) {
						Utils.alertinfo("您输入的身份证号有误，请重新输入");
						return false;
					} else {
						if (certNo.substring(17, 18) == 'x') {
							certNo = certNo.substring(0, 17) + 'X';
							$('#input_certNo').val(certNo);
						}
						if (Utils.IdentityCodeValid(certNo)) {
							return true;
						} else {
							Utils.alertinfo("您输入的身份证号有误，请重新输入");
							return false;
						}
					}
				},
				// ---------------------------------------------------------------------------------------------------------
				checkmoney : function(amtShow) {
					if (Utils.isEmpty(amtShow)) {
						Utils.alertinfo("请输入金额");
						return false;
					} else if (Utils.isMoney(amtShow)) {
						return true;
					} else {

						return false;
					}
				},
				checkemail : function(email) {
					if (Utils.isEmail(email)) {
						return true;
					} else {
						return false;
					}
				},
				checkepostcode : function(code) {
					if (Utils.isNum(code)) {
						return true;
					} else {

						return false;
					}
				},

				checkname : function(name) {
					if (Utils.isName(name)) {
						return true;
					} else {

						return false;
					}
				},

				checkMobilePhone : function(phone) {
					if (Utils.isMobile(phone)) {
						return true;
					} else {

						return false;
					}
				},

				checkMobile : function(mobile) {
					if (Utils.isEmpty(mobile) || !Utils.isNum(mobile) || mobile.length != 11) {
						return false;
					} else {
						if (mobile.indexOf('13') == 0 || mobile.indexOf('14') == 0 || mobile.indexOf('15') == 0
								|| mobile.indexOf('17') == 0 || mobile.indexOf('18') == 0) {
							return true;
						} else {
							return false;
						}
					}
				},

				back : function() {
					$('#comRightFill').hide().siblings('.loanApp').show();
					var selbox = $('.selectBox');
					selbox.remove();
					var pageTest = {
						title : '贷款申请',
						leftButton : {
							name : '返回',
							func : 'curView.Back()'
						},
						rightButton : {
							name : ''
						}
					}
					Client.initPageTitle(pageTest);
				},

			});
});
