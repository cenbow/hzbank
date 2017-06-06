define(function(require, exports, module){
	
	var dealResultTpl = require("text!../template/dealResult.html");
	
	var dealResultView = module.exports = ItemView.extend({
		
		events : {
			"click #goP2P":"goP2P"
		},
		
		template : dealResultTpl,
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
				
				$("#resultDiv").css("display","none");
				
				this.result = false;
			}else if(payres && payres.tranState != "30" && notifyres && notifyres.errorCode){
				if(notifyres.iPayFeeDetailList2.length>0){
					$("#seqNum").text(notifyres.billkey||"空");
					$("#name").text(notifyres.iPayFeeDetailList2[0].customerName||"空");
					$("#amt").text(notifyres.iPayFeeDetailList2[0].amount||"");
					$("#bigAmt").text(Utils.toChineseCurrency(notifyres.iPayFeeDetailList2[0].amount)||"空");
					$("#orderNo").text(notifyres.iPayFeeDetailList2[0].orderNo||"空");
					$("#flowNo").text(notifyres.iPayFeeDetailList2[0].flowNo||"空");
				}else{
					$("#resultDiv").css("display","none");
				}
				
				$("#wait").css("display","block");
			}else if(payres && payres.tranState && notifyres && notifyres.hostState){
				if(notifyres.iPayFeeDetailList2.length>0){
					$("#seqNum").text(notifyres.billkey||"空");
					$("#name").text(notifyres.iPayFeeDetailList2[0].customerName||"空");
					$("#amt").text(notifyres.iPayFeeDetailList2[0].amount||"");
					$("#bigAmt").text(Utils.toChineseCurrency(notifyres.iPayFeeDetailList2[0].amount)||"空");
					$("#orderNo").text(notifyres.iPayFeeDetailList2[0].orderNo||"空");
					$("#flowNo").text(notifyres.iPayFeeDetailList2[0].flowNo||"空");
				}else{
					$("#resultDiv").css("display","none");
				}
				
				var state = Utils.tranState(notifyres.hostState || "00",payres.tranState);
				if(state=="交易成功"){
					$("#paySuccess").css("display","block");
				}else if(state=="交易失败"){
					this.result = false;
					$("#payFaild").css("display","block");
					$("#ErrMsg").text(notifyres.iPayFeeDetailList2[0].hostErrorMessage || notifyres.iPayFeeDetailList2[0].errorMessage);
				}else{
					$("#wait").css("display","block");
				}
			}else if("102030".indexOf(payres.tranState)<0){
				$("#resultDiv").css("display","none");
				
				$("#wait").css("display","block");
			}
			
		    Client.hideWaitPanel(1);
		},
		
		goP2P:function(){
			var transferFlag = '1';
			var param = {transferFlag : transferFlag};
			App.navigate("product/productCtl/saleProducts",param);
		},
		
		goBack : function(){
			App.back(4);
		}
	
	});
});
