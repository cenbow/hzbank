define(function(require, exports, module) {
	
	var agreementTpl = require("text!../template/agreement.html");

	var agreementView = module.exports = ItemView.extend({

		template : agreementTpl,

		events : {
			"click #productAgree1" : "productAgree1",
			"click #productAgree2" : "productAgree2",
			"click #productAgree3" : "productAgree3",
			"click #productAgree4" : "productAgree4",
			"click #productAgree5" : "productAgree5"
		},

		// 初始化
		initialize : function() {
			var pageStep1 = {
				title : '相关协议',
				leftButton : {
					name : '返回',
					func : 'curView.goBack()'
				},
				rightButton : {
					name : '',
				}
			};
			Client.initPageTitle(pageStep1);
			var projectNo = "";
			var transferFlag = App.storage.get("_parameters")?App.storage.get("_parameters").transferFlag:"1";
			if(transferFlag=="0"){
				projectNo = App.storage.get("_parameters").financeNo;
				$("#product").hide();
				$("#productAgree5").show();
			}else{
				var financeDetail = App.storage.get("model").financeDetail;
				projectNo = App.storage.get("model").financeNo;
				$("#product").show();
				$("#productAgree5").hide();
				$("#financeDetail").html(financeDetail);
			}
			var $this = this;
			this.param = {};
			Ajax({
				url : "/product/saleExplainQuery",
				data : {projectNo:projectNo},
				success : function(data) {
					if (MUI.isEmpty(data.errorCode)) {
						$this.param = data;
						$this.param.projectNo = projectNo;
					}
					Client.hideWaitPanel(1);
				}
			});
		},

		productAgree1 : function() {
			App.navigate("product/productCtl/productAgree1",this.param);
			Client.hideWaitPanel(1);
		},
		productAgree2 : function() {
			App.navigate("product/productCtl/productAgree2",this.param);
			Client.hideWaitPanel(1);
		},
		productAgree3 : function() {
			App.navigate("product/productCtl/productAgree3");
			Client.hideWaitPanel(1);
		},
		productAgree4 : function() {
			App.navigate("product/productCtl/productAgree4");
			Client.hideWaitPanel(1);
		},
		productAgree5 : function() {
			App.navigate("product/productCtl/productAgree5");
			Client.hideWaitPanel(1);
		},

		goBack : function() {
			App.back();
			Client.hideWaitPanel(1);
		},
	});
});