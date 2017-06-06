define(function(require, exports, module){
	
	var promptTpl = require("text!../template/prompt.html");
	
	var promptView = module.exports = ItemView.extend({
		
		events : {
			"click #next" : "next"
		},
		
		template : promptTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			Client.hideWaitPanel(1);
			this.param={};
		    var url="",
			str="",
			type = Utils.search().type;
			switch(type){
				case 'cardChage':
					url = "special/specialCtl/cardCheck?type=cardChage";
					str = "同卡号换卡";
					break;
				case 'financeSign':
					url = "special/specialCtl/financeRiskReq";
					str = "签约管理";
					this.param.cardNo=App.storage.get("UserInfo").iCardInfo[0]
						?App.storage.get("UserInfo").iCardInfo[0].cardNo:"";
					break;
				case 'cardActive':
					url = "special/specialCtl/cardActive";
					str = "卡片激活";
					break;
				case 'changeCardPwd':
					url = "special/specialCtl/changeCardPwd";
					str = "密码修改";
					break;
				case 'upgrade':
					url = "special/specialCtl/upgrade";
					str = "账户升级";
					break;
			}
			this.param.url = url;
			this.param.action = str;
			$("#action").text(str);
		},

		cancel : function(){
			Client.menuOpt("5");
			var index = App.browseList.indexOf("special/specialCtl/special");
    	  	App.browseList.splice(1,index-1);
			App.back();
		},
		
		next : function(){
			App.navigate("special/specialCtl/facecheck",this.param);
		}
	
	});
});
