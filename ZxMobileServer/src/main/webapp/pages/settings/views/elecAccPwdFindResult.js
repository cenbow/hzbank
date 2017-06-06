define(function(require, exports, module){
	
	var elecAccPwdFindResultTpl = require("text!../template/elecAccPwdFindResult.html");
	
	var elecAccPwdFindView = module.exports = ItemView.extend({
		
		template : elecAccPwdFindResultTpl,
		
		events : {
			"click #submitBtn" : "submitBtn"
		},
		
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    var pageTest = {
				  	title:'找回交易密码',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			  };
			Client.initPageTitle(pageTest);
			this.init();
		    Client.hideWaitPanel(100);
		},
		
		
		init : function(){
			var trade = App.storage.get("_parameters");
			if(trade.tradeStatus=="2"){//已经审核了
				$("#next").show();
				$(".b").parent().addClass("active");
			}else{
				$("#next").hide();
			}
		},
		
		submitBtn : function(){
			App.navigate("settings/setCenterCtl/elecAccPwdResetThree");
		},
		 
		goBack : function(){
			App.navigate("settings/setCenterCtl/security");
		},
	
	});
});
