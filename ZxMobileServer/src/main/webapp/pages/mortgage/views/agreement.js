define(function(require, exports, module) {
	
	var agreementTpl = require("text!../template/agreement.html");

	var AgreementView = module.exports = ItemView.extend({

		template : agreementTpl,

		events : {
			
		},

		// 初始化
		initialize : function() {
			
			var certNo = App.storage.get("UserInfo").certNo;
			var customerNameCN = App.storage.get("UserInfo").customerNameCN;
			$("#certNo").text(certNo);
			$("#customerNameCN").text(customerNameCN);
			Client.hideWaitPanel(1);
		},


		goBack : function() {
			App.back();
		},
	});
});