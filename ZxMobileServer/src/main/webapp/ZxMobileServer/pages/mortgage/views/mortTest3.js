define(function(require, exports, module){
	
	var mortTest3Tpl = require("text!../template/mortTest3.html");
	
	var MortTest3View = module.exports = ItemView.extend({
		
		events : {
			"click #next":"next",
			"blur #houseAddress,#houseArea,#houseFloor":"checkButton",
			"keyup #houseAddress,#houseArea,#houseFloor":"checkButton",
				
		},
		
		template : mortTest3Tpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			var cityAlias = App.storage.get("_parameters").cityAlias;
			var areaName = App.storage.get("_parameters").areaName;
			var houseAddress1 = App.storage.get("_parameters").houseAddress1 || "";
			var houseArea =App.storage.get("_parameters").houseArea || "";
			var houseFloor =App.storage.get("_parameters").houseFloor || "";
			var houseCity = cityAlias+" "+areaName;
			$("#houseCity").val(houseCity);
			$("#houseAddress").val(houseAddress1);
			$("#houseArea").val(houseArea);
			$("#houseFloor").val(houseFloor);
			this.checkButton();
		    Client.hideWaitPanel(1);
		},
		
		next : function(){
			var cityAlias = App.storage.get("_parameters").cityAlias;
			var areaName = App.storage.get("_parameters").areaName;
			var houseAddress1 = $("#houseAddress").val();
			var houseArea =$("#houseArea").val();
			var houseFloor =$("#houseFloor").val();
			var param = {
					houseAddress1:houseAddress1,
					houseArea:houseArea,
					houseFloor:houseFloor,
					cityAlias:cityAlias,
					areaName:areaName
			};
			App.browParam[0] = param;
			
			if($("#next").attr('disabled')){ //确定按钮可点击
				return;
			}
			
			
			if (Utils.checkSession()) {
				if(Utils.checkRealUser()){
					if(!Utils.checkActivate()){
						return;
					}
					var cityAlias = App.storage.get("_parameters").cityAlias;
					var domicilePlace = App.storage.get("_parameters").areaZipCode;//行政区代码
					var projectId = App.storage.get("_parameters").projectId;//楼盘Id
					var areaName = App.storage.get("_parameters").areaName;
					var houseAddress = cityAlias+""+areaName+""+$("#houseAddress").val();
					var houseArea =$("#houseArea").val();
					var houseFloor =$("#houseFloor").val();
					var handInfo ={
							houseAddress:houseAddress,
							domicilePlace:domicilePlace,
							houseFloor:houseFloor,
							houseArea:houseArea,
							projectId:projectId
					};
					App.navigate("mortgage/mortgageCtl/mortMore",handInfo);
				}
			} else {
				Client.toLogin("curView.next()");
			}
		},
		
		checkButton : function(){
			(!MUI.isEmpty($('#houseAddress').val()) && !MUI.isEmpty($('#houseArea').val()) && !MUI.isEmpty($('#houseFloor').val()))
			? $("#next").removeClass('disabled').removeAttr('disabled') : $("#next").addClass('disabled').attr('disabled',true);								
		},
		
		
		goBack : function(){
			App.back();
		}
	
	});
});
