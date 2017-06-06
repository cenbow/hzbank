define(function(require, exports, module){
	
	var mortQueryAreaTpl = require("text!../template/mortQueryArea.html");
	
	var MortQueryAreaView = module.exports = ItemView.extend({
		
		events : {
			
		},
		
		template : mortQueryAreaTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    this.init();
		},
		
		init : function(){
			var cityId =App.storage.get("_parameters").cityId;
			var param = {	
					cityId:cityId,
					tranType:"01"
				};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/mortgage/area", data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
				var html="";
				var areaList = data.areaList;
				var pos="0";
				for ( var i = 0; i < areaList.length; i++) {
					pos++;
					var areaInfo = areaList[i];
					var areaId = areaInfo.areaId;
					var areaName = areaInfo.areaName;
					var areaZipCode = areaInfo.areaZipCode;
					/*if(areaId=="308" || areaId=="309" ||areaId=="310" ||areaId=="311" ||areaId=="305"
						||areaId=="409"||areaId=="410"||areaId=="411"||areaId=="412" ||areaId=="724"
						||areaId=="413"||areaId=="415"||areaId=="610"||areaId=="611" ||areaId=="323"
						||areaId=="718"||areaId=="720"||areaId=="721"||areaId=="722" ||areaId=="723"
						||areaId=="1533"||areaId=="1534"||areaId=="1536"||areaId=="1537" ||areaId=="1538"
						||areaId=="1539"||areaId=="1540"||areaId=="1541"||areaId=="696" ||areaId=="697" 
						||areaId=="703"||areaId=="704"||areaId=="706"||areaId=="707" ||areaId=="698"
						||areaId=="1398"||areaId=="1399" ||areaId=="710" ||areaId=="2179" ){
						
					}else{*/
						html += '<li class="list-item" cur="'+areaId+'" cur1="'+areaZipCode+'"  index="'+pos+'" >'+areaName+'</li>';
//					}
					 
				}
				if(pos=="1"){
					$("#areaList").html(html);
					$("#noResult").hide();
					$("#queryArea").show();
					
				}
				else if(pos>="2"){
					$("#areaList").append(html);
					$("#noResult").hide();
					$("#queryArea").show();
					
				}else{
					$("#noResult").show();
					$("#queryArea").hide();
				}
				$(".list-item").off().on("click",function(){
					var areaId = $(this).attr("cur");
					var areaZipCode = $(this).attr("cur1");
					var areaName = $(this).text();
					var areaData = {
							areaId:areaId,
							areaName:areaName,
							areaZipCode:areaZipCode,
							provinceId:App.storage.get("_parameters").provinceId,
							provinceAlias:App.storage.get("_parameters").provinceAlias,
							cityId:App.storage.get("_parameters").cityId,
							cityAlias:App.storage.get("_parameters").cityAlias,
							cityZipCode:App.storage.get("_parameters").cityZipCode
							
					};
					App.navigate("mortgage/mortgageCtl/mortTest1",areaData);
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
