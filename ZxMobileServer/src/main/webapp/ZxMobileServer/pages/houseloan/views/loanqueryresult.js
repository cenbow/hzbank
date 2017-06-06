define(function(require, exports, module) {

	var loanqueryresultTpl = require("text!../template/loanqueryresult.html");

	var loanqueryresultView = module.exports = ItemView.extend({

		events : {
			"click #queryresult" : "toqueryresult",
			"click #houseconfirm2" : "toqueryresult"
		},

		template : loanqueryresultTpl,
		// 定义日志TAG便于错误信息查找
		initialize : function() {
			var pageTest = {
				title : '贷款进度查询',
				leftButton : {
					name : '返回',
					func : 'App.back()'
				},
				rightButton : {
					name : '取消',
					func : 'curView.cancel()'
				}
			}
			Client.initPageTitle(pageTest);
			Client.hideWaitPanel(10);

			Client.openWaitPanel("拼命加载中，请稍候");
			
			var firstinfo =  App.storage.get("firstinfo");

			var param2 = {

				contractnum : firstinfo.contractnum

			};

			Ajax({
				url : "/houseloan/houseloanquery",
				data : param2,
				success : function(data) {
					if (MUI.isEmpty(data.errorCode)) {

						var iHouseState = data.iHouseState;
						

							for (var i = 0; i < iHouseState.length; i++) {

								if (iHouseState[i].state == "00") {

									$("#loanmsg").text("贷款受理")

								} else if (iHouseState[i].state == "01") {

									$("#loanmsg").text("公积金审批")

								} else if (iHouseState[i].state == "02") {

									$("#loanmsg").text("银行审批")

								} else if (iHouseState[i].state == "03") {

									$("#loanmsg").text("抵押登记")

								} else if (iHouseState[i].state == "04") {

									$("#loanmsg").text("贷款发放")

								}

							}
							
							if (data.certNo == "") {

								$("#applyerinfo").hide();

							} else {
							$("#resusername").text(data.userName);
							$("#resCertNo").text(data.certNo);
							
							$("#loannum").text(parseFloat(data.fundBorrowNum||0).toFixed(2)*1+parseFloat(data.commercialBorNum||0).toFixed(2)*1);
							
							$("#repayyear").text(data.borrowDeadline+"年"+"("+data.borrowDeadline*12+")期");
							
						}
					} else {

						$("#nodata").text(data.errorMessage);
						$("#info").hide();
						$("#error").show();

					}
					Client.hideWaitPanel(1);

				}
			});

		},

	 cancel : function(){
			
		var index = App.browseList.indexOf("houseloan/houseloanCtl/loanCenter");
 	  	App.browseList.splice(1,index-1);
		App.back();
			
		},
		
		
		toqueryresult : function() {

			App.navigate("houseloan/houseloanCtl/loanCenter");

		},

	});
});
