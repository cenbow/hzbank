define(function (require, exports, module) {
	

	var drawIndexView = require("../views/drawIndex");
	var drawLotteryView = require("../views/drawLottery");
	var lotteryCenterView = require("../views/lotteryCenter");
	require("cssJs!../../../css/rotate");
	
	var drawLotteryController = module.exports = Controller.extend({
		actions:{
				"drawIndex" : "drawIndex",
				"drawLottery" : "drawLottery",
				"lotteryCenter":"lotteryCenter"
				
			},
		drawIndex : function(){
			Client.menuOpt("0");
			App.container.show(new drawIndexView());
		},
		drawLottery : function(){
			Client.menuOpt("0");
			App.container.show(new drawLotteryView());
		},
		lotteryCenter : function(){
			Client.menuOpt("0");
			App.container.show(new lotteryCenterView());
		}
	});
	
});