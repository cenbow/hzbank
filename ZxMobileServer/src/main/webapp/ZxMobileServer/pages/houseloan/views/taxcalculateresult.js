define(function(require, exports, module) {

	var TaxcalculateresultTemplate = require("text!../template/taxcalculateresult.html");

	var TaxcalculateresultView = module.exports = ItemView.extend({

		template : TaxcalculateresultTemplate,

		events : {
			"click #calculateagain" : "tocalculateagain"

		},

		initialize : function() {
			var pageTest = {
				title : '计算结果',
				leftButton : {
					name : '返回',
					func : 'curView.goToBack()'
				},
				rightButton : {
					name : ''
				}
			}

			var houseType = Utils.search().houseType;
			// alert(houseType);

			var houseType2 = Utils.search().houseType2;
			// alert(houseType2);
			if (houseType == "1") {

				if (houseType2 == "1") {

					var normaltax =  App.storage.get("normaltax"); 
					$("#yingyeshui").hide();
					$("#zonghedijiashui").hide();
					$("#weixiujijing").hide();
					$("#jiaoyishouxufei").hide();
					$("#quanshudengjifei").hide();
					
					
					$("#qishuitax").html((normaltax.firsttax).toFixed(2));
					$("#yinyesuodesuitax").html((normaltax.yingyesuodetax).toFixed(2));
					$("#yingyefujiashuitax").html((normaltax.yingyefujiatax).toFixed(2));
					$("#gerensuodeshuitax").html((normaltax.personhavetax).toFixed(2));
					$("#yinghuashuitax").html((normaltax.nomalyinghua).toFixed(2));
					$("#hejifeitax").html((normaltax.normaltotaltax).toFixed(2));
					
					
					
				} else if (houseType2 == "2") {
					$("#yingyeshui").hide();
					$("#zonghedijiashui").hide();
					$("#weixiujijing").hide();
					$("#jiaoyishouxufei").hide();
					$("#quanshudengjifei").hide();
					
				var nonormaltax = 	App.storage.get("nonormaltax");
					
				

				$("#qishuitax").html((nonormaltax.nonormalqs).toFixed(2));
				$("#yinyesuodesuitax").html((nonormaltax.nonomalyytax).toFixed(2));
				$("#yingyefujiashuitax").html((nonormaltax.noyysdtax).toFixed(2));
				$("#gerensuodeshuitax").html((nonormaltax.nonomalhavetax).toFixed(2));
				$("#yinghuashuitax").html((nonormaltax.nonomalyinghua).toFixed(2));
				$("#hejifeitax").html((nonormaltax.nonmaltotal).toFixed(2));
				
				
				} else if (houseType2 == "3") {

					$("#yingyeshui").hide();

					$("#yingyefujiashui").hide();
					$("#yinyesuodesui").hide();

					$("#weixiujijing").hide();
					$("#jiaoyishouxufei").hide();
					$("#quanshudengjifei").hide();

				var ecommaltax = App.storage.get("ecommaltax");
					$("#qishuitax").html((ecommaltax.firstqishuitax).toFixed(2));
					$("#gerensuodeshuitax").html((ecommaltax.ecomperson).toFixed(2));
					$("#yinghuashuitax").html((ecommaltax.ecomyinhua).toFixed(2));
					$("#zonghedijiashuitax").html((ecommaltax.totaldiji).toFixed(2));
					$("#hejifeitax").html((ecommaltax.taxplus).toFixed(2));
			
				}

			} else if (houseType == "2") {

				var newhousetax =  App.storage.get("newhousetax");
				$("#yingyeshui").hide();
				$("#yingyefujiashui").hide();
				$("#yinyesuodesui").hide();
				$("#gerensuodeshui").hide();
				$("#zonghedijiashui").hide();

				
				$("#qishuitax").html((newhousetax.newhouseqs).toFixed(2));
				$("#yinghuashuitax").html((newhousetax.yinhuatax).toFixed(2));
				$("#weixiujijingtax").html((newhousetax.fangwutax).toFixed(2));
				$("#jiaoyishouxufeitax").html((newhousetax.jiaoyitax).toFixed(2));
				$("#quanshudengjifeitax").html((newhousetax.quanshutax).toFixed(2));
				$("#hejifeitax").html((newhousetax.totaltax).toFixed(2));
				
				
				
			}

			Client.initPageTitle(pageTest);
			Client.hideWaitPanel(10);
		},

		goToBack : function() {
			App.back();
		},

		tocalculateagain : function() {
			
			
			var houseTypeagain = Utils.search().houseType;
			
			App.navigate("houseloan/houseloanCtl/taxcalculate?houseTypeagain="+houseTypeagain);

		}

	});

});