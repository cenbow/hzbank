define(function(require, exports, module){
	
	var mortQueryCityTpl = require("text!../template/mortQueryCity.html");
	
	var MortQueryCityView = module.exports = ItemView.extend({
		
		events : {
			
		},
		
		template : mortQueryCityTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			this.init();
		},
		
		init : function(){
			var provinceId =App.storage.get("_parameters").provinceId;
			var param = {	
					provinceId:provinceId,
					tranType:"01"
				};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/mortgage/city", data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
				var html="";
				var cityList = data.cityList;
				var pos="0";
				for ( var i = 0; i < cityList.length; i++) {
					pos++;
					var cityInfo = cityList[i];
					var cityId = cityInfo.cityId;
					
					/*if(cityId == "1" || cityId == "2" || cityId == "6" || cityId == "74" || cityId == "75" || cityId == "187" || 
							cityId == "267" || cityId == "83" ||  cityId == "84" || cityId == "98" || cityId == "130"||
							cityId == "77" || cityId == "188" || cityId == "189" || cityId == "76" || cityId == "80" ){*/
						var cityAlias = cityInfo.cityAlias;
						var cityZipCode = cityInfo.cityZipCode;
						html += '<li class="list-item" code="'+cityZipCode+'" cur="'+cityId+'"  index="'+pos+'" >'+cityAlias+'</li>';
//					};
					 
				}
				if(pos=="1"){
					$("#cityList").html(html);
					$("#noResult").hide();
					$("#queryCity").show();
					
				}
				else if(pos>="2"){
					$("#cityList").append(html);
					$("#noResult").hide();
					$("#queryCity").show();
					
				}else{
					$("#noResult").show();
					$("#queryCity").hide();
				}
				$(".list-item").off().on("click",function(){
					var cityId = $(this).attr("cur");
					var cityAlias = $(this).text();
					var cityZipCode = $(this).attr("code");
					var cityData = {
							cityId:cityId,
							cityAlias:cityAlias,
							cityZipCode:cityZipCode,
							provinceId:App.storage.get("_parameters").provinceId,
							provinceAlias:App.storage.get("_parameters").provinceAlias
					};
					App.navigate("mortgage/mortgageCtl/mortQueryArea",cityData);
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
