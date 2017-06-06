define(function(require, exports, module){
	
	var facecheckTpl = require("text!../template/facecheck.html");
	
	var facecheckView = module.exports = ItemView.extend({
		
		events : {
			"click .cardArea" : "itCheck"
		},
		
		template : facecheckTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    
		    Client.hideWaitPanel(1);
		   
		    this.param = App.storage.get("_parameters");
		    if(this.param.action == "填写实名信息"){
		    	$(".step2").text("② 绑定银行卡");
			    $(".step3").text("③ 填写实名信息");
		    }
		},
		
		itCheck : function(){
			Client.ocrCheck("curView.getPhotoResFront");
		},
		
		cancel : function(){
			Client.menuOpt("5");
			var index = App.browseList.indexOf("special/specialCtl/special");
    	  	App.browseList.splice(1,index-1);
			App.back();
		},
		
		getPhotoResFront : function(obj){
			Client.hideWaitPanel(1);
			obj.birth = obj.year+'-'+obj.month+'-'+obj.day;
			_.extend(this.param,obj);
			if(this.param.action == "填写实名信息"){
				App.navigate("userReg/userRegCtl/userRegisterStep1",this.param);
				return;
			}
			App.navigate("special/specialCtl/ocrResult",this.param);
		}
		
	});
});
