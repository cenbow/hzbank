define(function(require, exports, module) {

	var LoancalculateTemplate = require("text!../template/loancalculate.html");

	var LoancalculateView = module.exports = ItemView.extend({

		template : LoancalculateTemplate,
		events : {

			"click #commercialloan" : "tocommercialloan",
			"click #fundloan" : "tofundloan",
			"click #mixloan" : "tomixloan",
			"click #loancalResult" : "toloancalResult"

		},

		initialize : function() {
			var pageTest = {
				title : '房贷计算器',
				leftButton : {
					name : '返回',
					func : 'curView.goToBack()'
				},
				rightButton : {
					name : ''
				}
			}
			Client.initPageTitle(pageTest);
			Client.hideWaitPanel(10);
			// 页面插件
			var $this = this;
			Zepto(function($) {
				var term = $('#term');
				term.on('click', function() {
					var stage = $('#stage');
					stage.show();
					var opts = stage.find('.list-item');
					opts.on('click', function() {
						var txtyear = $(this).text();
						// alert(txt);
						term.find('.cell').text(txtyear);
						stage.hide();
						App.storage.set("txtyear", txtyear);

					})
				})

				// ////////////////////////////////////////
				$('.switch-tab a').on('click', function() {
					$(this).addClass('active').siblings().removeClass('active');

				})

				// ////////////////////////////////////////
				var bzl = $('#bzlorate');
				var bzlIpt = bzl.find('input');
				var mtpa = bzl.find('.mtpa');
				var mtpb = bzl.find('.mtpb');
				bzl.on('click', function() {
					var discount = $('#discount');
					discount.show();

					var dzOpts = discount.find('#dizct li');
					var rtOpts = discount.find('#blrt li');

					function setParam(cur) {
						mtpa.hide();
						mtpb.hide();
						// alert(cur.attr("data-value"));
						App.storage.set("loanbeishu", cur.attr("data-value"));
						this.txt = cur.find('.itm').text();
						if (txt != '手动输入优惠折扣' && txt != '手动输入上浮倍数') {
							if (txt == '基准利率')
								txt = '无折扣';
							cur.addClass('active').siblings().removeClass('active');
							bzlIpt.attr('readonly', true);
							bzlIpt.val(txt);
						} else {
							txt == '手动输入上浮倍数' ? mtpa.show() : mtpa.hide();
							txt == '手动输入优惠折扣' ? mtpb.show() : mtpb.hide();
							bzlIpt.removeAttr('readonly');
							bzlIpt.val('').focus();
						}
						discount.hide();
					}

					dzOpts.on('click', function() {
						setParam($(this));
						//
						$("#rate").off().on("keyup",function(){
			        		var text = $(this).val();
			        		if(!Utils.isOneNum(text)){
			        			text = text.substring(0,text.length-1);
			        			$(this).val(text);
			        		}
			        	});
						
					})

					rtOpts.on('click', function() {
						setParam($(this));
						//
						
						
						$("#rate").off().on("keyup",function(){
			        		var text = $(this).val();
			        		
			        		if(text.indexOf(".") == text.length-1){
			        			return;
			        		}
			        		if(!Utils.isDecimal(text)){
			        			text = text.substring(0,text.length-1);
			        			$(this).val(text);
			        		}else if(text < 1 || text >= 10){
			        			text = text.substring(0,text.length-1);
			        			$(this).val(text);
			        		}
			        	});
						
						
					})

				})
			})
			
			
			
			var returntype2 = Utils.search().returntype;
			
			if(returntype2=="2"){
				
				$("#commercialloan").removeClass("active");
				$("#fundloan").addClass("active");
				$("#mixloan").removeClass("active");
				$("#gongjjingnum").show();
				$("#gongjijinglilv").show();
				$("#term").show();
				$("#bzlorate").hide();
				$("#shangyeloan").hide();
				
				
			}else if(returntype2=="3"){
				
				$("#commercialloan").removeClass("active");
				$("#fundloan").removeClass("active");
				$("#mixloan").addClass("active");
				$("#gongjjingnum").show();
				$("#shangyeloan").show();
				$("#bzlorate").show();
				$("#term").show();
				$("#gongjijinglilv").show();
				
				
			}
			

			
			
		
		},

		goToBack : function() {
			App.back();
		},

		tocommercialloan : function() {

			$("#commercialloan").addClass("active");
			$("#fundloan").removeClass("active");
			$("#mixloan").removeClass("active");

			$("#gongjijinglilv").hide();
			$("#gongjjingnum").hide();
			$("#shangyeloan").show();
			$("#term").show();
			$("#bzlorate").show();
		},

		tofundloan : function() {

			$("#commercialloan").removeClass("active");
			$("#fundloan").addClass("active");
			$("#mixloan").removeClass("active");
			$("#gongjjingnum").show();
			$("#gongjijinglilv").show();
			$("#term").show();
			$("#bzlorate").hide();
			$("#shangyeloan").hide();

		},

		tomixloan : function() {

			$("#commercialloan").removeClass("active");
			$("#fundloan").removeClass("active");
			$("#mixloan").addClass("active");
			$("#gongjjingnum").show();
			$("#shangyeloan").show();
			$("#bzlorate").show();
			$("#term").show();
			$("#gongjijinglilv").show();

		},
		checkDisRate : function(rate) {
			if (Utils.isOneNum(rate)||Utils.isSpecFloat(rate)) {
				return true;
			} else {
				return false;
			}
		},

		toloancalResult : function() {
			
			if($("#chooseyear").text()=="请选择年限"){
				
				Utils.alertinfo("请选择贷款期限");
				return;
				
				
			}

			var loanType = $(".zen-tab-nav .active").attr("val");
			var loanrate = $("#rate").val();
			
			if($('.mtpb').is(":visible")){ //折
				if(!loanrate || !this.checkDisRate(loanrate)){
					Utils.alertinfo("折扣输入格式不正确");
					return;
				}
			}else if ($('.mtpa').is(":visible")){ //倍
				if(!loanrate || !this.checkDisRate(loanrate)){
					Utils.alertinfo("倍数输入格式不正确");
					return;
				}
			}else if(loanType!="2" && !loanrate){
				Utils.alertinfo("请选择商贷利率");
				return;
			}
	
			if (loanType == "1") {

				// 本金（万）
				var loannum1 = parseFloat($("#shangyeloan1").val());
				// 本金
				var loannum2 = loannum1 * 10000;
				// 年限
				var txtline = App.storage.get("txtyear");
				var monthNum = parseInt(txtline.substring(4, 7));
				// 月份

				var loancomrate = "";

				if ($("#shangyeloan1").val().length == "0" || $("#rate").val().length == "0") {

					Utils.alertinfo("请输入完整后再计算哦~", 'words', 2000);
					return;

				} else {

					// 折扣
					if ($('.mtpb').is(":visible") || loanrate.indexOf("折") >= 0) {
						// alert(loanrate);
						if (loanrate == "无折扣") {

							var loancomrate = 0.049;

						} else {
							loanrate = loanrate.replace("折", "");
							if(loanrate.length=="1"){
								
								loanrate = loanrate*10;
							}
							
						
							var loancomrate = 0.049 * loanrate / 100;
						}
					} else {
						

						loanrate = loanrate.replace("倍", "");
						var loancomrate = loanrate * 0.049;
						
					}
					;

					// alert(loancaldis);
					// 等额本利息法
					var aaa = Math.pow((1 + loancomrate / 12), monthNum);
					// 每月还款额
					var mouthpay = (loannum2 * (loancomrate / 12) * aaa) / (aaa - 1);
					// 总利息
					var totallixi = mouthpay * monthNum - loannum2;
					// 本息合计
					var bengxiheji = totallixi + loannum2;
					// 贷款金额
					var loannum1;
					// 贷款期限
					var yearNum = monthNum / 12;

					var commercialloan = {

						"mouthpay" : mouthpay,
						"totallixi" : totallixi,
						"bengxiheji" : bengxiheji,
						"loannum1" : loannum1,
						"yearNum" : yearNum
					};

					App.storage.set("commercialloan", commercialloan);

					// 等额本金法
					// 每月还款额
					var sameloanpay = (loannum2 / monthNum) + loannum2 * (loancomrate / 12);
					//每月递减
					var eachmonth = loannum2/monthNum*(loancomrate/12);
					
					// 总利息
					var totallixi2 = (monthNum + 1) * loannum2 * (loancomrate / 12) / 2;
					// 本息合计
					var bengxiheji2 = loannum2 + totallixi2;
					// 贷款金额
					var loannum1;
					// 贷款期限
					var yearNum = monthNum / 12;
					var commercialloan2 = {

						"sameloanpay" : sameloanpay,
						"totallixi2" : totallixi2,
						"bengxiheji2" : bengxiheji2,
						"loannum1" : loannum1,
						"yearNum" : yearNum,
						"eachmonth":eachmonth

					};

					App.storage.set("commercialloan2", commercialloan2);
				}

			} else if (loanType == "2") {
				// 公积金利率
				var lilv = $('.switch-tab .active').attr("val");

				// 本金（万）
				var loannum1 = parseFloat($("#gongjjingnum1").val());
				if ($("#gongjjingnum1").val().length == "0") {

					Utils.alertinfo("请输入完整后再计算哦~", 'words', 2000);
					return;

				} else {
					// 本金
					var loannum2 = loannum1 * 10000;
					// 年限原始
					var txtline = App.storage.get("txtyear");
					// 月份
					var monthNum = parseInt(txtline.substring(4, 7));
					// 年数
					var yearNum = monthNum / 12;

					// 等额本利息法
					var aaa = Math.pow((1 + lilv / 12), monthNum);
					// 每月还款额
					var mouthpay = (loannum2 * (lilv / 12) * aaa) / (aaa - 1);
					// 总利息
					var totallixi = mouthpay * monthNum - loannum2;
					// 本息合计
					var bengxiheji = totallixi + loannum2;
					// 贷款金额
					var loannum1;
					// 贷款期限
					var yearNum = monthNum / 12;

					var commercialloan3 = {

						"mouthpay" : mouthpay,
						"totallixi" : totallixi,
						"bengxiheji" : bengxiheji,
						"loannum1" : loannum1,
						"yearNum" : yearNum

					};

					App.storage.set("commercialloan3", commercialloan3);

					// 等额本金法
					// 每月还款额
					var sameloanpay = (loannum2 / monthNum) + loannum2 * (lilv / 12);
					// 总利息
					var totallixi2 = (monthNum + 1) * loannum2 * (lilv / 12) / 2;
					// 本息合计
					var bengxiheji2 = loannum2 + totallixi2;
					//每月递减
					var eachmonth = loannum2 / monthNum*(lilv / 12);
					
					// 贷款金额

					var loannum1;

					// 贷款期限
					var yearNum = monthNum / 12;

					var commercialloan4 = {

						"sameloanpay" : sameloanpay,
						"totallixi2" : totallixi2,
						"bengxiheji2" : bengxiheji2,
						"loannum1" : loannum1,
						"yearNum" : yearNum,
						"eachmonth" : eachmonth

					};

					App.storage.set("commercialloan4", commercialloan4);

				}

			} else if (loanType == "3") {
				var loanrate2 = $("#rate").val();
				var loancomrate = "";
				// 折扣
				if ($('.mtpb').is(":visible") || loanrate2.indexOf("折") >= 0) {
					
					if (loanrate == "无折扣") {

						var loancomrate = 0.049;

					} else {
						loanrate2 = loanrate.replace("折", "");
						
						if(loanrate2.length=="1"){
							
							loanrate2 = loanrate2*10;
						}
						
						var loancomrate = 0.049 * loanrate2 / 100;
					}
				
				}else {
						loanrate2 = loanrate.replace("倍", "");
						var loancomrate = loanrate2 * 0.049;
					
				};
				

				// 混合贷款
				// 公积金部分

				// 公积金利率
				var lilv = $('.switch-tab .active').attr("val");
				var lilv2 = parseFloat(lilv);
				// 公积金本金（万）
				var loannum1 = parseFloat($("#gongjjingnum1").val());
				// 本金
				var loannum2 = loannum1 * 10000;

				// 年限原始
				var txtline = App.storage.get("txtyear");
				// 月份
				var monthNum = parseInt(txtline.substring(4, 7));
				// 年数
				var yearNum = monthNum / 12;

				// 商贷部分
				// 商业本金（万）
				var loannum55 = parseFloat($("#shangyeloan1").val());
				// alert(55);
				// 本金
				var loannum66 = loannum55 * 10000;

				if ($("#gongjjingnum1").val().length == "0" || $("#shangyeloan1").val().length == "0") {

					Utils.alertinfo("请输入完整后再计算哦~", 'words', 2000);
					return;

				} else {

					// 等额本利息法
					// 公积金
					var aaa = Math.pow((1 + lilv2 / 12), monthNum);
					var bbb = Math.pow((1 + loancomrate / 12), monthNum);
					// 每月还款额
					var mouthpaygj = (loannum2 * (lilv2 / 12) * bbb) / (bbb - 1);
					var mouthpaycom = (loannum66 * (loancomrate / 12) * aaa) / (aaa - 1);
					var perMonth = mouthpaycom + mouthpaygj;
					// 总利息
					var totallixicom = mouthpaycom * monthNum - loannum66;
					var totallixigj = mouthpaygj * monthNum - loannum2;
					var perlixi = totallixicom + totallixigj;

					// 本息合计
					var bengxihejimix = totallixicom + loannum66 + loannum2 + totallixigj;
					// 贷款金额
					var loannummix = loannum1 + loannum55;
					// 贷款期限
					var yearNum = monthNum / 12;

					var commercialloan5 = {

						"perMonth" : perMonth,
						"perlixi" : perlixi,
						"bengxihejimix" : bengxihejimix,
						"loannummix" : loannummix,
						"yearNum" : yearNum

					};

					App.storage.set("commercialloan5", commercialloan5);

					// 等额本金法
					// 商业贷款
					var shangyecom = (loannum66 / monthNum) + loannum66 * (loancomrate / 12);
					// 商业利息
					var totallixicom = (monthNum + 1) * loannum66 * (loancomrate / 12) / 2;
					//商业每月递减
					var eachmonthcom = loannum66/monthNum*(loancomrate/12);
					// 本息合计
					var bengxihejicom = loannum66 + totallixicom;
					// 贷款金额
					var loannum55;
					// 贷款期限
					var yearNum = monthNum / 12;
					// 公积金月供
					// 每月还款额
					var gongjigj = (loannum2 / monthNum) + loannum2 * (lilv2 / 12);
					//公积每月递减
					var eachmonthgongji = loannum2/monthNum*(lilv2/12);
					// 公积金利息
					var totalgongji = (monthNum + 1) * loannum2 * (lilv2 / 12) / 2;
					// 本息合计
					var bengxihejigj = loannum2 + totalgongji;

					// 总月供
					var mixloangj = shangyecom + gongjigj;
					// alert(mixloangj);
					// 总利息
					var totalintrest = totallixicom + totalgongji;
					//总计少交
					var eachmonth = eachmonthcom+eachmonthgongji;
					// 本息合计
					var totlheji = bengxihejicom + bengxihejigj;
					// 贷款金额
					var loannummix2 = loannum1 + loannum55;
					// 贷款期限
					var yearNum2 = monthNum / 12;

					var commercialloan6 = {

						"mixloangj" : mixloangj,
						"totalintrest" : totalintrest,
						"totlheji" : totlheji,
						"loannummix2" : loannummix2,
						"yearNum2" : yearNum2,
						"eachmonth":eachmonth

					};

					App.storage.set("commercialloan6", commercialloan6);

				}
			}

			App.navigate("houseloan/houseloanCtl/loancalculateresult?loanType=" + loanType);

		}

	});

});