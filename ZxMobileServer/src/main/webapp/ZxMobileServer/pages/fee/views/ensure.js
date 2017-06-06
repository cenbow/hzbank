define(function(require, exports, module){
	
	var ensureTpl = require("text!../template/ensure.html");
	
	var ensureView = module.exports = ItemView.extend({
		
		events : {
			"click #queryEnsuer":"queryEnsuer"
		},
		
		template : ensureTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			var customerName = App.storage.get("UserInfo").customerNameCN; 
//			alert(JSON.stringify(App.storage.get("UserInfo")));
			var cardNo = Utils.getEleCard().cardNo;//获取电子账号
			$("#cardNo").val(Utils.protectAcc(cardNo)+'(电子账户)');
			$("#name").val(customerName);
			
			this.QuerycityParam();
			
//			fee_cityParamQuery
			Client.hideWaitPanel(1);
		},
		
		
		QuerycityParam:function(){
			var $this = this;
			var param = {
					cityCode:'3301',
					feeType:'1200',
					feeBusinessCode:'330112001001',
					actionFlag:'2',
			};
			Ajax({url:"/fee/queryCityInstitutionList",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						var iChannelFeeList = data.iChannelFeeList;
						App.storage.set("iChannelFeeList",iChannelFeeList);
	    			}
			}});
		},
		
		queryEnsuer:function(){
			var $this = this;
			var cardNo = Utils.getEleCard().cardNo;//获取电子账号
			var payAccountName = App.storage.get("UserInfo").customerNameCN;
			var billKey = $("#billNo").val();
			if(billKey==""){
				Utils.alertinfo("请输入申请编码");
				return;
			}
			var projectCode = App.storage.get("iChannelFeeList")[0].projectCode;
			var param = {
					cardNo:cardNo,
					projectCode:projectCode,
					billkey:billKey,
					payAccount:cardNo,
					payAccountName:payAccountName,
					accountType:'1',
					chanflag:'08'
			};
			Client.openWaitPanel(1);
			Ajax({url:"/fee/carEnsureAmtPre",data:param,success:function(data){//小客车保证金预跑
					if(MUI.isEmpty(data.errorCode)){
						App.navigate("fee/feeCtl/queryEnsuer",param);
						Client.hideWaitPanel(1);
	    			}else{
   						Utils.alertinfo(data.errorMessage);
   						Client.hideWaitPanel(1);
   					}
					
			}});
			
		},
		
		goBack : function(){
			App.back();
		}
	
	});
});
