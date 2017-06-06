define(function(require, exports, module){
	
	var resultTpl = require("text!../template/result.html");
	
	var resultView = module.exports = ItemView.extend({
		
		events : {
			"click #submit,#submit1":"goBack",
			"click #detail":"detail"
		},
		
		template : resultTpl,
		
			//定义日志TAG便于错误信息查找
		initialize : function(){
			var param = App.storage.get("_parameters");
			var payres = param.payres;
			var notifyres = param.notifyres;
			this.result = true;
			if(notifyres){
				notifyres.hostState = notifyres.hostState || "00";
			}
			if(payres && payres.errorCode && payres.tranState == "30"){
				$("#payFaild").css("display","block");
				$("#ErrMsg").text(payres.errorMessage);
				this.result = false;
			}else if(payres && payres.tranState != "30" && notifyres && notifyres.errorCode){
				$("#wait").css("display","block");
			}else if(payres && payres.tranState && notifyres && notifyres.hostState){
				var state = Utils.tranState(notifyres.hostState || "00",payres.tranState);
				if(state=="交易成功"){
					$("#paySuccess").css("display","block");
				}else if(state=="交易失败"){
					this.result = false;
					$("#payFaild").css("display","block");
					$("#ErrMsg").text(notifyres.hostErrorMessage || notifyres.errorMessage);
				}else{
					$("#wait").css("display","block");
				}
			}else if("102030".indexOf(payres.tranState)<0){
				$("#wait").css("display","block");
			}
			
		    Client.hideWaitPanel(1);
		},
		
		detail : function(){
			var parameters = App.storage.get("_parameters");
			App.navigate("fee/feeCtl/orderList",{feeTypeCode : parameters.feeTypeCode});
		},
		
		goBack : function(){
			if(!this.result){
				App.back(3);
			}else{
				App.back(4);
			}
		}
	
	});
});
