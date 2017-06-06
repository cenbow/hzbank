define(function(require, exports, module){
	
	var mortQueryFloorTpl = require("text!../template/mortQueryFloor.html");
	
	var MortQueryFloorView = module.exports = ItemView.extend({
		
		events : {
			
		},
		
		template : mortQueryFloorTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    this.init();
		},
		
		init : function(){
			var cityId = App.storage.get("_parameters").cityId;
			var cityZipCode = App.storage.get("_parameters").cityZipCode;
			var buildingId = App.storage.get("_parameters").buildingId;
			var param = {	
					cityId:cityId,
					cityZipCode:cityZipCode,
					buildingId:buildingId,
					searchKey:""
				};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/mortgage/floor", data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
				var html="";
				var floorList = data.floorList;
				var pos="0";
				for ( var i = 0; i < floorList.length; i++) {
					pos++;
					var floorInfo = floorList[i];
					var floor = floorInfo.floor;
					html += '<li class="list-item" index="'+pos+'" >'+floor+'</li>'; 
				}
				if(pos=="1"){
					$("#floorList").html(html);
					$("#noResult").hide();
					$("#queryFloor").show();
				}
				else if(pos>="2"){
					$("#floorList").append(html);
					$("#noResult").hide();
					$("#queryFloor").show();
				}else{
					$("#noResult").show();
					$("#queryFloor").hide();
				}
				$(".list-item").off().on("click",function(){
					var floorName = $(this).text();
					var buildingName = App.storage.get("_parameters").buildingName;
					var floorData = {
							floorName:floorName,
							buildingName:buildingName,
							buildingId:App.storage.get("_parameters").buildingId,
							buildingName:App.storage.get("_parameters").buildingName,
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
					App.navigate("mortgage/mortgageCtl/mortTest2",floorData);
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
