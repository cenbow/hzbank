define(function(require, exports, module) {

	var TaxcalculateTemplate = require("text!../template/taxcalculate.html");

	var TaxcalculateView = module.exports = ItemView.extend({

		template : TaxcalculateTemplate,

		events : {
			"click #newhouse" : "tonewhouse",
			"click #oldhouse" : "tooldhouse",
			"click #nonormalhouse" : "tononormalhouse",
			"click #econmichouse" : "toeconmichouse",
			"click #normalhouse" : "tonormalhouse",
			"click #econmichouse" : "toeconmichouse",
			"click #taxcalculate" : "totaxcalculate",
			"click #housecardyear11 a" : "tohousecardyear11",

		},

		initialize : function() {
			var pageTest = {
				title : '税费计算器',
				leftButton : {
					name : '返回',
					func : 'curView.goToBack()'
				},
				rightButton : {
					name : ''
				}
			}
			Zepto(function($) {
				$('.zen-switch-tab a, .switch-tab a, .houseTyp .cell').on('click', function() {
					$(this).addClass('active').siblings().removeClass('active');
				})
			})

			Client.initPageTitle(pageTest);
			Client.hideWaitPanel(10);
			
			
			
			var houseTypeagain = Utils.search().houseTypeagain;
			
			if(houseTypeagain=="2"){
				

				$("#newhouse").addClass("active");
				$("#oldhouse").removeClass("active")

				$("#houseType").hide();
				$("#housecardyear").hide();
				$("#sellhouse").hide();
				$("#housetips").hide();
			}
	
		
		},

		goToBack : function() {
			App.back();
		},

		// 新房
		tonewhouse : function() {
			$("#newhouse").addClass("active");
			$("#oldhouse").removeClass("active")

			$("#houseType").hide();
			$("#housecardyear").hide();
			$("#sellhouse").hide();
			$("#housetips").hide();

		},

		tohousecardyear11 : function() {

			var housecardyear = $("#housecardyear11 .active").attr("val");
			if (housecardyear == "bb" || housecardyear == "cc") {

				$("#houseyuanjia").show();

			} else {

				$("#houseyuanjia").hide();

			}

		},

		// 二手房
		tooldhouse : function() {
			$("#oldhouse").addClass("active")
			$("#newhouse").removeClass("active");

			$("#houseType").show();
			$("#housecardyear").show();
			$("#sellhouse").show();
			$("#housetips").hide();

		},
		// 非普通住宅
		tononormalhouse : function() {

			$("#firstbuyhouse").hide();
			$("#sellhouse").hide();
			$("#housetips").hide();
			$("#housecardyear").show();

		},
		// 普通住宅
		tonormalhouse : function() {

			$("#housecardyear").show();
			$("#firstbuyhouse").show();
			$("#sellhouse").show();
			$("#houseyuanjia").hide();
			$("#housetips").hide();

		},

		// 经济适用房
		toeconmichouse : function() {

			$("#firstbuyhouse").show();
			$("#housetips").show();
			$("#houseyuanjia").show();
			$("#sellhouse").hide();
			$("#housecardyear").hide();

			$("#houseyuanjia").hide();

		},

		totaxcalculate : function() {

			var houseType = $(".zen-tab-nav .active").attr("val");
			var houseType2 = "";
			if (houseType == "1") {
				houseType2 = $("#typeRow .active").attr("val");

				if (houseType2 == "1") {
					var housearea = $("#housearea").val();
					var houseprice = parseFloat($("#houseprice").val()) * 10000;
					
					if(housearea.length=="0"||$("#houseprice").val().length=="0"){
						
						Utils.alertinfo("请输入完整后再计算哦~",'words',2000);
						return;
						
					}else{
					
					
					// 是否首次购房
					var iffirst = $('#firstbuyhouse .active').attr("val");
					// 房产证年限
					var housecardyear = $("#housecardyear11 .active").attr("val");
					// 卖方唯一住房
					var sellonlyhouse = $("#sellhouse .active").attr("val");

					var firsttax = "";

					if (iffirst == "no" || housearea >= 145) {

						var firsttax = houseprice * 0.03;
					} else if (housearea >= 90 && housearea < 145) {
						var firsttax = houseprice * 0.015;
					} else if (housearea < 90) {
						var firsttax = houseprice * 0.01;
					}
					;

					var yingyesuodetax = "";

					if (housecardyear == "aa") {
						var yingyesuodetax = houseprice * 0.0555;
					} else {
						var yingyesuodetax = parseInt("0");
					}
					;

					var yingyefujiatax = "";

					if (housecardyear == "aa") {
						var yingyefujiatax = houseprice * 0.00555;
					} else {
						var yingyefujiatax = parseInt("0");
					}

					var personhavetax = "";
					if (housecardyear == "cc" && sellonlyhouse == "yes1") {

						var personhavetax = parseInt("0");

					} else {

						var personhavetax = houseprice * 0.01;

					}

					var nomalyinghua = parseInt("5");

					var normaltotaltax = firsttax + yingyesuodetax + yingyefujiatax + personhavetax + nomalyinghua;

					var normaltax = {

						"firsttax" : firsttax,
						"yingyesuodetax" : yingyesuodetax,
						"yingyefujiatax" : yingyefujiatax,
						"personhavetax" : personhavetax,
						"nomalyinghua" : nomalyinghua,
						"normaltotaltax" : normaltotaltax

					};

					App.storage.set("normaltax", normaltax);
					}

				} else if (houseType2 == "2") {

					// 房屋面积
					var housearea = $("#housearea").val();

					// 房屋原价
					var houseprice = parseFloat($("#houseprice").val()) * 10000;
					

					if(housearea.length=="0"||$("#houseprice").val().length=="0"){
						
						Utils.alertinfo("请输入完整后再计算哦~",'words',2000);
						return;
						
					}else{
					

					// 房屋原价2
					var houseprice2 = parseFloat($("#houseprice").val());

					// 契税
					var nonormalqs = houseprice * 0.03;

					// 印花税
					var nonomalyinghua = parseInt("5");

					// 营业所得税
					var housecardyear6 = $("#housecardyear11 .active").attr("val");
					var nonomalyytax = "";
					var noyysdtax = "";
					var nonomalhavetax = "";
					if (housecardyear6 == "aa") {
						var nonomalyytax = houseprice * 0.056;
						var noyysdtax = houseprice * 0.0056;
						var nonomalhavetax = houseprice * 0.2;
					} else if (housecardyear6 == "bb" || housecardyear6 == "cc") {
						var housebefo = $("#houseyuanjiatax").val();
						
						if(housebefo.length=="0")
						
						
						{
							Utils.alertinfo("请输入完整后再计算哦~",'words',2000);
							return;
							
							
						}else{

						if (housebefo > houseprice2) {
							Utils.alertinfo("房屋原价不能大于总价",'words',2000);
						//	alert("房屋原价不能大于总价");
							return;
						} else {

							var nonomalyytax = (houseprice - housebefo) * 0.056;
							var noyysdtax = (houseprice - housebefo) * 0.0056;
							var nonomalhavetax = (houseprice - housebefo) * 0.2;
						}
					}
					}
					// 总计
					var nonmaltotal = nonormalqs + nonomalhavetax + nonomalyinghua + nonomalyytax + noyysdtax;

					var nonormaltax = {

						"nonormalqs" : nonormalqs,
						"nonomalyytax" : nonomalyytax,
						"noyysdtax" : noyysdtax,
						"nonomalhavetax" : nonomalhavetax,
						"nonomalyinghua" : nonomalyinghua,
						"nonmaltotal" : nonmaltotal

					};

					App.storage.set("nonormaltax", nonormaltax);
					
					}

				} else if (houseType2 == "3") {

					var housearea = $("#housearea").val();
					var houseprice = parseFloat($("#houseprice").val()) * 10000;
					
					if($("#housearea").val().length=="0"||$("#houseprice").val().length=="0"){
						
						
						Utils.alertinfo("请输入完整后再计算哦~",'words',2000);
						return;
						
						
					}else{
					
					
					// 是否首次购房
					var iffirst = $('#firstbuyhouse .active').attr("val");

					var firstqishuitax = "";
					if (iffirst == "no" || housearea > 140) {

						var firstqishuitax = houseprice * 0.03;
					} else if (housearea >= 90 && housearea <= 140) {
						var firstqishuitax = houseprice * 0.015;
					} else if (housearea < 90) {
						var firstqishuitax = houseprice * 0.01;
					}
					;

					// 个人所得税
					var ecomperson = houseprice * 0.01;
					// 印花税

					var ecomyinhua = parseInt("5");

					// 综合地价税

					var totaldiji = houseprice * 0.1;

					var taxplus = firstqishuitax + ecomperson + totaldiji + ecomyinhua;

					var ecommaltax = {

						"firstqishuitax" : firstqishuitax,
						"ecomperson" : ecomperson,
						"ecomyinhua" : ecomyinhua,
						"totaldiji" : totaldiji,
						"taxplus" : taxplus

					};

					App.storage.set("ecommaltax", ecommaltax);
					}

				}

			} else if (houseType == "2") {

				var housearea = $("#housearea").val();
				// 单位元
				var houseprice = parseFloat($("#houseprice").val()) * 10000;
				
				if(housearea.length=="0"||$("#houseprice").val().length=="0"){
					
					Utils.alertinfo("请输入完整后再计算哦~",'words',2000);
					return;
					
					
					
				}else{
					
					
				// alert(houseprice);
				var newhouseqs = "";

				var iffirst = $('#firstbuyhouse .active').attr("val");

				if (iffirst == "yes") {

					if (housearea < 90) {
						var newhouseqs = houseprice * 0.01;
					} else if (housearea >= 90 && housearea < 145) {
						var newhouseqs = houseprice * 0.015;
					} else if (housearea >= 145) {
						var newhouseqs = houseprice * 0.03;
					}
					// var yinhuatax =
				} else {
					var newhouseqs = houseprice * 0.03;
				}
				;

				var yinhuatax = houseprice * 0.0005;

				var fangwutax = houseprice * 0.02;

				var jiaoyitax = housearea * 3;

				var quanshutax = parseInt("80");

				var totaltax = newhouseqs + yinhuatax + fangwutax + jiaoyitax + quanshutax;

				var newhousetax = {

					"newhouseqs" : newhouseqs,
					"yinhuatax" : yinhuatax,
					"fangwutax" : fangwutax,
					"jiaoyitax" : jiaoyitax,
					"quanshutax" : quanshutax,
					"totaltax" : totaltax

				};

				App.storage.set("newhousetax", newhousetax);
				}

			}

			App.navigate("houseloan/houseloanCtl/taxcalculateresult?houseType=" + houseType + "&houseType2="
					+ houseType2);

		}

	});

});