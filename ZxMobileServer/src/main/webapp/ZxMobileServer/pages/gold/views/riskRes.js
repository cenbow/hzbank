define(function(require, exports, module){
	
	var riskResTpl = require("text!../template/riskRes.html");
	
	var riskResView = module.exports = ItemView.extend({
		
		events : {
			"click #back" : "goBack",
			"click #repeat" : "repeat",
			"click #buy" : "buy"
		},
		
		template : riskResTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			var data = App.storage.get("_parameters");
			$("#type").text(this.transType(data.riskLevel));
			Client.hideWaitPanel(1);
			$("#ico").removeClass("f").addClass(this.transClass(data.riskLevel));
		},
		
		transType : function(type){
			switch(type){
				case '1':
					return "保守型";
					break;
				case '2':
					return "稳健型";
					break;
				case '3':
					return "平衡型";
					break;
				case '4':
					return "成长型";
					break;
				case '5':
					return "进取型";
					break;
				default:
					return "未知";
					break;
			}
		},
		
		transClass : function(type){
			switch(type){
				case '2':
					return "f";
					break;
				case '3':
					return "e";
					break;
				case '4':
					return "c";
					break;
				case '5':
					return "b";
					break;
				default:
					return "d";
					break;
			}
		},
		
		buy : function(){
			App.navigate("gold/goldCtl/goldBuy");
		},
		
		repeat : function(){
			App.back();
		},
		
		goBack : function(){
    		App.back(3);
		}
	});
});
