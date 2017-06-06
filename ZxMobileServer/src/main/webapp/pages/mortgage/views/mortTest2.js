define(function(require, exports, module){
	
	var mortTest2Tpl = require("text!../template/mortTest2.html");
	
	var MortTest2View = module.exports = ItemView.extend({
		
		events : {
			"click #next":"next",
			"click #build" : "goBuild",
			"click #floo" : "goFloor",
			"click #hous" : "goHouse",
		},
		
		template : mortTest2Tpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			this.param={};
			var provinceAlias = App.storage.get("_parameters").provinceAlias;
			var cityAlias = App.storage.get("_parameters").cityAlias;
			var areaName = App.storage.get("_parameters").areaName;
		    var address = provinceAlias+" "+cityAlias+" "+areaName;
		    var projectName = App.storage.get("_parameters").projectName;
		    var areaZipCode = App.storage.get("_parameters").areaZipCode;
		    
		    this.param.provinceAlias = provinceAlias;
		    this.param.cityAlias = cityAlias;
		    this.param.areaName = areaName;
		    this.param.projectName = projectName;
		    this.param.areaZipCode = areaZipCode;
		    
		    $("#address").text(address);
		    $("#projectName").text(projectName);
		    
		    
		    var buildingName ="请选择楼栋";
		    var floorName ="请选择楼层";
		    var houseName ="请选择房号";
		    var buildArea ="";
		    
		    if(App.storage.get("_parameters")){
		    	buildingName = App.storage.get("_parameters").buildingName || "请选择楼栋";
		    	floorName = App.storage.get("_parameters").floorName || "请选择楼层";
		    	houseName = App.storage.get("_parameters").houseName || "请选择房号";
		    	buildArea = App.storage.get("_parameters").buildArea || "";
		    }
		    if(buildArea=="0"){
		    	buildArea ="";
		    }
		    
		    $("#building").text(buildingName);
		    $("#floor").text(floorName);
		    $("#house").text(houseName);
		    $("#buildArea").val(buildArea);
		    Client.hideWaitPanel(1);
		},
		
		goBuild : function(){
			var cityId = App.storage.get("_parameters").cityId;
			var cityZipCode = App.storage.get("_parameters").cityZipCode;
			var areaId = App.storage.get("_parameters").areaId;
			var projectId = App.storage.get("_parameters").projectId;
			this.param.cityId = cityId;
			this.param.cityZipCode = cityZipCode;
			this.param.areaId = areaId;
			this.param.projectId = projectId;
			App.navigate("mortgage/mortgageCtl/mortQueryBuilding",this.param);
		},
		
		goFloor : function(){
			var buildingName = $("#building").text().trim();
			if(buildingName=='请选择楼栋'){
				Utils.alertinfo("请选择楼栋");
				return false;
			}
			var totalFloor = App.storage.get("_parameters").totalFloor;
			var buildingId = App.storage.get("_parameters").buildingId;
			var cityId = App.storage.get("_parameters").cityId;
			var cityZipCode = App.storage.get("_parameters").cityZipCode;
			var areaId = App.storage.get("_parameters").areaId;
			var projectId = App.storage.get("_parameters").projectId;
			this.param.cityId = cityId;
			this.param.cityZipCode = cityZipCode;
			this.param.areaId = areaId;
			this.param.projectId = projectId;
			this.param.buildingName = buildingName;
			this.param.totalFloor = totalFloor;
			this.param.buildingId = buildingId;
			
			App.navigate("mortgage/mortgageCtl/mortQueryFloor",this.param);
		},
		
		goHouse : function(){
			var floorName = $("#floor").text().trim();
			if(floorName=='请选择楼层'){
				Utils.alertinfo("请选择楼层");
				return false;
			}
			
			var totalFloor = App.storage.get("_parameters").totalFloor;
			var buildingId = App.storage.get("_parameters").buildingId;
			var cityId = App.storage.get("_parameters").cityId;
			var cityZipCode = App.storage.get("_parameters").cityZipCode;
			var areaId = App.storage.get("_parameters").areaId;
			var projectId = App.storage.get("_parameters").projectId;
			var buildingName = App.storage.get("_parameters").buildingName;
			
			this.param.cityId = cityId;
			this.param.cityZipCode = cityZipCode;
			this.param.areaId = areaId;
			this.param.projectId = projectId;
			this.param.buildingName = buildingName;
			this.param.totalFloor = totalFloor;
			this.param.buildingId = buildingId;
			this.param.floorName = floorName;
			
			
			App.navigate("mortgage/mortgageCtl/mortQueryHouse",this.param);
		},
		
		checkButton : function(){
			($('#building').text()!="请选择楼栋" && $('#floor').text()!="请选择楼层" && $('#house').text()!="请选择房号")
			? $("#next").removeClass('disabled').removeAttr('disabled') : $("#next").addClass('disabled').attr('disabled',true);								
		},
		
		next : function(){
			if($("#next").attr('disabled')){ //确定按钮可点击
				return;
			}
			if($('#building').text()=="请选择楼栋" || $('#floor').text()=="请选择楼层" || $('#house').text()=="请选择房号"){
				var param1={
						cityAlias:App.storage.get("_parameters").cityAlias,
						areaName :App.storage.get("_parameters").areaName,
						projectId : App.storage.get("_parameters").projectId,
						areaZipCode : App.storage.get("_parameters").areaZipCode
				};
				App.navigate("mortgage/mortgageCtl/mortTest3",param1);
			}else{
				var cityId = App.storage.get("_parameters").cityId;
				var cityZipCode = App.storage.get("_parameters").cityZipCode;
				var cityName = App.storage.get("_parameters").cityAlias;
				var projectId = App.storage.get("_parameters").projectId;
				var projectName = App.storage.get("_parameters").projectName;
				var buildingId = App.storage.get("_parameters").buildingId;
				var buildingName = App.storage.get("_parameters").buildingName;
				var floor = $("#floor").text();
				var houseId = App.storage.get("_parameters").houseId;
				var houseName = $("#house").text();
				var buildArea = $("#buildArea").val();
				var propertyName = "";
				var serialNo = "";//业务流水号20位
				var totalFloor = App.storage.get("_parameters").totalFloor;
				var frontCode = "";
				
				if(buildArea<='0'){
					Utils.alertinfo("房屋面积不能为空");
					return false;
				}
				
				var param = {	
						cityId:cityId,
						cityZipCode:cityZipCode,
						cityName:cityName,
						projectId:projectId,
						projectName:projectName,
						buildingId:buildingId,
						buildingName:buildingName,
						floor:floor,
						houseId:houseId,
						houseName:houseName,
						buildArea:buildArea,
						propertyName:propertyName,
						serialNo:serialNo,
						totalFloor:totalFloor,
						frontCode:frontCode
					};
				var $this = this;
				Client.openWaitPanel("拼命加载中，请稍候");
				Ajax({url:"/mortgage/housePrice", data:param,success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						var totalPrice = data.totalPrice;
						var bool = totalPrice.indexOf("E");
						if(bool>0){
							var x = totalPrice.substr(0,bool);
							var y = totalPrice.substr(bool+1);
							totalPrice = x*(Math.pow(10,y));
						}
						var unitPrice = data.unitPrice;
						var estimable = data.estimable;
						
						var param = {
								totalPrice:totalPrice,
								unitPrice:unitPrice,
								estimable:estimable,
								floorName:App.storage.get("_parameters").floorName,
								houseName:App.storage.get("_parameters").houseName,
								buildArea:$("#buildArea").val(),
								houseId:App.storage.get("_parameters").houseId,
								totalFloor:App.storage.get("_parameters").totalFloor,
								provinceAlias:App.storage.get("_parameters").provinceAlias,
								cityAlias:App.storage.get("_parameters").cityAlias,
								areaName :App.storage.get("_parameters").areaName,
								serialNo:"",
								cityId:App.storage.get("_parameters").cityId,
						 		cityZipCode : App.storage.get("_parameters").cityZipCode,
								cityName : App.storage.get("_parameters").cityAlias,
						 		projectId : App.storage.get("_parameters").projectId,
						 		projectName : App.storage.get("_parameters").projectName,
						 		buildingId :App.storage.get("_parameters").buildingId,
								buildingName : App.storage.get("_parameters").buildingName,
								projectName : App.storage.get("_parameters").projectName,
								areaZipCode : App.storage.get("_parameters").areaZipCode
						
								};
						App.navigate("mortgage/mortgageCtl/mortMoney",param);
					}else{
						App.navigate("mortgage/mortgageCtl/mortMoney");
					}
						Client.hideWaitPanel(100);
					},error:function(){
						App.navigate("mortgage/mortgageCtl/mortMoney");
					}
				});
			}
		},
		
		
		
		
		goBack : function(){
			App.navigate("mortgage/mortgageCtl/mortTest1");
		}
	
	});
});
