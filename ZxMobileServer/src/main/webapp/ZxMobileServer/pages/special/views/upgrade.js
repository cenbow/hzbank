define(function(require, exports, module){
	
	var upgradeTpl = require("text!../template/upgrade.html");
	
	var upgradeView = module.exports = ItemView.extend({
		
		events : {
			"click #back,.vtBtn" : "goBack"
		},
		
		template : upgradeTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    
		    Client.hideWaitPanel(1);
		    var result = Utils.search().result;
		    if(result!="success"){
		    	$(".rzt").text(Utils.search().em);
		    	$(".vtPgae").hide();
		    	$(".idc-result").show();
		    }
		},
		
		goBack : function(){
			App.navigate("special/specialCtl/special");
		},
	
	});
});
