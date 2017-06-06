define(function(require, exports, module){
	
	var mall_IndexTpl = require("text!../template/mall_index.html");
	
	var mall_IndexView = module.exports = ItemView.extend({
		
		template : mall_IndexTpl,
		
		events : {
			"click #bannerToE,#aToE,#bToE,#cToE,#dToE,#RXhrefToE,#RX1ToE,#RX2ToE,#RX3ToE,#JFhrefToE,#JF1ToE,#JF2ToE,#JF3ToE,#JF4ToE,#JF5ToE":"toE"
		},
		
		initialize : function(){
			
		    var pageTest = {
				  	title:'商城首页',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			  }
			Client.initPageTitle(pageTest);
		    Client.hideWaitPanel(1);
		},
		goBack : function(){
			App.back();
		},
		
		toE : function(){
			Client.toEJSH();
		}
		
		
	});
});