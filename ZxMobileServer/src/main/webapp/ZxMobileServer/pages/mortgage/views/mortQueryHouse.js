define(function(require, exports, module){
	
	var mortQueryHouseTpl = require("text!../template/mortQueryHouse.html");
	
	var MortQueryHouseView = module.exports = ItemView.extend({
		
		events : {
			
		},
		
		template : mortQueryHouseTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    this.init();
		},
		
		init : function(){
			var cityId = App.storage.get("_parameters").cityId;
			var cityZipCode = App.storage.get("_parameters").cityZipCode;
			var buildingId = App.storage.get("_parameters").buildingId;
			var floor = App.storage.get("_parameters").floorName;
			var param = {	
					cityId:cityId,
					cityZipCode:cityZipCode,
					buildingId:buildingId,
					floor:floor,
					searchKey:""
				};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/mortgage/house", data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
				var html="";
				var houseList = data.houseList;
				var pos="0";
				for ( var i = 0; i < houseList.length; i++) {
					pos++;
					var houseInfo = houseList[i];
					var houseId = houseInfo.houseId;
					var houseName = houseInfo.houseName;
					var buildArea = houseInfo.buildArea;
					
					html += '<li class="list-item" area="'+buildArea+'" cur="'+houseId+'" index="'+pos+'" >'+houseName+'</li>'; 
				}
				if(pos=="1"){
					$("#houseList").html(html);
					$("#noResult").hide();
					$("#queryHouse").show();
				}
				else if(pos>="2"){
					$("#houseList").append(html);
					$("#noResult").hide();
					$("#queryHouse").show();
				}else{
					$("#noResult").show();
					$("#queryHouse").hide();
				}
				$(".list-item").off().on("click",function(){
					var buildingName = App.storage.get("_parameters").buildingName;
					var floorName = App.storage.get("_parameters").floorName;
					var buildArea = $(this).attr("area");
					var houseId = $(this).attr("cur");
					var houseName = $(this).text();
					var houseData = {
							buildingName:buildingName,
							floorName:floorName,
							houseName:houseName,
							buildArea:buildArea,
							houseId:houseId,
							buildingId:App.storage.get("_parameters").buildingId,
							totalFloor:App.storage.get("_parameters").totalFloor,
							provinceAlias:App.storage.get("_parameters").provinceAlias,
							cityAlias:App.storage.get("_parameters").cityAlias,
							areaName :App.storage.get("_parameters").areaName,
							projectName:App.storage.get("_parameters").projectName,
							areaZipCode:App.storage.get("_parameters").areaZipCode,
							cityId:App.storage.get("_parameters").cityId,
							cityZipCode:App.storage.get("_parameters").cityZipCode,
							areaId:App.storage.get("_parameters").areaId,
							projectId:App.storage.get("_parameters").projectId
					};
					App.navigate("mortgage/mortgageCtl/mortTest2",houseData);
				});
				}else{
					Utils.alertinfo(data.errorMessage);
				}Client.hideWaitPanel(100);
				}
			});
		},
		
		
		goBack : function(){
			App.back();
		}
	
	});
});
