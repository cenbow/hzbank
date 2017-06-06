define(function (require, exports, module) {
	
//	var IncomeTransferView = require("../views/incomeTransfer");
	var IncomeTransfer2View = require("../views/incomeTransfer2");
	var InnerTransferView = require("../views/innerTransfer");
	var OneStopTransferView = require("../views/oneStopTransfer");
	var TransferController = module.exports = Controller.extend({
		
		actions:{
			"recharge":"incomeTransfer2",
			"innerTransfer":"innerTransfer",
			"oneStopTransfer":"oneStopTransfer"
			},
		
//		incomeTransfer : function(){
//			 App.container.show(new IncomeTransferView());
//		},
		
		incomeTransfer2 : function(){
			var iCardList = App.storage.get("userCardList");
			if(MUI.isEmpty(iCardList)){
				  var params={
						  cardNo:Utils.getEleCard().cardNo
				  };
				  Ajax({url:"/cardManage/cardListQuery", data:params, 
					  success:function(data){
						  
						  if(MUI.isEmpty(data.errorCode)){
						  		var iCardList=data.iCardList;			
						  		App.storage.set("userCardList",iCardList);
								App.container.show(new IncomeTransfer2View());
						  }else{
						  		Utils.alertinfo(data.errorMessage);
						  }
					  }
				  });
			}else{
				App.container.show(new IncomeTransfer2View());
			}
		},
			
		innerTransfer:function(){
			App.container.show(new InnerTransferView());
		},
		
		oneStopTransfer:function(){
			App.container.show(new OneStopTransferView());
		}
		
	});
	
});