define(function(require, exports, module){
	
	var resultTpl = require("text!../template/result.html");
	
	var resultView = module.exports = ItemView.extend({
		
		events : {
			"click #next" : "next",
			"click #back" : "back"
		},
		
		template : resultTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    Client.hideWaitPanel(1);
		    this.param=App.storage.get("_parameters");
		    if(this.param.res == "fail"){
		    	$(".sucState").addClass("disabled");
		    	$("#next").hide();
		    	$("#back").show();
		    }
		    if(this.param.action == "填写实名信息"){
		    	$(".tp2 li").hide();
		    	$("#certNo").parents("li").show();
		    	$("#userName").parents("li").show();
		    }else if(this.param.action == "账户升级"){
		    	$("#next").text("升级账户");
		    }
		},
		
		next:function(){
			if(this.param.url.indexOf("upgrade")>=0){
				var param = {
						cardNo:Utils.getEleCard().cardNo,
					};
				var $this = this;
				Client.openWaitPanel("请稍候");
				Ajax({url:"/specialFinance/accountUpgrade",data:param,
					success : function(data) {
						App.navigate("special/specialCtl/upgrade?result="+data.result+"&em="+data.errorMessage);
						if(data.result=="success"){
							var userinfo = App.storage.get("UserInfo");
							userinfo.userType = "02";
							App.storage.set("UserInfo",userinfo);
						}
					}
				});
				return;
			}
			App.navigate(this.param.url,this.param);
		},

		cancel : function(){
			Client.menuOpt("5");
			var index = App.browseList.indexOf("special/specialCtl/special");
    	  	App.browseList.splice(1,index-1);
			App.back();
		},
		
		back:function(){
			if(Utils.search().from=="ocr"){
				App.back(2);
			}else{
				App.back();
			}
		}
	
	});
});
