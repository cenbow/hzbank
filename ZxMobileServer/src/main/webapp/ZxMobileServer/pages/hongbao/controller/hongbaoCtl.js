define(function (require, exports, module) {
	

	var hongbaoView = require("../views/hongbao");
	var myPrizeView = require("../views/myPrize");
	var hongbaoruleView = require("../views/hongbaorule");
	var lecunhongbaoView = require("../views/lecunhongbao");
	var activityRulesView = require("../views/activityRules");
	var myRedPacketView = require("../views/myRedPacket");
	var weeklyRanklistView = require("../views/weeklyRanklist");
	var redPacketInviteIndexView = require("../views/redPacketInviteIndex");
	
	var hongbaoController = module.exports = Controller.extend({
		actions:{
				"hongbao" : "hongbao",
				"hongbaorule" : "hongbaorule",
				"myPrize" : "myPrize",
				"lecunhongbao" : "lecunhongbao",
				"activityRules" : "activityRules",
				"myRedPacket" : "myRedPacket",
				"weeklyRanklist" : "weeklyRanklist",
				"redPacketInviteIndex" : "redPacketInviteIndex"
			},
		
		hongbao : function(){
			Client.menuOpt("0");
			App.container.show(new hongbaoView());
		},
		hongbaorule : function(){
			Client.menuOpt("0");
			var param = App.storage.get("activityDate");
			App.container.show(new hongbaoruleView(({model:new Model(param)})));
		},
		
		myPrize : function(){
			Client.menuOpt("0");
			App.container.show(new myPrizeView());
		},
		
		lecunhongbao : function(){
			Client.menuOpt("0");
        	Ajax({url:"/redPacket/getLeCunActivity",data:{},
				success:function(data){
				if(MUI.isEmpty(data.errorCode)){
					var param ={
							activityEndDate:Utils.formatDate(data.cd.activityEndDate, "yyyyMMdd", "yyyy年MM月dd日"),
							controlAmt:data.cd.controlAmt,
							controlCount:data.cd.controlCount,
							totalNum:data.cd.totalNum							
					};
					App.container.show(new lecunhongbaoView(({model:new Model(param)})));
				}else{
					Utils.alertinfo(data.errorMessage);
				}
			},error:function(){
			}});
		},
		
		activityRules : function(){
			Client.menuOpt("0");
			var param = App.storage.get("activityRulesDate");
			App.container.show(new activityRulesView(({model:new Model(param)})));
		},
		
		myRedPacket : function(){
			Client.menuOpt("0");
			App.container.show(new myRedPacketView());
		},
		
		
		weeklyRanklist : function(){
			Client.menuOpt("0");
			App.container.show(new weeklyRanklistView());
		},
		
		redPacketInviteIndex : function(){
			Client.menuOpt("0");
			App.container.show(new redPacketInviteIndexView());
		},
		
	});
	
});