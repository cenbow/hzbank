define(function(require, exports, module){
	
	var cityListTpl = require("text!../template/cityList.html");
	
	var cityListView = module.exports = ItemView.extend({
		
		events : {
			
		},
		
		template : cityListTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			
			var actionFlag="3";
			var feeType="08";
			var param = {
        			"actionFlag":actionFlag,
        			"feeType":feeType
    		};
			var $this = this;
			Client.openWaitPanel("拼命加载中，请稍候");
    		Ajax({url:"/fee/queryCityList",data:param, success:function(data){
    			if(MUI.isEmpty(data.errorCode)){
    				var html = "";
    				var pos = "0";
					$.each(data.iChannelFeeList,function(i,product){
						var cityName=product.cityName;
						var cityCode=product.cityCode;
						html += '<div class="list-item arr" index="'+cityCode+'"><span>'+cityName+'</span></div>';
						pos++;
					});
					if(!pos||pos=="1"){
						$("#cityList").html(html);
					}
					else{
						$("#cityList").append(html);
					}
					
					$(".list-item").on("click",function(){
						var model1={
								"cityName":$(this).find("span").text(),
								"cityCode":$(this).attr("index")
								};
						App.storage.set("model1",model1);
						App.back();
					});
					
    			}else{
    				Utils.alertinfo(data.errorMessage);
    			}
    			 Client.hideWaitPanel(1);
    		}});
		},
		
		
		goBack : function(){
			App.back();
		}
	
	});
});
