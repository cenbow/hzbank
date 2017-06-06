define(function(require, exports, module) {

	var LoanCenterTemplate = require("text!../template/loanCenter.html");

	var LoancenterView = module.exports = ItemView.extend({

		template : LoanCenterTemplate,

		events : {
			"click #buyhousestep" : "tostep",
			"click #loancalculate" : "toloancalculate",
			"click #taxcalculate" : "totaxcalculate",
			"click #loanapply" : "toloanapply",
			"click #loanstepquery" : "toloanstepquery",

		},
		initialize : function() {
			var pageTest = {
				title : '房贷中心',
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
		},

		goToBack : function() {
			App.back();
		},

		tostep : function() {
			App.navigate("houseloan/houseloanCtl/buyhousestep");
		},
		toloancalculate : function() {
			App.navigate("houseloan/houseloanCtl/loancalculate");
		},
		totaxcalculate : function() {
			App.navigate("houseloan/houseloanCtl/taxcalculate");
		},
		toloanapply : function() {

			if (Utils.checkRealUser("1")) {
				this.next("apply");
			} else {
				App.navigate("houseloan/houseloanCtl/loanapplyfirst");
			}

			// App.navigate("houseloan/houseloanCtl/houseinfo");
		},

		toloanstepquery : function() {

			// App.navigate("houseloan/houseloanCtl/loanquerystep1");
			if (Utils.checkRealUser("1")) {
				this.next("query");
			} else {
				App.navigate("houseloan/houseloanCtl/loanquerystep1");
			}
		},

		next : function(flag) {

			if (flag == "apply") {

				businessType = "1";

			} else {

				businessType = "0";
			}

			var newparam = {

				 certNo : App.storage.get("UserInfo").certNo,
			     //certNo : "33082419900818242X",
				 busiType : businessType
			};

			App.storage.set("CetrNo", newparam.certNo);

			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({
				url : "/houseloan/housecontractquery",
				data : newparam,
				success : function(data) {
					if (MUI.isEmpty(data.errorCode)) {

						var housecontract = data.icontractinfo;
						App.storage.set("housecontract", housecontract);

						if (housecontract.length == "1") {
							var houseconsec = data.icontractinfo[0].contractnum;

							var param2 = {

								certNo : App.storage.get("UserInfo").certNo,
								contractnum : houseconsec

							};
							Client.openWaitPanel("拼命加载中，请稍候");
							Ajax({
								url : "/houseloan/housestatusAjax",
								data : param2,
								success : function(data) {
									if (MUI.isEmpty(data.errorCode)) {
										// 所有返回信息
										App.storage.set("firstinfo", data);

										if (flag == "apply") {

											App.navigate("houseloan/houseloanCtl/houseinfo");

										} else {
											App.navigate("houseloan/houseloanCtl/loanqueryresult");

										}

									} else {
										Client.alertinfo(data.errorMessage, "提醒");
									}
									Client.hideWaitPanel(1);

								}
							});

						} else if (housecontract.length > 1) {

							// 合同信息
							App.navigate("houseloan/houseloanCtl/houseConcern?flag=" + flag);

						} else if (housecontract.length == "0") {

							App.navigate("houseloan/houseloanCtl/noLoaninfo");

						}

					}
				}
			})

		},

	});

});