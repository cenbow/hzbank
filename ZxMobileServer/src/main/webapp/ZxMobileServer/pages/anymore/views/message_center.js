define(function(require, exports, module){
	
	var messageCenterTpl = require("text!../template/message_center.html");
	
	var messageCenterView = module.exports = ItemView.extend({
		
	template : messageCenterTpl,
	
	events:{
		"click [data-target='#page-tab3']":"product",
		"click [data-target='#page-tab2']":"commonQue",
		"click #finance":"goToFinancePage",
		"click #deposit":"goToDepositPage"
	},
	initialize : function(){
		var pageTest = {
			  	title:'帮助中心',
				leftButton:{
					name : '返回',
					func :'curView.goBack()'
				},
				rightButton:{
					name : ''
				}
		  };
		Client.initPageTitle(pageTest);
	    Client.hideWaitPanel(100);
	    /*固定tab定位*/
	    	if(document.querySelector(".title-bar-shim-layer")){
				  document.querySelector(".zen-tab").style.top = document.querySelector(".title-bar-shim-layer").offsetHeight+"px";	 
			  };
			  document.querySelector(".zen-switch-pages").style.marginTop = '51px';
	},
	goBack:function(){
		App.back();
	},
	 product : function(){
		$("#page-tab2").hide();
		$("#page-tab3").show();
		$('[data-target="#page-tab2"]').removeClass('js-active');
		$('[data-target="#page-tab3"]').addClass('js-active');
	},
	 commonQue : function(){
			$("#page-tab2").show();
			$("#page-tab3").hide();
			$('[data-target="#page-tab3"]').removeClass('js-active');
			$('[data-target="#page-tab2"]').addClass('js-active');
	},
	goToFinancePage: function(){
//		var isLogon = Utils.checkSession();
//		Client.menuOpt("2");
//		if(!isLogon){
//			App.navigate("finance/financeCtl/financeBalance");
//		}else{
//			var param = {
//					financeNo:"",
//					financeName:""
//				};	
//			App.navigate("finance/financeCtl/financeBalanceLoad",param);
//		}
		Client.menuOpt("2");
		App.navigate("product/productCtl/wantInv");

	},
	
	goToDepositPage: function(){
		var isLogon = Utils.checkSession();
		Client.menuOpt("2");
		if(!isLogon){   
			App.navigate("deposit/depositCtl/deposit");
		 }else{
			App.navigate("deposit/depositCtl/depositLoad");
		}
	}
	});
});
