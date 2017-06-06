define(function(require, exports, module){
	
	var safeGradeResultTpl = require("text!../template/safeGradeResult.html");
	
	var safeGradeResultView = module.exports = ItemView.extend({
		
		template : safeGradeResultTpl,
		
		events : {
			"click #bank1,#bank2" : "goBack"
		},
		
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    var pageTest = {
				  	title:'安全等级',
					leftButton:{
						name : '返回',
						func :'curView.goBack()'
					},
					rightButton:{
						name : ''
					}
			  };
			Client.initPageTitle(pageTest);
//			var res = App.storage.get("_parameters").res;
			var userType = App.storage.get("UserInfo").userType;
			if(userType=="02"){
				$("#success").show();
				$("#fail").hide();
			}else{
				$("#success").hide();
				$("#fail").show();
			}
		    Client.hideWaitPanel(100);
		},
		
		 
		goBack : function(){
			App.navigate("settings/setCenterCtl/security");
		}
	
	});
});
