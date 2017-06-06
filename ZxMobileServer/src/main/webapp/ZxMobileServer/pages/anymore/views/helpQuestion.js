define(function(require, exports, module){
	
	var helpQuestionTpl = require("text!../template/helpQuestion.html");
	var messageCenterView = module.exports = ItemView.extend({
	template : helpQuestionTpl,
	events:{
		"click #telphone" : "telphone",
		"click #hzwechat" : "hzwechat"
	},
	initialize : function(){
		if(Utils.checkSession()){
			$('#spit').show();
		};
		var pageTest = {
			  	title:'常见问题',
				leftButton:{
					name : '返回',
					func :'curView.goToBack()'
				},
				rightButton:{
					name : '',
					func : ''
				}
		  };
		Client.initPageTitle(pageTest);
		Client.menuOpt("0");
		/*$(".list .arr").on("click",function(){
			val=$(this).attr("data-value");
			App.navigate("anymore/anymoreCtl/questionDetail",{param:val});
		});*/
		
		Client.hideWaitPanel(1); 
	},
	goToBack : function(){
		App.back();
	},
	
	telphone : function(){
		Client.callPhone("400-888-8508");
	},
	
	hzwechat : function(){
		App.navigate("anymore/anymoreCtl/weixin");
	},

	});
});


