define(function(require, exports, module){
	
	var hongbaoTpl = require("text!../template/hongbaorule.html");
	
	var hongbaoView = module.exports = ItemView.extend({
		
		events : {
			"click #closeRuleBtn" : "tohongbao"
			
		},
		
		template : hongbaoTpl,
		
		initialize : function(){
			//初始化菜单方法
			var pageTest = {
				  	title:'红包规则',
					leftButton:{
						name : '返回',
						func : 'curView.tohongbao()'
					},
					rightButton:{
						name : ''
					}
				  };
			Client.initPageTitle(pageTest);
			this.init();
			Client.hideWaitPanel(1);
		},
		
		init:function(){
			var doc = document.documentElement;
			window.clientHeight = doc.clientHeight;
			var g = doc.clientWidth;
			var f = 100*(g/640);
			$('.ui-view div').before('<style>html{font-size:'+ f +'px}</style>');
		},
		
		tohongbao : function(){
			App.navigate("hongbao/hongbaoCtl/hongbao");
    	}
	
	});
});
