define(function(require, exports, module) {

	var HouseinfoTpl = require("text!../template/houseinfo.html");

	var FacecheckView = module.exports = ItemView.extend({

		events : {
			"click #houseconfirm" : "tohouseconfirm",
		},

		template : HouseinfoTpl,
		// 定义日志TAG便于错误信息查找
		initialize : function() {
			var pageTest = {
				title : '贷款申请',
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
			Client.hideWaitPanel(1);
			
			var data = App.storage.get("firstinfo");

			$("#nodata").hide();
			$("#userName").text(data.intermediaryLinkman);
			$("#htnum").text(data.contractnum);
			$("#zjname").text(data.intermediaryName);
			$("#connectphone").text(data.intermediaryPhone);
			$("#houseaddress").text(data.houseAddr);
			$("#builarea").text(parseFloat(data.buildingArea).toFixed(2));
			
			var newhouserice = Utils.formatCurrency(data.houseRice,2);
			$("#houseprice").text(newhouserice);
			var newfirstpay = Utils.formatCurrency(data.firstPayment,2);
			$("#firstpay").text(newfirstpay);
			var newnewfirstpay = Utils.formatCurrency(data.assessValue,2) 
			$("#assessvalue").text(newnewfirstpay);
			
			
			
			
			// 房屋状况
			if (data.houseStatus == "1") {

				$('#housetype').text("期房");
				$("#payhousedateshow").show();
				$("#payhousedate").text(data.houseDate);
				
				
			} else if (data.houseStatus == "2") {
				$('#housetype').text("现房");
				$("#housedateshow").show();
				$("#housedate").text(data.houseDate);

			}
			
			if (data.houseType == "01") {
				$('#housestatus').text("商品房");
			} else if (data.houseType == "02") {
				$('#housestatus').text("二手房");
			} else if (data.houseType == "03") {
				$('#housestatus').text("经济适用房");
			} else if (data.houseType == "99"){
				$('#housestatus').text("其他");

			}

			var typestatus = {

				"housetype" : data.houseType,
				"housestatus" : data.houseStatus
			};

			App.storage.set("typestatus", typestatus);
		},

		
		cancel : function(){
			
			var index = App.browseList.indexOf("houseloan/houseloanCtl/loanCenter");
    	  	App.browseList.splice(1,index-1);
			App.back();
			
		},
		
		tohouseconfirm : function() {

			var typestatus = App.storage.get("typestatus");
			//房屋合同信息
			var housecontract = App.storage.get("housecontract");
	  
			var data = App.storage.get("firstinfo");
			
			var twicehouseprice = Utils.removeComma($("#houseprice").html())
			var twicefirstpay = Utils.removeComma($("#firstpay").html())
			var twiceassessvalue = Utils.removeComma($("#assessvalue").html())
		
			var param2 = {

				intermediaryName : $("#zjname").html(),
				intermediaryLinkman : $("#userName").html(),
				intermediaryPhone : $("#connectphone").html(),
				contractnum : $("#htnum").html(),
				houseAddr : $("#houseaddress").html(),
				buildingArea : $("#builarea").html(),
				houseRice : twicehouseprice,
				firstPayment :twicefirstpay,
				assessValue : twiceassessvalue,
				houseType : typestatus.housetype,
				houseStatus : typestatus.housestatus,
				houseDate : $("#housedate").html(),
				certNo : App.storage.get("CetrNo"),
			};

			App.storage.set("houseconfirminfo",param2);
			
			
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({
				url : "/houseloan/houseloanstepone",
				data : param2,
				success : function(data) {
					if (MUI.isEmpty(data.errorCode)) {
						App.navigate("houseloan/houseloanCtl/applyerinfo");
					} else {
						Client.alertinfo(data.errorMessage, "提醒");
					}
					Client.hideWaitPanel(1);
				}
			});
		},

	});
});
