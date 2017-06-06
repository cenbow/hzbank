define(function(require, exports, module) {

	var loancalculateresultTemplate = require("text!../template/loancalculateresult.html");

	var loancalculateresultView = module.exports = ItemView.extend({

		template : loancalculateresultTemplate,

		events : {
			"click #loancultwice" : "toloancultwice",
			"click #sameloan" : "tosameloan",
			"click #samefundloan" : "tosamefundloan"

		},

		initialize : function() {
			var pageTest = {
				title : '计算结果',
				leftButton : {
					name : '返回',
					func : 'curView.goToBack()'
				},
				rightButton : {
					name : ''
				}
			}

			var loanType = Utils.search().loanType;

			if (loanType == "1") {

				var loanresult = App.storage.get("commercialloan");
				// alert(loanresult);
				$("#mouthpay").html((loanresult.mouthpay).toFixed(2));
				$("#wholelixi").html((loanresult.totallixi).toFixed(2));
				$("#totalpay").html((loanresult.bengxiheji).toFixed(2));
				$("#loanpay").html(loanresult.loannum1);
				$("#loanmonth").html(loanresult.yearNum);

			} else if (loanType == "2") {

				var loanresult3 = App.storage.get("commercialloan3");
				$("#mouthpay").html((loanresult3.mouthpay).toFixed(2));
				$("#wholelixi").html((loanresult3.totallixi).toFixed(2));
				$("#totalpay").html((loanresult3.bengxiheji).toFixed(2));
				$("#loanpay").html(loanresult3.loannum1);
				$("#loanmonth").html(loanresult3.yearNum);

			} else if (loanType == "3") {

				var commercialloan5 = App.storage.get("commercialloan5");

				$("#mouthpay").html((commercialloan5.perMonth).toFixed(2));
				$("#wholelixi").html((commercialloan5.perlixi).toFixed(2));
				$("#totalpay").html((commercialloan5.bengxihejimix).toFixed(2));
				$("#loanpay").html(commercialloan5.loannummix);
				$("#loanmonth").html(commercialloan5.yearNum);

			}

			Client.initPageTitle(pageTest);
			Client.hideWaitPanel(10);
		},

		goToBack : function() {
			App.back();
		},

		toloancultwice : function() {

			var returntype = Utils.search().loanType;
		
			App.navigate("houseloan/houseloanCtl/loancalculate?returntype=" + returntype);

		},
		// 等额本息

		tosameloan : function() {

			var loanType = Utils.search().loanType;
			// alert(loanType);

			$("#sameloan").addClass("active");
			$("#samefundloan").removeClass("active");

			$("#eachmouthless").hide();
			if (loanType == "1") {

				var loanresult = App.storage.get("commercialloan");
				// alert(loanresult);
				$("#mouthpay").html((loanresult.mouthpay).toFixed(2));
				$("#wholelixi").html((loanresult.totallixi).toFixed(2));
				$("#totalpay").html((loanresult.bengxiheji).toFixed(2));
				$("#loanpay").html(loanresult.loannum1);
				$("#loanmonth").html(loanresult.yearNum);

			} else if (loanType == "2") {
				var loanresult3 = App.storage.get("commercialloan3");
				$("#mouthpay").html((loanresult3.mouthpay).toFixed(2));
				$("#wholelixi").html((loanresult3.totallixi).toFixed(2));
				$("#totalpay").html((loanresult3.bengxiheji).toFixed(2));
				$("#loanpay").html(loanresult3.loannum1);
				$("#loanmonth").html(loanresult3.yearNum);

			} else if (loanType == "3") {

				var commercialloan5 = App.storage.get("commercialloan5");

				$("#mouthpay").html((commercialloan5.perMonth).toFixed(2));
				$("#wholelixi").html((commercialloan5.perlixi).toFixed(2));
				$("#totalpay").html((commercialloan5.bengxihejimix).toFixed(2));
				$("#loanpay").html(commercialloan5.loannummix);
				$("#loanmonth").html(commercialloan5.yearNum);

			}

		},
		// 等额本金
		tosamefundloan : function() {

			var loanType2 = Utils.search().loanType;

			$("#sameloan").removeClass("active");
			$("#samefundloan").addClass("active");
			$("#eachmouthless").show();
			if (loanType2 == "1") {
				var loanresult2 = App.storage.get("commercialloan2");

				$("#mouthpay").html((loanresult2.sameloanpay).toFixed(2));
				$("#wholelixi").html((loanresult2.totallixi2).toFixed(2));
				$("#totalpay").html((loanresult2.bengxiheji2).toFixed(2));
				$("#loanpay").html(loanresult2.loannum1);
				$("#eachmouthlessyuan").html((loanresult2.eachmonth).toFixed(2));
				$("#loanmonth").html(loanresult2.yearNum);

			} else if (loanType2 == "2") {

				var loanresult4 = App.storage.get("commercialloan4");

				$("#mouthpay").html((loanresult4.sameloanpay).toFixed(2));
				$("#wholelixi").html((loanresult4.totallixi2).toFixed(2));
				$("#totalpay").html((loanresult4.bengxiheji2).toFixed(2));
				$("#eachmouthlessyuan").html((loanresult4.eachmonth).toFixed(2));
				$("#loanpay").html(loanresult4.loannum1);
				$("#loanmonth").html(loanresult4.yearNum);

			} else if (loanType2 == "3") {

				var commercialloan6 = App.storage.get("commercialloan6");

				$("#mouthpay").html((commercialloan6.mixloangj).toFixed(2));
				$("#wholelixi").html((commercialloan6.totalintrest).toFixed(2));
				$("#totalpay").html((commercialloan6.totlheji).toFixed(2));
				$("#eachmouthlessyuan").html((commercialloan6.eachmonth).toFixed(2));
				$("#loanpay").html(commercialloan6.loannummix2);
				$("#loanmonth").html(commercialloan6.yearNum2);

			}

		}

	});

});