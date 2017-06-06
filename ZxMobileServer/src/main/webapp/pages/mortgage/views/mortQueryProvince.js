define(function(require, exports, module){
	
	var mortQueryProvinceTpl = require("text!../template/mortQueryProvince.html");
	
	var MortQueryProvinceView = module.exports = ItemView.extend({
		
		events : {
			
		},
		
		template : mortQueryProvinceTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
		    this.init();
		},
		
		init : function(){
			var param = {
					tranType:"01",
				};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
			Ajax({url:"/mortgage/province", data:param,success:function(data){
				if(MUI.isEmpty(data.errorCode)){
				var html="";
				var provinceList = data.provinceList;
				var pos="0";
				for ( var i = 0; i < provinceList.length; i++) {
					var provinceInfo = provinceList[i];
					var provinceId = provinceInfo.provinceId;
					/*if (provinceId == "13" || provinceId == "2"
							|| provinceId == "5" || provinceId == "1"
							|| provinceId == "14" || provinceId == "15") {*/
						pos++;
						var provinceAlias = provinceInfo.provinceAlias;
						html += '<li class="list-item" cur="'+provinceId+'"  index="'+pos+'" >'+provinceAlias+'</li>'; 
//					}
				}
				if(pos=="1"){
					$("#provinceList").html(html);
					$("#noResult1").hide();
					$("#queryProvince").show();
					
				}
				else if(pos>="2"){
					$("#provinceList").append(html);
					$("#noResult1").hide();
					$("#queryProvince").show();
					
				}else{
					$("#noResult1").show();
					$("#queryProvince").hide();
				}
				$(".list-item").off().on("click",function(){
					var provinceId = $(this).attr("cur");
					var provinceAlias = $(this).text();
					var provinceData = {
							provinceId:provinceId,
							provinceAlias:provinceAlias
					};
					App.navigate("mortgage/mortgageCtl/mortQueryCity",provinceData);
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
