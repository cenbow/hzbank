define(function(require, exports, module){
	require("../../../scripts/components/allPicker");
	
	var mortApplyTpl = require("text!../template/mortApply.html");
	
	var MortApplyView = module.exports = ItemView.extend({
		
		events : {
			"click #help":"goHelp",
			"click #apply":"goApply",
			"click #loan":"loan",
			"click #next":"goNext",
			"click #queryMore":"queryMore",
			"click #changeCity":"changeCity"
		},
		
		template : mortApplyTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			this.areaPicker = new $.PopPicker();
			var date = "";
			var $this=this;
			$("#search").off().on("input",function(){
        		var searchKey = $(this).val().trim();
        		if(!searchKey){
        			return;
        		}
        		date = new Date();
        		if(searchKey.search(/[a-zA-Z]+/)==-1){
            		setTimeout(function(){
            			if(new Date()-date <2000) return;
            			$this.queryProject();
            		},2000);
        		}else{
        			return;
        		}
        	});
			this.queryHouseData={};
			if(pubParam.clientVersion>"3.0.8"){
				Client.getLocationInfo("curView.queryCity");//调用客户端方法获取当前城市
			}else{
				this.queryCity("179");
			}
		},
		
		queryCity : function(obj){
			var cityCode = "";
			if(obj=="179"){
				cityCode = obj;
			}else{
				cityCode = obj.cityCode;
			}
			//定位的当前城市与已有的城市对比
			var cityList = NS.PB_CITYLIST;
			for(var i=0;i<cityList.length;i++){
				if(cityList[i].cityCode==cityCode){
					this.queryHouseData.cityZipCode=cityList[i].cityZipCode;
					this.queryHouseData.cityId=cityList[i].cityId;
					this.queryHouseData.cityName=cityList[i].cityName;
				}
			}
			if(this.queryHouseData.cityZipCode=="" || this.queryHouseData.cityZipCode==null){
				this.queryHouseData.cityZipCode="330100";
				this.queryHouseData.cityId="74";
				this.queryHouseData.cityName="杭州";
			}
			var cityName = "杭州";
			if(App.storage.get("_parameters")){
				cityName = App.storage.get("_parameters").cityName;
			}else{
				cityName = this.queryHouseData.cityName || "杭州";
			}
			$("#cityName").text(cityName);
			if(cityName=="杭州"){
				$("#img").attr("src","images/deloan/de_head_hz.jpg");
			}else if(cityName=="上海"){
				$("#img").attr("src","images/deloan/de_head_sh.jpg");
			}else if(cityName=="北京"){
				$("#img").attr("src","images/deloan/de_head_bj.jpg");
			}else if(cityName=="南京"){
				$("#img").attr("src","images/deloan/de_head_nj.jpg");
			}else if(cityName=="合肥"){
				$("#img").attr("src","images/deloan/de_head_hf.jpg");
			}else if(cityName=="深圳"){
				$("#img").attr("src","images/deloan/de_head_sz.jpg");
			}else if(cityName=="宁波"){
				$("#img").attr("src","images/deloan/de_head_nb.png");
			}else if(cityName=="丽水"){
				$("#img").attr("src","images/deloan/de_head_ls.png");
			}else if(cityName=="绍兴"){
				$("#img").attr("src","images/deloan/de_head_sx.jpg");
			}else if(cityName=="温州"){
				$("#img").attr("src","images/deloan/de_head_wz.jpg");
			}else{
				$("#img").attr("src","images/deloan/de_head_qt.png");
			}
			
			this.init();
		},
		
		queryMore : function(){
			$(".ui-poppicker").remove();
			$(".ui-backdrop").remove();
			this.saveSession();
			var cityName ="";
			var cityId = "";
			var cityZipCode = "";
			if(App.storage.get("_parameters")){
				cityId = App.storage.get("_parameters").cityId;
				cityZipCode = App.storage.get("_parameters").cityZipCode;
				cityName = App.storage.get("_parameters").cityName;
			}else{
				cityName =this.queryHouseData.cityName;
				cityId = this.queryHouseData.cityId;
				cityZipCode = this.queryHouseData.cityZipCode;
			}
			var param = {
					cityName:cityName,
					cityId:cityId,
					cityZipCode:cityZipCode,
					areaZipCode:this.queryHouseData.areaZipCode,
					areaName:this.queryHouseData.areaName,
					areaId:this.queryHouseData.areaId,
					totalPrice:this.queryHouseData.totalPrice || "0",
					unitPrice:this.queryHouseData.unitPrice || "0",
					estimable:this.queryHouseData.estimable || "2",
					projectName:$("#search").val(),
					projectId:this.queryHouseData.projectId || "",
					buildingId:this.queryHouseData.buildingId || "",
					buildingName:$("#build").text(),
					totalFloor:this.queryHouseData.totalFloor || "",
					floorName:$("#floor").text(),
					houseId:this.queryHouseData.houseId || "",
					houseName:$("#house").text(),
					buildArea:$("#buildArea").val(),
					houseAddress:$("#houseAddress").val()
			};
			App.navigate("mortgage/mortgageCtl/mortLoop",param);
		},
		
		init : function(){
			var cityId = this.queryHouseData.cityId;
			if(App.storage.get("_parameters")){
				cityId = App.storage.get("_parameters").cityId;
				var cityName = App.storage.get("_parameters").cityName;
				var areaZipCode = App.storage.get("_parameters").areaZipCode;
				var areaName = App.storage.get("_parameters").areaName;
				var areaId = App.storage.get("_parameters").areaId;
				var totalPrice = App.storage.get("_parameters").totalPrice || "0";
				var unitPrice = App.storage.get("_parameters").unitPrice || "0";
				var estimable = App.storage.get("_parameters").estimable || "2";
				var projectName = App.storage.get("_parameters").projectName || "";
				var projectId = App.storage.get("_parameters").projectId || "";
				var buildingId = App.storage.get("_parameters").buildingId || "";
				var buildingName = App.storage.get("_parameters").buildingName || "请先输入楼盘";
				var totalFloor = App.storage.get("_parameters").totalFloor || "";
				var floorName = App.storage.get("_parameters").floorName || "请选择";
				var houseId = App.storage.get("_parameters").houseId || "";
				var houseName = App.storage.get("_parameters").houseName || "请选择";
				var buildArea = App.storage.get("_parameters").buildArea || "";
				var houseAddress = App.storage.get("_parameters").houseAddress || "";
				if(buildingName=="请先输入楼盘"){
					document.getElementById("build").setAttribute("class","fc-c");
				}else{
					document.getElementById("build").setAttribute("class","fc-3");
				}
				if(floorName=="请选择"){
					document.getElementById("floor").setAttribute("class","fc-c");
				}else{
					document.getElementById("floor").setAttribute("class","fc-3");
				}
				if(houseName=="请选择"){
					document.getElementById("house").setAttribute("class","fc-c");
				}else{
					document.getElementById("house").setAttribute("class","fc-3");
				}
				
				this.queryHouseData.cityName = cityName;
				this.queryHouseData.areaZipCode = areaZipCode;
				this.queryHouseData.areaName = areaName;
				this.queryHouseData.areaId = areaId;
				this.queryHouseData.totalPrice = totalPrice;
				this.queryHouseData.unitPrice = unitPrice;
				this.queryHouseData.estimable = estimable;
				this.queryHouseData.projectName = projectName;
				this.queryHouseData.projectId = projectId;
				this.queryHouseData.buildingId = buildingId;
				this.queryHouseData.buildingName = buildingName;
				this.queryHouseData.totalFloor = totalFloor;
				this.queryHouseData.floorName = floorName;
				this.queryHouseData.houseId = houseId;
				this.queryHouseData.houseName = houseName;
				this.queryHouseData.buildArea = buildArea;
				this.queryHouseData.houseAddress = houseAddress;
				
				if(buildingName=="暂无楼栋,下方填写" || floorName=="暂无楼层,下方填写" || houseName=="暂无房号,下方填写"){
					$("#address").show();
				}
				
				if(estimable=="1"){
					$("#mostMoney").show();
					$("#moneyL2").hide();
					$("#moneyL1").show();
					$("#next").text("我要申请");
					$("#money").text(Math.round(totalPrice/10000));
					$("#loanMoney").text(Math.round(totalPrice*0.7/10000)+"万元");
				}else if(estimable=="0"){
					$("#mostMoney").hide();
					$("#next").text("我要申请");
					$("#moneyL2").show();
					$("#moneyL1").hide();
					$("#loanMoney").text("暂无额度");
				}else{
					$("#mostMoney").hide();
					$("#next").text("开始评估");
				}
				$("#search").val(projectName);
				$("#build").text(buildingName);
				$("#floor").text(floorName);
				$("#house").text(houseName);
				$("#houseAddress").val(houseAddress);
				$("#buildArea").val(buildArea);
			}
			this.queryHouseData.cityId=cityId;
			this.queryArea(cityId);
		},
		
		goNext : function(){
			if($("#next").text().trim()=="开始评估"){
				this.goAssessment();
			}else{
				this.goApply();
			}
		},
		
		
		
		goClear : function(){
			this.queryHouseData.estimable = "2";
			$("#mostMoney").hide();
			$("#next").text("开始评估");
			$("#address").hide();
			$("#search").val("");
			$("#buildArea").val("");
			$("#build").text("请先输入楼盘");
			$("#floor").text("请选择");
			$("#houseAddress").val("");
			$("#house").text("请选择");
		},
		

		//开始评估,并且保存在本地
		goAssessment : function(){
			if(!$("#search").val().trim()){
				Utils.alertinfo("请输入楼盘");
				return false;
			}
			
			if($('#build').text()=="暂无楼栋,下方填写" || $('#floor').text()=="暂无楼层,下方填写" || $('#house').text()=="暂无房号,下方填写"){
				if(!$("#houseAddress").val().trim()){
					Utils.alertinfo("请输入房屋详细地址");
					return false;
				}
				if(!$("#buildArea").val().trim()){
					Utils.alertinfo("房屋面积不能为空");
					return false;
				}
				if($("#buildArea").val().trim()<=0){
					Utils.alertinfo("房屋面积不能为0");
					return false;
				}
				if($("#buildArea").val().trim()>=1000){
					Utils.alertinfo("房屋面积过大");
					return false;
				}
				
				
				var projectFlag = this.queryHouseData.projectFlag;//有无楼盘标志
				if(projectFlag=="1"){//有楼盘 ,查均价
					var cityId = "";
					if(App.storage.get("_parameters")){
						cityId = App.storage.get("_parameters").cityId;
					}else{
						cityId = this.queryHouseData.cityId;
					}
					if(cityId=="74" ||cityId=="1" ||cityId=="2" ||cityId=="6" 
						||cityId=="84" ||cityId=="98" ||cityId=="75"){
						var areaZipCode = this.queryHouseData.areaZipCode;
						if(areaZipCode=="330122" || areaZipCode=="330185" || 
						areaZipCode=="330182" ||areaZipCode=="330183" || areaZipCode=="330127"){
							this.queryAverPrice();
						}else{
							this.queryHouseData.estimable = "0";
							this.queryHouseData.buildArea = $("#buildArea").val().trim();
							this.queryHouseData.totalPrice = "0";
							this.queryHouseData.unitPrice = "0";
							$("#mostMoney").hide();
							$("#moneyL2").show();
							$("#moneyL1").hide();
							$("#loanMoney").text("暂无额度");
							$("#next").text("我要申请");
							this.goSave();
						}
					}else{
						this.queryAverPrice();
					}
				}else{//无楼盘
					this.queryHouseData.estimable = "0";
					this.queryHouseData.buildArea = $("#buildArea").val().trim();
					this.queryHouseData.totalPrice = "0";
					this.queryHouseData.unitPrice = "0";
					$("#mostMoney").hide();
					$("#moneyL2").show();
					$("#moneyL1").hide();
					$("#loanMoney").text("暂无额度");
					$("#next").text("我要申请");
					this.goSave();
				}
			}else{
				var cityName ="";
				var cityId = "";
				var cityZipCode = "";
				if(App.storage.get("_parameters")){
					cityId = App.storage.get("_parameters").cityId;
					cityZipCode = App.storage.get("_parameters").cityZipCode;
					cityName = App.storage.get("_parameters").cityName;
				}else{
					cityName =this.queryHouseData.cityName;
					cityId = this.queryHouseData.cityId;
					cityZipCode = this.queryHouseData.cityZipCode;
				}
				var projectId = this.queryHouseData.projectId;
				var projectName = this.queryHouseData.projectName;
				var buildingId = this.queryHouseData.buildingId;
				var buildingName = this.queryHouseData.buildingName;
				var houseId = this.queryHouseData.houseId;
				var totalFloor = this.queryHouseData.totalFloor;
				var floor = this.queryHouseData.floorName;
				var houseName = this.queryHouseData.houseName;
				var buildArea = $("#buildArea").val().trim();
				var propertyName = "";
				var serialNo = "";//业务流水号20位
				var frontCode = "";
				if(!buildArea){
					Utils.alertinfo("房屋面积不能为空");
					return false;
				}
				if(buildArea<=0){
					Utils.alertinfo("房屋面积不能为0");
					return false;
				}
				if(buildArea>=1000){
					Utils.alertinfo("房屋面积过大");
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
							totalPrice = Math.round(x*(Math.pow(10,y)));
						}
						var unitPrice = data.unitPrice;
						var estimable = data.estimable;
						$this.queryHouseData.totalPrice = totalPrice;
						$this.queryHouseData.unitPrice = unitPrice;
						$this.queryHouseData.estimable = estimable;
						
						if(totalPrice=="0"){
							$("#moneyL2").show();
							$("#moneyL1").hide();
							$("#loanMoney").text("暂无额度");
						}else{
							$("#mostMoney").show();
							$("#moneyL2").hide();
							$("#moneyL1").show();
							$("#money").text(Math.round(totalPrice/10000));
							$("#loanMoney").text(Math.round(totalPrice*0.7/10000)+"万元");
						}
						$("#next").text("我要申请");
						$this.goSave();
						Client.hideWaitPanel(100);
					}
					},error:function(){
						Client.hideWaitPanel(100);
					}
				});
			}
		},
		
		
		//查询均价
		queryAverPrice : function(){
			var cityName ="";
			var cityId = "";
			var cityZipCode = "";
			if(App.storage.get("_parameters")){
				cityId = App.storage.get("_parameters").cityId;
				cityZipCode = App.storage.get("_parameters").cityZipCode;
				cityName = App.storage.get("_parameters").cityName;
			}else{
				cityName =this.queryHouseData.cityName;
				cityId = this.queryHouseData.cityId;
				cityZipCode = this.queryHouseData.cityZipCode;
			}
			var projectId = this.queryHouseData.projectId;
			var projectName = this.queryHouseData.projectName;
			var buildingId = "";
			var buildingName = "";
			var houseId = "";
			var totalFloor = "";
			var floor = "";
			var houseName = "";
			var buildArea = $("#buildArea").val().trim();
			var propertyName = "";
			var serialNo = "";//业务流水号20位
			var frontCode = "";
			
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
						totalPrice = Math.round(x*(Math.pow(10,y)));
					}
					var unitPrice = data.unitPrice;
					var estimable = data.estimable;
					$this.queryHouseData.totalPrice = totalPrice;
					$this.queryHouseData.unitPrice = unitPrice;
					$this.queryHouseData.estimable = estimable;
					
					if(totalPrice=="0"){
						$("#moneyL2").show();
						$("#moneyL1").hide();
						$("#loanMoney").text("暂无额度");
					}else{
						$("#mostMoney").show();
						$("#moneyL2").hide();
						$("#moneyL1").show();
						$("#money").text(Math.round(totalPrice/10000));
						$("#loanMoney").text(Math.round(totalPrice*0.7/10000)+"万元");
					}
					$("#next").text("我要申请");
					$this.goSave();
					Client.hideWaitPanel(1);
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(1);
				}
			},error:function(){
				Client.hideWaitPanel(100);
			}
			});	
		
		},
		
		
		//保存评估信息到本地
		goSave : function(){
			var houseTotalPrice = this.queryHouseData.totalPrice;
			var unitPrice = this.queryHouseData.unitPrice;
			var estimable = this.queryHouseData.estimable;
			var cityName =  $("#cityName").text().trim();
			var areaName =  $("#userResult").text().trim();
			var buildArea =  $("#buildArea").val().trim();
			var buildingName =  "";
			var floorName = "";
			var houseName = "";
			var projectName = "";
			var houseAddress = "";
			if(estimable=="1"){
				buildingName =  this.queryHouseData.buildingName;
				floorName =  this.queryHouseData.floorName;
				houseName =  this.queryHouseData.houseName;
				projectName =  this.queryHouseData.projectName;
				if($('#build').text().trim()=="暂无楼栋,下方填写" || $('#floor').text().trim()=="暂无楼层,下方填写" || $('#house').text().trim()=="暂无房号,下方填写"){
					houseAddress = cityName+""+areaName+""+projectName+""+$("#houseAddress").val().trim();
				}else{
					houseAddress = cityName+""+areaName+""+projectName+""+ buildingName+""+houseName;
				}
			}else{
				buildingName =  $("#build").text().trim();
				floorName =  $("#floor").text().trim();
				houseName =  $("#house").text().trim();
				projectName =  $("#search").val().trim();
				houseAddress = cityName+""+areaName+""+$("#houseAddress").val().trim();
			}
			var param = {	
					houseTotalPrice:houseTotalPrice,
					unitPrice:unitPrice,
					projectName:projectName,
					buildName:buildingName,
					floorName:floorName,
					houseName:houseName,
					houseAddress:houseAddress,
					houseArea:buildArea,
					cityName:cityName,
					areaName:areaName
				};
			var $this = this;
			var url="";
			if(Utils.checkSession()){//登陆
				url = "/mortgage/mortEvaluateSave";
			}else{//未登录
				url = "/mortgage/mortEvaluateSaveNoSession";
			}
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:url, data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					Client.hideWaitPanel(100);
				}else{
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(100);
				}},error:function(){
					Utils.alertinfo(data.errorMessage);
					Client.hideWaitPanel(100);
				}
			});
		},
		
		
		goApply : function(type){
			$(".ui-poppicker").remove();
			$(".ui-backdrop").remove();
			var cityName = "";
			var cityId = "";
			var cityZipCode = "";
			if(App.storage.get("_parameters")){
				cityId = App.storage.get("_parameters").cityId;
				cityZipCode = App.storage.get("_parameters").cityZipCode;
				cityName = App.storage.get("_parameters").cityName;
			}else{
				cityId = this.queryHouseData.cityId;
				cityZipCode = this.queryHouseData.cityZipCode;
				cityName =this.queryHouseData.cityName;
			}
			
			var areaName = this.queryHouseData.areaName;
			var projectName = this.queryHouseData.projectName;
			var buildingName = this.queryHouseData.buildingName;
			var floorName = this.queryHouseData.floorName;
			var houseName = this.queryHouseData.houseName;
			var houseAddress1 = $("#houseAddress").val().trim();
			this.queryHouseData.buildArea = $("#buildArea").val().trim();
			if(this.queryHouseData.estimable=="1"){
				if(buildingName=="暂无楼栋,下方填写" || floorName=="暂无楼层,下方填写" || houseName=="暂无房号,下方填写"){
					this.queryHouseData.houseAddress = cityName+""+areaName+""+projectName+""+houseAddress1;
				}else{
					this.queryHouseData.houseAddress = cityName+""+areaName+""+projectName+""+ buildingName+""+houseName;//把楼层去掉了
				}
			}else{
				this.queryHouseData.houseAddress = cityName+""+areaName+""+houseAddress1;
			}
			
			if(type != '1'){
				var param = {
						cityName:cityName,
						cityId:cityId,
						cityZipCode:cityZipCode,
						areaZipCode:this.queryHouseData.areaZipCode,
						areaName:this.queryHouseData.areaName,
						areaId:this.queryHouseData.areaId,
						totalPrice:this.queryHouseData.totalPrice || "0",
						unitPrice:this.queryHouseData.unitPrice || "0",
						estimable:this.queryHouseData.estimable || "2",
						projectName:$("#search").val(),
						projectId:this.queryHouseData.projectId || "",
						buildingId:this.queryHouseData.buildingId || "",
						buildingName:$("#build").text(),
						totalFloor:this.queryHouseData.totalFloor || "",
						floorName:$("#floor").text(),
						houseId:this.queryHouseData.houseId || "",
						houseName:$("#house").text(),
						buildArea:$("#buildArea").val(),
						houseAddress:$("#houseAddress").val(),
						houseAddressAll:this.queryHouseData.houseAddress//提交的时候需要用到的地址
				};
				App.browParam[0] = param;
				}
			
			
			
			if (Utils.checkSession()) {//当需要输入密码登录的时候当前页面的信息带不到下一个页面,参考mortTest3.js
				if(Utils.checkRealUser()){
					if(!Utils.checkActivate()){
						return;
					}
					//申请提交的时候需要用到的数据
					var cityName = "";
					var cityId = "";
					var cityZipCode = "";
					if(App.storage.get("_parameters")){
						cityId = App.storage.get("_parameters").cityId;
						cityZipCode = App.storage.get("_parameters").cityZipCode;
						cityName = App.storage.get("_parameters").cityName;
					}else{
						cityId = this.queryHouseData.cityId;
						cityZipCode = this.queryHouseData.cityZipCode;
						cityName =this.queryHouseData.cityName;
					}
					var param = {
							cityName:cityName,
							cityId:cityId,
							cityZipCode:cityZipCode,
							areaZipCode:this.queryHouseData.areaZipCode,
							areaName:this.queryHouseData.areaName,
							areaId:this.queryHouseData.areaId,
							totalPrice:this.queryHouseData.totalPrice || "0",
							unitPrice:this.queryHouseData.unitPrice || "0",
							estimable:this.queryHouseData.estimable || "2",
							projectName:$("#search").val(),
							projectId:this.queryHouseData.projectId || "",
							buildingId:this.queryHouseData.buildingId || "",
							buildingName:$("#build").text(),
							totalFloor:this.queryHouseData.totalFloor || "",
							floorName:$("#floor").text(),
							houseId:this.queryHouseData.houseId || "",
							houseName:$("#house").text(),
							buildArea:$("#buildArea").val(),
							houseAddress:$("#houseAddress").val(),
							houseAddressAll:this.queryHouseData.houseAddress//提交的时候需要用到的地址
					};
			        if(type=='1'){
			           param = App.browParam[0];
			        }
					App.navigate("mortgage/mortgageCtl/mortMore",param);
				};
			} else {
				Client.toLogin("curView.goApply('1')");
			};
		},
		
		//查询区域
		queryArea : function(cityId){
			this.arrAreaList = [];
			var param = {	
					cityId:cityId,
					tranType:"01",
				};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/mortgage/area", data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
				var areaList = data.areaList;
				if(areaList.length<1){
					$this.arrAreaList = [{value: '111',text: '暂无区域',}];
				}
				for ( var i = 0; i < areaList.length; i++) {
					var areaInfo = areaList[i];
					var areaId = areaInfo.areaId;
					var areaName = areaInfo.areaName;
					var areaZipCode = areaInfo.areaZipCode;
					var arr={
							"value":areaId,
							"text":areaName,
							"code":areaZipCode
					};
					$this.arrAreaList.push(arr);
				}
				var areaName1 = $this.arrAreaList[0].text;
				var areaId1 = $this.arrAreaList[0].value;
				var areaZipCode1 = $this.arrAreaList[0].code;
				if(App.storage.get("_parameters")){
					areaName1 = App.storage.get("_parameters").areaName;
					if(areaName1){
						areaName1 = App.storage.get("_parameters").areaName;
						areaId1 = App.storage.get("_parameters").areaId;
						areaZipCode1 = App.storage.get("_parameters").areaZipCode;
					}else{
						areaName1 = $this.arrAreaList[0].text;
						areaId1 = $this.arrAreaList[0].value;
						areaZipCode1 = $this.arrAreaList[0].code;
					}
				}
				$("#userResult").text(areaName1);
				
				$this.queryHouseData.areaName = areaName1;
				$this.queryHouseData.areaId = areaId1;
				$this.queryHouseData.areaZipCode = areaZipCode1;
				$('#showUserPicker').on('tap', function(event) {
				   $this.areaPicker.setData($this.arrAreaList);
				   $this.areaPicker.show(function(items) {
					   document.getElementById("build").setAttribute("class","fc-c");
					   document.getElementById("floor").setAttribute("class","fc-c");
					   document.getElementById("house").setAttribute("class","fc-c");
					  $('#userResult').text(items[0].text);
					  $("#queryProject1").show();
					  $("#queryProject").hide();
					  $("#noResult").hide();
					  $("#address").hide();
					  $("#next").text("开始评估");
					  $("#mostMoney").hide();
					  $("#build").text("请先输入楼盘");
					  $("#floor").text("请选择");
					  $("#house").text("请选择");
					  $("#houseAddress").val("");
					  $("#search").val("");
					  $("#buildArea").val("");
					  $this.queryHouseData.areaName = items[0].text;
					  $this.queryHouseData.areaId = items[0].value;
					  $this.queryHouseData.areaZipCode = items[0].code;
				   });
				});
				}else{
					Utils.alertinfo(data.errorMessage);
				}
				Client.hideWaitPanel(100);
				},error:function(){
					$this.arrAreaList = [{value: '111',text: '暂无区域',}];
					Client.hideWaitPanel(100);
				}
			
			});
		},
		
		//查询楼盘
		queryProject : function(){
			$("#projectList .list-item-0").remove();
			var areaId = this.queryHouseData.areaId;
			var cityId = "";
			var cityZipCode = "";
			if(App.storage.get("_parameters")){
				cityId = App.storage.get("_parameters").cityId || cityId;
				cityZipCode = App.storage.get("_parameters").cityZipCode || cityZipCode;
			}else{
				cityId = this.queryHouseData.cityId;
				cityZipCode = this.queryHouseData.cityZipCode;
			}
			var searchKey = $("#search").val().trim();
			if(!searchKey){
				Client.hideWaitPanel(100);
    			return;
    		}
			var param = {	
					cityId:cityId,
					cityZipCode:cityZipCode,
					areaId:areaId,
					searchKey:searchKey,
					retNum:"5"
				};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/mortgage/project", data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
				document.getElementById("build").setAttribute("class","fc-3");
				document.getElementById("floor").setAttribute("class","fc-3");
				document.getElementById("house").setAttribute("class","fc-3");
				$("#next").text("开始评估");
				var html="";
				var projectList = data.projectList;
				var totalNum = data.totalNum;
				var pos="0";
				for ( var i = 0; i < projectList.length; i++) {
					pos++;
					var projectInfo = projectList[i];
					var projectId = projectInfo.projectId;
					var projectName = projectInfo.projectName;
					html += '<li class="list-item-0" cur="'+projectId+'"  index="'+pos+'" >'+projectName+'</li>'; 
				}
				
				if(totalNum=="0"){
					$("#queryProject").hide();
					$("#address").show();
					$("#houseAddress").val("");
					$("#queryProject1").show();
					$this.queryHouseData.projectFlag ="0";
					$("#build").text("暂无楼栋,下方填写");
					$("#floor").text("暂无楼层,下方填写");
				    $("#house").text("暂无房号,下方填写");
				    $("#buildArea").val("");
				}else{
					$("#noResult").hide();
					$this.queryHouseData.projectFlag ="1";
					$("#queryProject").show();
					$("#queryProject1").hide();
					if(pos=="1"){
						$("#projectList").html(html);
					}else{
						$("#projectList").append(html);
					}
				}
				
				
				$(".list-item-0").off().on("click",function(){
					var projectId = $(this).attr("cur");
					var projectName = $(this).text();
					$this.queryHouseData.projectId = projectId;
					$this.queryHouseData.projectName = projectName;
					$("#search").val(projectName);
					$("#next").text("开始评估");
					$("#queryProject").hide();
					$("#queryProject1").show();
					$("#address").hide();
					$this.queryBuild();
				});
				$("#mostMoney").hide();
				}else{
					Utils.alertinfo(data.errorMessage);
				}
				Client.hideWaitPanel(100);
				}
			});
		},
		
		
		//查询楼栋
		queryBuild : function(){
			var projectId = this.queryHouseData.projectId;
			this.arrBuildList=[];
			var cityId = "";
			var cityZipCode = "";
			if(App.storage.get("_parameters")){
				cityId = App.storage.get("_parameters").cityId;
				cityZipCode = App.storage.get("_parameters").cityZipCode;
			}else{
				cityId = this.queryHouseData.cityId;
				cityZipCode = this.queryHouseData.cityZipCode;
			}
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
				var buildingList = data.buildingList;
				if(buildingList.length<1){
					$this.arrBuildList=[{value: '',text: '暂无楼栋,下方填写',code:''}];
				}
				for ( var i = 0; i < buildingList.length; i++) {
					var buildingInfo = buildingList[i];
					var buildingId = buildingInfo.buildingId;
					var buildingName = buildingInfo.buildingName;
					var totalFloor = buildingInfo.totalFloor;
					var arr={
							"value":buildingId,
							"text":buildingName,
							"code":totalFloor
					};
					$this.arrBuildList.push(arr);
				}
				document.getElementById("build").setAttribute("class","fc-3");
				$("#build").text($this.arrBuildList[0].text);
				$this.queryHouseData.buildingId = $this.arrBuildList[0].value;
				$this.queryHouseData.buildingName = $this.arrBuildList[0].text;
				$this.queryHouseData.totalFloor = $this.arrBuildList[0].code;
				$this.queryFloor();
				
				$('#showBuild').on('tap', function(event) {
					if($("#build").text().trim()=="暂无楼栋,下方填写"){
						return;
					}
					$this.areaPicker.setData($this.arrBuildList);
					$this.areaPicker.show(function(items) {
					  $("#next").text("开始评估");
					  $("#mostMoney").hide();
					  $('#build').text(items[0].text);
					  $this.queryHouseData.buildingId = items[0].value;
					  $this.queryHouseData.buildingName = items[0].text;
					  $this.queryHouseData.totalFloor = items[0].code;
					  $this.queryFloor();
					});
				  });
				}else{
					Utils.alertinfo(data.errorMessage);
				}
				}
			});
		},
		
		
		//查询楼层
		queryFloor : function(){
			var buildingId = this.queryHouseData.buildingId;
			if(buildingId==""){
				$("#floor").text("暂无楼层,下方填写");
			    $("#house").text("暂无房号,下方填写");
			    $("#buildArea").val("");
			    $("#address").show();
				Client.hideWaitPanel(100);
				return;
			}
			this.arrFloorList=[];
			var cityId = "";
			var cityZipCode = "";
			if(App.storage.get("_parameters")){
				cityId = App.storage.get("_parameters").cityId;
				cityZipCode = App.storage.get("_parameters").cityZipCode;
			}else{
				cityId = this.queryHouseData.cityId;
				cityZipCode = this.queryHouseData.cityZipCode;
			}
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
				var floorList = data.floorList;
				if(floorList.length<1){
					$this.arrFloorList=[{value: '',text: '暂无楼层,下方填写',code:''}];
				}
				for ( var i = 0; i < floorList.length; i++) {
					var floorInfo = floorList[i];
					var floor = floorInfo.floor;
					var arr={
							"text":floor,
					};
					$this.arrFloorList.push(arr);
				}
				document.getElementById("floor").setAttribute("class","fc-3");
				$("#floor").text($this.arrFloorList[0].text);
				$this.queryHouseData.floorName = $this.arrFloorList[0].text;
				$this.queryHouse();
				$('#showFloor').on('tap', function(event) {
					if($("#floor").text().trim()=="暂无楼层,下方填写"){
						return;
					}
					$this.areaPicker.setData($this.arrFloorList);
					$this.areaPicker.show(function(items) {
						  $("#next").text("开始评估");
						  $("#mostMoney").hide();
						  $('#floor').text(items[0].text);
						  floorName = items[0].text;
						  $this.queryHouseData.floorName = items[0].text;
						  $this.queryHouse();
					  });
				  });
				}else{
					Utils.alertinfo(data.errorMessage);
				}
				}
			});
		},
		
		
		//查询房号
		queryHouse : function(){
			var floorName = this.queryHouseData.floorName;
			var buildingId = this.queryHouseData.buildingId;
			if(floorName=="暂无楼层,下方填写"){
			    $("#house").text("暂无房号,下方填写");
			    $("#buildArea").val("");
			    $("#address").show();
				Client.hideWaitPanel(100);
				return;
			}
			this.arrHouseList=[];
			var cityId = "";
			var cityZipCode = "";
			if(App.storage.get("_parameters")){
				cityId = App.storage.get("_parameters").cityId;
				cityZipCode = App.storage.get("_parameters").cityZipCode;
			}else{
				cityId = this.queryHouseData.cityId;
				cityZipCode = this.queryHouseData.cityZipCode;
			}
			var param = {	
					cityId:cityId,
					cityZipCode:cityZipCode,
					buildingId:buildingId,
					floor:floorName,
					searchKey:""
				};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/mortgage/house", data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
				var houseList = data.houseList;
				if(houseList.length<1){
					$this.arrHouseList=[{value: '',text: '暂无房号,下方填写',code:''}];
				}
				for ( var i = 0; i < houseList.length; i++) {
					var houseInfo = houseList[i];
					var houseId = houseInfo.houseId;
					var houseName = houseInfo.houseName;
					var buildArea = houseInfo.buildArea;
					var arr={
							"value":houseId,
							"text":houseName,
							"code":buildArea
					};
					$this.arrHouseList.push(arr);
				}
				document.getElementById("house").setAttribute("class","fc-3");
				$("#house").text($this.arrHouseList[0].text);
				if($this.arrHouseList[0].text=="暂无房号,下方填写"){
					 $("#buildArea").val("");
					 $("#address").show();
				}else{
					 $("#address").hide();
				}
				$this.queryHouseData.houseId = $this.arrHouseList[0].value;
				$this.queryHouseData.houseName = $this.arrHouseList[0].text;
				$this.queryHouseData.buildArea = $this.arrHouseList[0].code;
				if($this.arrHouseList[0].code==0){
					$("#buildArea").val("");
				}else{
					$("#buildArea").val($this.arrHouseList[0].code);
				}
				$('#showHouse').on('tap', function(event) {
					if($("#house").text().trim()=="暂无房号,下方填写"){
						return;
					}
					$this.areaPicker.setData($this.arrHouseList);
					$this.areaPicker.show(function(items) {
						  $("#next").text("开始评估");
						  $("#mostMoney").hide();
						  $('#house').text(items[0].text);
						  $this.queryHouseData.houseId = items[0].value;
						  $this.queryHouseData.houseName = items[0].text;
						  $this.queryHouseData.buildArea = items[0].code;
						  if(items[0].code==0){
							  $('#buildArea').val(""); 
						  }else{
							  $('#buildArea').val(items[0].code);
						  }
					  });
				  });
				}else{
					Utils.alertinfo(data.errorMessage);
				}
				Client.hideWaitPanel(100);
				}
			});
		},
		
		
		goHelp : function(){
			$(".ui-poppicker").remove();
			$(".ui-backdrop").remove();
			this.saveSession();
			var cityName ="";
			var cityId = "";
			var cityZipCode = "";
			if(App.storage.get("_parameters")){
				cityId = App.storage.get("_parameters").cityId;
				cityZipCode = App.storage.get("_parameters").cityZipCode;
				cityName = App.storage.get("_parameters").cityName;
			}else{
				cityName =this.queryHouseData.cityName;
				cityId = this.queryHouseData.cityId;
				cityZipCode = this.queryHouseData.cityZipCode;
			}
			var param = {
					cityName:cityName,
					cityId:cityId,
					cityZipCode:cityZipCode,
					areaZipCode:this.queryHouseData.areaZipCode,
					areaName:this.queryHouseData.areaName,
					areaId:this.queryHouseData.areaId,
					totalPrice:this.queryHouseData.totalPrice || "0",
					unitPrice:this.queryHouseData.unitPrice || "0",
					estimable:this.queryHouseData.estimable || "2",
					projectName:$("#search").val(),
					projectId:this.queryHouseData.projectId || "",
					buildingId:this.queryHouseData.buildingId || "",
					buildingName:$("#build").text(),
					totalFloor:this.queryHouseData.totalFloor || "",
					floorName:$("#floor").text(),
					houseId:this.queryHouseData.houseId || "",
					houseName:$("#house").text(),
					buildArea:$("#buildArea").val(),
					houseAddress:$("#houseAddress").val()
			};
			App.navigate("mortgage/mortgageCtl/help",param);
		},
		
		
		//切换城市
		changeCity : function(){
			$(".ui-poppicker").remove();
			$(".ui-backdrop").remove();
			if(App.storage.get("_parameters")){
				var cityId = App.storage.get("_parameters").cityId;
				var cityName = App.storage.get("_parameters").cityName;
				var cityZipCode = App.storage.get("_parameters").cityZipCode;
				var param = {
						cityName:cityName,
						cityId:cityId,
						cityZipCode:cityZipCode
				};
				App.navigate("mortgage/mortgageCtl/changeCity",param);
			}else{
				var cityName =this.queryHouseData.cityName || "杭州";
				var cityId = this.queryHouseData.cityId || "74";
				var cityZipCode = this.queryHouseData.cityZipCode || "330100";
				var param = {
						cityName:cityName,
						cityId:cityId,
						cityZipCode:cityZipCode
				};
				App.navigate("mortgage/mortgageCtl/changeCity",param);
			}
			
		},
		
		saveSession : function(){
			var cityName ="";
			var cityId = "";
			var cityZipCode = "";
			if(App.storage.get("_parameters")){
				cityId = App.storage.get("_parameters").cityId;
				cityZipCode = App.storage.get("_parameters").cityZipCode;
				cityName = App.storage.get("_parameters").cityName;
			}else{
				cityName =this.queryHouseData.cityName;
				cityId = this.queryHouseData.cityId;
				cityZipCode = this.queryHouseData.cityZipCode;
			}
			var param = {
					cityName:cityName,
					cityId:cityId,
					cityZipCode:cityZipCode,
					areaZipCode:this.queryHouseData.areaZipCode,
					areaName:this.queryHouseData.areaName,
					areaId:this.queryHouseData.areaId,
					totalPrice:this.queryHouseData.totalPrice || "0",
					unitPrice:this.queryHouseData.unitPrice || "0",
					estimable:this.queryHouseData.estimable || "2",
					projectName:$("#search").val(),
					projectId:this.queryHouseData.projectId || "",
					buildingId:this.queryHouseData.buildingId || "",
					buildingName:$("#build").text(),
					totalFloor:this.queryHouseData.totalFloor || "",
					floorName:$("#floor").text(),
					houseId:this.queryHouseData.houseId || "",
					houseName:$("#house").text(),
					buildArea:$("#buildArea").val(),
					houseAddress:$("#houseAddress").val()
			};
			App.browParam[0] = param;
		},
		
		loan : function(){
			$(".ui-poppicker").remove();
			$(".ui-backdrop").remove();
			var cityName ="";
			var cityId = "";
			var cityZipCode = "";
			if(App.storage.get("_parameters")){
				cityId = App.storage.get("_parameters").cityId;
				cityZipCode = App.storage.get("_parameters").cityZipCode;
				cityName = App.storage.get("_parameters").cityName;
			}else{
				cityName =this.queryHouseData.cityName;
				cityId = this.queryHouseData.cityId;
				cityZipCode = this.queryHouseData.cityZipCode;
			}
			var param = {
					cityName:cityName,
					cityId:cityId,
					cityZipCode:cityZipCode,
					areaZipCode:this.queryHouseData.areaZipCode,
					areaName:this.queryHouseData.areaName,
					areaId:this.queryHouseData.areaId,
					totalPrice:this.queryHouseData.totalPrice || "0",
					unitPrice:this.queryHouseData.unitPrice || "0",
					estimable:this.queryHouseData.estimable || "2",
					projectName:$("#search").val(),
					projectId:this.queryHouseData.projectId || "",
					buildingId:this.queryHouseData.buildingId || "",
					buildingName:$("#build").text(),
					totalFloor:this.queryHouseData.totalFloor || "",
					floorName:$("#floor").text(),
					houseId:this.queryHouseData.houseId || "",
					houseName:$("#house").text(),
					buildArea:$("#buildArea").val(),
					houseAddress:$("#houseAddress").val()
			};
			App.browParam[0] = param;
			
			if (Utils.checkSession()) {
				if(Utils.checkRealUser()){
					if(!Utils.checkActivate()){
						return;
					}
					var cityName ="";
					var cityId = "";
					var cityZipCode = "";
					if(App.storage.get("_parameters")){
						cityId = App.storage.get("_parameters").cityId;
						cityZipCode = App.storage.get("_parameters").cityZipCode;
						cityName = App.storage.get("_parameters").cityName;
					}else{
						cityName =this.queryHouseData.cityName;
						cityId = this.queryHouseData.cityId;
						cityZipCode = this.queryHouseData.cityZipCode;
					}
					var param = {
							cityName:cityName,
							cityId:cityId,
							cityZipCode:cityZipCode,
							areaZipCode:this.queryHouseData.areaZipCode,
							areaName:this.queryHouseData.areaName,
							areaId:this.queryHouseData.areaId,
							totalPrice:this.queryHouseData.totalPrice || "0",
							unitPrice:this.queryHouseData.unitPrice || "0",
							estimable:this.queryHouseData.estimable || "2",
							projectName:$("#search").val(),
							projectId:this.queryHouseData.projectId || "",
							buildingId:this.queryHouseData.buildingId || "",
							buildingName:$("#build").text(),
							totalFloor:this.queryHouseData.totalFloor || "",
							floorName:$("#floor").text(),
							houseId:this.queryHouseData.houseId || "",
							houseName:$("#house").text(),
							buildArea:$("#buildArea").val(),
							houseAddress:$("#houseAddress").val()
					};
					App.navigate("mortgage/mortgageCtl/myLoan",param);
				}
			} else {
				Client.toLogin("curView.loan()");
			}
		},
		
		goBack : function(){
			App.storage.remove("_parameters");
			$(".ui-poppicker").remove();
			$(".ui-backdrop").remove();
			App.navigate("index/index/index");
		}
	
	});
});
