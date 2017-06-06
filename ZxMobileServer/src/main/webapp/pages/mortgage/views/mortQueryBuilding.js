define(function(require, exports, module){
	
	var mortQueryBuildingTpl = require("text!../template/mortQueryBuilding.html");
	
	var MortQueryBuildingView = module.exports = ItemView.extend({
		
		events : {
			
		},
		
		template : mortQueryBuildingTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    this.init();
		},
		
		init : function(){
			var cityId = App.storage.get("_parameters").cityId;
			var cityZipCode = App.storage.get("_parameters").cityZipCode;
			var projectId = App.storage.get("_parameters").projectId;
			var param = {	
					cityId:cityId,
					cityZipCode:cityZipCode,
					projectId:projectId,
					searchKey:""
				};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/mortgage/building", data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
				var html="";
				var buildingList = data.buildingList;
				var pos="0";
				for ( var i = 0; i < buildingList.length; i++) {
					pos++;
					var buildingInfo = buildingList[i];
					var buildingId = buildingInfo.buildingId;
					var buildingName = buildingInfo.buildingName;
					var totalFloor = buildingInfo.totalFloor;
					App.storage.set("buildIdInfo",{buildingId:buildingInfo.buildingId});
					html += '<li class="list-item" cur="'+buildingId+'" arr="'+totalFloor+'"  index="'+pos+'" >'+buildingName+'</li>'; 
				}
				if(pos=="1"){
					$("#buildingList").html(html);
					$("#noResult").hide();
					$("#queryBuilding").show();
					
				}
				else if(pos>="2"){
					$("#buildingList").append(html);
					$("#noResult").hide();
					$("#queryBuilding").show();
					
				}else{
					$("#noResult").show();
					$("#queryBuilding").hide();
				}
				$(".list-item").off().on("click",function(){
					var buildingId = $(this).attr("cur");
					var buildingName = $(this).text();
					var totalFloor = $(this).attr("arr");
					var buildingData = {
							buildingId:buildingId,
							buildingName:buildingName,
							totalFloor:totalFloor,
							provinceAlias:App.storage.get("_parameters").provinceAlias,
							cityAlias:App.storage.get("_parameters").cityAlias,
							areaName :App.storage.get("_parameters").areaName,
							projectName:App.storage.get("_parameters").projectName,
							cityId:App.storage.get("_parameters").cityId,
							cityZipCode:App.storage.get("_parameters").cityZipCode,
							areaId:App.storage.get("_parameters").areaId,
							projectId:App.storage.get("_parameters").projectId,
							areaZipCode:App.storage.get("_parameters").areaZipCode
					};
					App.navigate("mortgage/mortgageCtl/mortTest2",buildingData);
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
