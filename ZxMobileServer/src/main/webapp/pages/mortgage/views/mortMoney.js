define(function(require, exports, module){
	
	var mortMoneyTpl = require("text!../template/mortMoney.html");
	
	var MortMoneyView = module.exports = ItemView.extend({
		
		events : {
			"click #next":"next",
			"click #back":"goBack"
		},
		
		template : mortMoneyTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			if(App.storage.get("_parameters")){
				$("#success").show();
				$("#error").hide();
				var totalPrice = Utils.formatCurrency(App.storage.get("_parameters").totalPrice*0.7, 2);
				var evaluationPrice = Utils.formatCurrency(App.storage.get("_parameters").totalPrice, 2);
		    	$("#maxMoney").text(totalPrice);
		    	$("#evaluationPrice").text(evaluationPrice);
			}else{
				$("#success").hide();
				$("#error").show();
			}
		    Client.hideWaitPanel(1);
		},
		
		next : function(){
			if (Utils.checkSession()) {
				if(Utils.checkRealUser()){
					if(!Utils.checkActivate()){
						return;
					}
					var housePropertyNo = App.storage.get("_parameters").houseId;//云估价房产编号
					var domicilePlace = App.storage.get("_parameters").areaZipCode;//行政区代码
					var provinceAlias = App.storage.get("_parameters").provinceAlias;
					var projectId = App.storage.get("_parameters").projectId;//楼盘Id
					var projectName = App.storage.get("_parameters").projectName;
					var cityAlias = App.storage.get("_parameters").cityAlias;
					var areaName =App.storage.get("_parameters").areaName;
					var buildingName =App.storage.get("_parameters").buildingName;
					var houseName =App.storage.get("_parameters").houseName;
					var houseAddress = provinceAlias+""+cityAlias+""+areaName+""+projectName+""+buildingName+""+houseName;
					var houseArea = App.storage.get("_parameters").buildArea;
					var storey = App.storage.get("_parameters").floor;
					var orderFlowNo = App.storage.get("_parameters").serialNo;
					var unitPrice = App.storage.get("_parameters").unitPrice;
					var estimable = App.storage.get("_parameters").estimable;
					var param = {
							totalPrice:App.storage.get("_parameters").totalPrice*0.7,
							evaluationPrice:App.storage.get("_parameters").totalPrice,
							housePropertyNo:housePropertyNo,//云估价房产编号
							domicilePlace:domicilePlace,//行政区代码
							projectId:projectId,//楼盘Id
							houseAddress:houseAddress,
							houseArea:houseArea,
							storey:storey,
							orderFlowNo:orderFlowNo,
							unitPrice:unitPrice,
							estimable:estimable
					};
					App.navigate("mortgage/mortgageCtl/mortMore",param);
				}
			} else {
				Client.toLogin("curView.next()");
			}
		},
		
		goBack : function(){
			App.back();
		}
	
	});
});
