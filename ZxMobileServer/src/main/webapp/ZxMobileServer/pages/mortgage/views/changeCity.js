define(function(require, exports, module){
	
	var changeCityTpl = require("text!../template/changeCity.html");
	
	var ChangeCityView = module.exports = ItemView.extend({
		
		events : {
			"click #repayMethod":"repayMethod",
			"click #test" : "test"
		},
		
		template : changeCityTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			if(App.storage.get("_parameters")){
				var cityId = App.storage.get("_parameters").cityId;
				var cityName = App.storage.get("_parameters").cityName;
				var cityZipCode = App.storage.get("_parameters").cityZipCode;
				html = '<li cityId="'+cityId+'" cityName="'+cityName+'" cityZipCode="'+cityZipCode+'"><div>'+cityName+'</div></li>';
				$("#addCity").html(html);
			}
			$('li').off().on('click', function(){
				var cur = $(this);
				var cityName = cur.attr('cityName');
				var cityId = cur.attr('cityId');
				var cityZipCode = cur.attr('cityZipCode');
				var param = {
						cityName:cityName,
						cityId:cityId,
						cityZipCode:cityZipCode
				};
				App.navigate("mortgage/mortgageCtl/mortApply",param);
			});
		    Client.hideWaitPanel(1);
		},
		


		
		
		goBack : function(){
			App.back();
		}
	
	});
});
