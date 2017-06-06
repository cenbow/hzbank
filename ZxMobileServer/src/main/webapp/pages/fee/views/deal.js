define(function(require, exports, module){
	require("cssJs!../../../css/viewer.min");
	require("../../../scripts/libs/viewer.min");
	
	var dealTpl = require("text!../template/deal.html");
	
	var dealView = module.exports = ItemView.extend({
		
		events : {
			"click #dealNext":"dealNext",
			"click #showJpg":"showJpg"
		},
		
		template : dealTpl,
		
		initialize : function(){
			var _this = this;
			
			_this.viewer = new Viewer(document.getElementById('imgContainer'), {
	          url: 'data-original'
	        });
			var startTime = App.storage.get("_parameters").startTime;
			var endTime = App.storage.get("_parameters").endTime;
			$("#timeSet").text("2. 缴款时间："+startTime+"-"+endTime+"；");
			
			Client.hideWaitPanel(1);
		},
		
		dealNext:function(){
			var $this = this;
			var payNo = $("#payNo").val();
			var payName = $("#payName").val();
			var payAmt = $("#payAmt").val();
			if(payNo==""){
				Utils.alertinfo("请输入缴款书编号");
				return;
			}
			if(payName==""){
				Utils.alertinfo("请输入付款人全称");
				return;
			}
//			if(!Utils.checkChinese(payName)){
//				Utils.alertinfo("请输入正确的付款人全称");
//				return;
//			}
			if(payAmt==""){
				Utils.alertinfo("请输入缴款金额");
				return;
			}
			
			if(!Utils.checkAmount(payAmt)){
				return;
			}
			
//			var params = {
//					payNo:payNo,
//					payName:payName,
//					payAmt:payAmt
//			};
			
			var param = {
					'projectCode':'PC0014',
					'billkey':payNo,
					'feeBusinessCode':'33011200001',
					'mobileNo':App.storage.get("UserInfo").regMobile,
					'sendData1':payAmt,
					'sendData2':'1',
					'sendData3':payName
			};
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/fee/carOweFeeQuery",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						var JFTFlowNo = data.JFTFlowNo;
						$.each(data.iPayFeeDetailList,function(i,product){
							var billkey=product.billkey;
							var customerName=product.customerName;
							var amount=product.amount;
							var reserveData1=product.reserveData1;
							
							var params={
								"payNo":payNo,
								"payName":payName,
								"payAmt":payAmt,
								"billkey":billkey,
								"customerName":customerName,
								"amount":amount,
								"reserveData1":reserveData1,
								"JFTFlowNo":JFTFlowNo
							};
//							App.storage.set("UserFee",UserCarFee);
							App.navigate("fee/feeCtl/dealNext",params);
						});
	    			}else{
	    				if(data.errorCode=="-67069"){
	    					Utils.alertinfo("缴费金额不符");
	    				}else if(data.errorCode=="-67059"){
	    					Utils.alertinfo("未查询到您输入的缴款书编号");
	    				}else{
	    					Utils.alertinfo(data.errorMessage);
	    				}
	    				
	    				Client.hideWaitPanel(1);
	    			}
//					Client.hideWaitPanel(1);
			}});
		},
		
		showJpg : function(){
			this.viewer.show();
		},
		
		
		goBack : function(){
			App.back();
		}
	
	});
});
