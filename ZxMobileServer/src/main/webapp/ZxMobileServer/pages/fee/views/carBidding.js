define(function(require, exports, module){
	
	var carBiddingTpl = require("text!../template/carBidding.html");
	
	var carBiddingView = module.exports = ItemView.extend({
		
		events : {
			"click #ensure":"ensure",
			"click #deal":"deal",
			"click #querySuc":"querySuc",
		},
		
		template : carBiddingTpl,
			//定义日志TAG便于错误信息查找
		initialize : function(){
			this.queryApparList();
			this.queryParamList = {};
			Client.hideWaitPanel(1);
		},
		
		queryApparList:function(){
			var $this = this;
			var startTime,endTime,startEndTime;
			var param = {
					aprCode:'FEE_COLSE_TIME'
			};
			Client.hideWaitPanel(1);
			Ajax({url:"/fee/queryApparList",data:param,
				success:function(data){
					if(MUI.isEmpty(data.errorCode)){
						var iApparList = data.cd.iApparList;
//						App.storage.set("iApparList",iApparList);
						for(var i=0;i<iApparList.length;i++){
							if(iApparList[i].aprValue == 10){
								endTime = iApparList[i].aprShowMsg;
							}else if(iApparList[i].aprValue == 9){
								startTime = iApparList[i].aprShowMsg;
							}else if(iApparList[i].aprValue == 11){
								startEndTime = iApparList[i].aprShowMsg;
							}
							
//							alert(startTime+endTime+startEndTime);
						}
						$this.queryParamList.startTime=startTime;
						$this.queryParamList.endTime=endTime;
						$this.queryParamList.startEndTime=startEndTime;
	    			}
					$this.income = true;
			}});
		},
		
		ensure:function(){
			App.navigate("fee/feeCtl/ensure");
		},
		
		deal:function(){
			var $this = this;
			
			var data = $this.queryParamList.startEndTime;
			var time = Utils.getServerDate("yyyyMMddhhmmss");
			var nowDate = time.substring(0,8);
			var nowTime = time.substring(8,12);
			var startDate = data.split("|")[0];
			var endDate = data.split("|")[1];
			var startTime = $this.queryParamList.startTime.split(":")[0] +""+ $this.queryParamList.startTime.split(":")[1];
			var endTime = $this.queryParamList.endTime.split(":")[0] +""+ $this.queryParamList.endTime.split(":")[1];
			
			if(MUI.isEmpty(data)){
				Utils.alertinfo("不在缴款日期内，请在缴款日"+$this.queryParamList.startTime+"到"+$this.queryParamList.endTime+"进行缴款。");
			}else if(nowDate>endDate){
				Utils.alertinfo("不在缴款日期内，请在缴款日"+$this.queryParamList.startTime+"到"+$this.queryParamList.endTime+"进行缴款。");
			}
			else if(nowTime < startTime || nowTime > endTime){
				Utils.alertinfo("请在缴款日:"+startDate.substr(4,2)+"月"+startDate.substr(6,2)+"日" +
						"至"+endDate.substr(4,2)+"月"+endDate.substr(6,2)+"日，"
						+startTime.substr(0,2)+"点"+startTime.substr(2,2)+"分"+"至"+endTime.substr(0,2)+"点"+endTime.substr(2,2)+"分"+"进行缴款。");
			}
			else if(nowDate < startDate){
				Utils.alertinfo("缴款时间为:"+startDate.substr(4,2)+"月"+startDate.substr(6,2)+"日" +
				"至"+endDate.substr(4,2)+"月"+endDate.substr(6,2)+"日，"+startTime.substr(0,2)+"点"+startTime.substr(2,2)+"分"+"至"+endTime.substr(0,2)+"点"+endTime.substr(2,2)+"分");
			}
			else{
				var param = {
						'startTime':$this.queryParamList.startTime,
						'endTime':$this.queryParamList.endTime
				};
				App.navigate("fee/feeCtl/deal",param);
			}
			
		},
		
		querySuc:function(){
			App.navigate("fee/feeCtl/querySuc");
		},
		
		goBack : function(){
			App.back();
		},
		
		car:function(){
			App.navigate("fee/feeCtl/carList");
		}
	
	});
});
