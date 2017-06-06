define(function(require, exports, module){
	
	var mortTest1Tpl = require("text!../template/mortTest1.html");
	
	var MortTest1View = module.exports = ItemView.extend({
		
		events : {
			"click #selected":"queryProvince",
			"click #submit" : "queryProject",
			"click #next" : "next"
		},
		
		template : mortTest1Tpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			var date = "";
			var $this=this;
			
			var addressName = "请选择地区";
			if(App.storage.get("_parameters")){
				var provinceAlias =App.storage.get("_parameters").provinceAlias||"";
				var cityAlias =App.storage.get("_parameters").cityAlias||"";
				var areaName =App.storage.get("_parameters").areaName||"";
				if(provinceAlias=="" || cityAlias =="" || areaName==""){
					addressName = "请选择地区";
					Client.hideWaitPanel(1);
				}else{
					addressName = provinceAlias+" "+cityAlias+" "+areaName;
					this.queryProject();
				}
			}else{
				Client.hideWaitPanel(1);
			}
			
			$("#selected").text(addressName);
			$this.goSearch();
			$("#next").addClass('disabled').attr('disabled',true);
		},
		
		goSearch : function(){
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
		},
		
		
		queryProvince : function(){
			App.navigate("mortgage/mortgageCtl/mortQueryProvince");
		},
		
		
		queryProject : function(){
			$("#projectList .list-item-0").remove();
			var cityId = App.storage.get("_parameters").cityId;
			var cityZipCode = App.storage.get("_parameters").cityZipCode;
			var areaId = App.storage.get("_parameters").areaId;
			var searchKey = $("#search").val().trim();
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
					$("#next").removeClass('disabled').removeAttr('disabled');
					$("#noResult").show();
					$("#queryProject").hide();
					$("#next").show();
				}else{
					$("#next").addClass('disabled').attr('disabled',true);
					if(pos=="1"){
						$("#projectList").html(html);
						$("#noResult").hide();
						$("#next").hide();
						$("#queryProject").show();
						
					}
					else{
						$("#projectList").append(html);
						$("#noResult").hide();
						$("#next").hide();
						$("#queryProject").show();
					}
				}
				
				
				$(".list-item-0").off().on("click",function(){
					var projectId = $(this).attr("cur");
					var projectName = $(this).text();
					var pos = $(this).attr("index");
					var projectData = {
							projectId:projectId,
							projectName:projectName,
							pos:pos,
							areaId:App.storage.get("_parameters").areaId,
							areaName:App.storage.get("_parameters").areaName,
							areaZipCode:App.storage.get("_parameters").areaZipCode,
							provinceId:App.storage.get("_parameters").provinceId,
							provinceAlias:App.storage.get("_parameters").provinceAlias,
							cityId:App.storage.get("_parameters").cityId,
							cityAlias:App.storage.get("_parameters").cityAlias,
							cityZipCode:App.storage.get("_parameters").cityZipCode
					};
					App.navigate("mortgage/mortgageCtl/mortTest2",projectData);
				});
				}else{
					Utils.alertinfo(data.errorMessage);
				}
				Client.hideWaitPanel(100);
				}
			});
		},
		
		
		next : function(){
			if($("#next").attr('disabled')){ //确定按钮可点击
				return;
			}
			App.navigate("mortgage/mortgageCtl/mortTest3");
		},
		
		goBack : function(){
			App.navigate("mortgage/mortgageCtl/mortApply");
		}
	
	});
});
