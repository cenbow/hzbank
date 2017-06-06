define(function(require, exports, module){
	
	var saleHelpTpl = require("text!../template/saleHelp.html");
	
	var saleHelpView = module.exports = ItemView.extend({
		
		template : saleHelpTpl,
		
		events:{
		},
		initialize : function(){
			var pageTest = {
				  	title:'帮助中心',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			  };
			Client.initPageTitle(pageTest);
		    Client.hideWaitPanel(100);
		},
		goBack:function(){
			App.back();
		}
	
	});
});
