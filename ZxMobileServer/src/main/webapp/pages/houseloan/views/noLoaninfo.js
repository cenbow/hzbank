define(function(require, exports, module) {

	var NoloaninfoTemplate = require("text!../template/Noloaninfo.html");

	var NoloaninfoView = module.exports = ItemView.extend({

		template : NoloaninfoTemplate,

		events : {

			"click #houseconfirm2" : "tohouseconfirm2"
		},

		initialize : function() {
			var pageTest = {
				title : '贷款申请',
				leftButton : {
					name : '返回',
					func : 'curView.goToBack()'
				},

			}
			Client.initPageTitle(pageTest);
			Client.hideWaitPanel(10);
		},

		tohouseconfirm2 : function() {

			App.back();

		},

		goToBack : function() {
			App.back();
		},

	});

});